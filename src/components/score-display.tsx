'use client';

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Locale } from "@/types";
import { textFor } from "@/lib/i18n";

type ScoreDisplayProps = {
  correct: number;
  incorrect: number;
  total: number;
  locale: Locale;
};

export const ScoreDisplay = ({
  correct,
  incorrect,
  total,
  locale,
}: ScoreDisplayProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm text-slate-800 shadow-xl dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-200">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
            {textFor(locale, "correct")}
          </p>
          <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-300">
            {correct}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <XCircle className="h-5 w-5 text-rose-400" />
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
            {textFor(locale, "incorrect")}
          </p>
          <p className="text-lg font-semibold text-rose-600 dark:text-rose-300">
            {incorrect}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div
          className={cn(
            "rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-right dark:border-slate-800/60 dark:bg-slate-800/60",
          )}
        >
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
            {textFor(locale, "score")}
          </p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {correct} / {total}
          </p>
        </div>
      </div>
    </div>
  );
};

