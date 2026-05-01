import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";
import type { Inscription, InscriptionFormule } from "@/lib/db";

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
