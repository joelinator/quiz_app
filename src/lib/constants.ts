import { Difficulty } from "@/types";

export const MAX_QUESTIONS = 50;

export const STORAGE_KEYS = {
  profile: "antic-quiz-profile",
  questions: "antic-quiz-questions-v2",
  lastSession: "antic-quiz-last-session",
  language: "antic-quiz-language",
  theme: "antic-quiz-theme",
};

export const QUIZ_CSV_FILES = ["quiz.csv", "quiz_2.csv", "quiz_sup.csv"];

export const DEFAULT_THEMES = [
  "ANTIC (Cameroun)",
  "Introduction à l’Intelligence Artificielle (IA)",
  "cybersecurite de base et bonnes pratiques",
  "mots de passe securises",
  "Contrôle parental et hygiène numérique des adolescents",
];

export const ALL_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export const FALLBACK_THEME: "light" | "dark" = "dark";

