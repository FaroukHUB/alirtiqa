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
