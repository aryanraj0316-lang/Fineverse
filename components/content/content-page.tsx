import Link from "next/link";
import { cx } from "@/lib/cx";

export interface ContentSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

/**
 * Template for policy and help pages: a 65-character measure, with a sticky
 * "On this page" list on wide screens and a jump list on phones.
 */
export function ContentPage({
  title,
  intro,
  sections,
  notice,
  updated,
}: {
  title: string;
  intro?: React.ReactNode;
  sections: ContentSection[];
  /** Shown above the text, e.g. "this is a template" on legal pages. */
  notice?: React.ReactNode;
  updated?: string;
}) {
  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <header className="max-w-3xl">
        <h1 className="type-display text-display">{title}</h1>
        {intro && <div className="mt-4 text-body-lg text-basalt/80">{intro}</div>}
        {updated && <p className="mt-3 text-small text-basalt/70">Last updated {updated}</p>}
      </header>

      {notice && <div className="mt-8 max-w-3xl rounded-surface border border-dashed border-basalt/35 bg-chalk p-4 text-small">{notice}</div>}

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-12">
        {sections.length > 2 && (
          <nav aria-label="On this page" className="mb-10 lg:col-span-3 lg:mb-0">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
              <p className="text-small font-semibold">On this page</p>
              <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="inline-flex rounded-full border border-basalt/20 px-3 py-1.5 text-small hover:border-basalt lg:rounded-none lg:border-0 lg:p-0 lg:text-basalt/75 lg:hover:text-basalt lg:hover:underline"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
        <div className={cx("prose-fv max-w-[65ch]", sections.length > 2 ? "lg:col-span-8" : "lg:col-span-9")}>
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-[calc(var(--nav-h)+1.5rem)] border-t border-basalt/10 py-8 first:border-t-0 first:pt-0">
              <h2 className="type-heading text-h2">{s.title}</h2>
              <div className="mt-4 flex flex-col gap-4 text-body text-basalt/85">{s.body}</div>
            </section>
          ))}
          <p className="mt-6 text-small text-basalt/70">
            Still need help?{" "}
            <Link href="/contact" className="underline underline-offset-4">
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
