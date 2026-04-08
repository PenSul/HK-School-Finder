import { View, Text } from "react-native";
import { useSchoolCount } from "@/hooks/useSchoolCount";

export default function DiscoverScreen() {
  const count = useSchoolCount();

  return (
    <View className="flex-1 items-center justify-center bg-bg-light">
      <Text className="text-2xl font-bold text-primary mb-2">Discover</Text>
      <Text className="text-base text-text-secondary">
        {count} schools found
      </Text>
    </View>
  );
}
