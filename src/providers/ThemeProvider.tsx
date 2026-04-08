import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { Appearance, useColorScheme } from "react-native";
import { storage } from "@/stores/mmkv";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  colorScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialPreference(): ThemePreference {
  const saved = storage.getString("theme-preference");
  if (saved === "light" || saved === "dark" || saved === "system") return saved;
  return "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(
    getInitialPreference
  );

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    storage.set("theme-preference", pref);
    Appearance.setColorScheme(pref === "system" ? "unspecified" : pref);
  }, []);

  useEffect(() => {
    if (preference !== "system") {
      Appearance.setColorScheme(preference);
    }
  }, [preference]);

  const resolvedScheme = systemScheme === "light" || systemScheme === "dark" ? systemScheme : "light";
  const colorScheme: "light" | "dark" =
    preference === "system" ? resolvedScheme : preference;

  return (
    <ThemeContext.Provider value={{ preference, setPreference, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
