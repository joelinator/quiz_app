'use client';

import { cn } from "@/lib/utils";
import { AnswerRecord, Question } from "@/types";

type ProgressDotsProps = {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, AnswerRecord>;
};

export const ProgressDots = ({
  questions,
  currentIndex,
  answers,
}: ProgressDotsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((question, idx) => {
        const record = answers[question.id];
        const isCurrent = idx === currentIndex;
        const status = record ? (record.isCorrect ? "correct" : "wrong") : null;
        return (
          <span
            key={`${question.id || "q"}-${idx}`}
            className={cn(
              "h-3 w-3 rounded-full border transition",
              "border-slate-300 bg-slate-200 dark:border-slate-700/70 dark:bg-slate-800/70",
              isCurrent && "scale-125 border-cyan-400 bg-cyan-300/90 shadow",
              status === "correct" && "border-emerald-400 bg-emerald-400/80",
              status === "wrong" && "border-rose-400 bg-rose-400/80",
            )}
          />
        );
      })}
    </div>
  );
};

