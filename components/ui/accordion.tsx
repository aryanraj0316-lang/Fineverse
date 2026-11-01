"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "@/lib/cx";

/** Disclosure list. Content fades in; height snaps (no animated layout). */
export function Accordion({
  items,
  defaultOpen,
  className,
  headingLevel = 3,
}: {
  items: { id: string; title: string; content: React.ReactNode }[];
  defaultOpen?: string;
  className?: string;
  /** Keep the document outline in order: use 2 when the accordion sits directly under the h1. */
  headingLevel?: 2 | 3 | 4;
}) {
  const Heading = `h${headingLevel}` as const;
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const base = useId();
  return (
    <div className={cx("border-t border-basalt/12", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        const panel = `${base}-${item.id}`;
        return (
          <div key={item.id} className="border-b border-basalt/12">
            <Heading>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-body font-medium"
              >
                {item.title}
                <ChevronDown aria-hidden strokeWidth={1.5} className={cx("size-5 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
            </Heading>
            <div id={panel} hidden={!isOpen} className="animate-[fade-in_240ms_var(--ease-out)] pb-5 text-body text-basalt/80">
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
