'use client';

import { Languages } from "lucide-react";
import { useSettings } from "@/components/providers";
import { cn } from "@/lib/utils";
import { textFor } from "@/lib/i18n";

export const LanguageToggle = () => {
  const { language, setLanguage } = useSettings();

  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400 sm:inline">
        {textFor(language, "languageToggle")}
      </div>
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white/90 p-1 shadow-lg dark:border-slate-800/60 dark:bg-slate-900/70">
        {(["fr", "en"] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setLanguage(loc)}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold uppercase tracking-tight transition",
              language === loc
                ? "bg-slate-100 text-slate-900 shadow-inner dark:bg-slate-700 dark:text-slate-50"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
            )}
          >
            {loc === "fr" ? "FR" : "EN"}
            {language === loc && <Languages className="h-3.5 w-3.5" />}
          </button>
        ))}
      </div>
    </div>
  );
};

