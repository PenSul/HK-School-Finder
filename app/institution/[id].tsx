import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useInstitutionById } from "@/hooks/useInstitutionById";
import { useProgrammesByInstitution } from "@/hooks/useProgrammesByInstitution";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCompareStore } from "@/stores/useCompareStore";
import { useShortlistStore } from "@/stores/useShortlistStore";
import { AccordionSection } from "@/components/detail/AccordionSection";
import { ContactRow } from "@/components/detail/ContactRow";
import { InfoTile } from "@/components/detail/InfoTile";
import { EmptyState } from "@/components/shared/EmptyState";
import { COLORS } from "@/constants/colors";
import type { UgcProgramme } from "@/types/school";

export default function InstitutionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const objectid = Number(id);
  const router = useRouter();
  const { locale, t } = useLanguage();
  const { institution, loading } = useInstitutionById(objectid);

  const shortlistId = `hei-${id}`;
  const addCompare = useCompareStore((s) => s.addSchool);
  const isCompared = useCompareStore((s) => s.isSelected(shortlistId));
  const addShortlist = useShortlistStore((s) => s.addToShortlist);
  const removeShortlist = useShortlistStore((s) => s.removeFromShortlist);
  const isShortlisted = useShortlistStore((s) => s.isShortlisted(shortlistId));

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({ address: true, contact: false, programmes: true });
  const [programmeSearch, setProgrammeSearch] = useState("");

  const universityEn = institution?.facility_name_en ?? "";
  const { programmes, loading: progLoading } = useProgrammesByInstitution(
    universityEn,
    programmeSearch
  );
  const isUgc = programmes.length > 0 || progLoading;

  const toggleSection = useCallback((key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleShortlist = useCallback(() => {
    if (isShortlisted) {
      removeShortlist(shortlistId);
    } else {
      addShortlist(shortlistId);
    }
  }, [shortlistId, isShortlisted, addShortlist, removeShortlist]);

  const handleCompare = useCallback(() => {
    addCompare(shortlistId);
    router.push("/compare");
  }, [shortlistId, addCompare, router]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: "" }} />
        <View className="flex-1 items-center justify-center bg-bg-light">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </>
    );
  }

  if (!institution) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: "" }} />
        <View className="flex-1 bg-bg-light">
          <EmptyState
            title={t("detail_institution_not_found")}
            message={t("detail_go_back")}
            icon="alert-circle-outline"
          />
        </View>
      </>
    );
  }

  const name =
    locale === "tc"
      ? institution.facility_name_tc || institution.facility_name_en
      : institution.facility_name_en;
  const subName =
    locale === "tc"
      ? institution.facility_name_en
      : institution.facility_name_tc;
  const address =
    locale === "tc"
      ? institution.address_tc || institution.address_en
      : institution.address_en;

  const groupedProgrammes = programmes.reduce<
    Record<string, UgcProgramme[]>
  >((acc, p) => {
    const key =
      locale === "tc" ? p.level_of_study_tc : p.level_of_study_en;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});
  const programmeSections = Object.entries(groupedProgrammes).map(
    ([title, data]) => ({ title, data })
  );

  return (
    <>
      <Stack.Screen options={{ headerTitle: "" }} />
      <View className="flex-1 bg-bg-light">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Hero Banner */}
          <View
            style={{ backgroundColor: COLORS.primary }}
            className="px-4 pt-6 pb-5"
          >
            <Text className="text-xl font-bold text-white" numberOfLines={3}>
              {name}
            </Text>
            {subName ? (
              <Text
                className="text-sm text-white/70 mt-1"
                numberOfLines={2}
              >
                {subName}
              </Text>
            ) : null}
            <View className="flex-row items-center mt-3 gap-2">
              <View
                style={{
                  backgroundColor: isUgc ? "#D97706" : "#64748B",
                }}
                className="rounded px-2 py-0.5"
              >
                <Text className="text-xs font-medium text-white">
                  {isUgc ? "UGC" : "HEI"}
                </Text>
              </View>
              <Pressable
                onPress={handleCompare}
                className="flex-row items-center rounded-full px-3 py-1.5 border border-white/40"
                accessibilityRole="button"
                accessibilityLabel={t("detail_compare")}
              >
                <Ionicons
                  name={
                    isCompared ? "checkmark-circle" : "add-circle-outline"
                  }
                  size={16}
                  color="white"
                />
                <Text className="text-xs font-medium text-white ml-1">
                  {t("detail_compare")}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Info Strip */}
          <View className="flex-row gap-2 px-4 mt-4">
            <InfoTile
              icon="location-outline"
              label={t("detail_address")}
              value={address ? address.substring(0, 40) : "-"}
            />
            {institution.telephone ? (
              <InfoTile
                icon="call-outline"
                label={t("detail_telephone")}
                value={institution.telephone}
              />
            ) : null}
            {institution.website ? (
              <InfoTile
                icon="globe-outline"
                label={t("detail_website")}
                value={
                  institution.website.replace(/^https?:\/\//, "").substring(0, 25)
                }
              />
            ) : null}
          </View>

          {/* Address Section */}
          <View className="mt-4">
            <AccordionSection
              title={t("detail_address")}
              expanded={expandedSections.address ?? true}
              onToggle={() => toggleSection("address")}
            >
              <View className="gap-2">
                {institution.address_en ? (
                  <Text className="text-sm text-text-primary">
                    {institution.address_en}
                  </Text>
                ) : null}
                {institution.address_tc ? (
                  <Text className="text-sm text-text-primary">
                    {institution.address_tc}
                  </Text>
                ) : null}
              </View>
            </AccordionSection>

            {/* Contact Section */}
            <AccordionSection
              title={t("detail_contact")}
              expanded={expandedSections.contact ?? false}
              onToggle={() => toggleSection("contact")}
            >
              <ContactRow
                icon="call-outline"
                label={t("detail_telephone")}
                value={institution.telephone}
                type="tel"
              />
              <ContactRow
                icon="document-text-outline"
                label={t("detail_fax")}
                value={institution.fax}
                type="fax"
              />
              <ContactRow
                icon="mail-outline"
                label={t("detail_email")}
                value={institution.email}
                type="email"
              />
              <ContactRow
                icon="globe-outline"
                label={t("detail_website")}
                value={institution.website}
                type="url"
              />
            </AccordionSection>

            {/* UGC Programmes Section */}
            {isUgc ? (
              <AccordionSection
                title={`${t("detail_programmes")} (${programmes.length})`}
                expanded={expandedSections.programmes ?? true}
                onToggle={() => toggleSection("programmes")}
              >
                {/* Programme Search */}
                <View className="flex-row items-center bg-bg-light rounded-lg px-3 py-2 mb-3">
                  <Ionicons
                    name="search-outline"
                    size={16}
                    color="#64748B"
                  />
                  <TextInput
                    className="flex-1 ml-2 text-sm text-text-primary"
                    placeholder={t("detail_search_programmes")}
                    placeholderTextColor="#94A3B8"
                    value={programmeSearch}
                    onChangeText={setProgrammeSearch}
                    accessibilityLabel={t("detail_search_programmes")}
                  />
                </View>

                {/* Grouped Programme List */}
                {programmeSections.length === 0 && !progLoading ? (
                  <Text className="text-sm text-text-secondary text-center py-4">
                    {t("detail_no_programmes")}
                  </Text>
                ) : (
                  programmeSections.map((section) => (
                    <View key={section.title} className="mb-3">
                      <Text className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                        {section.title}
                      </Text>
                      {section.data.map((prog) => (
                        <View
                          key={prog.objectid}
                          className="py-2 border-b border-hairline"
                        >
                          <Text
                            className="text-sm text-text-primary"
                            numberOfLines={2}
                          >
                            {locale === "tc"
                              ? prog.programme_name_tc ||
                                prog.programme_name_en
                              : prog.programme_name_en}
                          </Text>
                          <Text className="text-xs text-text-secondary mt-0.5">
                            {locale === "tc"
                              ? prog.mode_of_study_tc
                              : prog.mode_of_study_en}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))
                )}
              </AccordionSection>
            ) : null}
          </View>
        </ScrollView>

        {/* Bottom Sticky Bar */}
        <View
          className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-4 py-3 bg-surface-light border-t border-hairline"
          style={{ paddingBottom: 24 }}
        >
          <Pressable
            onPress={() => {
              if (institution.latitude && institution.longitude) {
                router.push("/(tabs)/map");
              }
            }}
            className="flex-1 flex-row items-center justify-center py-3 rounded-lg border border-primary"
            accessibilityRole="button"
            accessibilityLabel={t("detail_view_on_map")}
          >
            <Ionicons name="map-outline" size={18} color={COLORS.primary} />
            <Text className="text-sm font-medium text-primary ml-2">
              {t("detail_view_on_map")}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleShortlist}
            className="flex-1 flex-row items-center justify-center py-3 rounded-lg"
            style={{ backgroundColor: COLORS.accent }}
            accessibilityRole="button"
            accessibilityLabel={
              isShortlisted
                ? t("detail_remove_shortlist")
                : t("detail_add_shortlist")
            }
          >
            <Ionicons
              name={isShortlisted ? "heart" : "heart-outline"}
              size={18}
              color="white"
            />
            <Text className="text-sm font-medium text-white ml-2">
              {isShortlisted
                ? t("detail_remove_shortlist")
                : t("detail_add_shortlist")}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
