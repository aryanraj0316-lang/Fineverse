"use client";

import dynamic from "next/dynamic";

// Overlays that are only needed once opened load after the page, not with it.
const CartDrawer = dynamic(() => import("@/components/cart/cart-drawer").then((m) => m.CartDrawer), { ssr: false });
const SearchPalette = dynamic(() => import("@/components/search/search-palette").then((m) => m.SearchPalette), { ssr: false });

export function LazyOverlays() {
  return (
    <>
      <CartDrawer />
      <SearchPalette />
    </>
  );
}
