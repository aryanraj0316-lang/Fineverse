import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { orderSeeds, type OrderSeed } from "@/data/orders";

export type Order = OrderSeed & { giftNote?: string; total: number };

interface OrdersState {
  /** Orders placed in this browser (mock). Sample orders come from data/orders.ts. */
  placed: Order[];
  place: (order: Order) => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      placed: [],
      place: (order) => set((s) => ({ placed: [order, ...s.placed] })),
    }),
    { name: "fineverse:orders", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);

/** All orders visible to the UI: placed here first, then the samples. */
export function allOrders(placed: Order[]): (Order | (OrderSeed & { total?: number }))[] {
  return [...placed, ...orderSeeds];
}

export function findOrder(placed: Order[], id: string) {
  const key = id.trim().toUpperCase();
  return allOrders(placed).find((o) => o.id.toUpperCase() === key);
}

export type OrderDraft = Omit<Order, "id" | "placed" | "status" | "steps" | "estimated"> & { estimate?: Date };

/** Creates a mock order from checkout and returns its id. */
export function placeOrder({ estimate, ...draft }: OrderDraft): string {
  const now = new Date();
  const id = `FV-${(Math.floor(now.getTime() / 1000) % 90000) + 10000}`;
  useOrders.getState().place({
    ...draft,
    id,
    placed: now.toISOString(),
    status: "ordered",
    steps: { ordered: now.toISOString() },
    estimated: (estimate ?? now).toISOString().slice(0, 10),
  });
  return id;
}
