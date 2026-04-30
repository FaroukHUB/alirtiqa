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
      "Programme entièrement adapté à votre niveau et vos objectifs",
      "Suivi individuel à chaque séance",
      "Avancement accéléré (idéal débutant ou remise à niveau)",
      "Flexibilité totale des horaires",
      "Accès direct au professeur pour poser vos questions",
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
      "Travail en binôme avec un niveau similaire",
      "Motivation constante et entraide entre les séances",
      "Meilleure régularité dans l’apprentissage",
      "Échange et pratique orale renforcée",
      "Tarif optimisé sans sacrifier la qualité",
    ],
  },
  {
    slug: "groupe",
    titre: "Cours en groupe",
    promesse: "Apprendre en collectif, dans une dynamique de classe.",
    prix: site.pricing.groupe,
    unite: "€ / 8h par mois (par personne)",
    pour: [
      "Interaction avec plusieurs élèves",
      "Énergie de groupe qui booste la motivation",
      "Apprentissage structuré et progressif",
      "Exercices collectifs et mises en pratique",
      "Solution la plus économique",
    ],
  },
];
