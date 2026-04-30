import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

export const sql = neon(process.env.DATABASE_URL);

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
