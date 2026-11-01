import { create } from "zustand";

interface UiState {
  /**
   * Whether a hero is under the nav. `null` until a page reports it, in which
   * case CSS decides (see .site-header in globals.css).
   */
  overHero: boolean | null;
  setOverHero: (value: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useUi = create<UiState>()((set) => ({
  overHero: null,
  setOverHero: (overHero) => set({ overHero }),
  searchOpen: false,
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
