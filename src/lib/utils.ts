import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Difficulty, Locale, LocalizedString, Question } from "@/types";

export const cn = (...inputs: (string | undefined | null | false)[]) =>
  twMerge(clsx(inputs));

export const shuffle = <T,>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const pickLocalized = (locale: Locale, value: LocalizedString) =>
  value[locale] ?? value.en;

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const normalizeTheme = (value: string) =>
  value
    .normalize("NFKC")
    .toLowerCase()
    .trim();

export const uniqueThemes = (questions: Question[]) => {
  const set = new Set<string>();
  questions.forEach((q) => set.add(q.theme));
  return [...set];
};

export const filterQuestions = (
  questions: Question[],
  themes: string[],
  difficulties: Difficulty[],
) => {
  if (!themes.length && !difficulties.length) return questions;
  const normalizedRequested = themes.map(normalizeTheme);
  return questions.filter((q) => {
    const themeOk =
      !themes.length ||
      normalizedRequested.includes(normalizeTheme(q.theme));
    const diffOk = !difficulties.length || difficulties.includes(q.difficulty);
    return themeOk && diffOk;
  });
};

