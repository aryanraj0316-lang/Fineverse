import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartLine {
  variantId: string;
  quantity: number;
  /** Lines added together by "Add kit to cart" share a bundle id. */
  bundleId?: string;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (lines: CartLine[]) => void;
  setQuantity: (variantId: string, quantity: number, bundleId?: string) => void;
  remove: (variantId: string, bundleId?: string) => void;
  open: () => void;
  close: () => void;
}

const sameLine = (a: CartLine, variantId: string, bundleId?: string) =>
  a.variantId === variantId && a.bundleId === bundleId;

/**
 * Cart state, persisted to localStorage. UI only: prices are always looked up
 * from lib/commerce, so the stored cart holds variant ids and quantities.
 */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (incoming) =>
        set((state) => {
          const lines = [...state.lines];
          for (const line of incoming) {
            const existing = lines.findIndex((l) => sameLine(l, line.variantId, line.bundleId));
            if (existing >= 0) {
              const current = lines[existing]!;
              lines[existing] = { ...current, quantity: current.quantity + line.quantity };
            } else {
              lines.push(line);
            }
          }
          return { lines };
        }),
      setQuantity: (variantId, quantity, bundleId) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (sameLine(l, variantId, bundleId) ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        })),
      remove: (variantId, bundleId) =>
        set((state) => ({ lines: state.lines.filter((l) => !sameLine(l, variantId, bundleId)) })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "fineverse:cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      // Rehydrated after mount by <StoreHydration />, so server and first
      // client render match.
      skipHydration: true,
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.lines.reduce((count, line) => count + line.quantity, 0);
