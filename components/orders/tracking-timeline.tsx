"use client";

import { Check } from "lucide-react";
import type { OrderStatus } from "@/data/orders";
import { cx } from "@/lib/cx";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "ordered", label: "Ordered" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "out-for-delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const when = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }) : null;

/**
 * Order progress. Horizontal on wide screens, vertical on phones. The filled
 * line grows to the current step on load (scale only).
 */
export function TrackingTimeline({ status, steps }: { status: OrderStatus; steps: Partial<Record<OrderStatus, string>> }) {
  const current = STEPS.findIndex((s) => s.key === status);
  const fraction = current / (STEPS.length - 1);

  return (
    <ol className="timeline relative grid gap-6 md:grid-cols-5 md:gap-2" style={{ "--progress": fraction } as React.CSSProperties} aria-label="Order progress">
      <span aria-hidden className="absolute top-3 bottom-3 left-[11px] w-0.5 bg-basalt/12 md:top-[11px] md:right-[10%] md:bottom-auto md:left-[10%] md:h-0.5 md:w-auto" />
      <span aria-hidden className="timeline-fill absolute top-3 bottom-3 left-[11px] w-0.5 origin-top bg-cobalt md:top-[11px] md:right-[10%] md:bottom-auto md:left-[10%] md:h-0.5 md:w-auto md:origin-left" />
      {STEPS.map((s, i) => {
        const done = i <= current;
        return (
          <li key={s.key} className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-2 md:text-center" aria-current={i === current ? "step" : undefined}>
            <span
              className={cx(
                "relative z-10 grid size-6 shrink-0 place-items-center rounded-full border-2",
                done ? "border-cobalt bg-cobalt text-chalk" : "border-basalt/25 bg-stone",
              )}
            >
              {done && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
            </span>
            <span>
              <span className={cx("block text-small", done ? "font-semibold" : "text-basalt/70")}>{s.label}</span>
              {when(steps[s.key]) && <span className="block text-micro text-basalt/70">{when(steps[s.key])}</span>}
              <span className="sr-only">{done ? (i === current ? "Current step" : "Done") : "Not yet"}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
