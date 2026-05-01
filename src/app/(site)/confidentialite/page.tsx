import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de l'Institut Al-Irtiqā' : données collectées, finalités, conservation, droits RGPD.",
  robots: { index: true, follow: false },
};

export default function ConfidentialitePage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-zellige bg-[length:160px] opacity-[0.06]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
        />
        <div className="container-prose relative py-16 sm:py-20">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-dore">
            RGPD
          </p>
          <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Politique de confidentialité
          </h1>
        </div>
      </section>

      <section className="bg-creme py-14 sm:py-20">
        <div className="container-prose">
          <article className="mx-auto max-w-2xl space-y-10 text-nuit/85">
            <p className="rounded-xl border border-nuit/10 bg-white p-5 text-sm">
              {site.name} respecte la réglementation européenne sur la
              protection des données (RGPD) et la loi française Informatique
              et Libertés. La présente politique explique quelles données nous
              collectons, pourquoi, combien de temps nous les conservons, et
              quels sont vos droits.
            </p>

            <Section title="1. Responsable du traitement">
              <p>
                Le responsable du traitement des données est{" "}
                <strong>{site.name}</strong>, joignable à l&apos;adresse{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-dore-700 underline hover:no-underline"
                >
                  {site.contact.email}
                </a>
                .
              </p>
            </Section>

            <Section title="2. Données collectées et finalités">
              <p>Nous collectons les données suivantes :</p>
              <ul className="mt-3 space-y-3">
                <Bullet
                  label="Inscription aux cours"
                  detail="Prénom, nom, email, téléphone, âge, formule choisie, niveau estimé, disponibilités, message libre. Finalité : traiter votre demande d'inscription et vous recontacter."
                />
                <Bullet
                  label="Test de niveau"
                  detail="Réponses aux questions, IP et user-agent. À la fin du test, optionnellement votre prénom, email et téléphone si vous souhaitez recevoir un suivi. Finalité : situer votre niveau et vous proposer un programme adapté."
                />
                <Bullet
                  label="Téléchargement de PDFs (bibliothèque)"
                  detail="Email, prénom (optionnel), IP, user-agent. Finalité : autoriser le téléchargement et vous tenir informé des nouveaux documents si vous le souhaitez."
                />
                <Bullet
                  label="Formulaire de contact"
                  detail="Prénom, email, sujet, message. Finalité : répondre à votre demande."
                />
                <Bullet
                  label="Avis"
                  detail="Nom (ou prénom), email, note, témoignage. Finalité : modération puis publication sur la page Avis si validé."
                />
              </ul>
            </Section>

            <Section title="3. Base légale">
              <p>
                Le traitement de vos données repose sur votre{" "}
                <strong>consentement explicite</strong> (formulaire envoyé)
                ou sur l&apos;<strong>exécution d&apos;un contrat</strong>{" "}
                (suivi pédagogique de l&apos;élève inscrit).
              </p>
            </Section>

            <Section title="4. Durée de conservation">
              <ul className="mt-3 space-y-2">
                <Bullet
                  label="Inscriptions actives"
                  detail="Conservées pendant toute la durée du suivi de l'élève + [À COMPLÉTER — ex. 3 ans] après la fin de la relation pour respecter les obligations légales."
                />
                <Bullet
                  label="Demandes non abouties"
                  detail="[À COMPLÉTER — ex. 1 an] après la dernière interaction."
                />
                <Bullet
                  label="Tests de niveau"
                  detail="[À COMPLÉTER — ex. 1 an] à des fins statistiques."
                />
                <Bullet
                  label="Messages de contact"
                  detail="[À COMPLÉTER — ex. 1 an] après la dernière réponse."
                />
                <Bullet
                  label="Téléchargements PDF"
                  detail="[À COMPLÉTER — ex. 2 ans] pour la newsletter, sauf désinscription."
                />
              </ul>
            </Section>

            <Section title="5. Destinataires">
              <p>
                Vos données sont accessibles uniquement à l&apos;équipe
                pédagogique et administrative de {site.name}. Elles ne sont{" "}
                <strong>jamais vendues ni cédées à des tiers</strong> à des
                fins commerciales.
              </p>
              <p className="mt-3">
                Nous utilisons les sous-traitants techniques suivants :
              </p>
              <ul className="mt-3 space-y-2">
                <Bullet
                  label="Vercel Inc. (États-Unis)"
                  detail="Hébergement du site. Garanties RGPD via Standard Contractual Clauses."
                />
                <Bullet
                  label="Neon (États-Unis / Europe)"
                  detail="Base de données PostgreSQL."
                />
                <Bullet
                  label="Hostinger (Chypre)"
                  detail="Domaine et envoi des emails (SMTP)."
                />
                <Bullet
                  label="Anthropic (États-Unis)"
                  detail="API d'intelligence artificielle utilisée pour l'assistant conversationnel et la génération de questions du test. Aucune donnée personnelle identifiable n'est transmise à Anthropic."
                />
              </ul>
            </Section>

            <Section title="6. Vos droits">
              <p>
                Conformément au RGPD, vous disposez des droits suivants sur
                vos données :
              </p>
              <ul className="mt-3 space-y-2">
                <Bullet label="Droit d'accès" detail="Obtenir la copie de vos données." />
                <Bullet
                  label="Droit de rectification"
                  detail="Faire corriger des données inexactes."
                />
                <Bullet
                  label="Droit à l'effacement"
                  detail="Demander la suppression de vos données."
                />
                <Bullet
                  label="Droit à la limitation"
                  detail="Demander que le traitement soit suspendu."
                />
                <Bullet
                  label="Droit d'opposition"
                  detail="Vous opposer au traitement de vos données."
                />
                <Bullet
                  label="Droit à la portabilité"
                  detail="Récupérer vos données dans un format structuré."
                />
              </ul>
              <p className="mt-4">
                Pour exercer l&apos;un de ces droits, écrivez-nous à{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-dore-700 underline hover:no-underline"
                >
                  {site.contact.email}
                </a>{" "}
                en précisant l&apos;objet de votre demande. Nous y répondrons
                dans un délai d&apos;un mois.
              </p>
              <p className="mt-3 text-sm text-nuit/65">
                Vous avez également le droit d&apos;introduire une réclamation
                auprès de la CNIL (
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noreferrer"
                  className="text-dore-700 underline hover:no-underline"
                >
                  www.cnil.fr
                </a>
                ).
              </p>
            </Section>

            <Section title="7. Cookies">
              <p>
                Le site utilise uniquement des{" "}
                <strong>cookies techniques</strong> nécessaires au
                fonctionnement (notamment pour conserver une session
                administrateur ou la progression d&apos;un test entamé). Aucun
                cookie publicitaire ni outil de tracking tiers n&apos;est
                utilisé à ce jour.
              </p>
              <p className="mt-3 text-sm text-nuit/65">
                [À COMPLÉTER si vous ajoutez plus tard un outil analytics —
                Plausible, GA4, etc.]
              </p>
            </Section>

            <Section title="8. Sécurité">
              <p>
                Nous mettons en œuvre les mesures techniques et
                organisationnelles appropriées pour protéger vos données :
                connexion HTTPS, mots de passe administrateurs hashés (bcrypt),
                accès limité aux personnes habilitées.
              </p>
            </Section>

            <Section title="9. Modifications">
              <p>
                La présente politique peut être amenée à évoluer. Toute
                modification sera publiée sur cette page avec mention de la
                date de mise à jour.
              </p>
            </Section>

            <p className="border-t border-nuit/10 pt-6 text-xs text-nuit/45">
              Dernière mise à jour : [À COMPLÉTER — date]
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl text-nuit sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Bullet({ label, detail }: { label: string; detail: string }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-dore" />
      <span>
        <strong className="text-nuit">{label}</strong>
        {" — "}
        {detail}
      </span>
    </li>
  );
}
