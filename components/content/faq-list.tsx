"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";

export interface FaqGroup {
  title: string;
  items: { q: string; a: string }[];
}

/** FAQ with instant search across questions and answers. */
export function FaqList({ groups }: { groups: FaqGroup[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, items: g.items.filter((i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)) }))
        .filter((g) => g.items.length),
    [groups, q],
  );
  const count = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="max-w-3xl">
      <label htmlFor={id} className="sr-only">
        Search questions
      </label>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2" strokeWidth={1.5} />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search, e.g. cash on delivery"
          className="h-14 w-full rounded-field border border-basalt/25 bg-chalk pr-4 pl-12 text-body-lg"
        />
      </div>
      <p aria-live="polite" className="mt-3 text-small text-basalt/70">
        {q ? `${count} ${count === 1 ? "question" : "questions"} match` : ""}
      </p>

      {count === 0 ? (
        <p className="mt-8 text-body-lg">
          No questions match &ldquo;{query.trim()}&rdquo;.{" "}
          <Link href="/contact" className="underline underline-offset-4">
            Ask us directly
          </Link>
          .
        </p>
      ) : (
        filtered.map((g) => (
          <section key={g.title} className="mt-10">
            <h2 className="type-heading text-h3">{g.title}</h2>
            <Accordion className="mt-3" items={g.items.map((i, n) => ({ id: `${g.title}-${n}`, title: i.q, content: <p>{i.a}</p> }))} />
          </section>
        ))
      )}
    </div>
  );
}
