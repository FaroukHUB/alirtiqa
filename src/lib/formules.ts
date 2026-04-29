import { site } from "./site";

export type Formule = {
  slug: "particulier" | "duo" | "groupe";
  titre: string;
  promesse: string;
  prix: number;
  unite: string;
  pour: string[];
  badge?: string;
};

export const formules: Formule[] = [
  {
    slug: "particulier",
    titre: "Cours particulier",
    promesse: "Un suivi 100% personnalisé, à votre rythme.",
    prix: site.pricing.particulier,
    unite: "€ / 8h par mois",
    pour: [
      "Progression sur-mesure adaptée à vos objectifs",
      "Horaires flexibles, programme ajusté",
      "Idéal pour rattraper ou accélérer",
    ],
    badge: "Le plus intensif",
  },
  {
    slug: "duo",
    titre: "Cours en duo",
    promesse: "À deux, pour s'entraider et s'encourager.",
    prix: site.pricing.duo,
    unite: "€ / 8h par mois (par personne)",
    pour: [
      "Deux apprenants de niveau proche",
      "Tarif préférentiel par rapport au particulier",
      "Émulation et entraide entre les séances",
    ],
    badge: "Recommandé",
  },
  {
    slug: "groupe",
    titre: "Cours en groupe",
    promesse: "Apprendre en collectif, dans une dynamique de classe.",
    prix: site.pricing.groupe,
    unite: "€ / 8h par mois (par personne)",
    pour: [
      "Groupes à partir de 3 apprenants",
      "Niveau et rythme harmonisés",
      "L'option la plus accessible",
    ],
  },
];
