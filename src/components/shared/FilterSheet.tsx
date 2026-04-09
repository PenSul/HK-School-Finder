import { forwardRef, useMemo, useCallback } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { FilterChip } from "./FilterChip";
import { useFilterStore } from "@/stores/useFilterStore";
import { useUniFilterStore } from "@/stores/useUniFilterStore";
import { useSchoolCount } from "@/hooks/useSchoolCount";
import { DISTRICTS } from "@/constants/districts";
import { RELIGIONS } from "@/constants/religions";

// --- K-12 filter options ---

const KG_FINANCE_OPTIONS = ["PRIVATE", "AIDED"];
const PRIMARY_FINANCE_OPTIONS = ["GOVERNMENT", "AIDED", "DSS", "ESF", "CAPUT", "PRIVATE"];
const SESSION_OPTIONS_BASE = ["AM", "PM", "WHOLE DAY"];
const SESSION_OPTIONS_WITH_EVENING = [...SESSION_OPTIONS_BASE, "EVENING"];
const GENDER_OPTIONS = ["CO-ED", "BOYS", "GIRLS"];

// --- University filter options ---

const STUDY_LEVEL_OPTIONS = ["Sub-degree", "Undergraduate", "Taught Postgraduate", "Research Postgraduate"];
const MODE_OPTIONS = ["Full-time", "Part-time"];

interface FilterSheetProps {
  onClose: () => void;
}

export const FilterSheet = forwardRef<BottomSheet, FilterSheetProps>(
  function FilterSheet({ onClose }, ref) {
    const snapPoints = useMemo(() => ["50%", "92%"], []);
    const educationLevel = useFilterStore((s) => s.educationLevel);
    const isUniversity = educationLevel === "UNIVERSITY";

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#64748B" }}
      >
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <FilterHeader />
          {isUniversity ? <UniversityFilters /> : <K12Filters />}
        </BottomSheetScrollView>
        <FilterFooter onClose={onClose} />
      </BottomSheet>
    );
  }
);

// --- Header ---

function FilterHeader() {
  const educationLevel = useFilterStore((s) => s.educationLevel);
  const clearK12 = useFilterStore((s) => s.clearFilters);
  const clearUni = useUniFilterStore((s) => s.clearFilters);
  const isUniversity = educationLevel === "UNIVERSITY";

  return (
    <View className="flex-row justify-between items-center px-4 pb-3 border-b border-hairline">
      <Text className="text-lg font-bold text-text-primary">Filters</Text>
      <Pressable onPress={isUniversity ? clearUni : clearK12}>
        <Text className="text-sm font-medium text-accent">Clear All</Text>
      </Pressable>
    </View>
  );
}

// --- Footer with live count ---

function FilterFooter({ onClose }: { onClose: () => void }) {
  const educationLevel = useFilterStore((s) => s.educationLevel);
  const isUniversity = educationLevel === "UNIVERSITY";
  const schoolCount = useSchoolCount();

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-surface-light border-t border-hairline px-4 py-3">
      <Pressable
        onPress={onClose}
        className="bg-accent rounded-lg py-3 items-center"
        accessibilityRole="button"
      >
        <Text className="text-base font-semibold text-white">
          {isUniversity ? "Apply Filters" : `Show ${schoolCount} Schools`}
        </Text>
      </Pressable>
    </View>
  );
}

// --- K-12 Filters ---

function K12Filters() {
  const educationLevel = useFilterStore((s) => s.educationLevel);
  const districts = useFilterStore((s) => s.districts);
  const financeTypes = useFilterStore((s) => s.financeTypes);
  const religions = useFilterStore((s) => s.religions);
  const sessions = useFilterStore((s) => s.sessions);
  const genders = useFilterStore((s) => s.genders);
  const toggleDistrict = useFilterStore((s) => s.toggleDistrict);
  const toggleFinanceType = useFilterStore((s) => s.toggleFinanceType);
  const toggleReligion = useFilterStore((s) => s.toggleReligion);
  const toggleSession = useFilterStore((s) => s.toggleSession);
  const toggleGender = useFilterStore((s) => s.toggleGender);

  const financeOptions =
    educationLevel === "KG" ? KG_FINANCE_OPTIONS : PRIMARY_FINANCE_OPTIONS;
  const sessionOptions =
    educationLevel === "SECONDARY" ? SESSION_OPTIONS_WITH_EVENING : SESSION_OPTIONS_BASE;
  const showGender = educationLevel === "PRIMARY" || educationLevel === "SECONDARY";

  return (
    <View className="px-4 pt-4">
      <FilterSection title="Finance Type">
        {financeOptions.map((opt) => (
          <FilterChip
            key={opt}
            label={opt}
            isActive={financeTypes.includes(opt)}
            onPress={() => toggleFinanceType(opt)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Session">
        {sessionOptions.map((opt) => (
          <FilterChip
            key={opt}
            label={opt}
            isActive={sessions.includes(opt)}
            onPress={() => toggleSession(opt)}
          />
        ))}
      </FilterSection>

      {showGender && (
        <FilterSection title="Gender">
          {GENDER_OPTIONS.map((opt) => (
            <FilterChip
              key={opt}
              label={opt}
              isActive={genders.includes(opt)}
              onPress={() => toggleGender(opt)}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="District">
        {DISTRICTS.map((d) => (
          <FilterChip
            key={d.en}
            label={d.en}
            isActive={districts.includes(d.en)}
            onPress={() => toggleDistrict(d.en)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Religion">
        {RELIGIONS.map((r) => (
          <FilterChip
            key={r.en}
            label={r.en}
            isActive={religions.includes(r.en)}
            onPress={() => toggleReligion(r.en)}
          />
        ))}
      </FilterSection>
    </View>
  );
}

// --- University Filters ---

function UniversityFilters() {
  const scope = useUniFilterStore((s) => s.scope);
  const studyLevels = useUniFilterStore((s) => s.studyLevels);
  const modesOfStudy = useUniFilterStore((s) => s.modesOfStudy);
  const programmeSearch = useUniFilterStore((s) => s.programmeSearch);
  const districts = useUniFilterStore((s) => s.districts);
  const setScope = useUniFilterStore((s) => s.setScope);
  const toggleStudyLevel = useUniFilterStore((s) => s.toggleStudyLevel);
  const toggleModeOfStudy = useUniFilterStore((s) => s.toggleModeOfStudy);
  const setProgrammeSearch = useUniFilterStore((s) => s.setProgrammeSearch);
  const toggleDistrict = useUniFilterStore((s) => s.toggleDistrict);

  const isUgc = scope === "UGC";

  return (
    <View className="px-4 pt-4">
      <FilterSection title="Scope">
        <FilterChip label="UGC-funded" isActive={isUgc} onPress={() => setScope("UGC")} />
        <FilterChip label="All HEIs" isActive={!isUgc} onPress={() => setScope("ALL")} />
      </FilterSection>

      <FilterSection title="Level of Study">
        {STUDY_LEVEL_OPTIONS.map((opt) => (
          <FilterChip
            key={opt}
            label={opt}
            isActive={studyLevels.includes(opt)}
            onPress={() => toggleStudyLevel(opt)}
            disabled={!isUgc}
          />
        ))}
      </FilterSection>

      <FilterSection title="Mode of Study">
        {MODE_OPTIONS.map((opt) => (
          <FilterChip
            key={opt}
            label={opt}
            isActive={modesOfStudy.includes(opt)}
            onPress={() => toggleModeOfStudy(opt)}
            disabled={!isUgc}
          />
        ))}
      </FilterSection>

      {isUgc && (
        <FilterSection title="Programme Search">
          <View className="w-full flex-row items-center bg-surface-light rounded-xl px-3 py-2 border border-hairline mb-2">
            <TextInput
              value={programmeSearch}
              onChangeText={setProgrammeSearch}
              placeholder="Search programmes..."
              placeholderTextColor="#64748B"
              className="flex-1 text-sm text-text-primary"
              autoCorrect={false}
            />
          </View>
        </FilterSection>
      )}

      <FilterSection title="District">
        {DISTRICTS.map((d) => (
          <FilterChip
            key={d.en}
            label={d.en}
            isActive={districts.includes(d.en)}
            onPress={() => toggleDistrict(d.en)}
          />
        ))}
      </FilterSection>
    </View>
  );
}

// --- Shared section wrapper ---

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-text-primary mb-2">{title}</Text>
      <View className="flex-row flex-wrap">{children}</View>
    </View>
  );
}
