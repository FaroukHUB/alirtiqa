import type { QuestionCategorie } from "@/lib/db";

export const TEST_MAX_QUESTIONS = 15;
export const TEST_START_LEVEL = 3;
export const TEST_MIN_LEVEL = 1;
export const TEST_MAX_LEVEL = 15;

export type AnswerLog = {
  level_at_time: number;
  categorie: QuestionCategorie;
  est_correcte: boolean;
};

export function clampLevel(level: number): number {
  return Math.max(TEST_MIN_LEVEL, Math.min(TEST_MAX_LEVEL, level));
}

export function nextLevel(current: number, correct: boolean): number {
  return clampLevel(current + (correct ? 1 : -1));
}

/**
 * Stabilisation : dans les 6 dernières questions répondues, l'élève
 * n'a oscillé qu'entre 2 niveaux différents au maximum (ex : 5,6,5,6,5,6).
 * Renvoie true dès qu'on doit arrêter le test.
 */
export function isStabilized(history: AnswerLog[]): boolean {
  if (history.length < 6) return false;
  const last6 = history.slice(-6).map((h) => h.level_at_time);
  const distinct = new Set(last6);
  return distinct.size <= 2;
}

/**
 * Niveau final = médiane des 5 derniers niveaux où l'élève a répondu.
 * Si moins de 5 réponses, médiane sur ce qu'on a.
 */
export function niveauFinal(history: AnswerLog[]): number {
  const lastN = history.slice(-5).map((h) => h.level_at_time);
  if (lastN.length === 0) return TEST_START_LEVEL;
  const sorted = [...lastN].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

/**
 * Forces / faiblesses par catégorie. Renvoie un dict avec, pour chaque catégorie
 * effectivement vue dans le test, le pourcentage de réussite et le nombre absolu.
 */
export function scoresParCategorie(history: AnswerLog[]): Record<
  QuestionCategorie,
  { correct: number; total: number; pct: number } | undefined
> {
  const acc: Partial<
    Record<QuestionCategorie, { correct: number; total: number }>
  > = {};
  for (const h of history) {
    const cur = acc[h.categorie] ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (h.est_correcte) cur.correct += 1;
    acc[h.categorie] = cur;
  }
  const out: Record<
    QuestionCategorie,
    { correct: number; total: number; pct: number } | undefined
  > = {
    vocabulaire: undefined,
    grammaire: undefined,
    sarf: undefined,
    lecture: undefined,
    comprehension: undefined,
    coran: undefined,
  };
  for (const k of Object.keys(acc) as QuestionCategorie[]) {
    const v = acc[k]!;
    out[k] = {
      correct: v.correct,
      total: v.total,
      pct: Math.round((v.correct / v.total) * 100),
    };
  }
  return out;
}

/**
 * Décide si le test doit s'arrêter (vrai) ou continuer (faux).
 */
export function shouldStop(history: AnswerLog[]): boolean {
  if (history.length >= TEST_MAX_QUESTIONS) return true;
  if (isStabilized(history)) return true;
  return false;
}
