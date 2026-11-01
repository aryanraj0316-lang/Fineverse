import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistState {
  handles: string[];
  toggle: (handle: string) => boolean;
  remove: (handle: string) => void;
}

/** Saved products (by handle), persisted locally. */
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      handles: [],
      toggle: (handle) => {
        const saved = get().handles.includes(handle);
        set({ handles: saved ? get().handles.filter((h) => h !== handle) : [handle, ...get().handles] });
        return !saved;
      },
      remove: (handle) => set({ handles: get().handles.filter((h) => h !== handle) }),
    }),
    { name: "fineverse:wishlist", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
