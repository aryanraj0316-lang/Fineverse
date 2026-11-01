"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import { useLenis } from "@/components/providers/smooth-scroll";
import { formatPrice, searchProducts } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { useUi } from "@/stores/ui";

const RECENT_KEY = "fineverse:recent-searches";
const CATEGORY_LABEL: Record<string, string> = { electronics: "Electronics", clothing: "Clothing", wearables: "Wearables" };

const RECENT_EVENT = "fineverse:recent-searches";

function readRecentRaw(): string {
  try {
    return localStorage.getItem(RECENT_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}
function readRecent(): string[] {
  try {
    return JSON.parse(readRecentRaw()) as string[];
  } catch {
    return [];
  }
}
function writeRecent(list: string[] | null) {
  try {
    if (list) localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    else localStorage.removeItem(RECENT_KEY);
  } catch {}
  window.dispatchEvent(new Event(RECENT_EVENT));
}
const subscribeRecent = (cb: () => void) => {
  window.addEventListener(RECENT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(RECENT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

/**
 * Command-palette search: opens from the nav icon, "/" or Ctrl/⌘+K. Instant
 * results with thumbnails, price and category; arrow keys move, Enter opens.
 */
export function SearchPalette() {
  const open = useUi((s) => s.searchOpen);
  const setOpen = useUi((s) => s.setSearchOpen);
  const router = useRouter();
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  // Recent searches from localStorage; the server snapshot is empty.
  const recentRaw = useSyncExternalStore(subscribeRecent, readRecentRaw, () => "[]");
  const recent = useMemo(() => {
    try {
      return JSON.parse(recentRaw) as string[];
    } catch {
      return [];
    }
  }, [recentRaw]);

  const results = useMemo(() => searchProducts(query).slice(0, 6), [query]);
  const total = useMemo(() => searchProducts(query).length, [query]);

  // Keyboard shortcuts to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    const d = dialog.current;
    if (!d || !open || d.open) return;
    d.showModal();
    lenis.current?.stop();
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => input.current?.focus());
  }, [open, lenis]);

  const close = () => setOpen(false);
  const finishClose = () => {
    dialog.current?.close();
    lenis.current?.start();
    document.documentElement.style.overflow = "";
    setQuery("");
    setActive(0);
  };

  const remember = (term: string) => {
    const t = term.trim();
    if (!t) return;
    writeRecent([t, ...readRecent().filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 5));
  };

  const go = (href: string) => {
    remember(query);
    close();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      const hit = results[active];
      go(hit && active < results.length ? hit.href : `/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Search"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-transparent"
    >
      <AnimatePresence onExitComplete={finishClose}>
        {open && (
          <>
            <motion.div key="scrim" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.18 }} className="pointer-events-none absolute inset-0 bg-basalt/40" />
            <motion.div
              key="panel"
              data-lenis-prevent
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : 0.18, ease: [0.2, 0.7, 0.2, 1] }}
              className="absolute inset-x-0 top-0 flex max-h-dvh flex-col bg-chalk shadow-[0_24px_60px_-20px_rgb(29_28_26/0.45)] sm:inset-x-auto sm:top-[12vh] sm:left-1/2 sm:w-[min(40rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:rounded-surface"
            >
              <div className="flex h-16 shrink-0 items-center gap-3 border-b border-basalt/10 px-4">
                <Search aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
                <input
                  ref={input}
                  type="search"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls={listId}
                  aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
                  aria-label="Search products"
                  placeholder="Search products"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onKeyDown}
                  className="h-full min-w-0 flex-1 bg-transparent text-body-lg outline-none placeholder:text-basalt/45 [&::-webkit-search-cancel-button]:hidden"
                />
                <kbd className="hidden rounded-field border border-basalt/20 px-1.5 py-0.5 text-micro text-basalt/70 sm:block">Esc</kbd>
                <button type="button" aria-label="Close search" onClick={close} className="grid size-10 place-items-center rounded-full hover:bg-basalt/5 sm:hidden">
                  <X aria-hidden className="size-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="min-h-0 overflow-y-auto p-2">
                {!query.trim() && (
                  <div className="p-3">
                    {recent.length > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-small font-semibold">Recent searches</p>
                          <button
                            type="button"
                            className="text-small underline underline-offset-4"
                            onClick={() => writeRecent(null)}
                          >
                            Clear
                          </button>
                        </div>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {recent.map((r) => (
                            <li key={r}>
                              <button type="button" onClick={() => setQuery(r)} className="h-9 rounded-full border border-basalt/20 px-3.5 text-small hover:border-basalt">
                                {r}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    <p className={cx("text-small font-semibold", recent.length > 0 && "mt-5")}>Browse</p>
                    <CategoryLinks onPick={close} />
                  </div>
                )}

                {query.trim() && results.length === 0 && (
                  <div className="p-3">
                    <p className="text-body">No results for &ldquo;{query.trim()}&rdquo;.</p>
                    <p className="mt-1 text-small text-basalt/70">Try a category instead:</p>
                    <CategoryLinks onPick={close} />
                  </div>
                )}

                {results.length > 0 && (
                  <ul id={listId} role="listbox" aria-label="Results">
                    {results.map((p, i) => {
                      const img = p.colours[0]!.images[0];
                      return (
                        <li key={p.handle} id={`${listId}-${i}`} role="option" aria-selected={active === i}>
                          <Link
                            href={p.href}
                            onClick={() => {
                              remember(query);
                              close();
                            }}
                            onMouseEnter={() => setActive(i)}
                            className={cx("flex items-center gap-3 rounded-field p-2", active === i && "bg-stone")}
                          >
                            <Image src={img.src} alt="" width={img.width} height={img.height} sizes="48px" className="aspect-[4/5] w-12 shrink-0 rounded-surface bg-sand object-cover" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-small font-semibold">{p.title}</span>
                              <span className="block text-micro text-basalt/70">
                                {CATEGORY_LABEL[p.category]} · {p.typeTitle}
                              </span>
                            </span>
                            <span data-price className="text-small">
                              {formatPrice(p.priceFrom)}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                    <li role="option" aria-selected={active === results.length} id={`${listId}-${results.length}`}>
                      <Link
                        href={`/search?q=${encodeURIComponent(query.trim())}`}
                        onClick={() => {
                          remember(query);
                          close();
                        }}
                        onMouseEnter={() => setActive(results.length)}
                        className={cx("block rounded-field p-3 text-small font-medium underline underline-offset-4", active === results.length && "bg-stone")}
                      >
                        See all {total} {total === 1 ? "result" : "results"} for &ldquo;{query.trim()}&rdquo;
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </dialog>
  );
}

function CategoryLinks({ onPick }: { onPick: () => void }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {[
        ["Electronics", "/shop/electronics"],
        ["Clothing", "/shop/clothing"],
        ["Wearables", "/shop/wearables"],
        ["The Everyday Kit", "/kit"],
      ].map(([label, href]) => (
        <li key={href}>
          <Link href={href!} onClick={onPick} className="inline-flex h-9 items-center rounded-full border border-basalt/20 px-3.5 text-small hover:border-basalt">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
