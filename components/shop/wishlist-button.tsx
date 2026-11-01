"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/stores/wishlist";
import { toast } from "@/stores/toast";
import { cx } from "@/lib/cx";

export function WishlistButton({ handle, title, className }: { handle: string; title: string; className?: string }) {
  const saved = useWishlist((s) => s.handles.includes(handle));
  const toggle = useWishlist((s) => s.toggle);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const nowSaved = toggle(handle);
        toast(nowSaved ? "Saved to wishlist" : "Removed from wishlist");
      }}
      className={cx("grid size-10 place-items-center rounded-full transition-[background-color,scale] hover:bg-chalk/70 active:scale-90", className)}
    >
      <Heart
        aria-hidden
        strokeWidth={1.5}
        className={cx("size-5 transition-[fill,scale] duration-300", saved ? "scale-110 fill-basalt" : "fill-transparent")}
      />
    </button>
  );
}
