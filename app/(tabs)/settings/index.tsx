import { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Switch, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { useTheme, type ThemePreference } from "@/providers/ThemeProvider";
import { useLanguage, type Locale } from "@/providers/LanguageProvider";
import { storage } from "@/stores/mmkv";
import { COLORS } from "@/constants/colors";

const THEME_OPTIONS: { key: ThemePreference; i18nKey: string }[] = [
  { key: "light", i18nKey: "settings_light" },
  { key: "dark", i18nKey: "settings_dark" },
  { key: "system", i18nKey: "settings_system" },
];

export default function SettingsScreen() {
  const db = useSQLiteContext();
  const { preference, setPreference } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  const [admissionReminders, setAdmissionReminders] = useState(
    () => storage.getString("pref_admission_reminders") !== "false"
  );
  const [openDayAlerts, setOpenDayAlerts] = useState(
    () => storage.getString("pref_open_day_alerts") !== "false"
  );
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    db.getFirstAsync<{ value: string }>(
      "SELECT value FROM db_metadata WHERE key = ?",
      "last_seed_ts"
    ).then((row) => {
      if (row) setLastUpdated(row.value);
    });
  }, [db]);

  const toggleAdmissionReminders = useCallback((val: boolean) => {
    setAdmissionReminders(val);
    storage.set("pref_admission_reminders", String(val));
  }, []);

  const toggleOpenDayAlerts = useCallback((val: boolean) => {
    setOpenDayAlerts(val);
    storage.set("pref_open_day_alerts", String(val));
  }, []);

  const handleClearAll = useCallback(() => {
    Alert.alert(t("settings_clear_all"), t("settings_clear_confirm"), [
      { text: t("settings_clear_no"), style: "cancel" },
      {
        text: t("settings_clear_yes"),
        style: "destructive",
        onPress: async () => {
          await db.runAsync("DELETE FROM schools");
          await db.runAsync("DELETE FROM hei_institutions");
          await db.runAsync("DELETE FROM ugc_programmes");
          await db.runAsync("DELETE FROM calendar_events");
          await db.runAsync("DELETE FROM db_metadata");
          storage.remove("shortlist-storage");
          storage.remove("status-tracker-storage");
          Alert.alert("Data cleared. Please restart the app.");
        },
      },
    ]);
  }, [db, t]);

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const lastUpdatedDisplay = lastUpdated
    ? t("settings_last_updated").replace("{date}", new Date(lastUpdated).toLocaleDateString())
    : "";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Display Section */}
      <Text style={styles.sectionTitle}>{t("settings_display")}</Text>
      <View style={styles.card}>
        {/* Language */}
        <Text style={styles.rowLabel}>{t("settings_language")}</Text>
        <View style={styles.segmentRow}>
          <Pressable
            onPress={() => setLocale("en")}
            style={[styles.segment, locale === "en" && styles.segmentActive]}
            accessibilityRole="radio"
            accessibilityState={{ selected: locale === "en" }}
          >
            <Text style={[styles.segmentText, locale === "en" && styles.segmentTextActive]}>
              {t("settings_english")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setLocale("tc")}
            style={[styles.segment, locale === "tc" && styles.segmentActive]}
            accessibilityRole="radio"
            accessibilityState={{ selected: locale === "tc" }}
          >
            <Text style={[styles.segmentText, locale === "tc" && styles.segmentTextActive]}>
              {t("settings_chinese")}
            </Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Appearance */}
        <Text style={styles.rowLabel}>{t("settings_appearance")}</Text>
        <View style={styles.segmentRow}>
          {THEME_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setPreference(opt.key)}
              style={[styles.segment, preference === opt.key && styles.segmentActive]}
              accessibilityRole="radio"
              accessibilityState={{ selected: preference === opt.key }}
            >
              <Text style={[styles.segmentText, preference === opt.key && styles.segmentTextActive]}>
                {t(opt.i18nKey)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Notifications Section */}
      <Text style={styles.sectionTitle}>{t("settings_notifications")}</Text>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>{t("settings_admission_reminders")}</Text>
          <Switch
            value={admissionReminders}
            onValueChange={toggleAdmissionReminders}
            trackColor={{ true: COLORS.accent, false: COLORS.light.hairline }}
            thumbColor={COLORS.light.surface}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>{t("settings_open_day_alerts")}</Text>
          <Switch
            value={openDayAlerts}
            onValueChange={toggleOpenDayAlerts}
            trackColor={{ true: COLORS.accent, false: COLORS.light.hairline }}
            thumbColor={COLORS.light.surface}
          />
        </View>
      </View>

      {/* Data Section */}
      <Text style={styles.sectionTitle}>{t("settings_data")}</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.rowLabel}>{t("settings_cached_data")}</Text>
          <Text style={styles.rowValue}>{lastUpdatedDisplay}</Text>
        </View>
        <View style={styles.divider} />
        <Pressable onPress={handleClearAll} style={styles.dangerRow} accessibilityRole="button">
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={styles.dangerText}>{t("settings_clear_all")}</Text>
        </Pressable>
      </View>

      {/* About Section */}
      <Text style={styles.sectionTitle}>{t("settings_about")}</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.rowLabel}>{t("settings_data_sources")}</Text>
          <Text style={styles.rowValue}>{t("settings_data_attribution")}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.rowLabel}>{t("settings_version")}</Text>
          <Text style={styles.rowValue}>{appVersion}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rowLabel: {
    fontSize: 15,
    color: COLORS.light.textPrimary,
    marginBottom: 8,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.light.hairline,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.light.textPrimary,
  },
  segmentTextActive: {
    color: COLORS.light.surface,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light.hairline,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  rowValue: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  dangerText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#EF4444",
  },
});
