export type Niveau = {
  numero: number;
  slug: string;
  titre: string;
  cycle: "Initiation" | "Préparation" | "Approfondissement";
  resume: string;
  contenu: string;
};

export const niveaux: Niveau[] = [
  {
    numero: 1,
    slug: "muqadima-alif",
    titre: "MUQADIMA ALIF",
    cycle: "Initiation",
    resume: "Alphabet, voyelles, chiffres, jours et mois, vocabulaire.",
    contenu:
      "Premier contact avec la langue : on apprend à reconnaître et à former les 28 lettres de l'alphabet, à distinguer les voyelles brèves et longues, à compter, à nommer les jours et les mois, et à mémoriser un vocabulaire utile au quotidien. Aucune connaissance préalable n'est requise.",
  },
  {
    numero: 2,
    slug: "ta3bir",
    titre: "TA3BIR",
    cycle: "Initiation",
    resume: "Adjectifs, métiers, verbes, pronoms, particules, dialogues.",
    contenu:
      "On enrichit son vocabulaire avec les adjectifs et les noms de métiers, on rencontre les premiers verbes ainsi que les pronoms personnels et démonstratifs, on découvre les principales particules grammaticales, et l'on s'entraîne à travers des dialogues du quotidien.",
  },
  {
    numero: 3,
    slug: "muqadima-ba",
    titre: "MUQADIMA BA",
    cycle: "Initiation",
    resume: "Types de mots, verbes conjugués, textes, l'heure.",
    contenu:
      "Étape qui consolide les acquis : classification approfondie des types de mots, premières conjugaisons illustrées par des exemples, courts textes thématiques (la maison, la mosquée, la salle de classe) et apprentissage de l'heure.",
  },
  {
    numero: 4,
    slug: "timhidi-alif",
    titre: "TIMHIDI ALIF",
    cycle: "Préparation",
    resume: "Milieux scolaire et médical, présentation, possession.",
    contenu:
      "Ouverture vers des textes plus consistants ancrés dans des contextes concrets — école, hôpital, restaurant. On apprend à se présenter, à manipuler les différentes formes des pronoms, et à saisir les notions de possession ainsi que d'article défini et indéfini.",
  },
  {
    numero: 5,
    slug: "timhidi-ba",
    titre: "TIMHIDI BA",
    cycle: "Préparation",
    resume: "Géographie, médecine, grammaire, conjugaison.",
    contenu:
      "On élargit le champ avec des textes touchant à la géographie, à la médecine et à la vie de famille. La grammaire s'approfondit, la conjugaison verbale se précise, et le vocabulaire à l'oral comme à l'écrit s'étoffe sensiblement.",
  },
  {
    numero: 6,
    slug: "moustawa-1",
    titre: "MOUSTAWA 1",
    cycle: "Approfondissement",
    resume: "Hamza, pluriel masculin, Inna wa akhawatuha.",
    contenu:
      "Premier niveau du cycle d'approfondissement, articulé autour de thèmes vivants (sport, zoo, démarches administratives). Les règles d'écriture de la Hamza sont passées en revue, le pluriel masculin est étudié dans toutes ses formes, et l'on aborde les groupes de particules Inna wa akhawātuhā ainsi que Kāna wa akhawātuhā.",
  },
  {
    numero: 7,
    slug: "moustawa-2",
    titre: "MOUSTAWA 2",
    cycle: "Approfondissement",
    resume: "Pluriel féminin, duel, analyse grammaticale, poèmes.",
    contenu:
      "On poursuit avec le pluriel féminin et le duel, et l'on entre véritablement dans l'analyse grammaticale (al-iʿrāb). La construction des noms et des verbes est étudiée à travers des textes du quotidien — appartement, achats, mariage — agrémentés de premiers poèmes.",
  },
  {
    numero: 8,
    slug: "moustawa-3",
    titre: "MOUSTAWA 3",
    cycle: "Approfondissement",
    resume: "Technologie, noms invariables, bases de conjugaison.",
    contenu:
      "Niveau qui mêle textes contemporains (technologies, communication, mois de Ramadan), étude des noms invariables (mamnūʿ min al-ṣarf), premières bases du système de conjugaison (mīzān ṣarfī), ainsi qu'un travail régulier sur la poésie.",
  },
  {
    numero: 9,
    slug: "moustawa-4",
    titre: "MOUSTAWA 4",
    cycle: "Approfondissement",
    resume: "Histoires des prophètes, poèmes, expressions arabes.",
    contenu:
      "L'apprenant aborde les récits des prophètes — notamment celui de Soulaymān ʿalayhi al-salām —, étudie deux poèmes, approfondit les noms verbaux trilitères (al-maṣādir al-thulāthiyya) et enrichit son répertoire d'expressions arabes idiomatiques.",
  },
  {
    numero: 10,
    slug: "moustawa-5",
    titre: "MOUSTAWA 5",
    cycle: "Approfondissement",
    resume: "Histoires des prophètes, grammaire avancée, figures de style.",
    contenu:
      "Série dense de récits prophétiques (Mūsā et al-Khaḍir, Dāwūd, sourate Ṣād), accompagnée d'un texte sur l'épreuve de la richesse (sourate Al-Qalam) et de deux poèmes. La grammaire couvre adjectifs, adverbes, compléments de temps et de lieu, et l'on aborde les premières figures de style.",
  },
  {
    numero: 11,
    slug: "moustawa-6",
    titre: "MOUSTAWA 6",
    cycle: "Approfondissement",
    resume: "Sourate Al-Kahf, rhétorique, interpellation.",
    contenu:
      "Étude du récit des Gens de la Caverne (sourate Al-Kahf), accompagnée de textes orientés vers la science religieuse et de poèmes consacrés à la connaissance et à la vérité. Travail approfondi sur la rhétorique arabe, l'interpellation (al-nidāʾ) et la liaison entre les mots.",
  },
  {
    numero: 12,
    slug: "moustawa-7",
    titre: "MOUSTAWA 7",
    cycle: "Approfondissement",
    resume: "Sourate Al-Qaṣaṣ, masdar, sujet et complément.",
    contenu:
      "Le récit de Mūsā et de Pharaon dans la sourate Al-Qaṣaṣ structure ce niveau, qui couvre les différentes catégories de noms verbaux (al-maṣādir), les fonctions de sujet (al-fāʿil) et de complément d'objet direct (al-mafʿūl bihi), l'expression de l'exception (al-istithnāʾ) ainsi que le groupe Kāda wa akhawātuhā.",
  },
  {
    numero: 13,
    slug: "moustawa-8",
    titre: "MOUSTAWA 8",
    cycle: "Approfondissement",
    resume: "Sourate Yūsuf, rôles grammaticaux, Ḏanna wa akhawatuha.",
    contenu:
      "Cycle entièrement consacré au récit du prophète Yūsuf, qui sert de fil conducteur pour étudier les rôles syntaxiques (sujet, complément direct, nom verbal), les cas où le khabar précède le mubtadaʾ, le groupe Ẓanna wa akhawātuhā, ainsi que les tournures exprimant la critique, l'éloge, l'étonnement et l'exclamation.",
  },
  {
    numero: 14,
    slug: "moustawa-9",
    titre: "MOUSTAWA 9",
    cycle: "Approfondissement",
    resume: "Vie du Prophète ﷺ : avant la Révélation jusqu'à Badr.",
    contenu:
      "On entre dans la sīra du Prophète ﷺ, depuis sa naissance jusqu'à la bataille de Badr. Étude des particules de génitif (ḥurūf al-jarr), des règles d'écriture de la Hamza précédée de Inna, ainsi que des différentes formes de la négation.",
  },
  {
    numero: 15,
    slug: "moustawa-10",
    titre: "MOUSTAWA 10",
    cycle: "Approfondissement",
    resume: "Vie du Prophète ﷺ : d'Ouhoud à sa mort, tanwin, diminutif.",
    contenu:
      "Suite et fin de la sīra prophétique, depuis la bataille d'Uḥud jusqu'au décès du Prophète ﷺ. Approfondissement morphologique avec les différentes catégories de tanwīn, la formation du diminutif (al-taṣghīr), la nasab (lien de filiation) et le phénomène d'al-tanāzuʿ.",
  },
];

export const cycles = ["Initiation", "Préparation", "Approfondissement"] as const;
