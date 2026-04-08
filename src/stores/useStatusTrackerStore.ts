import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStateStorage } from "./mmkv";

export type ApplicationStage =
  | "interested"
  | "visited"
  | "applied"
  | "result";

interface StatusTrackerStore {
  stages: Record<string, ApplicationStage>;
  setStage: (schoolId: string, stage: ApplicationStage) => void;
  getStage: (schoolId: string) => ApplicationStage | undefined;
  removeStage: (schoolId: string) => void;
  clearStages: () => void;
}

export const useStatusTrackerStore = create<StatusTrackerStore>()(
  persist(
    (set, get) => ({
      stages: {},
      setStage: (schoolId, stage) =>
        set((s) => ({ stages: { ...s.stages, [schoolId]: stage } })),
      getStage: (schoolId) => get().stages[schoolId],
      removeStage: (schoolId) =>
        set((s) => {
          const { [schoolId]: _, ...rest } = s.stages;
          return { stages: rest };
        }),
      clearStages: () => set({ stages: {} }),
    }),
    {
      name: "status-tracker-storage",
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
