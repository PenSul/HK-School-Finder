import { useEffect, useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { CalendarEvent } from "@/types/calendar";
import { getEventsByMonth } from "@/repositories/calendarRepository";

export function useCalendarEvents(year: number, month: number) {
  const db = useSQLiteContext();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getEventsByMonth(db, year, month).then((result) => {
      setEvents(result);
      setLoading(false);
    });
  }, [db, year, month]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { events, loading, refresh };
}
