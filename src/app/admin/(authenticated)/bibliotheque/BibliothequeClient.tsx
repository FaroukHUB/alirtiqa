"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Pdf, PdfCategorie, PdfStatut } from "@/lib/db";

const CATEGORIES: { value: PdfCategorie; label: string }[] = [
  { value: "exercices", label: "Cahier d'exercices" },
  { value: "cours", label: "Support de cours" },
  { value: "reference", label: "Référence" },
  { value: "coran", label: "Coran" },
  { value: "lecture", label: "Lecture conseillée" },
  { value: "autre", label: "Autre" },
];

const STATUT_BADGE: Record<PdfStatut, { label: string; cls: string }> = {
  draft: { label: "Brouillon", cls: "bg-amber-100 text-amber-800 ring-amber-300/50" },
  published: { label: "En ligne", cls: "bg-emerald-100 text-emerald-800 ring-emerald-300/50" },
  archived: { label: "Archivé", cls: "bg-nuit/10 text-nuit/65 ring-nuit/20" },
};

type PdfWithStats = Pdf & { nb_downloads: number };

export function BibliothequeClient({ pdfs }: { pdfs: PdfWithStats[] }) {
  const [openUpload, setOpenUpload] = useState(false);
  const [editing, setEditing] = useState<PdfWithStats | null>(null);

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-nuit/65">
          {pdfs.length} document{pdfs.length > 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={() => setOpenUpload(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-nuit px-4 py-2 text-xs font-medium text-creme transition-colors hover:bg-nuit-400"
        >
          ↑ Ajouter un PDF
        </button>
      </div>

      {pdfs.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-nuit/15 bg-creme/40 p-12 text-center">
          <p className="font-display text-lg text-nuit/70">
            Aucun document pour l&apos;instant.
          </p>
          <p className="mt-2 text-sm text-nuit/55">
            Clique sur « Ajouter un PDF » pour partager un premier document.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {pdfs.map((p) => (
            <PdfCard
              key={p.id}
              pdf={p}
              onEdit={() => setEditing(p)}
            />
          ))}
        </ul>
      )}

      {openUpload && <UploadModal onClose={() => setOpenUpload(false)} />}
      {editing && (
        <EditModal pdf={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}

function PdfCard({
  pdf,
  onEdit,
}: {
  pdf: PdfWithStats;
  onEdit: () => void;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const badge = STATUT_BADGE[pdf.statut];

  async function changeStatut(statut: PdfStatut) {
    setBusy(true);
    const res = await fetch(`/api/admin/pdfs/${pdf.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    setBusy(false);
    if (res.ok) startTransition(() => router.refresh());
  }

  async function remove() {
    setBusy(true);
    const res = await fetch(`/api/admin/pdfs/${pdf.id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (res.ok) startTransition(() => router.refresh());
  }

  const cat = CATEGORIES.find((c) => c.value === pdf.categorie);

  return (
    <li className="rounded-xl border border-nuit/10 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${badge.cls}`}
            >
              {badge.label}
            </span>
            <span className="rounded-full bg-nuit/5 px-2.5 py-0.5 text-[11px] font-medium text-nuit/70">
              {cat?.label}
            </span>
            {pdf.niveau !== null && (
              <span className="rounded-full bg-nuit/5 px-2.5 py-0.5 text-[11px] font-medium text-nuit/70">
                Niveau {pdf.niveau}
              </span>
            )}
            {pdf.nb_downloads > 0 && (
              <span className="text-[11px] text-nuit/50">
                ↓ {pdf.nb_downloads} téléchargement{pdf.nb_downloads > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <h3 className="mt-2 font-display text-base text-nuit">
            {pdf.titre}
          </h3>
          {pdf.description && (
            <p className="mt-1 text-xs text-nuit/65 leading-relaxed">
              {pdf.description}
            </p>
          )}
          {pdf.auteur && (
            <p className="mt-1 text-[11px] text-nuit/45">
              Par {pdf.auteur}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <a
            href={pdf.blob_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-nuit/15 bg-white px-2.5 py-1 text-xs font-medium text-nuit/75 hover:bg-nuit/5"
          >
            ↗ Voir le PDF
          </a>
          {pdf.statut !== "published" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatut("published")}
              className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Publier
            </button>
          )}
          {pdf.statut === "published" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatut("archived")}
              className="rounded-md border border-nuit/15 bg-white px-2.5 py-1 text-xs font-medium text-nuit/65 hover:bg-nuit/5 disabled:opacity-50"
            >
              Archiver
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md border border-nuit/15 bg-white px-2.5 py-1 text-xs font-medium text-nuit/75 hover:bg-nuit/5"
          >
            ✎ Éditer
          </button>
          {confirmingDelete ? (
            <>
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded-md px-2 py-1 text-xs text-nuit/55 hover:bg-nuit/5"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-md border border-rose-200 bg-white px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [auteur, setAuteur] = useState("");
  const [niveau, setNiveau] = useState<string>("");
  const [categorie, setCategorie] = useState<PdfCategorie>("cours");
  const [statut, setStatut] = useState<PdfStatut>("published");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError("Choisis un fichier PDF.");
      return;
    }
    setError(null);
    setBusy(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("titre", titre);
    fd.append("description", description);
    fd.append("auteur", auteur);
    if (niveau) fd.append("niveau", niveau);
    fd.append("categorie", categorie);
    fd.append("statut", statut);

    const res = await fetch("/api/admin/pdfs", { method: "POST", body: fd });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Erreur lors de l'upload");
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <Modal onClose={onClose} title="Ajouter un PDF">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Fichier PDF (max 20 MB)">
          <input
            required
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-nuit file:mr-3 file:rounded-md file:border-0 file:bg-nuit file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-creme hover:file:bg-nuit-400"
          />
          {file && (
            <p className="mt-1 text-[11px] text-nuit/55">
              {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </Field>

        <Field label="Titre *">
          <input
            required
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className={inputCls}
            placeholder="ex. Cahier d'exercices niveau 3 — la Hamza"
          />
        </Field>

        <Field label="Description courte">
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
            placeholder="ex. 12 exercices pour s'entraîner à écrire la hamza correctement."
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Niveau (optionnel)">
            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              className={inputCls}
            >
              <option value="">Tous niveaux</option>
              {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Niveau {n}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Catégorie *">
            <select
              required
              value={categorie}
              onChange={(e) => setCategorie(e.target.value as PdfCategorie)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Auteur (optionnel)">
            <input
              type="text"
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              className={inputCls}
              placeholder="ex. Institut Al-Irtiqā'"
            />
          </Field>
          <Field label="Statut">
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value as PdfStatut)}
              className={inputCls}
            >
              <option value="published">En ligne</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
          </Field>
        </div>

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-nuit px-5 py-2 text-xs font-medium text-creme hover:bg-nuit-400 disabled:opacity-60"
          >
            {busy ? "Upload en cours…" : "Uploader"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-nuit/15 bg-white px-5 py-2 text-xs font-medium text-nuit/65 hover:bg-nuit/5"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditModal({
  pdf,
  onClose,
}: {
  pdf: PdfWithStats;
  onClose: () => void;
}) {
  const router = useRouter();
  const [titre, setTitre] = useState(pdf.titre);
  const [description, setDescription] = useState(pdf.description ?? "");
  const [auteur, setAuteur] = useState(pdf.auteur ?? "");
  const [niveau, setNiveau] = useState<string>(
    pdf.niveau !== null ? String(pdf.niveau) : "",
  );
  const [categorie, setCategorie] = useState<PdfCategorie>(pdf.categorie);
  const [statut, setStatut] = useState<PdfStatut>(pdf.statut);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch(`/api/admin/pdfs/${pdf.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titre,
        description: description || null,
        auteur: auteur || null,
        niveau: niveau ? parseInt(niveau, 10) : null,
        categorie,
        statut,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d?.error ?? "Erreur");
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <Modal onClose={onClose} title="Modifier le document">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Titre">
          <input
            required
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Description">
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Niveau">
            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              className={inputCls}
            >
              <option value="">Tous niveaux</option>
              {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Niveau {n}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Catégorie">
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value as PdfCategorie)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Auteur">
            <input
              type="text"
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Statut">
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value as PdfStatut)}
              className={inputCls}
            >
              <option value="published">En ligne</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
          </Field>
        </div>

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-nuit px-5 py-2 text-xs font-medium text-creme hover:bg-nuit-400 disabled:opacity-60"
          >
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-nuit/15 bg-white px-5 py-2 text-xs font-medium text-nuit/65 hover:bg-nuit/5"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-nuit/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-nuit">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-nuit/55 hover:bg-nuit/5"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-nuit/15 bg-white px-3 py-2 text-sm text-nuit outline-none transition-colors focus:border-dore focus:ring-2 focus:ring-dore/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-nuit/55">
        {label}
      </span>
      {children}
    </label>
  );
}
