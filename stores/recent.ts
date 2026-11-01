import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RecentState {
  handles: string[];
  record: (handle: string) => void;
}

/** Recently viewed products (newest first, max 8), persisted locally. */
export const useRecent = create<RecentState>()(
  persist(
    (set, get) => ({
      handles: [],
      record: (handle) => set({ handles: [handle, ...get().handles.filter((h) => h !== handle)].slice(0, 8) }),
    }),
    { name: "fineverse:recent", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
