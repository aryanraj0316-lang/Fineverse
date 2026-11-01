import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OrderAddress } from "@/data/orders";

/**
 * Mock sign-in (UI only): phone number + OTP 123456. Swap for a real auth
 * provider later; components only use `user`, `signIn` and `signOut`.
 */
interface AuthState {
  user: { phone: string; name?: string } | null;
  /** Addresses saved from the account page (mock). */
  addresses: OrderAddress[];
  signIn: (phone: string) => void;
  signOut: () => void;
  addAddress: (a: OrderAddress) => void;
  removeAddress: (index: number) => void;
}

export const MOCK_OTP = "123456";

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      addresses: [],
      signIn: (phone) => set({ user: { phone, name: phone === "9876543210" ? "Aarav Sharma" : undefined } }),
      signOut: () => set({ user: null }),
      addAddress: (a) => set((s) => ({ addresses: [...s.addresses, a] })),
      removeAddress: (i) => set((s) => ({ addresses: s.addresses.filter((_, j) => j !== i) })),
    }),
    { name: "fineverse:auth", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
