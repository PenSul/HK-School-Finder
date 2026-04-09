import { memo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useStatusTrackerStore, type ApplicationStage } from "@/stores/useStatusTrackerStore";
import { useLanguage } from "@/providers/LanguageProvider";
import { COLORS } from "@/constants/colors";

const STAGES: { key: ApplicationStage; i18nKey: string }[] = [
  { key: "interested", i18nKey: "shortlist_stage_interested" },
  { key: "visited", i18nKey: "shortlist_stage_visited" },
  { key: "applied", i18nKey: "shortlist_stage_applied" },
  { key: "result", i18nKey: "shortlist_stage_result" },
];

interface StatusStepperProps {
  schoolId: string;
}

export const StatusStepper = memo(function StatusStepper({ schoolId }: StatusStepperProps) {
  const { t } = useLanguage();
  const currentStage = useStatusTrackerStore((s) => s.stages[schoolId]);
  const setStage = useStatusTrackerStore((s) => s.setStage);

  const currentIndex = currentStage
    ? STAGES.findIndex((s) => s.key === currentStage)
    : -1;

  const handlePress = useCallback(
    (stage: ApplicationStage) => {
      setStage(schoolId, stage);
    },
    [schoolId, setStage]
  );

  return (
    <View style={styles.container}>
      {STAGES.map((stage, index) => {
        const isActive = index <= currentIndex;
        const isLast = index === STAGES.length - 1;
        return (
          <View key={stage.key} style={styles.stepWrapper}>
            <View style={styles.stepRow}>
              <Pressable
                onPress={() => handlePress(stage.key)}
                style={[
                  styles.circle,
                  { backgroundColor: isActive ? COLORS.accent : COLORS.light.hairline },
                ]}
                accessibilityRole="button"
                accessibilityLabel={t(stage.i18nKey)}
                accessibilityState={{ selected: isActive }}
              >
                {isActive ? (
                  <Ionicons name="checkmark" size={12} color={COLORS.light.surface} />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </Pressable>
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: index < currentIndex ? COLORS.accent : COLORS.light.hairline },
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: isActive ? COLORS.accent : COLORS.light.textSecondary },
              ]}
              numberOfLines={1}
            >
              {t(stage.i18nKey)}
            </Text>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  stepWrapper: {
    flex: 1,
    alignItems: "center",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 2,
  },
  stepNumber: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
});
