import "../global.css";
import { useEffect, type ReactNode } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "nativewind";
import { DATABASE_NAME } from "@/db/client";
import { createTables } from "@/db/schema";
import { migrateIfNeeded } from "@/db/migrations";
import { DatabaseProvider } from "@/providers/DatabaseProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";

SplashScreen.preventAutoHideAsync();

/** Syncs our ThemeProvider colorScheme to NativeWind so dark: classes work */
function DarkModeSync({ children }: { children: ReactNode }) {
  const { colorScheme } = useTheme();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme, setColorScheme]);

  return <>{children}</>;
}

async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await createTables(db);
  await migrateIfNeeded(db);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDatabase}>
        <DatabaseProvider>
          <ThemeProvider>
            <DarkModeSync>
            <LanguageProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="school/[id]"
                  options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                  name="institution/[id]"
                  options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                  name="compare/index"
                  options={{ headerShown: true, headerTitle: "Compare" }}
                />
                <Stack.Screen
                  name="event/[id]"
                  options={{ headerShown: true, headerTitle: "" }}
                />
                <Stack.Screen
                  name="event/create"
                  options={{ headerShown: true, headerTitle: "New Event" }}
                />
              </Stack>
            </LanguageProvider>
            </DarkModeSync>
          </ThemeProvider>
        </DatabaseProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
