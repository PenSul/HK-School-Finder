import { View, Text } from "react-native";
import { useShortlistStore } from "@/stores/useShortlistStore";

export default function ShortlistScreen() {
  const count = useShortlistStore((s) => s.shortlistedIds.length);

  return (
    <View className="flex-1 items-center justify-center bg-bg-light">
      <Text className="text-2xl font-bold text-primary mb-2">Shortlist</Text>
      <Text className="text-base text-text-secondary">
        {count} schools saved
      </Text>
    </View>
  );
}
