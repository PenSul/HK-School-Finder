import { memo } from "react";
import { ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { useFilterStore } from "@/stores/useFilterStore";
import { useLanguage } from "@/providers/LanguageProvider";
import type { EducationLevel } from "@/types/filter";

const LEVELS: { key: EducationLevel; enLabel: string; i18nKey: string }[] = [
  { key: "KG", enLabel: "KG", i18nKey: "education_kg" },
  { key: "PRIMARY", enLabel: "Primary", i18nKey: "education_primary" },
  { key: "SECONDARY", enLabel: "Secondary", i18nKey: "education_secondary" },
  { key: "UNIVERSITY", enLabel: "Post-Sec", i18nKey: "map_post_sec" },
];

export const MapLevelPills = memo(function MapLevelPills() {
  const educationLevel = useFilterStore((s) => s.educationLevel);
  const setEducationLevel = useFilterStore((s) => s.setEducationLevel);
  const { t } = useLanguage();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {LEVELS.map((level) => {
        const isActive = educationLevel === level.key;
        return (
          <Pressable
            key={level.key}
            onPress={() => setEducationLevel(level.key)}
            style={[
              styles.pill,
              isActive ? styles.pillActive : styles.pillInactive,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.pillText,
                isActive ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              {t(level.i18nKey)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  pill: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pillActive: {
    backgroundColor: "#1E3A5F",
  },
  pillInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  pillTextInactive: {
    color: "#1E293B",
  },
});
