export type Locale = "en" | "fr";

export type Difficulty = "easy" | "medium" | "hard";

export type LocalizedString = {
  en: string;
  fr: string;
};

export type Option = {
  text: LocalizedString;
  explanation: LocalizedString;
};

export type Question = {
  id: string;
  question: LocalizedString;
  options: Option[];
  correctIndex: number;
  theme: string;
  difficulty: Difficulty;
  hint?: LocalizedString;
};

export type UserProfile = {
  nickname: string;
  className: string;
};

export type QuizConfig = {
  mode: "random" | "filtered";
  themes: string[];
  difficulties: Difficulty[];
  total: number;
};

export type AnswerRecord = {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpentMs: number;
};

export type SavedSession = {
  completedAt: number;
  total: number;
  correct: number;
  incorrect: number;
  durationMs: number;
};

