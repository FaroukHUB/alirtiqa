import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";
import { niveaux } from "@/lib/niveaux";
import type {
  Inscription,
  InscriptionFormule,
  TestAttempt,
  TestAnswer,
} from "@/lib/db";
import { scoresParCategorie } from "@/lib/test-engine";

let _transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  _transporter = nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465,
    auth: { user, pass },
  });

  return _transporter;
}

const FORMULE_LABEL: Record<InscriptionFormule, string> = {
  particulier: "Cours particulier",
  duo: "Cours en duo",
  groupe: "Cours en groupe",
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });
}

function adminBody(i: Inscription): string {
  return [
    `Nouvelle demande reçue le ${fmtDate(i.created_at)}.`,
    "",
    "— Identité —",
    `Prénom : ${i.prenom}`,
    `Nom : ${i.nom}`,
    i.age ? `Âge : ${i.age}` : null,
    "",
    "— Contact —",
    `Email : ${i.email}`,
    i.telephone ? `Téléphone : ${i.telephone}` : null,
    "",
    "— Demande —",
    `Formule souhaitée : ${FORMULE_LABEL[i.formule]}`,
    i.niveau ? `Niveau estimé : ${i.niveau}` : null,
    i.disponibilite ? `Disponibilités : ${i.disponibilite}` : null,
    "",
    i.message ? "— Message —" : null,
    i.message ?? null,
    i.message ? "" : null,
    "—",
    "Voir / traiter cette demande :",
    `${site.url}/admin/inscriptions/${i.id}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

function candidateBody(i: Inscription): string {
  const lignes = [
    "As-salāmu ʿalaykum wa raḥmatu Llāhi wa barakātuh,",
    "",
    "Nous avons bien reçu votre demande d'inscription aux cours d'arabe",
    "de l'Institut Al-Irtiqā'. Bārak Allāhu fīkum pour votre confiance.",
    "",
    "Voici le récapitulatif de votre demande :",
    "",
    `  • Formule choisie : ${FORMULE_LABEL[i.formule]}`,
  ];
  if (i.niveau) lignes.push(`  • Niveau estimé : ${i.niveau}`);
  if (i.disponibilite)
    lignes.push(`  • Disponibilités indiquées : ${i.disponibilite}`);
  lignes.push(
    "",
    "Notre équipe vous recontactera in shā'a Llāh sous 48 heures",
    "ouvrées, par WhatsApp ou par email, afin de fixer ensemble un",
    "premier échange et de répondre à toutes vos questions.",
    "",
    "Si vous souhaitez nous joindre dans l'intervalle :",
    `  • WhatsApp : ${site.contact.whatsappDisplay}`,
    `  • Email : ${site.contact.email}`,
    "",
    "Qu'Allāh facilite votre apprentissage et le rende bénéfique.",
    "",
    "—",
    "L'équipe de l'Institut Al-Irtiqā'",
    "Méthode égyptienne — cours d'arabe en ligne",
    site.url.replace(/^https?:\/\//, ""),
  );
  return lignes.join("\n");
}

export async function sendAdminNotif(i: Inscription): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[mailer] SMTP non configuré, mail admin non envoyé");
    return false;
  }
  const adminEmail = process.env.ADMIN_EMAIL ?? site.contact.email;
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER!;
  try {
    await transporter.sendMail({
      from,
      to: adminEmail,
      replyTo: i.email,
      subject: `Nouvelle inscription — ${i.prenom} ${i.nom} — formule ${i.formule}`,
      text: adminBody(i),
    });
    return true;
  } catch (err) {
    console.error("[mailer] échec envoi mail admin:", err);
    return false;
  }
}

const CATEGORIE_LABEL: Record<string, string> = {
  vocabulaire: "Vocabulaire",
  grammaire: "Grammaire",
  sarf: "Sarf / Conjugaison",
  lecture: "Lecture / Voyellation",
  comprehension: "Compréhension",
  coran: "Coran / Hadith",
};

function testResultBody(
  attempt: TestAttempt,
  answers: TestAnswer[],
): string {
  const niveau = attempt.niveau_final ?? 0;
  const niveauInfo = niveaux.find((n) => n.numero === niveau);
  const scores = scoresParCategorie(
    answers.map((a) => ({
      level_at_time: a.level_at_time,
      categorie: a.categorie,
      est_correcte: a.est_correcte,
    })),
  );
  const correctTotal = answers.filter((a) => a.est_correcte).length;

  const lignes: (string | null)[] = [
    `Test de niveau terminé le ${fmtDate(attempt.created_at)}.`,
    "",
    "— Candidat —",
    `Prénom : ${attempt.prenom ?? "—"}`,
    `Email : ${attempt.email ?? "—"}`,
    attempt.telephone ? `Téléphone : ${attempt.telephone}` : null,
    attempt.age ? `Âge : ${attempt.age}` : null,
    "",
    "— Résultat —",
    `Niveau estimé : ${niveau}${niveauInfo ? ` — ${niveauInfo.titre} (${niveauInfo.cycle})` : ""}`,
    `Score global : ${correctTotal} / ${answers.length} bonnes réponses`,
    "",
    "— Détail par catégorie —",
  ];

  for (const [cat, s] of Object.entries(scores)) {
    if (!s) continue;
    lignes.push(
      `  • ${CATEGORIE_LABEL[cat]} : ${s.correct}/${s.total} (${s.pct}%)`,
    );
  }

  lignes.push(
    "",
    "—",
    "Voir le détail dans l'admin :",
    `${site.url}/admin/inscriptions`,
  );

  return lignes.filter((l) => l !== null).join("\n");
}

export async function sendTestResultNotif(
  attempt: TestAttempt,
  answers: TestAnswer[],
): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[mailer] SMTP non configuré, mail test non envoyé");
    return false;
  }
  const adminEmail = process.env.ADMIN_EMAIL ?? site.contact.email;
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER!;
  const niveau = attempt.niveau_final ?? 0;
  const niveauInfo = niveaux.find((n) => n.numero === niveau);
  try {
    await transporter.sendMail({
      from,
      to: adminEmail,
      replyTo: attempt.email ?? undefined,
      subject: `Test de niveau — ${attempt.prenom ?? "Anonyme"} → niveau ${niveau}${niveauInfo ? ` (${niveauInfo.titre})` : ""}`,
      text: testResultBody(attempt, answers),
    });
    return true;
  } catch (err) {
    console.error("[mailer] échec envoi mail test:", err);
    return false;
  }
}

export async function sendCandidateConfirm(i: Inscription): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[mailer] SMTP non configuré, mail candidat non envoyé");
    return false;
  }
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER!;
  try {
    await transporter.sendMail({
      from,
      to: i.email,
      replyTo: process.env.ADMIN_EMAIL ?? site.contact.email,
      subject:
        "Votre demande d'inscription à l'Institut Al-Irtiqā' a bien été reçue",
      text: candidateBody(i),
    });
    return true;
  } catch (err) {
    console.error("[mailer] échec envoi mail candidat:", err);
    return false;
  }
}
