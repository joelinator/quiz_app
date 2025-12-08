'use client';

import { FALLBACK_THEME, STORAGE_KEYS } from "@/lib/constants";
import { Locale } from "@/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SettingsContextValue = {
  theme: "light" | "dark";
  language: Locale;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (locale: Locale) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const getInitialTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return FALLBACK_THEME;
  const stored = localStorage.getItem(STORAGE_KEYS.theme) as
    | "light"
    | "dark"
    | null;
  if (stored) return stored;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const getInitialLanguage = (): Locale => {
  if (typeof window === "undefined") return "fr";
  const stored = localStorage.getItem(STORAGE_KEYS.language) as Locale | null;
  if (stored) return stored;
  const browser = navigator.language?.startsWith("fr") ? "fr" : "en";
  return browser;
};

const applyThemeToDocument = (theme: "light" | "dark") => {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  // Use stable SSR-safe defaults to avoid hydration mismatch, then hydrate from storage/browser.
  const [theme, setThemeState] = useState<"light" | "dark">(FALLBACK_THEME);
  const [language, setLanguageState] = useState<Locale>("fr");
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const initialTheme = getInitialTheme();
    const initialLanguage = getInitialLanguage();
    setThemeState(initialTheme);
    setLanguageState(initialLanguage);
    applyThemeToDocument(initialTheme);
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setTheme = (next: "light" | "dark") => {
    setThemeState(next);
    applyThemeToDocument(next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
  };

  const setLanguage = (next: Locale) => {
    setLanguageState(next);
    localStorage.setItem(STORAGE_KEYS.language, next);
  };

  const value = useMemo(
    () => ({ theme, language, setTheme, setLanguage, hydrated }),
    [theme, language, hydrated],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
};

