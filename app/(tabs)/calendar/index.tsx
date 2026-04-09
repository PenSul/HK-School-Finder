import { useState, useCallback, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { updateEvent } from "@/repositories/calendarRepository";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { EventCard } from "@/components/calendar/EventCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useLanguage } from "@/providers/LanguageProvider";
import { COLORS } from "@/constants/colors";
import type { CalendarEvent } from "@/types/calendar";

const MONTH_NAMES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_TC = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

export default function CalendarScreen() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const db = useSQLiteContext();
  const { events, loading, refresh } = useCalendarEvents(year, month);
  const { locale, t } = useLanguage();
  const router = useRouter();

  const monthNames = locale === "tc" ? MONTH_NAMES_TC : MONTH_NAMES_EN;

  const goToPrevMonth = useCallback(() => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else { setMonth((m) => m - 1); }
    setSelectedDay(null);
  }, [month]);

  const goToNextMonth = useCallback(() => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else { setMonth((m) => m + 1); }
    setSelectedDay(null);
  }, [month]);

  const filteredEvents = useMemo(() => {
    if (selectedDay === null) return events;
    const dayStr = String(selectedDay).padStart(2, "0");
    const monthStr = String(month).padStart(2, "0");
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    return events.filter((e) => e.event_date === dateStr);
  }, [events, selectedDay, year, month]);

  const handleToggleReminder = useCallback(
    async (eventId: string, enabled: boolean) => {
      const event = events.find((e) => e.id === eventId);
      if (!event) return;
      await updateEvent(db, eventId, {
        title: event.title,
        description: event.description ?? undefined,
        event_date: event.event_date,
        event_time: event.event_time ?? undefined,
        category: event.category,
        school_no: event.school_no ?? undefined,
        reminder_enabled: enabled,
      });
      // Schedule or cancel local notification (dynamic import for Expo Go compat)
      try {
        const Notifications = await import("expo-notifications");
        if (enabled) {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status === "granted") {
            const triggerDate = new Date(event.event_date);
            triggerDate.setDate(triggerDate.getDate() - 1);
            triggerDate.setHours(9, 0, 0, 0);
            if (triggerDate > new Date()) {
              await Notifications.scheduleNotificationAsync({
                content: { title: event.title, body: `Tomorrow: ${event.title}` },
                trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
                identifier: `reminder-${eventId}`,
              });
            }
          }
        } else {
          await Notifications.cancelScheduledNotificationAsync(`reminder-${eventId}`);
        }
      } catch {
        // expo-notifications unavailable in Expo Go -- silently skip
      }
      refresh();
    },
    [db, events, refresh]
  );

  const handleExportCalendar = useCallback(async (event: CalendarEvent) => {
    try {
      const ExpoCalendar = await import("expo-calendar");
      const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("calendar_no_permission"));
        return;
      }
      const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
      const cal = calendars.find((c) => c.isPrimary) ?? calendars[0];
      if (!cal) return;
      const startDate = new Date(`${event.event_date}T${event.event_time || "09:00"}`);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);
      await ExpoCalendar.createEventAsync(cal.id, {
        title: event.title,
        notes: event.description ?? undefined,
        startDate,
        endDate,
      });
      Alert.alert(t("calendar_exported"));
    } catch {
      Alert.alert(t("calendar_no_permission"));
    }
  }, [t]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Month navigation */}
        <View style={styles.monthNav}>
          <Pressable onPress={goToPrevMonth} style={styles.navBtn} accessibilityLabel="Previous month">
            <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
          </Pressable>
          <Text style={styles.monthTitle}>
            {monthNames[month - 1]} {year}
          </Text>
          <Pressable onPress={goToNextMonth} style={styles.navBtn} accessibilityLabel="Next month">
            <Ionicons name="chevron-forward" size={22} color={COLORS.primary} />
          </Pressable>
        </View>

        {/* Calendar grid */}
        <CalendarGrid
          year={year}
          month={month}
          events={events}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        {/* Events list */}
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>
            {selectedDay
              ? `${monthNames[month - 1]} ${selectedDay}`
              : t("tab_calendar")}
          </Text>
          <Text style={styles.eventsCount}>
            {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
          </Text>
        </View>

        {filteredEvents.length === 0 ? (
          <EmptyState
            title={t("calendar_empty")}
            message=""
            icon="calendar-outline"
          />
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onToggleReminder={handleToggleReminder}
              onExportCalendar={handleExportCalendar}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/event/create")}
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel={t("calendar_create")}
      >
        <Ionicons name="add" size={28} color={COLORS.light.surface} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.light.textPrimary,
  },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.light.textPrimary,
  },
  eventsCount: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
