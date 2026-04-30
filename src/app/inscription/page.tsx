import type { Metadata } from "next";
import { Suspense } from "react";
import { InscriptionForm } from "./InscriptionForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "S'inscrire aux cours d'arabe de l'Institut Al-Irtiqā'. Formulaire rapide, réponse sous 24h.",
};

export default function InscriptionPage() {
  const whatsappUrl = `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`;

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-arabesque bg-[length:520px] opacity-[0.05]"
        />
        <div className="container-prose relative py-20 sm:py-24">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-dore">
            Inscription
          </p>
          <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Quelques informations et nous vous recontactons
          </h1>
          <p className="mt-5 max-w-xl text-creme/75">
            Remplissez ce formulaire et choisissez votre canal préféré : email
            ou WhatsApp. Réponse sous 24 h. Vous pouvez aussi nous joindre
            directement sur WhatsApp au{" "}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-dore hover:underline"
            >
              {site.contact.whatsappDisplay}
            </a>
            .
          </p>
        </div>
      </section>

      <section id="formulaire" className="scroll-mt-32 bg-creme py-16 sm:py-20">
        <div className="container-prose">
          <Suspense fallback={null}>
            <InscriptionForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
