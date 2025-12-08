'use client';

import { STORAGE_KEYS } from "@/lib/constants";
import { Question } from "@/types";
import Papa from "papaparse";
import { useEffect, useState } from "react";

type UseQuestionsResult = {
  questions: Question[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useQuestions = (): UseQuestionsResult => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromCache = () => {
    if (typeof window === "undefined") return;
    const cached = localStorage.getItem(STORAGE_KEYS.questions);
    if (cached) {
      try {
        const parsed: Question[] = JSON.parse(cached);
        setQuestions(parsed);
        setLoading(false);
      } catch {
        // ignore cache errors
      }
    }
  };

  // kept for potential future use (server-side parsing moved to /api/questions)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const parseCsv = (csvText: string): Question[] => {
    const clean = csvText.replace(/^\uFEFF/, "");
    const parsed = Papa.parse<Record<string, string>>(clean, {
      delimiter: "~",
      header: true,
      skipEmptyLines: true,
      quoteChar: '"',
      escapeChar: '"',
    });
    if (parsed.errors.length) {
      console.warn("CSV parse errors", parsed.errors);
    }
    //console.log("CSV meta delimiter", parsed.meta.delimiter);
    //console.log("CSV meta fields", parsed.meta.fields);
    //console.log("CSV raw length", clean.length);
    //console.log("CSV rows parsed", parsed.data.length);
    //console.log("CSV first row", parsed.data[0]);

    const rows: Record<string, string>[] = parsed.data;

    return rows.map((row: Record<string, string>) => {
      const pick = (name: string) => (row[name] ?? "").trim();
      const options = Array.from({ length: 4 }).map((_, i) => ({
        text: {
          en: pick(`options/${i}/text/en`),
          fr: pick(`options/${i}/text/fr`),
        },
        explanation: {
          en: pick(`options/${i}/explanation/en`),
          fr: pick(`options/${i}/explanation/fr`),
        },
      }));
      const hintEn = pick("hint/en");
      const hintFr = pick("hint/fr");
      const hint =
        hintEn || hintFr
          ? {
              en: hintEn || hintFr,
              fr: hintFr || hintEn,
            }
          : undefined;

      return {
        id: pick("id"),
        question: {
          en: pick("question/en"),
          fr: pick("question/fr"),
        },
        options,
        correctIndex: Number(pick("correctIndex") || 0),
        theme: pick("theme"),
        difficulty: (pick("difficulty") as Question["difficulty"]) || "medium",
        ...(hint ? { hint } : {}),
      };
    });
  };

  const refetch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data: Question[] = await res.json();
      setQuestions(data);
      localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(data));
      setError(null);
    } catch (err) {
      setError((err as Error).message ?? "Failed to load questions");
      if (!questions.length) {
        loadFromCache();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFromCache();
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { questions, loading, error, refetch };
};

