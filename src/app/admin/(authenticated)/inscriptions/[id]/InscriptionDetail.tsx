"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Inscription, InscriptionStatut } from "@/lib/db";

const STATUT_OPTIONS: { value: InscriptionStatut; label: string }[] = [
  { value: "nouveau", label: "Nouveau" },
  { value: "contacte", label: "Contacté" },
  { value: "essai", label: "Essai planifié" },
  { value: "inscrit", label: "Inscrit" },
  { value: "refus", label: "Refusé" },
  { value: "sans_suite", label: "Sans suite" },
];

export function InscriptionDetail({
  inscription,
}: {
  inscription: Inscription;
}) {
  const router = useRouter();
  const [statut, setStatut] = useState<InscriptionStatut>(inscription.statut);
  const [note, setNote] = useState(inscription.note_admin ?? "");
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | { kind: "saved" }
    | { kind: "error"; message: string }
    | null
  >(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const dirty =
    statut !== inscription.statut ||
    (note ?? "") !== (inscription.note_admin ?? "");

  async function save() {
    setFeedback(null);
    const res = await fetch(`/api/admin/inscriptions/${inscription.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut, note_admin: note }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setFeedback({
        kind: "error",
        message: data?.error ?? "Erreur lors de l'enregistrement.",
      });
      return;
    }
    setFeedback({ kind: "saved" });
    startTransition(() => router.refresh());
  }

  async function remove() {
    setFeedback(null);
    const res = await fetch(`/api/admin/inscriptions/${inscription.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setFeedback({
        kind: "error",
        message: "Erreur lors de la suppression.",
      });
      return;
    }
    router.push("/admin/inscriptions");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-nuit/10 bg-white p-6">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-nuit/55">
          Statut
        </h2>
        <div className="mt-3 space-y-1.5">
          {STATUT_OPTIONS.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                statut === o.value
                  ? "border-dore bg-dore/5 text-nuit"
                  : "border-nuit/10 text-nuit/70 hover:border-nuit/25"
              }`}
            >
              <input
                type="radio"
                name="statut"
                value={o.value}
                checked={statut === o.value}
                onChange={() => setStatut(o.value)}
                className="sr-only"
              />
              <span
                className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                  statut === o.value
                    ? "border-dore bg-dore"
                    : "border-nuit/25"
                }`}
              >
                {statut === o.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              {o.label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-nuit/10 bg-white p-6">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-nuit/55">
          Notes internes
        </h2>
        <textarea
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="ex. relancé le 12/05, demande créneau soir…"
          className="mt-3 w-full resize-y rounded-lg border border-nuit/15 bg-white px-3 py-2 text-sm text-nuit outline-none transition-colors focus:border-dore focus:ring-2 focus:ring-dore/20"
        />
      </section>

      <div className="space-y-2">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || pending}
          className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            dirty && !pending
              ? "bg-nuit text-creme hover:bg-nuit-400"
              : "cursor-not-allowed bg-nuit/15 text-nuit/45"
          }`}
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>

        {feedback?.kind === "saved" && (
          <p className="text-center text-xs text-emerald-700">
            ✓ Modifications enregistrées
          </p>
        )}
        {feedback?.kind === "error" && (
          <p className="text-center text-xs text-rose-700">
            {feedback.message}
          </p>
        )}
      </div>

      <section className="rounded-xl border border-rose-200/60 bg-white p-6">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-rose-700/80">
          Zone sensible
        </h2>
        <p className="mt-2 text-xs text-nuit/55">
          Supprimer définitivement cette demande de la base.
        </p>
        {confirmingDelete ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={remove}
              className="flex-1 rounded-md bg-rose-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-700"
            >
              Confirmer la suppression
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-md border border-nuit/15 px-3 py-2 text-xs text-nuit/65 hover:bg-nuit/5"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="mt-3 inline-flex items-center justify-center rounded-md border border-rose-200 bg-white px-3 py-2 text-xs text-rose-700 transition-colors hover:bg-rose-50"
          >
            Supprimer cette demande
          </button>
        )}
      </section>
    </div>
  );
}
