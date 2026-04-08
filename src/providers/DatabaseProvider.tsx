import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { isSeeded, seedDatabase, type SeedProgress } from "@/db/seed";

interface DatabaseContextValue {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({ isReady: false });

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [isReady, setIsReady] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [progress, setProgress] = useState<SeedProgress | null>(null);

  const runSeed = useCallback(async () => {
    try {
      setSeedError(null);
      const alreadySeeded = await isSeeded(db);
      if (alreadySeeded) {
        setIsReady(true);
        return;
      }

      setIsSeeding(true);
      await seedDatabase(db, (p) => setProgress(p));
      setIsSeeding(false);
      setIsReady(true);
    } catch (err) {
      setIsSeeding(false);
      setSeedError(err instanceof Error ? err.message : String(err));
    }
  }, [db]);

  useEffect(() => {
    runSeed();
  }, [runSeed]);

  if (seedError) {
    return (
      <View className="flex-1 items-center justify-center bg-bg-light px-8">
        <Text className="text-xl font-bold text-primary mb-2">
          Failed to Load Data
        </Text>
        <Text className="text-base text-text-secondary text-center mb-6">
          {seedError}
        </Text>
        <Pressable
          onPress={runSeed}
          className="bg-accent px-6 py-3 rounded-lg"
        >
          <Text className="text-base font-semibold text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-bg-light px-8">
        <ActivityIndicator size="large" color="#1E3A5F" />
        <Text className="text-lg font-semibold text-primary mt-4 mb-2">
          {isSeeding ? "Setting Up" : "Loading"}
        </Text>
        <Text className="text-base text-text-secondary text-center">
          {progress?.message ?? "Preparing database..."}
        </Text>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
