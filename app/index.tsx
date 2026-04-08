import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import { DATABASE_NAME } from "@/db/client";
import { createTables } from "@/db/schema";
import { migrateIfNeeded } from "@/db/migrations";
import { isSeeded, seedDatabase, type SeedProgress } from "@/db/seed";
import { getSchoolCount } from "@/repositories/schoolRepository";
import { getInstitutionCount } from "@/repositories/heiRepository";
import { getProgrammeCount } from "@/repositories/programmeRepository";

export default function TestHarness() {
  const [status, setStatus] = useState("Initializing...");
  const [counts, setCounts] = useState({ schools: 0, hei: 0, ugc: 0 });

  useEffect(() => {
    (async () => {
      try {
        const db = await openDatabaseAsync(DATABASE_NAME);
        setStatus("Creating tables...");
        await createTables(db);
        await migrateIfNeeded(db);

        const seeded = await isSeeded(db);
        if (!seeded) {
          await seedDatabase(db, (p: SeedProgress) => {
            setStatus(`${p.phase}: ${p.message}`);
          });
        }

        const schoolCount = await getSchoolCount(db, {
          educationLevel: "PRIMARY",
          searchQuery: "",
          districts: [],
          financeTypes: [],
          religions: [],
          sessions: [],
          genders: [],
        });

        const heiCount = await getInstitutionCount(db);

        const ugcCount = await getProgrammeCount(db, {
          scope: "UGC",
          studyLevels: [],
          modesOfStudy: [],
          programmeSearch: "",
          districts: [],
        });

        setCounts({ schools: schoolCount, hei: heiCount, ugc: ugcCount });
        setStatus("Seed complete - data layer verified");
      } catch (err) {
        setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
      }
    })();
  }, []);

  return (
    <ScrollView className="flex-1 bg-bg-light p-4 pt-16">
      <Text className="text-2xl font-bold text-primary mb-4">
        Data Layer Verification
      </Text>
      <Text className="text-base text-text-secondary mb-6">{status}</Text>
      <View className="bg-surface-light rounded-xl p-4 gap-3">
        <Text className="text-lg text-text-primary">
          Primary Schools: {counts.schools}
        </Text>
        <Text className="text-lg text-text-primary">
          HEI Institutions: {counts.hei}
        </Text>
        <Text className="text-lg text-text-primary">
          UGC Programmes: {counts.ugc}
        </Text>
      </View>
    </ScrollView>
  );
}
