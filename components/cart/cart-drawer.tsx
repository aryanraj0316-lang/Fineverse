"use client";

import { useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { registerFlyer } from "@/lib/cart-actions";
import { selectCartCount, useCart } from "@/stores/cart";
import { CartContents } from "./cart-contents";

/**
 * The cart drawer, plus the fly-to-cart animation: a copy of the product image
 * travels from the button to the cart icon (FLIP), the badge ticks, then the
 * drawer opens. About 600 ms from click to an open drawer.
 */
export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const count = useCart(selectCartCount);

  useEffect(() => {
    registerFlyer(flyToCart);
    return () => registerFlyer(null);
  }, []);

  return (
    <Dialog open={isOpen} onClose={close} variant="drawer" title={count ? `Cart (${count})` : "Cart"}>
      <CartContents onNavigate={close} />
    </Dialog>
  );
}

async function flyToCart(image: HTMLImageElement) {
  const target = document.querySelector<HTMLElement>("[data-cart-button]");
  if (!target) return;
  const from = image.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (!from.width || !to.width) return;

  const clone = image.cloneNode(true) as HTMLImageElement;
  Object.assign(clone.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    margin: "0",
    zIndex: "95",
    pointerEvents: "none",
    objectFit: "contain",
    borderRadius: "4px",
    transformOrigin: "top left",
  });
  clone.removeAttribute("srcset");
  clone.removeAttribute("sizes");
  clone.src = image.currentSrc || image.src;
  document.body.appendChild(clone);

  const scale = Math.min(to.width / from.width, to.height / from.height) * 0.9;
  const dx = to.left + to.width / 2 - (from.left + (from.width * scale) / 2);
  const dy = to.top + to.height / 2 - (from.top + (from.height * scale) / 2);
  const flight = clone.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.35}px) scale(${0.5 + scale / 2})`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.2 },
    ],
    { duration: 340, easing: "cubic-bezier(0.5, 0, 0.2, 1)", fill: "forwards" },
  );
  // Resolve as the image reaches the icon, so the badge and drawer start on arrival.
  void flight.finished.then(() => clone.remove(), () => clone.remove());
  await new Promise((r) => setTimeout(r, 300));
}
