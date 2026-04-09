import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { School } from "@/types/school";
import { Badge } from "./Badge";
import { useLanguage } from "@/providers/LanguageProvider";

interface SchoolCardProps {
  school: School;
}

export const SchoolCard = memo(function SchoolCard({ school }: SchoolCardProps) {
  const router = useRouter();
  const { locale } = useLanguage();

  const name = locale === "tc" ? school.name_tc || school.name_en : school.name_en;
  const subName = locale === "tc" ? school.name_en : school.name_tc;
  const district = locale === "tc" ? school.district_tc : school.district_en;

  return (
    <Pressable
      onPress={() => router.push(`/school/${school.school_no}`)}
      className="bg-surface-light rounded-xl mx-4 mb-3 p-4"
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
      accessibilityRole="button"
      accessibilityLabel={`${school.name_en}, ${school.district_en}`}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-text-primary" numberOfLines={2}>
            {name}
          </Text>
          {subName ? (
            <Text className="text-sm text-text-secondary mt-0.5" numberOfLines={1}>
              {subName}
            </Text>
          ) : null}
        </View>
        <Badge financeType={school.finance_type_en} locale={locale} />
      </View>
      <View className="flex-row mt-2 gap-3 flex-wrap">
        <Text className="text-xs text-text-secondary">{district}</Text>
        <Text className="text-xs text-text-secondary">
          {locale === "tc" ? school.session_tc : school.session_en}
        </Text>
        <Text className="text-xs text-text-secondary">
          {locale === "tc" ? school.students_gender_tc : school.students_gender_en}
        </Text>
      </View>
    </Pressable>
  );
});
