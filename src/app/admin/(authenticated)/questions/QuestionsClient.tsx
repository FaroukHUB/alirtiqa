"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  Question,
  QuestionCategorie,
  QuestionStatut,
  QuestionType,
} from "@/lib/db";

const CATEGORIES: { value: QuestionCategorie; label: string }[] = [
  { value: "vocabulaire", label: "Vocabulaire" },
  { value: "grammaire", label: "Grammaire" },
  { value: "sarf", label: "Sarf" },
  { value: "lecture", label: "Lecture" },
  { value: "comprehension", label: "Compréhension" },
  { value: "coran", label: "Coran" },
];

const STATUT_BADGE: Record<QuestionStatut, { label: string; cls: string }> = {
  draft: {
    label: "Brouillon",
    cls: "bg-amber-100 text-amber-800 ring-amber-300/50",
  },
  published: {
    label: "Publiée",
    cls: "bg-emerald-100 text-emerald-800 ring-emerald-300/50",
  },
  archived: {
    label: "Archivée",
    cls: "bg-nuit/10 text-nuit/60 ring-nuit/20",
  },
};

const SOURCE_LABEL: Record<Question["source"], string> = {
  manuel: "Manuel",
  ia_seed: "IA · seed",
  ia_admin: "IA · admin",
};

export function QuestionsClient({ questions }: { questions: Question[] }) {
  const router = useRouter();
  const [openCreate, setOpenCreate] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [confirmingBulk, setConfirmingBulk] = useState<
    "publish" | "draft" | "archive" | "delete" | null
  >(null);

  const draftIds = questions
    .filter((q) => q.statut === "draft")
    .map((q) => q.id);
  const publishedIds = questions
    .filter((q) => q.statut === "published")
    .map((q) => q.id);
  const allIds = questions.map((q) => q.id);

  async function bulkAction(
    action: "publish" | "draft" | "archive" | "delete",
  ) {
    const ids =
      action === "publish"
        ? draftIds
        : action === "draft"
          ? publishedIds
          : allIds;
    if (ids.length === 0) return;
    setBulkBusy(true);
    const res = await fetch("/api/admin/questions/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, action }),
    });
    setBulkBusy(false);
    setConfirmingBulk(null);
    if (res.ok) router.refresh();
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-nuit/65">
          {questions.length} question{questions.length > 1 ? "s" : ""} affichée
          {questions.length > 1 ? "s" : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          {draftIds.length > 0 &&
            (confirmingBulk === "publish" ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 ring-1 ring-emerald-300">
                <span className="text-xs text-emerald-900">
                  Publier {draftIds.length} brouillon
                  {draftIds.length > 1 ? "s" : ""} ?
                </span>
                <button
                  type="button"
                  disabled={bulkBusy}
                  onClick={() => bulkAction("publish")}
                  className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingBulk(null)}
                  className="rounded-full px-2 py-1 text-xs text-nuit/55 hover:bg-white/50"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingBulk("publish")}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
              >
                ✓ Tout publier ({draftIds.length})
              </button>
            ))}
          <button
            type="button"
            onClick={() => setOpenGenerate(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-dore/40 bg-dore/5 px-4 py-2 text-xs font-medium text-dore-700 transition-colors hover:bg-dore/15"
          >
            ✨ Générer via IA
          </button>
          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-nuit px-4 py-2 text-xs font-medium text-creme transition-colors hover:bg-nuit-400"
          >
            + Nouvelle question
          </button>
          {allIds.length > 0 &&
            (confirmingBulk === "delete" ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 ring-1 ring-rose-300">
                <span className="text-xs text-rose-900">
                  Supprimer {allIds.length} question
                  {allIds.length > 1 ? "s" : ""} affichée
                  {allIds.length > 1 ? "s" : ""} ? (Action irréversible)
                </span>
                <button
                  type="button"
                  disabled={bulkBusy}
                  onClick={() => bulkAction("delete")}
                  className="rounded-full bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingBulk(null)}
                  className="rounded-full px-2 py-1 text-xs text-nuit/55 hover:bg-white/50"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingBulk("delete")}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50"
              >
                ✗ Tout supprimer ({allIds.length})
              </button>
            ))}
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-nuit/15 bg-creme/40 p-12 text-center">
          <p className="font-display text-lg text-nuit/70">
            Aucune question avec ces filtres.
          </p>
          <p className="mt-2 text-sm text-nuit/55">
            Lance le seed via{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-xs">
              npm run db:seed-questions
            </code>{" "}
            ou crée une question manuellement.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              isEditing={editingId === q.id}
              onEdit={() => setEditingId(q.id)}
              onClose={() => setEditingId(null)}
            />
          ))}
        </ul>
      )}

      {openCreate && (
        <QuestionFormModal
          mode="create"
          onClose={() => setOpenCreate(false)}
        />
      )}
      {openGenerate && (
        <GenerateModal onClose={() => setOpenGenerate(false)} />
      )}
    </>
  );
}

function QuestionCard({
  question,
  isEditing,
  onEdit,
  onClose,
}: {
  question: Question;
  isEditing: boolean;
  onEdit: () => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function changeStatut(statut: QuestionStatut) {
    setBusy(true);
    const res = await fetch(`/api/admin/questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    setBusy(false);
    if (res.ok) startTransition(() => router.refresh());
  }

  async function remove() {
    setBusy(true);
    const res = await fetch(`/api/admin/questions/${question.id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (res.ok) startTransition(() => router.refresh());
  }

  const badge = STATUT_BADGE[question.statut];

  if (isEditing) {
    return (
      <li className="rounded-xl border border-dore/40 bg-white p-5 shadow-[0_4px_20px_rgba(201,169,97,0.12)]">
        <QuestionForm
          mode="edit"
          initial={question}
          onCancel={onClose}
          onSaved={() => {
            onClose();
            startTransition(() => router.refresh());
          }}
        />
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-nuit/10 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${badge.cls}`}
          >
            {badge.label}
          </span>
          <span className="rounded-full bg-nuit/5 px-2.5 py-0.5 text-[11px] font-medium text-nuit/70">
            N{question.niveau}
          </span>
          <span className="rounded-full bg-nuit/5 px-2.5 py-0.5 text-[11px] font-medium text-nuit/70">
            {CATEGORIES.find((c) => c.value === question.categorie)?.label}
          </span>
          <span className="rounded-full bg-nuit/5 px-2.5 py-0.5 text-[11px] font-medium text-nuit/70">
            {question.type === "qcm" ? "QCM" : "Vrai/Faux"}
          </span>
          <span className="text-[11px] text-nuit/45">
            {SOURCE_LABEL[question.source]}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {question.statut !== "published" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatut("published")}
              className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              ✓ Publier
            </button>
          )}
          {question.statut === "published" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatut("draft")}
              className="rounded-md border border-nuit/15 bg-white px-2.5 py-1 text-xs font-medium text-nuit/65 hover:bg-nuit/5 disabled:opacity-50"
            >
              ↺ Brouillon
            </button>
          )}
          {question.statut !== "archived" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatut("archived")}
              className="rounded-md border border-nuit/15 bg-white px-2.5 py-1 text-xs font-medium text-nuit/55 hover:bg-nuit/5 disabled:opacity-50"
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

      <p className="mt-4 text-sm leading-relaxed text-nuit">
        {question.enonce}
      </p>

      {question.arabe && (
        <p
          dir="rtl"
          lang="ar"
          className="mt-3 rounded-lg bg-creme/60 px-4 py-2.5 text-right text-lg leading-loose text-nuit"
          style={{ fontFamily: "Amiri, serif" }}
        >
          {question.arabe}
        </p>
      )}

      <ul className="mt-4 space-y-1.5">
        {question.choix.map((c, i) => {
          const correct = i === question.bonne_reponse;
          const isArabic = /[؀-ۿ]/.test(c);
          return (
            <li
              key={i}
              className={`flex items-start gap-3 rounded-md border px-3 py-2 text-sm ${
                correct
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-900"
                  : "border-nuit/10 text-nuit/75"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-bold ${
                  correct
                    ? "bg-emerald-600 text-white"
                    : "bg-nuit/10 text-nuit/55"
                }`}
              >
                {correct ? "✓" : String.fromCharCode(65 + i)}
              </span>
              <span
                className={isArabic ? "text-base" : ""}
                dir={isArabic ? "rtl" : "ltr"}
                lang={isArabic ? "ar" : undefined}
                style={isArabic ? { fontFamily: "Amiri, serif" } : undefined}
              >
                {c}
              </span>
            </li>
          );
        })}
      </ul>

      {question.explication && (
        <p className="mt-3 border-l-2 border-dore/40 bg-creme/40 px-4 py-2 text-xs italic text-nuit/70">
          {question.explication}
        </p>
      )}
    </li>
  );
}

type FormState = {
  type: QuestionType;
  enonce: string;
  arabe: string;
  choix: string[];
  bonne_reponse: number;
  explication: string;
  niveau: number;
  categorie: QuestionCategorie;
  statut: QuestionStatut;
};

function emptyForm(): FormState {
  return {
    type: "qcm",
    enonce: "",
    arabe: "",
    choix: ["", "", "", ""],
    bonne_reponse: 0,
    explication: "",
    niveau: 1,
    categorie: "vocabulaire",
    statut: "draft",
  };
}

function fromQuestion(q: Question): FormState {
  return {
    type: q.type,
    enonce: q.enonce,
    arabe: q.arabe ?? "",
    choix: [...q.choix],
    bonne_reponse: q.bonne_reponse,
    explication: q.explication ?? "",
    niveau: q.niveau,
    categorie: q.categorie,
    statut: q.statut,
  };
}

function QuestionForm({
  mode,
  initial,
  onSaved,
  onCancel,
}: {
  mode: "create" | "edit";
  initial?: Question;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() =>
    initial ? fromQuestion(initial) : emptyForm(),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setType(t: QuestionType) {
    setForm((p) => ({
      ...p,
      type: t,
      choix: t === "qcm" ? ["", "", "", ""] : ["Vrai", "Faux"],
      bonne_reponse: 0,
    }));
  }

  function setChoix(i: number, v: string) {
    setForm((p) => {
      const next = [...p.choix];
      next[i] = v;
      return { ...p, choix: next };
    });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const url =
      mode === "create"
        ? "/api/admin/questions"
        : `/api/admin/questions/${initial!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d?.error ?? "Erreur lors de l'enregistrement");
      return;
    }
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            className={inputCls}
          >
            <option value="qcm">QCM (4 choix)</option>
            <option value="vf">Vrai / Faux</option>
          </select>
        </Field>
        <Field label="Niveau">
          <select
            value={form.niveau}
            onChange={(e) =>
              setForm((p) => ({ ...p, niveau: parseInt(e.target.value, 10) }))
            }
            className={inputCls}
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Niveau {n}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Catégorie">
          <select
            value={form.categorie}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                categorie: e.target.value as QuestionCategorie,
              }))
            }
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

      <Field label="Énoncé (français)">
        <textarea
          required
          rows={2}
          value={form.enonce}
          onChange={(e) =>
            setForm((p) => ({ ...p, enonce: e.target.value }))
          }
          className={inputCls}
        />
      </Field>

      <Field label="Texte arabe (optionnel, voyellation requise)">
        <textarea
          dir="rtl"
          lang="ar"
          rows={2}
          value={form.arabe}
          onChange={(e) => setForm((p) => ({ ...p, arabe: e.target.value }))}
          className={`${inputCls} text-lg`}
          style={{ fontFamily: "Amiri, serif" }}
        />
      </Field>

      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-nuit/55">
          Choix · cocher la bonne réponse
        </p>
        <div className="space-y-2">
          {form.choix.map((c, i) => {
            const isArabic = /[؀-ۿ]/.test(c);
            return (
              <label
                key={i}
                className="flex items-center gap-2.5 rounded-md border border-nuit/15 bg-white px-3 py-2"
              >
                <input
                  type="radio"
                  name="bonne_reponse"
                  checked={form.bonne_reponse === i}
                  onChange={() =>
                    setForm((p) => ({ ...p, bonne_reponse: i }))
                  }
                  className="h-4 w-4 accent-dore"
                />
                <span className="w-4 text-xs font-bold text-nuit/55">
                  {String.fromCharCode(65 + i)}
                </span>
                <input
                  type="text"
                  required
                  value={c}
                  onChange={(e) => setChoix(i, e.target.value)}
                  dir={isArabic ? "rtl" : "ltr"}
                  className={`flex-1 border-0 bg-transparent text-sm outline-none ${
                    isArabic ? "text-right text-base" : ""
                  }`}
                  style={isArabic ? { fontFamily: "Amiri, serif" } : undefined}
                  disabled={form.type === "vf"}
                />
              </label>
            );
          })}
        </div>
      </div>

      <Field label="Explication (optionnelle)">
        <textarea
          rows={2}
          value={form.explication}
          onChange={(e) =>
            setForm((p) => ({ ...p, explication: e.target.value }))
          }
          className={inputCls}
        />
      </Field>

      <Field label="Statut">
        <select
          value={form.statut}
          onChange={(e) =>
            setForm((p) => ({ ...p, statut: e.target.value as QuestionStatut }))
          }
          className={inputCls}
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publiée</option>
          <option value="archived">Archivée</option>
        </select>
      </Field>

      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-nuit px-4 py-2 text-xs font-medium text-creme hover:bg-nuit-400 disabled:opacity-60"
        >
          {busy ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-nuit/15 bg-white px-4 py-2 text-xs font-medium text-nuit/65 hover:bg-nuit/5"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

function QuestionFormModal({
  mode,
  initial,
  onClose,
}: {
  mode: "create" | "edit";
  initial?: Question;
  onClose: () => void;
}) {
  const router = useRouter();
  return (
    <Modal onClose={onClose} title="Nouvelle question">
      <QuestionForm
        mode={mode}
        initial={initial}
        onCancel={onClose}
        onSaved={() => {
          onClose();
          router.refresh();
        }}
      />
    </Modal>
  );
}

function GenerateModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [niveau, setNiveau] = useState(3);
  const [categorie, setCategorie] = useState<QuestionCategorie>("vocabulaire");
  const [count, setCount] = useState(3);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    const res = await fetch("/api/admin/questions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niveau, categorie, count }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Échec de la génération");
      return;
    }
    setResult(
      `${data.inserted} question(s) ajoutée(s) en brouillon.${data.rejected ? ` ${data.rejected.length} rejetée(s).` : ""}`,
    );
    router.refresh();
  }

  return (
    <Modal onClose={onClose} title="Générer des questions via IA">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-xs text-nuit/65">
          Claude Haiku 4.5 génère les questions selon le niveau et la
          catégorie. Elles seront ajoutées en{" "}
          <strong>brouillon</strong> (à valider manuellement).
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Niveau">
            <select
              value={niveau}
              onChange={(e) => setNiveau(parseInt(e.target.value, 10))}
              className={inputCls}
            >
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
              onChange={(e) =>
                setCategorie(e.target.value as QuestionCategorie)
              }
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nombre">
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className={inputCls}
            >
              {[1, 2, 3, 5, 8, 10].map((n) => (
                <option key={n} value={n}>
                  {n} question{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}
        {result && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            ✓ {result}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-dore px-4 py-2 text-xs font-medium text-nuit hover:bg-dore-300 disabled:opacity-60"
          >
            {busy ? "Génération…" : "✨ Générer"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-nuit/15 bg-white px-4 py-2 text-xs font-medium text-nuit/65 hover:bg-nuit/5"
          >
            Fermer
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
        className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
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
