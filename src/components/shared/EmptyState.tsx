import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({
  title = "No Results Found",
  message = "Try adjusting your filters or search query",
  icon = "search-outline",
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20 px-8">
      <Ionicons name={icon} size={48} color="#64748B" />
      <Text className="text-lg font-semibold text-text-primary mt-4 text-center">
        {title}
      </Text>
      <Text className="text-sm text-text-secondary mt-2 text-center">
        {message}
      </Text>
    </View>
  );
}
