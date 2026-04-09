import { useCallback } from "react";
import { View } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { createEvent } from "@/repositories/calendarRepository";
import { EventForm } from "@/components/calendar/EventForm";
import { useLanguage } from "@/providers/LanguageProvider";
import { COLORS } from "@/constants/colors";
import type { CalendarEventInput } from "@/types/calendar";

export default function CreateEventScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = useCallback(
    async (input: CalendarEventInput) => {
      await createEvent(db, input);
      router.back();
    },
    [db, router]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: t("calendar_create") }} />
      <View style={{ flex: 1, backgroundColor: COLORS.light.background }}>
        <EventForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={t("calendar_save")}
        />
      </View>
    </>
  );
}
