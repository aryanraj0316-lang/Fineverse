"use client";

import { useEffect } from "react";
import { useAuth } from "@/stores/auth";
import { useCart } from "@/stores/cart";
import { useOrders } from "@/stores/orders";
import { useRecent } from "@/stores/recent";
import { useWishlist } from "@/stores/wishlist";

/** Loads persisted stores after the first render to avoid hydration mismatches. */
export function StoreHydration() {
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useWishlist.persist.rehydrate();
    void useRecent.persist.rehydrate();
    void useOrders.persist.rehydrate();
    void useAuth.persist.rehydrate();
  }, []);
  return null;
}
