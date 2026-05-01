import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }
  _sql = neon(url);
  return _sql;
}

export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  getSql()(strings, ...values)) as NeonQueryFunction<false, false>;

export type Avis = {
  id: string;
  nom: string;
  email: string;
  note: number;
  texte: string;
  statut: "pending" | "approved" | "rejected";
  created_at: string;
  moderated_at: string | null;
};

export type Admin = {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type InscriptionStatut =
  | "nouveau"
  | "contacte"
  | "essai"
  | "inscrit"
  | "refus"
  | "sans_suite";

export type InscriptionFormule = "particulier" | "duo" | "groupe";

export type QuestionType = "qcm" | "vf";
export type QuestionCategorie =
  | "vocabulaire"
  | "grammaire"
  | "sarf"
  | "lecture"
  | "comprehension"
  | "coran";
export type QuestionStatut = "draft" | "published" | "archived";
export type QuestionSource = "manuel" | "ia_seed" | "ia_admin";

export type Question = {
  id: string;
  type: QuestionType;
  enonce: string;
  arabe: string | null;
  choix: string[];
  bonne_reponse: number;
  explication: string | null;
  niveau: number;
  categorie: QuestionCategorie;
  statut: QuestionStatut;
  source: QuestionSource;
  created_at: string;
  updated_at: string;
};

export type PdfCategorie =
  | "exercices"
  | "cours"
  | "reference"
  | "coran"
  | "lecture"
  | "autre";
export type PdfStatut = "draft" | "published" | "archived";

export type Pdf = {
  id: string;
  titre: string;
  description: string | null;
  niveau: number | null;
  categorie: PdfCategorie;
  blob_url: string;
  blob_pathname: string;
  file_size: number | null;
  auteur: string | null;
  statut: PdfStatut;
  created_at: string;
  updated_at: string;
};

export type PdfDownload = {
  id: string;
  pdf_id: string;
  email: string;
  prenom: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

export type TestAttempt = {
  id: string;
  current_level: number;
  niveau_final: number | null;
  finished_at: string | null;
  prenom: string | null;
  email: string | null;
  telephone: string | null;
  age: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

export type TestAnswer = {
  id: string;
  attempt_id: string;
  question_id: string;
  level_at_time: number;
  categorie: QuestionCategorie;
  choix_donne: number;
  est_correcte: boolean;
  ordre: number;
  created_at: string;
};

export type Inscription = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  age: string | null;
  formule: InscriptionFormule;
  niveau: string | null;
  disponibilite: string | null;
  message: string | null;
  statut: InscriptionStatut;
  note_admin: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};
