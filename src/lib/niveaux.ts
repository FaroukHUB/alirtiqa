export type Niveau = {
  numero: number;
  slug: string;
  titre: string;
  cycle: "Initiation" | "Préparation" | "Approfondissement";
  resume: string;
};

export const niveaux: Niveau[] = [
  { numero: 1, slug: "muqadima-alif", titre: "MUQADIMA ALIF", cycle: "Initiation",
    resume: "Alphabet, voyelles, chiffres, jours et mois, vocabulaire." },
  { numero: 2, slug: "ta3bir", titre: "TA3BIR", cycle: "Initiation",
    resume: "Adjectifs, métiers, verbes, pronoms, particules, dialogues." },
  { numero: 3, slug: "muqadima-ba", titre: "MUQADIMA BA", cycle: "Initiation",
    resume: "Types de mots, verbes conjugués, textes, l'heure." },
  { numero: 4, slug: "timhidi-alif", titre: "TIMHIDI ALIF", cycle: "Préparation",
    resume: "Milieux scolaire et médical, présentation, possession." },
  { numero: 5, slug: "timhidi-ba", titre: "TIMHIDI BA", cycle: "Préparation",
    resume: "Géographie, médecine, grammaire, conjugaison." },
  { numero: 6, slug: "moustawa-1", titre: "MOUSTAWA 1", cycle: "Approfondissement",
    resume: "Hamza, pluriel masculin, Inna wa akhawatuha." },
  { numero: 7, slug: "moustawa-2", titre: "MOUSTAWA 2", cycle: "Approfondissement",
    resume: "Pluriel féminin, duel, analyse grammaticale, poèmes." },
  { numero: 8, slug: "moustawa-3", titre: "MOUSTAWA 3", cycle: "Approfondissement",
    resume: "Technologie, noms invariables, bases de conjugaison." },
  { numero: 9, slug: "moustawa-4", titre: "MOUSTAWA 4", cycle: "Approfondissement",
    resume: "Histoires des prophètes, poèmes, expressions arabes." },
  { numero: 10, slug: "moustawa-5", titre: "MOUSTAWA 5", cycle: "Approfondissement",
    resume: "Histoires des prophètes, grammaire avancée, figures de style." },
  { numero: 11, slug: "moustawa-6", titre: "MOUSTAWA 6", cycle: "Approfondissement",
    resume: "Sourate Al-Kahf, rhétorique, interpellation." },
  { numero: 12, slug: "moustawa-7", titre: "MOUSTAWA 7", cycle: "Approfondissement",
    resume: "Sourate Al-Qaṣaṣ, masdar, sujet et complément." },
  { numero: 13, slug: "moustawa-8", titre: "MOUSTAWA 8", cycle: "Approfondissement",
    resume: "Sourate Yūsuf, rôles grammaticaux, Ḏanna wa akhawatuha." },
  { numero: 14, slug: "moustawa-9", titre: "MOUSTAWA 9", cycle: "Approfondissement",
    resume: "Vie du Prophète ﷺ : avant la Révélation jusqu'à Badr." },
  { numero: 15, slug: "moustawa-10", titre: "MOUSTAWA 10", cycle: "Approfondissement",
    resume: "Vie du Prophète ﷺ : d'Ouhoud à sa mort, tanwin, diminutif." },
];

export const cycles = ["Initiation", "Préparation", "Approfondissement"] as const;
