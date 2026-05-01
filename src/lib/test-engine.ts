import type { QuestionCategorie } from "@/lib/db";

export const TEST_MIN_LEVEL = 1;
export const TEST_MAX_LEVEL = 10;

/**
 * Phase 1 — évaluation rapide de la lecture.
 * 4 questions fixes sur les niveaux 1 à 3, principalement lecture.
 * Si l'élève réussit moins de PHASE_1_PASS_THRESHOLD réponses,
 * le test s'arrête et le résultat est niveau 1 ("fondamentaux à reprendre").
 */
export const PHASE_1_LENGTH = 4;
export const PHASE_1_PASS_THRESHOLD = 3;

export type Phase1Slot = {
  niveau: number;
  categorie: QuestionCategorie;
};

/**
 * Plan fixe de la phase 1 : on teste la lecture/voyellation à 3 niveaux,
 * puis un mot de vocabulaire de base.
 */
export const PHASE_1_PLAN: Phase1Slot[] = [
  { niveau: 1, categorie: "lecture" },
  { niveau: 2, categorie: "lecture" },
  { niveau: 3, categorie: "lecture" },
  { niveau: 2, categorie: "vocabulaire" },
];

/**
 * Phase 2 — placement adaptatif (ladder) pour situer l'élève entre les
 * niveaux 3 et 10.
 */
export const PHASE_2_START_LEVEL = 5;
export const PHASE_2_MIN_LEVEL = 3;
export const PHASE_2_MAX_LEVEL = TEST_MAX_LEVEL;
export const PHASE_2_MAX_QUESTIONS = 10;

export const TEST_MAX_QUESTIONS = PHASE_1_LENGTH + PHASE_2_MAX_QUESTIONS;

export type AnswerLog = {
  level_at_time: number;
  categorie: QuestionCategorie;
  est_correcte: boolean;
};

export function clampLevel(
  level: number,
  min = TEST_MIN_LEVEL,
  max = TEST_MAX_LEVEL,
): number {
  return Math.max(min, Math.min(max, level));
}

export function nextLevel(
  current: number,
  correct: boolean,
  min = PHASE_2_MIN_LEVEL,
  max = PHASE_2_MAX_LEVEL,
): number {
  return clampLevel(current + (correct ? 1 : -1), min, max);
}

/**
 * Combien de questions de la phase 1 ont été répondues (entre 0 et PHASE_1_LENGTH).
 */
export function phase1Answered(history: AnswerLog[]): number {
  return Math.min(history.length, PHASE_1_LENGTH);
}

/**
 * L'élève est-il encore en phase 1 ?
 */
export function isInPhase1(history: AnswerLog[]): boolean {
  return history.length < PHASE_1_LENGTH;
}

/**
 * Score brut de la phase 1 (0 à PHASE_1_LENGTH).
 */
export function phase1Score(history: AnswerLog[]): number {
  return history
    .slice(0, PHASE_1_LENGTH)
    .filter((h) => h.est_correcte).length;
}

/**
 * L'élève a-t-il réussi la phase 1 ? (true si score >= seuil)
 * Suppose que la phase 1 est terminée (history.length >= PHASE_1_LENGTH).
 */
export function phase1Passed(history: AnswerLog[]): boolean {
  return phase1Score(history) >= PHASE_1_PASS_THRESHOLD;
}

/**
 * Stabilisation phase 2 : sur les 6 dernières questions DE PHASE 2,
 * l'élève n'a oscillé qu'entre 2 niveaux maximum.
 */
export function isStabilized(history: AnswerLog[]): boolean {
  const phase2 = history.slice(PHASE_1_LENGTH);
  if (phase2.length < 6) return false;
  const last6 = phase2.slice(-6).map((h) => h.level_at_time);
  return new Set(last6).size <= 2;
}

/**
 * Niveau final phase 2 = médiane des 5 derniers niveaux DE PHASE 2.
 * (avant : on prenait les 5 dernières tout court, ce qui mélangeait phase 1
 * et phase 2 et faussait le résultat)
 */
export function niveauFinalPhase2(history: AnswerLog[]): number {
  const phase2 = history.slice(PHASE_1_LENGTH);
  const lastN = phase2.slice(-5).map((h) => h.level_at_time);
  if (lastN.length === 0) return PHASE_2_START_LEVEL;
  const sorted = [...lastN].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

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
 * Doit-on arrêter la phase 2 ?
 * (la phase 1 est gérée séparément par phase1Passed et compte fixe)
 */
export function shouldStopPhase2(history: AnswerLog[]): boolean {
  const phase2 = history.slice(PHASE_1_LENGTH);
  if (phase2.length >= PHASE_2_MAX_QUESTIONS) return true;
  if (isStabilized(history)) return true;
  return false;
}

// Backward-compat (anciens noms utilisés dans le mailer / page résultat)
export const TEST_START_LEVEL = PHASE_2_START_LEVEL;
