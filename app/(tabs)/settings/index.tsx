import { View, Text } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { useLanguage } from "@/providers/LanguageProvider";

export default function SettingsScreen() {
  const { preference } = useTheme();
  const { locale } = useLanguage();

  return (
    <View className="flex-1 items-center justify-center bg-bg-light">
      <Text className="text-2xl font-bold text-primary mb-4">Settings</Text>
      <Text className="text-base text-text-secondary">
        Theme: {preference}
      </Text>
      <Text className="text-base text-text-secondary">
        Language: {locale.toUpperCase()}
      </Text>
    </View>
  );
}
