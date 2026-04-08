import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { School } from "@/types/school";
import { getSchools } from "@/repositories/schoolRepository";
import { useFilterStore } from "@/stores/useFilterStore";

export function useSchools(limit = 50, offset = 0) {
  const db = useSQLiteContext();
  const educationLevel = useFilterStore((s) => s.educationLevel);
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const districts = useFilterStore((s) => s.districts);
  const financeTypes = useFilterStore((s) => s.financeTypes);
  const religions = useFilterStore((s) => s.religions);
  const sessions = useFilterStore((s) => s.sessions);
  const genders = useFilterStore((s) => s.genders);

  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSchools(
      db,
      { educationLevel, searchQuery, districts, financeTypes, religions, sessions, genders },
      limit,
      offset
    ).then((result) => {
      if (!cancelled) {
        setSchools(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [db, educationLevel, searchQuery, districts, financeTypes, religions, sessions, genders, limit, offset]);

  return { schools, loading };
}
