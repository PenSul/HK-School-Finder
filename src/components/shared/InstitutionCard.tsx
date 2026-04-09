import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { HeiInstitution } from "@/types/school";
import { useLanguage } from "@/providers/LanguageProvider";

interface InstitutionCardProps {
  institution: HeiInstitution;
}

export const InstitutionCard = memo(function InstitutionCard({ institution }: InstitutionCardProps) {
  const router = useRouter();
  const { locale } = useLanguage();

  const name = locale === "tc"
    ? institution.facility_name_tc || institution.facility_name_en
    : institution.facility_name_en;
  const subName = locale === "tc" ? institution.facility_name_en : institution.facility_name_tc;
  const address = locale === "tc"
    ? institution.address_tc || institution.address_en
    : institution.address_en;

  return (
    <Pressable
      onPress={() => router.push(`/institution/${institution.objectid}`)}
      className="bg-surface-light rounded-xl mx-4 mb-3 p-4"
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
      accessibilityRole="button"
      accessibilityLabel={`${institution.facility_name_en}`}
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
        <View className="rounded px-2 py-0.5 bg-text-secondary">
          <Text className="text-xs font-medium text-white">HEI</Text>
        </View>
      </View>
      {address ? (
        <Text className="text-xs text-text-secondary mt-2" numberOfLines={1}>
          {address}
        </Text>
      ) : null}
    </Pressable>
  );
});
