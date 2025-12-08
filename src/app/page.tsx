'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, Sparkles, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSettings } from "@/components/providers";
import { useQuestions } from "@/hooks/useQuestions";
import { ALL_DIFFICULTIES, DEFAULT_THEMES, MAX_QUESTIONS, STORAGE_KEYS } from "@/lib/constants";
import { difficultyLabels, textFor } from "@/lib/i18n";
import { cn, uniqueThemes } from "@/lib/utils";
import { Difficulty, SavedSession, UserProfile } from "@/types";

type Mode = "random" | "filtered";

export default function Home() {
  const router = useRouter();
  const { language } = useSettings();
  const { questions, loading, error } = useQuestions();

  const [profile, setProfile] = useState<UserProfile>({
    nickname: "",
    className: "",
  });
  const [mode, setMode] = useState<Mode>("random");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(
    [],
  );
  const [lastSession, setLastSession] = useState<SavedSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.profile);
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch {
          /* ignore */
        }
      }
      const savedSession = localStorage.getItem(STORAGE_KEYS.lastSession);
      if (savedSession) {
        try {
          setLastSession(JSON.parse(savedSession));
        } catch {
          /* ignore */
        }
      }
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const themes = useMemo(
    () => (questions.length ? uniqueThemes(questions) : DEFAULT_THEMES),
    [questions],
  );

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme],
    );
  };

  const toggleDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty],
    );
  };

  const handleStart = () => {
    const trimmedProfile = {
      nickname: profile.nickname.trim(),
      className: profile.className.trim(),
    };
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(trimmedProfile));

    const params = new URLSearchParams();
    params.set("mode", mode);
    if (mode === "filtered" && selectedThemes.length) {
      params.set("themes", selectedThemes.join(","));
    }
    if (mode === "filtered" && selectedDifficulties.length) {
      params.set("difficulties", selectedDifficulties.join(","));
    }
    params.set("count", String(MAX_QUESTIONS));
    router.push(`/quiz?${params.toString()}`);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/antic_logo.png"
            alt="ANTIC logo"
            width={48}
            height={48}
            priority
            className="h-12 w-12 rounded-2xl shadow-[0_15px_45px_rgba(34,211,238,0.25)]"
          />
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-200">
              ANTIC
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {textFor(language, "welcome")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card relative overflow-hidden rounded-3xl p-8 shadow-2xl lg:col-span-3"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.14),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(244,114,182,0.18),transparent_30%),radial-gradient(circle_at_50%_60%,rgba(52,211,153,0.18),transparent_30%)] opacity-80" />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-cyan-100 ring-1 ring-white/10">
                {textFor(language, "subtitle")}
              </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-tight text-emerald-800 ring-1 ring-emerald-100 dark:bg-white/5 dark:text-emerald-200 dark:ring-white/10">
                <Sparkles className="h-4 w-4" />
                {textFor(language, "instantFeedback")}
              </div>
            <div className="flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-tight text-cyan-800 ring-1 ring-cyan-100 dark:bg-white/5 dark:text-cyan-200 dark:ring-white/10">
                {textFor(language, "offlineReady")}
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">
                {textFor(language, "welcome")}
              </h1>
              <p className="max-w-2xl text-base text-slate-800 dark:text-slate-300">
                {textFor(language, "subtitle")}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {textFor(language, "lastSession")}
                </p>
                {hydrated && lastSession ? (
                  <div className="mt-3 space-y-2 text-sm text-slate-800 dark:text-slate-300">
                    <p>
                      {textFor(language, "score")}:{" "}
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        {lastSession.correct} / {lastSession.total}
                      </span>
                    </p>
                    <p>
                      {textFor(language, "timeSpent")}:{" "}
                      <span className="text-sky-700 dark:text-sky-200">
                        {Math.round(lastSession.durationMs / 1000)} s
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-800 dark:text-slate-400">
                    {textFor(language, "noSession")}
                  </p>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {textFor(language, "progress")}
                </p>
                <p className="mt-3 text-sm text-slate-800 dark:text-slate-400">
                  {textFor(language, "randomMode")} • {textFor(language, "liveScore")}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="glass-card relative rounded-3xl p-6 shadow-2xl lg:col-span-2"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 via-transparent to-white/0" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-400 text-white shadow-md shadow-cyan-500/30">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">
                    {textFor(language, "start")}
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {textFor(language, "startCta")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {textFor(language, "nickname")}
                </label>
                <input
                  value={profile.nickname}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, nickname: e.target.value }))
                  }
                  placeholder="Ada"
                  className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {textFor(language, "className")}
                </label>
                <input
                  value={profile.className}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, className: e.target.value }))
                  }
                  placeholder="Terminale"
                  className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { key: "random", label: textFor(language, "randomMode") },
                { key: "filtered", label: textFor(language, "filteredMode") },
              ] satisfies { key: Mode; label: string }[]).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMode(item.key)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
                    "border-slate-200 bg-white/90 hover:border-cyan-300 hover:shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70 dark:hover:border-cyan-400/70",
                    mode === item.key &&
                      "border-cyan-500 bg-cyan-50 text-cyan-900 shadow-[0_10px_40px_rgba(34,211,238,0.12)] dark:border-cyan-400/90 dark:bg-cyan-500/10 dark:text-cyan-50 dark:shadow-[0_10px_50px_rgba(34,211,238,0.20)]",
                  )}
                >
                  <span>{item.label}</span>
                  <span className="text-xs uppercase tracking-wide text-cyan-700 dark:text-cyan-200">
                    {mode === item.key ? "✔" : ""}
                  </span>
                </button>
              ))}
            </div>

            {mode === "filtered" && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {textFor(language, "selectThemes")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {themes.map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => toggleTheme(theme)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-tight transition",
                          selectedThemes.includes(theme)
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-[0_10px_40px_rgba(52,211,153,0.12)] dark:border-emerald-400/80 dark:bg-emerald-500/10 dark:text-emerald-50 dark:shadow-[0_10px_40px_rgba(52,211,153,0.18)]"
                            : "border-slate-200 text-slate-800 hover:border-cyan-400/60 hover:text-cyan-900 dark:border-slate-800/70 dark:text-slate-300 dark:hover:text-cyan-100",
                        )}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {textFor(language, "selectDifficulties")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ALL_DIFFICULTIES.map((difficulty) => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => toggleDifficulty(difficulty)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-tight transition",
                          selectedDifficulties.includes(difficulty)
                            ? "border-cyan-500 bg-cyan-50 text-cyan-900 shadow-[0_10px_40px_rgba(34,211,238,0.14)] dark:border-cyan-400/90 dark:bg-cyan-500/10 dark:text-cyan-50 dark:shadow-[0_10px_40px_rgba(34,211,238,0.20)]"
                            : "border-slate-200 text-slate-800 hover:border-emerald-400/60 hover:text-emerald-900 dark:border-slate-800/70 dark:text-slate-300 dark:hover:text-emerald-100",
                        )}
                      >
                        {difficultyLabels[language][difficulty]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {loading && (
                <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {textFor(language, "loading")}
                </div>
              )}
              {error && (
                <div className="text-sm text-amber-300">
                  {textFor(language, "errorLoading")}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleStart}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 px-6 py-4 text-base font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_60px_rgba(56,189,248,0.35)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 transition group-hover:opacity-100" />
                <span>{textFor(language, "start")}</span>
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
