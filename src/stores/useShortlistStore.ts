import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStateStorage } from "./mmkv";

interface ShortlistStore {
  shortlistedIds: string[];
  addToShortlist: (id: string) => void;
  removeFromShortlist: (id: string) => void;
  isShortlisted: (id: string) => boolean;
  clearShortlist: () => void;
}

export const useShortlistStore = create<ShortlistStore>()(
  persist(
    (set, get) => ({
      shortlistedIds: [],
      addToShortlist: (id) =>
        set((s) => {
          if (s.shortlistedIds.includes(id)) return s;
          return { shortlistedIds: [...s.shortlistedIds, id] };
        }),
      removeFromShortlist: (id) =>
        set((s) => ({
          shortlistedIds: s.shortlistedIds.filter((i) => i !== id),
        })),
      isShortlisted: (id) => get().shortlistedIds.includes(id),
      clearShortlist: () => set({ shortlistedIds: [] }),
    }),
    {
      name: "shortlist-storage",
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
