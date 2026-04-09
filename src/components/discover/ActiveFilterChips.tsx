import { ScrollView, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFilterStore } from "@/stores/useFilterStore";

interface ChipData {
  label: string;
  onRemove: () => void;
}

export function ActiveFilterChips() {
  const districts = useFilterStore((s) => s.districts);
  const financeTypes = useFilterStore((s) => s.financeTypes);
  const religions = useFilterStore((s) => s.religions);
  const sessions = useFilterStore((s) => s.sessions);
  const genders = useFilterStore((s) => s.genders);
  const toggleDistrict = useFilterStore((s) => s.toggleDistrict);
  const toggleFinanceType = useFilterStore((s) => s.toggleFinanceType);
  const toggleReligion = useFilterStore((s) => s.toggleReligion);
  const toggleSession = useFilterStore((s) => s.toggleSession);
  const toggleGender = useFilterStore((s) => s.toggleGender);

  const chips: ChipData[] = [
    ...financeTypes.map((f) => ({ label: f, onRemove: () => toggleFinanceType(f) })),
    ...sessions.map((s) => ({ label: s, onRemove: () => toggleSession(s) })),
    ...genders.map((g) => ({ label: g, onRemove: () => toggleGender(g) })),
    ...districts.map((d) => ({ label: d, onRemove: () => toggleDistrict(d) })),
    ...religions.map((r) => ({ label: r, onRemove: () => toggleReligion(r) })),
  ];

  if (chips.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 pb-2"
    >
      {chips.map((chip) => (
        <Pressable
          key={chip.label}
          onPress={chip.onRemove}
          className="flex-row items-center bg-primary/10 rounded-full px-3 py-1.5 mr-2"
          accessibilityRole="button"
          accessibilityLabel={`Remove ${chip.label} filter`}
        >
          <Text className="text-xs text-primary mr-1">{chip.label}</Text>
          <Ionicons name="close" size={12} color="#1E3A5F" />
        </Pressable>
      ))}
    </ScrollView>
  );
}
