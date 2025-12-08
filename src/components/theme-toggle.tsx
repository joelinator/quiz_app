'use client';

import { Moon, Sun } from "lucide-react";
import { useSettings } from "@/components/providers";
import { cn } from "@/lib/utils";
import { textFor } from "@/lib/i18n";

export const ThemeToggle = () => {
  const { theme, setTheme, language } = useSettings();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-lg transition",
        "border-slate-300 bg-white/90 text-slate-800 hover:border-slate-400",
        "dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-slate-700",
      )}
      aria-label={textFor(language, "themeToggle")}
    >
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="hidden sm:inline">{textFor(language, "themeToggle")}</span>
    </button>
  );
};

