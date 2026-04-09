import { ScrollView, Pressable, Text } from "react-native";
import { useFilterStore } from "@/stores/useFilterStore";
import type { EducationLevel } from "@/types/filter";

const LEVELS: { key: EducationLevel; label: string }[] = [
  { key: "KG", label: "KG" },
  { key: "PRIMARY", label: "Primary" },
  { key: "SECONDARY", label: "Secondary" },
  { key: "UNIVERSITY", label: "University" },
];

export function EducationLevelTabs() {
  const educationLevel = useFilterStore((s) => s.educationLevel);
  const setEducationLevel = useFilterStore((s) => s.setEducationLevel);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 py-2"
    >
      {LEVELS.map((level) => {
        const isActive = educationLevel === level.key;
        return (
          <Pressable
            key={level.key}
            onPress={() => setEducationLevel(level.key)}
            className={`rounded-full px-4 py-2 mr-2 min-h-[36px] items-center justify-center ${
              isActive ? "bg-primary" : "bg-surface-light border border-hairline"
            }`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              className={`text-sm font-medium ${
                isActive ? "text-white" : "text-text-primary"
              }`}
            >
              {level.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
