"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, X } from "lucide-react";
import { NavLogo } from "@/components/brand/nav-logo";
import { useLenis } from "@/components/providers/smooth-scroll";
import { mobileMenuLinks } from "@/lib/site";
import { cx } from "@/lib/cx";
import type { NavCategory } from "./nav-types";

const ease = [0.2, 0.7, 0.2, 1] as const;

/**
 * Full-screen menu built on <dialog>: the browser traps focus, makes the page
 * behind inert, closes on Escape (we animate first) and returns focus to the
 * menu button.
 */
export function MobileMenu({
  open,
  onClose,
  categories,
  trustLine,
}: {
  open: boolean;
  onClose: () => void;
  categories: NavCategory[];
  trustLine: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState<string | null>(null);
  const baseId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open || dialog.open) return;
    dialog.showModal();
    lenis.current?.stop();
    document.documentElement.style.overflow = "hidden";
  }, [open, lenis]);

  const finishClose = () => {
    dialogRef.current?.close();
    lenis.current?.start();
    document.documentElement.style.overflow = "";
    setExpanded(null);
  };

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      aria-label="Menu"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-basalt backdrop:bg-transparent lg:hidden"
    >
      <AnimatePresence onExitComplete={finishClose}>
        {open && (
          <motion.div
            key="panel"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0 : 0.35, ease }}
            className="flex h-full flex-col bg-stone"
          >
            <div className="flex h-(--nav-h) shrink-0 items-center px-gutter">
              <div className="flex flex-1">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="-ml-2.5 grid size-11 place-items-center rounded-full hover:bg-basalt/5"
                >
                  <X aria-hidden className="size-6" strokeWidth={1.5} />
                </button>
              </div>
              <NavLogo onClick={onClose} />
              <div className="flex-1" />
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-gutter pb-10">
              <ul className="mt-4 border-t border-basalt/10">
                {categories.map((category, index) => {
                  const isOpen = expanded === category.handle;
                  const panelId = `${baseId}-${category.handle}`;
                  return (
                    <motion.li
                      key={category.handle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: reduce ? 0 : 0.12 + index * 0.03, duration: 0.25 }}
                      className="border-b border-basalt/10"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setExpanded(isOpen ? null : category.handle)}
                        className="type-display flex w-full items-center justify-between py-4 text-left text-h1"
                      >
                        {category.title}
                        <ChevronDown
                          aria-hidden
                          strokeWidth={1.5}
                          className={cx("size-6 transition-transform duration-200", isOpen && "rotate-180")}
                        />
                      </button>
                      <div id={panelId} hidden={!isOpen} className="pb-6">
                        <ul className="flex flex-col">
                          {category.types.map((type) => (
                            <li key={type.href}>
                              <Link href={type.href} onClick={onClose} className="block py-2 text-body-lg">
                                {type.title}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              href={category.href}
                              onClick={onClose}
                              className="block py-2 text-body-lg font-medium underline decoration-basalt/30 underline-offset-4"
                            >
                              View all {category.title.toLowerCase()}
                            </Link>
                          </li>
                        </ul>
                        <Link href={category.featured.href} onClick={onClose} className="mt-4 flex items-center gap-4">
                          <Image
                            src={category.featured.image.src}
                            alt={category.featured.image.alt}
                            width={category.featured.image.width}
                            height={category.featured.image.height}
                            sizes="80px"
                            className="aspect-[4/5] h-auto w-20 rounded-surface bg-sand object-cover"
                          />
                          <span className="flex flex-col">
                            <span className="text-small font-medium">{category.featured.title}</span>
                            <span data-price className="text-small text-basalt/70">
                              {category.featured.price}
                            </span>
                          </span>
                        </Link>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>

              <ul className="mt-8 flex flex-col gap-1">
                {mobileMenuLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={onClose} className="block py-2 text-body-lg">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-small text-basalt/70">{trustLine}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
