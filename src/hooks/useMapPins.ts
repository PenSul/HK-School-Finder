import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFilterStore } from "@/stores/useFilterStore";
import { getSchoolsForMap } from "@/repositories/schoolRepository";
import { getInstitutionsForMap } from "@/repositories/heiRepository";
import { schoolToMapPin, institutionToMapPin } from "@/types/map";
import type { MapPin } from "@/types/map";

export function useMapPins() {
  const db = useSQLiteContext();
  const educationLevel = useFilterStore((s) => s.educationLevel);
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const districts = useFilterStore((s) => s.districts);
  const financeTypes = useFilterStore((s) => s.financeTypes);
  const religions = useFilterStore((s) => s.religions);
  const sessions = useFilterStore((s) => s.sessions);
  const genders = useFilterStore((s) => s.genders);

  const [pins, setPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    if (educationLevel === "UNIVERSITY") {
      getInstitutionsForMap(db).then((institutions) => {
        if (!cancelled) {
          setPins(institutions.map(institutionToMapPin));
          setLoading(false);
        }
      });
    } else {
      const filters = {
        educationLevel,
        searchQuery,
        districts,
        financeTypes,
        religions,
        sessions,
        genders,
      };
      getSchoolsForMap(db, filters).then((schools) => {
        if (!cancelled) {
          setPins(schools.map(schoolToMapPin));
          setLoading(false);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [
    db,
    educationLevel,
    searchQuery,
    districts,
    financeTypes,
    religions,
    sessions,
    genders,
  ]);

  return { pins, loading };
}
