"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useLenis } from "@/components/providers/smooth-scroll";
import { cx } from "@/lib/cx";

const ease = [0.2, 0.7, 0.2, 1] as const;

/**
 * Modal on the native <dialog>: focus is trapped and the page behind is inert,
 * Escape closes (after our exit animation), and focus returns to the opener.
 * `variant="drawer"` slides in from the right (full width on phones).
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  variant = "modal",
  className,
  hideTitle = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: "modal" | "drawer";
  className?: string;
  hideTitle?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open || dialog.open) return;
    dialog.showModal();
    lenis.current?.stop();
    document.documentElement.style.overflow = "hidden";
  }, [open, lenis]);

  const finishClose = () => {
    ref.current?.close();
    lenis.current?.start();
    document.documentElement.style.overflow = "";
  };

  const drawer = variant === "drawer";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // A click on the backdrop area (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-basalt backdrop:bg-transparent"
    >
      <AnimatePresence onExitComplete={finishClose}>
        {open && (
          <>
            <motion.div
              key="scrim"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.24 }}
              className="pointer-events-none absolute inset-0 bg-basalt/40"
            />
            <motion.div
              key="panel"
              data-lenis-prevent
              initial={drawer ? { x: "100%" } : { opacity: 0, scale: 0.98 }}
              animate={drawer ? { x: 0 } : { opacity: 1, scale: 1 }}
              exit={drawer ? { x: "100%", transition: { duration: reduce ? 0 : 0.24, ease } } : { opacity: 0, scale: 0.98, transition: { duration: reduce ? 0 : 0.18 } }}
              transition={{ duration: reduce ? 0 : drawer ? 0.28 : 0.22, ease }}
              className={cx(
                "absolute flex flex-col overflow-hidden bg-chalk shadow-[0_24px_60px_-20px_rgb(29_28_26/0.45)]",
                drawer
                  ? "inset-y-0 right-0 w-full sm:w-[28rem]"
                  : "top-1/2 left-1/2 max-h-[88dvh] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-surface",
                className,
              )}
            >
              <div className={cx("flex shrink-0 items-center justify-between gap-4 border-b border-basalt/10 px-5", drawer ? "h-(--nav-h)" : "h-16")}>
                <h2 id={titleId} className={cx("type-heading text-h3", hideTitle && "sr-only")}>
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-2 grid size-11 place-items-center rounded-full hover:bg-basalt/5"
                >
                  <X aria-hidden className="size-5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </dialog>
  );
}
