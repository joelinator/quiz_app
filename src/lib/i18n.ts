import { Difficulty, Locale, LocalizedString } from "@/types";

export const uiCopy: Record<
  Locale,
  Record<
    | "welcome"
    | "subtitle"
    | "nickname"
    | "className"
    | "theme"
    | "difficulty"
    | "randomMode"
    | "filteredMode"
    | "start"
    | "continue"
    | "loading"
    | "errorLoading"
    | "score"
    | "correct"
    | "incorrect"
    | "next"
    | "finish"
    | "hint"
    | "showHint"
    | "reportTitle"
    | "timeSpent"
    | "playAgain"
    | "questionsLeft"
    | "question"
    | "of"
    | "summary"
    | "wrongAnswers"
    | "filters"
    | "randomLabel"
    | "customLabel"
    | "startCta"
    | "selectThemes"
    | "selectDifficulties"
    | "instantFeedback"
    | "offlineReady"
    | "progress"
    | "liveScore"
    | "languageToggle"
    | "themeToggle"
    | "lastSession"
    | "noSession",
    string
  >
> = {
  en: {
    welcome: "ANTIC Quiz Challenge",
    subtitle: "Train for the competition with fast, focused quizzes.",
    nickname: "Nickname",
    className: "Class",
    theme: "Themes",
    difficulty: "Difficulties",
    randomMode: "Random 50 questions",
    filteredMode: "Filter by theme & difficulty",
    start: "Start",
    continue: "Continue",
    loading: "Loading questions...",
    errorLoading:
      "Unable to download questions. Using cached data when available.",
    score: "Score",
    correct: "Correct",
    incorrect: "Incorrect",
    next: "Next",
    finish: "Finish",
    hint: "Hint",
    showHint: "Show hint",
    reportTitle: "Final report",
    timeSpent: "Time spent",
    playAgain: "Play again",
    questionsLeft: "questions left",
    question: "Question",
    of: "of",
    summary: "Summary",
    wrongAnswers: "Wrong answers",
    filters: "Filters",
    randomLabel: "Aléatoire 50 questions",
    customLabel: "Custom selection",
    startCta: "Start the challenge",
    selectThemes: "Select themes",
    selectDifficulties: "Select difficulty levels",
    instantFeedback: "Instant feedback",
    offlineReady: "Offline ready",
    progress: "Progress",
    liveScore: "Live score",
    languageToggle: "Lang",
    themeToggle: "Theme",
    lastSession: "Last session",
    noSession: "No session recorded yet",
  },
  fr: {
    welcome: "Défi Quiz ANTIC",
    subtitle: "Entraîne-toi pour la compétition avec des quiz rapides.",
    nickname: "Surnom",
    className: "Classe",
    theme: "Thèmes",
    difficulty: "Difficultés",
    randomMode: "Aléatoire 50 questions",
    filteredMode: "Filtrer par thème et difficulté",
    start: "Commencer",
    continue: "Continuer",
    loading: "Chargement des questions...",
    errorLoading:
      "Impossible de télécharger les questions. Cache utilisé si disponible.",
    score: "Score",
    correct: "Bonnes",
    incorrect: "Erreurs",
    next: "Suivant",
    finish: "Terminer",
    hint: "Indice",
    showHint: "Afficher l'indice",
    reportTitle: "Rapport final",
    timeSpent: "Temps écoulé",
    playAgain: "Rejouer",
    questionsLeft: "questions restantes",
    question: "Question",
    of: "sur",
    summary: "Résumé",
    wrongAnswers: "Erreurs",
    filters: "Filtres",
    randomLabel: "Aléatoire 50 questions",
    customLabel: "Sélection personnalisée",
    startCta: "Lancer le défi",
    selectThemes: "Choisis les thèmes",
    selectDifficulties: "Choisis les niveaux",
    instantFeedback: "Feedback immédiat",
    offlineReady: "Prêt hors ligne",
    progress: "Progression",
    liveScore: "Score en direct",
    languageToggle: "Langue",
    themeToggle: "Thème",
    lastSession: "Dernière session",
    noSession: "Aucune session enregistrée",
  },
};

export const difficultyLabels: Record<Locale, Record<Difficulty, string>> = {
  en: { easy: "Easy", medium: "Medium", hard: "Hard" },
  fr: { easy: "Facile", medium: "Moyen", hard: "Difficile" },
};

export const textFor = <K extends keyof (typeof uiCopy)["en"]>(
  locale: Locale,
  key: K,
) => uiCopy[locale][key];

export const localize = (locale: Locale, value: LocalizedString) =>
  value[locale] ?? value.en;

