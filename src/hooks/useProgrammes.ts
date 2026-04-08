import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { UgcProgramme } from "@/types/school";
import { getProgrammes } from "@/repositories/programmeRepository";
import { useUniFilterStore } from "@/stores/useUniFilterStore";

export function useProgrammes(limit = 50, offset = 0) {
  const db = useSQLiteContext();
  const scope = useUniFilterStore((s) => s.scope);
  const studyLevels = useUniFilterStore((s) => s.studyLevels);
  const modesOfStudy = useUniFilterStore((s) => s.modesOfStudy);
  const programmeSearch = useUniFilterStore((s) => s.programmeSearch);
  const districts = useUniFilterStore((s) => s.districts);

  const [programmes, setProgrammes] = useState<UgcProgramme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProgrammes(
      db,
      { scope, studyLevels, modesOfStudy, programmeSearch, districts },
      limit,
      offset
    ).then((result) => {
      if (!cancelled) {
        setProgrammes(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [db, scope, studyLevels, modesOfStudy, programmeSearch, districts, limit, offset]);

  return { programmes, loading };
}
