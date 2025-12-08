'use client';

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { cn, pickLocalized } from "@/lib/utils";
import { Locale, Option } from "@/types";

type OptionCardProps = {
  option: Option;
  index: number;
  selectedIndex: number | null;
  correctIndex: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
  locale: Locale;
};

export const OptionCard = ({
  option,
  index,
  selectedIndex,
  correctIndex,
  onSelect,
  disabled,
  locale,
}: OptionCardProps) => {
  const isSelected = selectedIndex === index;
  const isCorrect = isSelected && selectedIndex === correctIndex;
  const isWrong = isSelected && !isCorrect;
  const statusIcon = isCorrect ? (
    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
  ) : isWrong ? (
    <XCircle className="h-5 w-5 text-rose-400" />
  ) : (
    <Info className="h-5 w-5 text-slate-600 dark:text-slate-400" />
  );

  return (
    <motion.button
      type="button"
      layout
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      onClick={() => onSelect(index)}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-gradient-to-br p-4 text-left shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
        "border-slate-200 from-white via-slate-50 to-slate-100 backdrop-blur-sm hover:border-slate-300",
        "dark:border-slate-800/60 dark:from-slate-900/70 dark:via-slate-900/50 dark:to-slate-800/40 dark:hover:border-slate-600/70",
        disabled && "opacity-70 cursor-not-allowed",
        isCorrect && "border-emerald-400/80 shadow-emerald-500/20",
        isWrong && "border-rose-400/80 shadow-rose-500/20",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold uppercase tracking-tight",
            "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100",
            isCorrect &&
              "border-emerald-500/60 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-50",
            isWrong &&
              "border-rose-500/60 bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-50",
          )}
        >
          {String.fromCharCode(65 + index)}
        </span>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {pickLocalized(locale, option.text)}
            </p>
            {statusIcon}
          </div>
          <AnimatePresence initial={false}>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm",
                  isCorrect
                    ? "border-emerald-500/40 bg-emerald-100 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-50"
                    : "border-rose-500/40 bg-rose-100 text-rose-900 dark:bg-rose-500/10 dark:text-rose-50",
                )}
              >
                {pickLocalized(locale, option.explanation)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
};

