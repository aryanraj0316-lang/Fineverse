"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, User } from "lucide-react";
import { NavLogo } from "@/components/brand/nav-logo";
import { cx } from "@/lib/cx";
import { useUi } from "@/stores/ui";
import { CartButton } from "./cart-button";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import type { NavCategory } from "./nav-types";

const OPEN_DELAY = 120; // hover intent: passing over a link doesn't open the menu
const CLOSE_DELAY = 160;

const iconButton =
  "grid size-11 place-items-center rounded-full transition-colors hover:bg-basalt/5";

export function SiteHeader({
  categories,
  trustLine,
}: {
  categories: NavCategory[];
  trustLine: string;
}) {
  const overHero = useUi((s) => s.overHero);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolledDown = useScrolledDown();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const headerRef = useRef<HTMLElement>(null);

  const menuOpen = openMenu !== null || mobileOpen;
  // Never hide over the hero (the wordmark lands in the nav) or with a menu open.
  const hidden = scrolledDown && overHero !== true && !menuOpen;
  const active = categories.find((c) => c.handle === openMenu) ?? null;

  const clearTimer = () => clearTimeout(timer.current);
  const requestOpen = (handle: string) => {
    clearTimer();
    if (openMenu) setOpenMenu(handle);
    else timer.current = setTimeout(() => setOpenMenu(handle), OPEN_DELAY);
  };
  const requestClose = () => {
    clearTimer();
    timer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  };
  const closeNow = () => {
    clearTimer();
    setOpenMenu(null);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-full bg-basalt px-4 py-2 text-small text-chalk focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        className={cx(
          "site-header fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-(--ease-out)",
          hidden && "-translate-y-full",
        )}
        data-over-hero={overHero === null ? undefined : String(overHero)}
        data-menu-open={menuOpen ? "true" : undefined}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") requestClose();
        }}
        onPointerEnter={clearTimer}
        onKeyDown={(e) => {
          if (e.key === "Escape" && openMenu) {
            const trigger = headerRef.current?.querySelector<HTMLElement>(
              `[aria-controls="mega-${openMenu}"]`,
            );
            closeNow();
            trigger?.focus();
          }
        }}
        onBlur={(e) => {
          if (!headerRef.current?.contains(e.relatedTarget as Node | null)) closeNow();
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-(--nav-h) border-b border-basalt/10 bg-stone opacity-(--nav-surface) transition-opacity duration-300"
        />

        <nav
          aria-label="Main"
          data-nav-bar
          className="relative flex h-(--nav-h) items-center px-gutter"
        >
          <div className="flex flex-1 lg:hidden">
            <button
              type="button"
              className={cx(iconButton, "-ml-2.5")}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          <NavLogo onClick={closeNow} />

          <ul className="ml-[clamp(1.25rem,2vw,2rem)] hidden items-center gap-[clamp(.75rem,1.4vw,1.5rem)] lg:flex">
            {["Men", "Women"].map((title) => <li key={title} onPointerEnter={closeNow}><Link href={`/shop/${title.toLowerCase()}`} onClick={closeNow} className="py-3 text-small font-semibold transition-opacity hover:opacity-60">{title}</Link></li>)}
            {categories.map((category) => (
              <li
                key={category.handle}
                className="relative flex items-center"
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") requestOpen(category.handle);
                }}
              >
                <Link
                  href={category.href}
                  onClick={closeNow}
                  className={cx(
                    "py-3 text-small transition-opacity hover:opacity-60",
                    openMenu === category.handle && "underline underline-offset-[6px]",
                  )}
                >
                  {category.title}
                </Link>
                {/* Keyboard and screen-reader access to the menu; visible only when focused. */}
                <button
                  type="button"
                  aria-expanded={openMenu === category.handle}
                  aria-controls={`mega-${category.handle}`}
                  onClick={() => (openMenu === category.handle ? closeNow() : setOpenMenu(category.handle))}
                  className="absolute top-1/2 -right-6 grid size-6 -translate-y-1/2 place-items-center rounded-full opacity-0 focus-visible:opacity-100"
                >
                  <ChevronDown aria-hidden className="size-4" strokeWidth={1.5} />
                  <span className="sr-only">{category.title} menu</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-1 items-center justify-end gap-1 lg:-mr-2.5">
            <Link
              href="/search"
              aria-label="Search"
              aria-keyshortcuts="/ Control+K"
              onClick={(e) => {
                e.preventDefault();
                useUi.getState().setSearchOpen(true);
              }}
              className={iconButton}
            >
              <Search aria-hidden className="size-[22px]" strokeWidth={1.5} />
            </Link>
            <Link href="/account" aria-label="Account" className={cx(iconButton, "hidden lg:grid")}>
              <User aria-hidden className="size-[22px]" strokeWidth={1.5} />
            </Link>
            <span className="-mr-2.5 lg:mr-0">
              <CartButton />
            </span>
          </div>
        </nav>

        <MegaMenu category={active} onNavigate={closeNow} />
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        trustLine={trustLine}
      />
    </>
  );
}

/** True after scrolling down, false after scrolling up or near the top. */
function useScrolledDown() {
  const [down, setDown] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < 120) setDown(false);
        else if (delta > 8) setDown(true);
        else if (delta < -8) setDown(false);
        if (Math.abs(delta) > 8) lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return down;
}
