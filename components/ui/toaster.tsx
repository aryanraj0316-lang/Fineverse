"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useToasts, type Toast } from "@/stores/toast";

const ease = [0.2, 0.7, 0.2, 1] as const;

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 lg:right-6 lg:bottom-6 lg:left-auto lg:items-end"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToasts((s) => s.dismiss);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const start = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => dismiss(toast.id), toast.action ? 5000 : 3000);
  };
  const stop = () => clearTimeout(timer.current);

  useEffect(() => {
    timer.current = setTimeout(() => dismiss(toast.id), toast.action ? 5000 : 3000);
    return () => clearTimeout(timer.current);
  }, [dismiss, toast.id, toast.action]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, ease }}
      onPointerEnter={stop}
      onPointerLeave={start}
      onFocus={stop}
      onBlur={start}
      className="pointer-events-auto flex min-h-12 w-full max-w-sm items-center gap-3 rounded-surface bg-basalt py-2 pr-2 pl-4 text-small text-chalk shadow-[0_12px_32px_-12px_rgb(29_28_26/0.5)]"
    >
      <Check aria-hidden className="size-4 shrink-0" strokeWidth={2} />
      <span className="flex-1">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick();
            dismiss(toast.id);
          }}
          className="rounded-full px-3 py-1.5 font-medium underline underline-offset-4 hover:bg-chalk/10"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => dismiss(toast.id)}
        className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-chalk/10"
      >
        <X aria-hidden className="size-4" strokeWidth={1.75} />
      </button>
    </motion.div>
  );
}
