import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, action?: Toast["action"]) => number;
  dismiss: (id: number) => void;
}

let next = 1;

/** Confirmations use the same verb as the button that triggered them ("Added to cart"). */
export const useToasts = create<ToastState>()((set) => ({
  toasts: [],
  push: (message, action) => {
    const id = next++;
    // Keep at most two on screen.
    set((s) => ({ toasts: [...s.toasts.slice(-1), { id, message, action }] }));
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (message: string, action?: Toast["action"]) => useToasts.getState().push(message, action);
