import "server-only";
import { sql } from "@/lib/db";
import type { QuestionCategorie } from "@/lib/db";

const POOL_MIN_LEVEL = 1;
const POOL_MAX_LEVEL = 15;

export type PublicQuestion = {
  id: string;
  type: "qcm" | "vf";
  enonce: string;
  arabe: string | null;
  choix: string[];
};

type DbQuestionRow = {
  id: string;
  type: "qcm" | "vf";
  enonce: string;
  arabe: string | null;
  choix: string[];
  bonne_reponse: number;
  niveau: number;
  categorie: QuestionCategorie;
};

/** Renvoie la version publique d'une question (sans bonne_reponse ni explication). */
export function toPublic(q: DbQuestionRow): PublicQuestion {
  return {
    id: q.id,
    type: q.type,
    enonce: q.enonce,
    arabe: q.arabe,
    choix: q.choix,
  };
}

/**
 * Tire une question publiée au niveau exact, en excluant les ids déjà vus.
 * Renvoie null si rien de disponible à ce niveau.
 */
async function pickAtLevel(
  level: number,
  excludeIds: Set<string>,
): Promise<DbQuestionRow | null> {
  const rows = (await sql`
    SELECT id, type, enonce, arabe, choix, bonne_reponse, niveau, categorie
    FROM questions
    WHERE statut = 'published' AND niveau = ${level}
  `) as DbQuestionRow[];

  const candidates = rows.filter((r) => !excludeIds.has(r.id));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Tire une question publiée au niveau ET catégorie exacts (utilisé par la phase 1).
 * Si rien à (niveau, categorie), tente n'importe quelle catégorie à ce niveau,
 * puis n'importe quoi entre niveau-1 et niveau+1 (les niveaux d'initiation).
 */
export async function pickPhase1Question(
  level: number,
  categorie: QuestionCategorie,
  excludeIds: Set<string>,
): Promise<DbQuestionRow | null> {
  const exact = (await sql`
    SELECT id, type, enonce, arabe, choix, bonne_reponse, niveau, categorie
    FROM questions
    WHERE statut = 'published' AND niveau = ${level} AND categorie = ${categorie}
  `) as DbQuestionRow[];
  const exactCandidates = exact.filter((r) => !excludeIds.has(r.id));
  if (exactCandidates.length > 0) {
    return exactCandidates[Math.floor(Math.random() * exactCandidates.length)];
  }

  const sameLevel = await pickAtLevel(level, excludeIds);
  if (sameLevel) return sameLevel;

  for (const delta of [1, -1, 2]) {
    const candidate = level + delta;
    if (candidate < 1 || candidate > 5) continue;
    const found = await pickAtLevel(candidate, excludeIds);
    if (found) return found;
  }
  return null;
}

/**
 * Tire une question au niveau cible. Si rien de dispo à ce niveau, élargit
 * progressivement la recherche aux niveaux voisins (±1, ±2…) jusqu'à ±5.
 * Renvoie null si vraiment aucune question publiée trouvée.
 */
export async function pickQuestion(
  level: number,
  excludeIds: Set<string>,
): Promise<DbQuestionRow | null> {
  const exact = await pickAtLevel(level, excludeIds);
  if (exact) return exact;

  for (let delta = 1; delta <= 5; delta++) {
    for (const candidate of [level - delta, level + delta]) {
      if (candidate < POOL_MIN_LEVEL || candidate > POOL_MAX_LEVEL) continue;
      const found = await pickAtLevel(candidate, excludeIds);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Récupère les ids des questions déjà répondues dans une tentative.
 */
export async function answeredQuestionIds(
  attemptId: string,
): Promise<Set<string>> {
  const rows = (await sql`
    SELECT question_id FROM test_answers WHERE attempt_id = ${attemptId}
  `) as { question_id: string }[];
  return new Set(rows.map((r) => r.question_id));
}

/**
 * Charge une question complète par id (avec bonne_reponse, pour scorage côté serveur).
 */
export async function loadQuestion(
  id: string,
): Promise<DbQuestionRow | null> {
  const rows = (await sql`
    SELECT id, type, enonce, arabe, choix, bonne_reponse, niveau, categorie
    FROM questions
    WHERE id = ${id}
    LIMIT 1
  `) as DbQuestionRow[];
  return rows[0] ?? null;
}
