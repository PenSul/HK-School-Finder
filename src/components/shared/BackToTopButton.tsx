import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface BackToTopButtonProps {
  visible: boolean;
  onPress: () => void;
}

export function BackToTopButton({ visible, onPress }: BackToTopButtonProps) {
  if (!visible) return null;

  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-24 right-4 bg-primary w-12 h-12 rounded-full items-center justify-center"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
      }}
      accessibilityRole="button"
      accessibilityLabel="Scroll to top"
    >
      <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
    </Pressable>
  );
}
