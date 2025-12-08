import { NextResponse } from "next/server";
import { QUIZ_CSV_FILES } from "@/lib/constants";
import Papa from "papaparse";
import fs from "fs";
import path from "path";
import { Question } from "@/types";

const parseCsvFile = (filePath: string): Question[] => {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const parsed = Papa.parse(raw, {
    delimiter: "~",
    header: true,
    skipEmptyLines: true,
    quoteChar: '"',
    escapeChar: '"',
  });
  if (parsed.errors?.length) {
    console.warn(`CSV parse errors in ${filePath}`, parsed.errors);
  }
  const rows = parsed.data as Papa.ParseResult<string>["data"] as Record<
    string,
    string
  >[];

  return rows.map((row) => {
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
        ? { en: hintEn || hintFr, fr: hintFr || hintEn }
        : undefined;

    return {
      id: pick("id"),
      question: { en: pick("question/en"), fr: pick("question/fr") },
      options,
      correctIndex: Number(pick("correctIndex") || 0),
      theme: pick("theme"),
      difficulty: (pick("difficulty") as Question["difficulty"]) || "medium",
      ...(hint ? { hint } : {}),
    };
  });
};

export async function GET() {
  try {
    const base = path.join(process.cwd(), "data", "quizzes");
    const datasets = QUIZ_CSV_FILES.map((file) =>
      parseCsvFile(path.join(base, file)),
    );
    const data = datasets.flat();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Failed to load questions server-side", err);
    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 },
    );
  }
}

