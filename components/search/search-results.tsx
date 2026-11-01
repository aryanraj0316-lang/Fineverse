"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { searchProducts } from "@/lib/commerce";
import { useUrlParams } from "@/lib/use-url-params";
import { useUi } from "@/stores/ui";

export function SearchResults() {
  const [params] = useUrlParams();
  const q = (params.get("q") ?? "").trim();
  const results = useMemo(() => searchProducts(q), [q]);
  const openPalette = useUi((s) => s.setSearchOpen);

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <h1 className="type-display text-h1" aria-live="polite">
        {q ? (
          <>
            <span data-price>{results.length}</span> {results.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
          </>
        ) : (
          "Search"
        )}
      </h1>
      <button type="button" onClick={() => openPalette(true)} className="mt-3 text-small underline underline-offset-4">
        {q ? "Search again" : "Search products"}
      </button>

      {q && results.length === 0 && (
        <div className="mt-10">
          <p className="text-body-lg">Nothing matched. Try a category:</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {[
              ["Electronics", "/shop/electronics"],
              ["Clothing", "/shop/clothing"],
              ["Wearables", "/shop/wearables"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href!} className="inline-flex h-10 items-center rounded-full border border-basalt/20 px-4 text-small hover:border-basalt">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <li key={p.handle}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
