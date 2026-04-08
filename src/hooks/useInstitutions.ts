import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { HeiInstitution } from "@/types/school";
import { getInstitutions } from "@/repositories/heiRepository";

export function useInstitutions(searchQuery = "", limit = 50, offset = 0) {
  const db = useSQLiteContext();
  const [institutions, setInstitutions] = useState<HeiInstitution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getInstitutions(db, searchQuery, limit, offset).then((result) => {
      if (!cancelled) {
        setInstitutions(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [db, searchQuery, limit, offset]);

  return { institutions, loading };
}
