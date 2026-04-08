import type { SQLiteDatabase } from "expo-sqlite";
import type { CalendarEvent, CalendarEventInput, EventCategory } from "@/types/calendar";

interface CalendarEventRow {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  category: string;
  school_no: string | null;
  reminder_enabled: number;
  is_seeded: number;
}

function mapRow(row: CalendarEventRow): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    event_date: row.event_date,
    event_time: row.event_time,
    category: row.category as EventCategory,
    school_no: row.school_no,
    reminder_enabled: row.reminder_enabled === 1,
    is_seeded: row.is_seeded === 1,
  };
}

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getEventsByMonth(
  db: SQLiteDatabase,
  year: number,
  month: number
): Promise<CalendarEvent[]> {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

  const rows = await db.getAllAsync<CalendarEventRow>(
    "SELECT * FROM calendar_events WHERE event_date >= ? AND event_date < ? ORDER BY event_date, event_time",
    startDate,
    endDate
  );
  return rows.map(mapRow);
}

export async function getEventById(
  db: SQLiteDatabase,
  id: string
): Promise<CalendarEvent | null> {
  const row = await db.getFirstAsync<CalendarEventRow>(
    "SELECT * FROM calendar_events WHERE id = ?",
    id
  );
  return row ? mapRow(row) : null;
}

export async function createEvent(
  db: SQLiteDatabase,
  input: CalendarEventInput
): Promise<string> {
  const id = generateId();
  await db.runAsync(
    `INSERT INTO calendar_events
       (id, title, description, event_date, event_time, category, school_no, reminder_enabled, is_seeded)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    id,
    input.title,
    input.description ?? null,
    input.event_date,
    input.event_time ?? null,
    input.category,
    input.school_no ?? null,
    input.reminder_enabled ? 1 : 0
  );
  return id;
}

export async function updateEvent(
  db: SQLiteDatabase,
  id: string,
  input: CalendarEventInput
): Promise<void> {
  await db.runAsync(
    `UPDATE calendar_events
     SET title = ?, description = ?, event_date = ?, event_time = ?,
         category = ?, school_no = ?, reminder_enabled = ?
     WHERE id = ?`,
    input.title,
    input.description ?? null,
    input.event_date,
    input.event_time ?? null,
    input.category,
    input.school_no ?? null,
    input.reminder_enabled ? 1 : 0,
    id
  );
}

export async function deleteEvent(
  db: SQLiteDatabase,
  id: string
): Promise<void> {
  await db.runAsync("DELETE FROM calendar_events WHERE id = ?", id);
}

export async function deleteSeededEvents(
  db: SQLiteDatabase
): Promise<void> {
  await db.runAsync("DELETE FROM calendar_events WHERE is_seeded = 1");
}

export async function getEventsWithReminders(
  db: SQLiteDatabase
): Promise<CalendarEvent[]> {
  const rows = await db.getAllAsync<CalendarEventRow>(
    "SELECT * FROM calendar_events WHERE reminder_enabled = 1 ORDER BY event_date"
  );
  return rows.map(mapRow);
}
