"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { PdfCategorie } from "@/lib/db";

type PublicPdf = {
  id: string;
  titre: string;
  description: string | null;
  niveau: number | null;
  categorie: PdfCategorie;
  file_size: number | null;
  auteur: string | null;
  created_at: string;
};

const CATEGORIES: { value: PdfCategorie | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "exercices", label: "Cahiers d'exercices" },
  { value: "cours", label: "Supports de cours" },
  { value: "reference", label: "Références" },
  { value: "coran", label: "Coran" },
  { value: "lecture", label: "Lectures" },
  { value: "autre", label: "Autre" },
];

const CATEGORIE_LABEL: Record<PdfCategorie, string> = {
  exercices: "Cahier d'exercices",
  cours: "Support de cours",
  reference: "Référence",
  coran: "Coran",
  lecture: "Lecture",
  autre: "Document",
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${Math.round(kb)} KB`;
}

export function BibliothequeClient({ pdfs }: { pdfs: PublicPdf[] }) {
  const [filterCat, setFilterCat] = useState<PdfCategorie | "all">("all");
  const [filterLevel, setFilterLevel] = useState<number | "all">("all");
  const [downloadTarget, setDownloadTarget] = useState<PublicPdf | null>(null);

  const filtered = useMemo(() => {
    return pdfs.filter((p) => {
      if (filterCat !== "all" && p.categorie !== filterCat) return false;
      if (filterLevel !== "all" && p.niveau !== filterLevel) return false;
      return true;
    });
  }, [pdfs, filterCat, filterLevel]);

  const availableLevels = useMemo(() => {
    const levels = new Set<number>();
    pdfs.forEach((p) => {
      if (p.niveau !== null) levels.add(p.niveau);
    });
    return Array.from(levels).sort((a, b) => a - b);
  }, [pdfs]);

  return (
    <>
      <div className="mb-8 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-nuit/55">
            Catégorie
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setFilterCat(c.value)}
                className={cn(
                  "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                  filterCat === c.value
                    ? "bg-nuit text-creme"
                    : "bg-white text-nuit/65 ring-1 ring-nuit/10 hover:ring-nuit/25",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {availableLevels.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-nuit/55">
              Niveau
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilterLevel("all")}
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  filterLevel === "all"
                    ? "bg-nuit text-creme"
                    : "bg-white text-nuit/65 ring-1 ring-nuit/10 hover:ring-nuit/25",
                )}
              >
                Tous
              </button>
              {availableLevels.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFilterLevel(n)}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    filterLevel === n
                      ? "bg-nuit text-creme"
                      : "bg-white text-nuit/65 ring-1 ring-nuit/10 hover:ring-nuit/25",
                  )}
                >
                  N{n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-nuit/15 bg-white p-12 text-center">
          <p className="font-display text-lg text-nuit/70">
            Aucun document avec ces filtres.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pdf, i) => (
            <motion.li
              key={pdf.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group flex flex-col rounded-2xl border border-nuit/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-dore/40 hover:shadow-[0_8px_28px_rgba(10,26,63,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-10 flex-none items-center justify-center rounded-md bg-rose-50 text-[10px] font-bold text-rose-700">
                  PDF
                </div>
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  {pdf.niveau !== null && (
                    <span className="rounded-full bg-dore/10 px-2 py-0.5 text-[10px] font-medium text-dore-700">
                      N{pdf.niveau}
                    </span>
                  )}
                  <span className="rounded-full bg-nuit/5 px-2 py-0.5 text-[10px] font-medium text-nuit/65">
                    {CATEGORIE_LABEL[pdf.categorie]}
                  </span>
                </div>
              </div>

              <h3 className="mt-4 font-display text-base text-nuit">
                {pdf.titre}
              </h3>
              {pdf.description && (
                <p className="mt-2 flex-1 text-sm leading-relaxed text-nuit/65">
                  {pdf.description}
                </p>
              )}
              {pdf.auteur && (
                <p className="mt-2 text-[11px] text-nuit/45">
                  Par {pdf.auteur}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-nuit/5 pt-4">
                {pdf.file_size && (
                  <span className="text-[11px] text-nuit/45">
                    {formatSize(pdf.file_size)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setDownloadTarget(pdf)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-nuit px-4 py-1.5 text-xs font-medium text-creme transition-colors hover:bg-nuit-400"
                >
                  ↓ Télécharger
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {downloadTarget && (
        <DownloadModal
          pdf={downloadTarget}
          onClose={() => setDownloadTarget(null)}
        />
      )}
    </>
  );
}

function DownloadModal({
  pdf,
  onClose,
}: {
  pdf: PublicPdf;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/pdfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf_id: pdf.id, email, prenom, website }),
      });
      const data = await res.json().catch(() => ({}));
      setBusy(false);
      if (!res.ok) {
        setError(data?.error ?? "Erreur lors de l'envoi");
        return;
      }
      setDownloadUrl(data.url);
      // déclenche immédiatement l'ouverture du PDF
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      setBusy(false);
      setError("Connexion impossible. Réessayez dans un instant.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-nuit/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-12 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right rounded-full p-1.5 text-nuit/55 hover:bg-nuit/5"
          aria-label="Fermer"
        >
          ✕
        </button>

        <p className="font-display text-[10px] uppercase tracking-[0.3em] text-dore-700">
          Téléchargement
        </p>
        <h2 className="mt-1.5 font-display text-xl text-nuit">{pdf.titre}</h2>

        {downloadUrl ? (
          <div className="mt-6">
            <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              ✓ Le téléchargement a démarré dans un nouvel onglet.
            </div>
            <p className="mt-3 text-xs text-nuit/65">
              Si rien ne s&apos;est ouvert, cliquez{" "}
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="text-dore-700 underline"
              >
                ici
              </a>
              .
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-full bg-nuit px-5 py-2.5 text-sm font-medium text-creme hover:bg-nuit-400"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <p className="text-sm text-nuit/70">
              Pour accéder au document, indiquez votre email. Vous serez
              notifié de l&apos;ajout de nouveaux documents (vous pouvez vous
              désinscrire à tout moment).
            </p>

            <input
              type="text"
              placeholder="Prénom (optionnel)"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full rounded-lg border border-nuit/15 bg-white px-3 py-2.5 text-sm text-nuit outline-none focus:border-dore focus:ring-2 focus:ring-dore/20"
            />
            <input
              required
              type="email"
              placeholder="Votre email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-nuit/15 bg-white px-3 py-2.5 text-sm text-nuit outline-none focus:border-dore focus:ring-2 focus:ring-dore/20"
            />

            {/* Honeypot anti-spam */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-nuit px-5 py-2.5 text-sm font-medium text-creme hover:bg-nuit-400 disabled:opacity-60"
            >
              {busy ? "Envoi…" : "↓ Recevoir le PDF"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
