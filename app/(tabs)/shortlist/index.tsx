import { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useShortlistedItems, type ShortlistItem } from "@/hooks/useShortlistedItems";
import { useShortlistStore } from "@/stores/useShortlistStore";
import { useLanguage } from "@/providers/LanguageProvider";
import { Badge } from "@/components/shared/Badge";
import { StatusStepper } from "@/components/shortlist/StatusStepper";
import { EmptyState } from "@/components/shared/EmptyState";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "@/constants/colors";

export default function ShortlistScreen() {
  const { items, loading } = useShortlistedItems();
  const removeFromShortlist = useShortlistStore((s) => s.removeFromShortlist);
  const { locale, t } = useLanguage();
  const router = useRouter();

  const renderItem = useCallback(
    ({ item }: { item: ShortlistItem }) => {
      if (item.type === "school") {
        const s = item.data;
        const name = locale === "tc" ? s.name_tc || s.name_en : s.name_en;
        const subName = locale === "tc" ? s.name_en : s.name_tc;
        return (
          <View className="bg-surface-light rounded-xl mx-4 mb-3 p-4"
            style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
            <Pressable
              onPress={() => router.push(`/school/${s.school_no}`)}
              accessibilityRole="button"
              accessibilityLabel={s.name_en}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <Text className="text-base font-semibold text-text-primary" numberOfLines={2}>{name}</Text>
                  {subName ? <Text className="text-sm text-text-secondary mt-0.5" numberOfLines={1}>{subName}</Text> : null}
                </View>
                <Badge financeType={s.finance_type_en} locale={locale} />
              </View>
              <Text className="text-xs text-text-secondary mt-1">
                {locale === "tc" ? s.district_tc : s.district_en}
              </Text>
            </Pressable>
            <StatusStepper schoolId={s.school_no} />
            <Pressable
              onPress={() => removeFromShortlist(s.school_no)}
              className="flex-row items-center justify-center mt-1 py-2"
              accessibilityRole="button"
              accessibilityLabel={t("shortlist_remove")}
            >
              <Ionicons name="trash-outline" size={14} color={COLORS.light.textSecondary} />
              <Text className="text-xs text-text-secondary ml-1">{t("shortlist_remove")}</Text>
            </Pressable>
          </View>
        );
      }
      // Institution
      const inst = item.data;
      const name = locale === "tc" ? inst.facility_name_tc || inst.facility_name_en : inst.facility_name_en;
      return (
        <View className="bg-surface-light rounded-xl mx-4 mb-3 p-4"
          style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
          <Pressable
            onPress={() => router.push(`/institution/${inst.objectid}`)}
            accessibilityRole="button"
            accessibilityLabel={inst.facility_name_en}
          >
            <Text className="text-base font-semibold text-text-primary" numberOfLines={2}>{name}</Text>
          </Pressable>
          <StatusStepper schoolId={String(inst.objectid)} />
          <Pressable
            onPress={() => removeFromShortlist(String(inst.objectid))}
            className="flex-row items-center justify-center mt-1 py-2"
            accessibilityRole="button"
            accessibilityLabel={t("shortlist_remove")}
          >
            <Ionicons name="trash-outline" size={14} color={COLORS.light.textSecondary} />
            <Text className="text-xs text-text-secondary ml-1">{t("shortlist_remove")}</Text>
          </Pressable>
        </View>
      );
    },
    [locale, router, removeFromShortlist, t]
  );

  const keyExtractor = useCallback(
    (item: ShortlistItem) =>
      item.type === "school" ? item.data.school_no : String(item.data.objectid),
    []
  );

  if (!loading && items.length === 0) {
    return (
      <View className="flex-1 bg-bg-light dark:bg-bg-dark">
        <EmptyState
          title={t("shortlist_empty")}
          message={t("shortlist_empty_cta")}
          icon="heart-outline"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg-light dark:bg-bg-dark">
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 16 }}
      />
    </View>
  );
}
