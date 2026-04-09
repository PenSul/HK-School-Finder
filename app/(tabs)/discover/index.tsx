import { useRef, useState, useCallback } from "react";
import { View, Text } from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import type BottomSheet from "@gorhom/bottom-sheet";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useFilterStore } from "@/stores/useFilterStore";
import { useSchools } from "@/hooks/useSchools";
import { useInstitutions } from "@/hooks/useInstitutions";
import { useSchoolCount } from "@/hooks/useSchoolCount";
import type { School } from "@/types/school";
import type { HeiInstitution } from "@/types/school";
import { EducationLevelTabs } from "@/components/discover/EducationLevelTabs";
import { SearchBar } from "@/components/discover/SearchBar";
import { ActiveFilterChips } from "@/components/discover/ActiveFilterChips";
import { SchoolCard } from "@/components/shared/SchoolCard";
import { InstitutionCard } from "@/components/shared/InstitutionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BackToTopButton } from "@/components/shared/BackToTopButton";
import { FilterSheet } from "@/components/shared/FilterSheet";

export default function DiscoverScreen() {
  const educationLevel = useFilterStore((s) => s.educationLevel);
  const hasActiveFilters = useFilterStore((s) =>
    s.searchQuery.trim().length > 0 ||
    s.districts.length > 0 ||
    s.financeTypes.length > 0 ||
    s.religions.length > 0 ||
    s.sessions.length > 0 ||
    s.genders.length > 0
  );
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const isUniversity = educationLevel === "UNIVERSITY";

  const { schools, loading: schoolsLoading } = useSchools();
  const { institutions, loading: instLoading } = useInstitutions(searchQuery);
  const count = useSchoolCount();

  const flashListRef = useRef<FlashListRef<School | HeiInstitution>>(null);
  const filterSheetRef = useRef<BottomSheet>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const openFilter = useCallback(() => {
    filterSheetRef.current?.snapToIndex(0);
  }, []);

  const closeFilter = useCallback(() => {
    filterSheetRef.current?.close();
  }, []);

  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setShowBackToTop(false);
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setShowBackToTop(offsetY > 400);
    },
    []
  );

  const data = isUniversity ? institutions : schools;
  const loading = isUniversity ? instLoading : schoolsLoading;
  const label = isUniversity ? "Institutions" : "Schools";

  const renderItem = useCallback(
    ({ item }: { item: School | HeiInstitution }) => {
      if (isUniversity) {
        return <InstitutionCard institution={item as HeiInstitution} />;
      }
      return <SchoolCard school={item as School} />;
    },
    [isUniversity]
  );

  const keyExtractor = useCallback(
    (item: School | HeiInstitution) => {
      if (isUniversity) {
        return String((item as HeiInstitution).objectid);
      }
      return (item as School).school_no;
    },
    [isUniversity]
  );

  const ListHeader = useCallback(
    () => (
      <Text className="px-4 py-2 text-sm text-text-secondary">
        {count} {label} Found
      </Text>
    ),
    [count, label]
  );

  const ListEmpty = useCallback(
    () => (loading ? null : <EmptyState />),
    [loading]
  );

  return (
    <View className="flex-1 bg-bg-light dark:bg-bg-dark">
      <EducationLevelTabs />
      <SearchBar onFilterPress={openFilter} hasActiveFilters={hasActiveFilters} />
      <ActiveFilterChips />

      <FlashList
        ref={flashListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <BackToTopButton visible={showBackToTop} onPress={scrollToTop} />
      <FilterSheet ref={filterSheetRef} onClose={closeFilter} />
    </View>
  );
}
