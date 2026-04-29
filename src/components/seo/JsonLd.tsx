import { site } from "@/lib/site";

const e164 = `+${site.contact.whatsapp.replace(/\D/g, "")}`;

const educationalOrganization = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  description: site.description,
  inLanguage: ["fr", "ar"],
  email: site.contact.email,
  telephone: e164,
  sameAs: [`https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`],
  areaServed: ["FR", "BE", "CH", "MA", "DZ", "TN"],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
    audienceType: "Apprenants francophones, enfants à partir de 10 ans et adultes",
  },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "Certificat de niveau (15 niveaux progressifs)",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Cours particulier",
      price: site.pricing.particulier,
      priceCurrency: "EUR",
      description: "Cours d'arabe en visioconférence — 8h/mois — formule individuelle",
    },
    {
      "@type": "Offer",
      name: "Cours en duo",
      price: site.pricing.duo,
      priceCurrency: "EUR",
      description: "Cours d'arabe en visioconférence — 8h/mois — formule duo",
    },
    {
      "@type": "Offer",
      name: "Cours en groupe",
      price: site.pricing.groupe,
      priceCurrency: "EUR",
      description: "Cours d'arabe en visioconférence — 8h/mois — formule groupe (≥3)",
    },
  ],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  inLanguage: "fr-FR",
  publisher: {
    "@type": "EducationalOrganization",
    name: site.name,
    url: site.url,
  },
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
