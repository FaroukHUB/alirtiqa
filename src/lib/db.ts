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
