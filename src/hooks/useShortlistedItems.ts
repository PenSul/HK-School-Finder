import { useEffect, useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useShortlistStore } from "@/stores/useShortlistStore";
import { getSchoolsByIds } from "@/repositories/schoolRepository";
import { getInstitutionsByIds } from "@/repositories/heiRepository";
import type { School } from "@/types/school";
import type { HeiInstitution } from "@/types/school";

export type ShortlistItem =
  | { type: "school"; data: School }
  | { type: "institution"; data: HeiInstitution };

export function useShortlistedItems() {
  const db = useSQLiteContext();
  const shortlistedIds = useShortlistStore((s) => s.shortlistedIds);
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (shortlistedIds.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const schools = await getSchoolsByIds(db, shortlistedIds);
    const schoolIdSet = new Set(schools.map((s) => s.school_no));

    const remainingIds = shortlistedIds
      .filter((id) => !schoolIdSet.has(id))
      .map(Number)
      .filter((n) => !isNaN(n));
    const institutions = await getInstitutionsByIds(db, remainingIds);
    const instMap = new Map(institutions.map((i) => [String(i.objectid), i]));
    const schoolMap = new Map(schools.map((s) => [s.school_no, s]));

    // Preserve shortlist order
    const ordered: ShortlistItem[] = [];
    for (const id of shortlistedIds) {
      const school = schoolMap.get(id);
      if (school) {
        ordered.push({ type: "school", data: school });
        continue;
      }
      const inst = instMap.get(id);
      if (inst) {
        ordered.push({ type: "institution", data: inst });
      }
    }

    setItems(ordered);
    setLoading(false);
  }, [db, shortlistedIds]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
}
