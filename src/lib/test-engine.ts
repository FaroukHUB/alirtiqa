import type { QuestionCategorie } from "@/lib/db";

/**
 * Test minimaliste : 5 questions à difficulté croissante, sur les 3 premiers
 * niveaux du programme Al-Furqan. Public visé : élèves qui savent déjà lire
 * (les non-lecteurs ne passent pas le test, ils s'inscrivent directement en
 * MUQADIMA ALIF). Le score détermine le niveau d'entrée.
 */

export const TEST_QUESTIONS_COUNT = 5;

export type Slot = {
  niveau: number;
  categorie: QuestionCategorie;
};

/**
 * Plan fixe du test : 5 questions, 2 sur niveau 1, 1 sur niveau 2, 2 sur niveau 3.
 * Si une cellule est vide en DB, le serveur tire une question d'une catégorie
 * voisine au même niveau.
 */
export const TEST_PLAN: Slot[] = [
  { niveau: 1, categorie: "lecture" },
  { niveau: 1, categorie: "vocabulaire" },
  { niveau: 2, categorie: "vocabulaire" },
  { niveau: 3, categorie: "grammaire" },
  { niveau: 3, categorie: "comprehension" },
];

export type AnswerLog = {
  level_at_time: number;
  categorie: QuestionCategorie;
  est_correcte: boolean;
};

export type Niveau = 1 | 2 | 3;

/**
 * Mapping score (0 à 5 bonnes réponses) → niveau d'entrée recommandé.
 * 0-1 : MUQADIMA ALIF (les bases ne sont pas solides)
 * 2-3 : TA3BIR
 * 4-5 : MUQADIMA BA
 */
export function niveauFromScore(correctCount: number): Niveau {
  if (correctCount <= 1) return 1;
  if (correctCount <= 3) return 2;
  return 3;
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
