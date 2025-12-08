'use client';

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Info,
  Loader2,
  RotateCcw,
  Share2,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { OptionCard } from "@/components/option-card";
import { ProgressDots } from "@/components/progress-dots";
import { ScoreDisplay } from "@/components/score-display";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSettings } from "@/components/providers";
import { useQuestions } from "@/hooks/useQuestions";
import { ALL_DIFFICULTIES, MAX_QUESTIONS, STORAGE_KEYS } from "@/lib/constants";
import { difficultyLabels, textFor } from "@/lib/i18n";
import { cn, filterQuestions, formatDuration, pickLocalized, shuffle } from "@/lib/utils";
import { AnswerRecord, Difficulty, Question, SavedSession } from "@/types";

function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useSettings();
  const { questions, loading, error, refetch } = useQuestions();

  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const questionStart = useRef<number>(0);
  const [now, setNow] = useState(0);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);

  useEffect(() => {
    const current = Date.now();
    setNow(current);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parsedConfig = useMemo(() => {
    const mode = (searchParams.get("mode") as "random" | "filtered") ?? "random";
    const themes = searchParams.get("themes")?.split(",").filter(Boolean) ?? [];
    const difficultiesParam =
      searchParams.get("difficulties")?.split(",").filter(Boolean) ?? [];
    const difficulties = difficultiesParam.filter((diff): diff is Difficulty =>
      (ALL_DIFFICULTIES as string[]).includes(diff),
    );
    const count = Math.min(
      Number(searchParams.get("count")) || MAX_QUESTIONS,
      MAX_QUESTIONS,
    );
    return { mode, themes, difficulties, count };
  }, [searchParams]);

  useEffect(() => {
    if (!questions.length) return;
    const filtered =
      parsedConfig.mode === "filtered"
        ? filterQuestions(questions, parsedConfig.themes, parsedConfig.difficulties)
        : questions;
    const selected =
      shuffle(filtered).slice(0, parsedConfig.count || MAX_QUESTIONS);
    setSessionQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
    setShowHint(false);
    const start = Date.now();
    setSessionStart(start);
    questionStart.current = start;
  }, [parsedConfig, questions]);

  const currentQuestion = sessionQuestions[currentIndex];
  const totalQuestions = sessionQuestions.length || parsedConfig.count || MAX_QUESTIONS;

  const correctCount = useMemo(
    () => Object.values(answers).filter((a) => a.isCorrect).length,
    [answers],
  );
  const incorrectCount = useMemo(
    () => Object.values(answers).filter((a) => !a.isCorrect).length,
    [answers],
  );

  const onSelectOption = (index: number) => {
    if (!currentQuestion || finished) return;
    const elapsed = Date.now() - questionStart.current;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedIndex: index,
        isCorrect: index === currentQuestion.correctIndex,
        timeSpentMs: elapsed,
      },
    }));
  };

  const goNext = () => {
    if (!currentQuestion) return;
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setShowHint(false);
      // eslint-disable-next-line react-hooks/purity
      questionStart.current = Date.now();
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setFinished(true);
    const finishedAt = Date.now();
    const durationMs = sessionStart ? finishedAt - sessionStart : 0;
    setFinishedAt(finishedAt);
    const payload: SavedSession = {
      completedAt: finishedAt,
      total: sessionQuestions.length,
      correct: correctCount,
      incorrect: sessionQuestions.length - correctCount,
      durationMs,
    };
    localStorage.setItem(STORAGE_KEYS.lastSession, JSON.stringify(payload));
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setFinished(false);
    setShowHint(false);
    const start = Date.now();
    setSessionStart(start);
    questionStart.current = start;
    setFinishedAt(null);
  };

  useEffect(() => {
    if (finished && correctCount / (totalQuestions || 1) >= 0.7) {
      const end = Date.now() + 800;
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#22d3ee", "#34d399", "#a855f7"],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#22d3ee", "#34d399", "#a855f7"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
  }, [finished, correctCount, totalQuestions]);

  const shareScore = async () => {
    const text = `J'ai eu ${correctCount}/${totalQuestions} au quiz ANTIC !`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  if (loading && !sessionQuestions.length) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-800 dark:text-slate-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        {textFor(language, "loading")}
      </div>
    );
  }

  if (error && !sessionQuestions.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-800 dark:text-slate-200">
        <p>{textFor(language, "errorLoading")}</p>
        <button
          onClick={refetch}
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const wrongQuestions = sessionQuestions.filter(
    (q) => answers[q.id] && !answers[q.id].isCorrect,
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 pb-12 pt-8 sm:px-8">
      <header className="flex items-center justify-between gap-2 rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-400/70 hover:text-cyan-900 dark:border-slate-800/70 dark:text-slate-200 dark:hover:text-cyan-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/90 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/60">
            <Image
              src="/antic_logo.png"
              alt="ANTIC logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg"
              priority
            />
            <div className="text-xs uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-200">
              ANTIC Quiz
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {!finished ? (
        <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          <section className="glass-card rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white/85 px-3 py-2 text-xs uppercase tracking-[0.22em] text-cyan-800 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-cyan-200">
                  {textFor(language, "question")} {currentIndex + 1} {textFor(language, "of")}{" "}
                  {sessionQuestions.length}
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-400">
                  {sessionQuestions.length - currentIndex - 1}{" "}
                  {textFor(language, "questionsLeft")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-300" />
                <span className="text-sm text-slate-800 dark:text-slate-200">
                  {sessionStart ? formatDuration(now - sessionStart) : "00:00"}
                </span>
              </div>
            </div>

            {currentQuestion && (
              <div className="mt-6 space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-slate-50">
                      {pickLocalized(language, currentQuestion.question)}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-semibold uppercase tracking-tight text-cyan-800 dark:border-cyan-400/60 dark:bg-cyan-500/10 dark:text-cyan-100">
                        {currentQuestion.theme}
                      </span>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold uppercase tracking-tight text-emerald-800 dark:border-emerald-400/60 dark:bg-emerald-500/10 dark:text-emerald-100">
                        {difficultyLabels[language][currentQuestion.difficulty]}
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {currentQuestion.options.map((option, idx) => (
                        <OptionCard
                          key={idx}
                          option={option}
                          index={idx}
                          selectedIndex={answers[currentQuestion.id]?.selectedIndex ?? null}
                          correctIndex={currentQuestion.correctIndex}
                          onSelect={onSelectOption}
                          disabled={!!answers[currentQuestion.id]}
                          locale={language}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/80">
                  <button
                    type="button"
                    onClick={() => setShowHint((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-400/70 hover:text-cyan-900 dark:border-slate-800/70 dark:text-slate-200 dark:hover:text-cyan-100"
                  >
                    <Info className="h-4 w-4" />
                    {textFor(language, "hint")}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-emerald-400/70 hover:text-emerald-900 dark:border-slate-800/70 dark:text-slate-200 dark:hover:text-emerald-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!answers[currentQuestion.id]}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wide transition",
                        answers[currentQuestion.id]
                          ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-[0_15px_45px_rgba(34,211,238,0.35)]"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
                      )}
                    >
                      {currentIndex === sessionQuestions.length - 1
                        ? textFor(language, "finish")
                        : textFor(language, "next")}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showHint && currentQuestion.hint && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-3 text-sm text-cyan-900 shadow-lg dark:border-cyan-400/60 dark:bg-cyan-500/10 dark:text-cyan-50"
                    >
                      {pickLocalized(language, currentQuestion.hint)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </section>

          <section className="glass-card space-y-4 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {textFor(language, "liveScore")}
              </p>
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            </div>
            <ScoreDisplay
              correct={correctCount}
              incorrect={incorrectCount}
              total={sessionQuestions.length}
              locale={language}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-800 dark:text-slate-300">
                <span>{textFor(language, "progress")}</span>
                <span className="text-slate-800 dark:text-slate-400">
                  {currentIndex + 1} / {sessionQuestions.length}
                </span>
              </div>
              <ProgressDots
                questions={sessionQuestions}
                currentIndex={currentIndex}
                answers={answers}
              />
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
          <section className="glass-card rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-200">
                  Résultats
                </p>
                <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50">
                  Bravo !
                </h1>
                <p className="text-sm text-slate-800 dark:text-slate-300">
                  {finishedAt && sessionStart
                    ? `Temps: ${formatDuration(finishedAt - sessionStart)}`
                    : ""}
                </p>
              </div>
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-slate-800"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-cyan-400"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentage / 100) * 339} 339`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900 dark:text-slate-50">
                  <p className="text-xl font-bold">
                    {correctCount} / {totalQuestions}
                  </p>
                  <p className="text-sm text-cyan-700 dark:text-cyan-200">{percentage}%</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 dark:border-emerald-400/60 dark:bg-emerald-500/10">
                <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                  Correct
                </p>
                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {correctCount}
                </p>
              </div>
              <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 dark:border-rose-400/60 dark:bg-rose-500/10">
                <p className="text-xs uppercase tracking-wide text-rose-700 dark:text-rose-200">
                  Incorrect
                </p>
                <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                  {incorrectCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/50">
                <p className="text-xs uppercase tracking-wide text-slate-800 dark:text-slate-300">
                  Temps
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {finishedAt && sessionStart
                    ? formatDuration(finishedAt - sessionStart)
                    : "00:00"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/70 bg-emerald-50 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-900 shadow-[0_10px_30px_rgba(52,211,153,0.18)] dark:bg-emerald-500/10 dark:text-emerald-50"
              >
                Recommencer
              </button>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/70 bg-cyan-50 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-cyan-900 shadow-[0_10px_30px_rgba(34,211,238,0.20)] dark:bg-cyan-500/10 dark:text-cyan-50"
              >
                Changer de filtres
              </button>
              <button
                onClick={shareScore}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 hover:border-cyan-400/70 hover:text-cyan-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </button>
            </div>
          </section>

          <section className="glass-card space-y-4 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {textFor(language, "wrongAnswers")}
              </p>
              <Info className="h-4 w-4 text-slate-700 dark:text-slate-400" />
            </div>
            {wrongQuestions.length === 0 ? (
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                Tout est correct, superbe score !
              </p>
            ) : (
              <div className="space-y-4">
                {wrongQuestions.map((q) => {
                  const userAnswerIndex = answers[q.id]?.selectedIndex ?? -1;
                  const userAnswer =
                    userAnswerIndex >= 0 ? q.options[userAnswerIndex] : null;
                  const correctAnswer = q.options[q.correctIndex];
                  return (
                    <div
                      key={q.id}
                      className="rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-800/70 dark:bg-slate-900/70"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {pickLocalized(language, q.question)}
                      </p>
                      {userAnswer && (
                        <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">
                          Ta réponse : {pickLocalized(language, userAnswer.text)}
                        </p>
                      )}
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        Bonne réponse : {pickLocalized(language, correctAnswer.text)}
                      </p>
                      <p className="mt-1 text-xs text-slate-800 dark:text-slate-300">
                        {pickLocalized(language, correctAnswer.explanation)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-800 dark:text-slate-200">
          Loading quiz...
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}

