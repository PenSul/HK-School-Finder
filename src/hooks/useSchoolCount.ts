import { useEffect, useState, useRef } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getSchoolCount } from "@/repositories/schoolRepository";
import { useFilterStore } from "@/stores/useFilterStore";

const DEBOUNCE_MS = 300;

export function useSchoolCount() {
  const db = useSQLiteContext();
  const educationLevel = useFilterStore((s) => s.educationLevel);
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const districts = useFilterStore((s) => s.districts);
  const financeTypes = useFilterStore((s) => s.financeTypes);
  const religions = useFilterStore((s) => s.religions);
  const sessions = useFilterStore((s) => s.sessions);
  const genders = useFilterStore((s) => s.genders);

  const [count, setCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      getSchoolCount(db, {
        educationLevel,
        searchQuery,
        districts,
        financeTypes,
        religions,
        sessions,
        genders,
      }).then(setCount);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [db, educationLevel, searchQuery, districts, financeTypes, religions, sessions, genders]);

  return count;
}
