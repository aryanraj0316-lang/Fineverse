import type { Metadata } from "next";
import { CartContents } from "@/components/cart/cart-contents";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

/** Full-page cart: the fallback for the drawer, and where /cart links land. */
export default function CartPage() {
  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <h1 className="type-display text-display">Cart</h1>
      <div className="mt-8">
        <CartContents page />
      </div>
    </div>
  );
}
