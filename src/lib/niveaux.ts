export type Niveau = {
  numero: number;
  slug: string;
  titre: string;
  cycle: "Initiation" | "Fondations" | "Consolidation" | "Maîtrise";
  resume: string;
};

export const niveaux: Niveau[] = [
  { numero: 1, slug: "alphabet", titre: "Alphabet & sons", cycle: "Initiation",
    resume: "Lettres, voyelles, prononciation, écriture cursive." },
  { numero: 2, slug: "lecture-syllabique", titre: "Lecture syllabique", cycle: "Initiation",
    resume: "Assemblage des sons, premiers mots, harakat." },
  { numero: 3, slug: "vocabulaire-de-base", titre: "Vocabulaire de base", cycle: "Initiation",
    resume: "300 mots usuels, dialogues simples, salutations." },
  { numero: 4, slug: "phrase-simple", titre: "La phrase simple", cycle: "Fondations",
    resume: "Phrase nominale, phrase verbale, accords basiques." },
  { numero: 5, slug: "conjugaison-i", titre: "Conjugaison I — Présent & passé", cycle: "Fondations",
    resume: "Verbe trilitère sain au māḍī et muḍāriʿ." },
  { numero: 6, slug: "ajurrumiyya-i", titre: "Ajurrumiyya I", cycle: "Fondations",
    resume: "Marfūʿāt et manṣūbāt : sujets, attributs, compléments." },
  { numero: 7, slug: "ajurrumiyya-ii", titre: "Ajurrumiyya II", cycle: "Fondations",
    resume: "Majrūrāt, particules, prépositions, exceptions." },
  { numero: 8, slug: "conjugaison-ii", titre: "Conjugaison II — Verbes irréguliers", cycle: "Consolidation",
    resume: "Verbes assimilés, creux, défectueux, doublés." },
  { numero: 9, slug: "morphologie", titre: "Morphologie (ṣarf)", cycle: "Consolidation",
    resume: "Schèmes verbaux et nominaux, dérivation racine." },
  { numero: 10, slug: "lecture-coranique-i", titre: "Lecture coranique I", cycle: "Consolidation",
    resume: "Sourates courtes : Al-Fātiḥa et juzʾ ʿAmma." },
  { numero: 11, slug: "syntaxe-avancee", titre: "Syntaxe avancée", cycle: "Consolidation",
    resume: "Subordonnées, états, exceptions, vocatif." },
  { numero: 12, slug: "lecture-coranique-ii", titre: "Lecture coranique II", cycle: "Maîtrise",
    resume: "Versets longs, exégèse linguistique de base." },
  { numero: 13, slug: "rhetorique", titre: "Rhétorique (balāgha)", cycle: "Maîtrise",
    resume: "Maʿānī, bayān, badīʿ : la beauté du discours arabe." },
  { numero: 14, slug: "textes-classiques", titre: "Textes classiques", cycle: "Maîtrise",
    resume: "Lecture commentée d'extraits du turāth." },
  { numero: 15, slug: "expression-libre", titre: "Expression libre", cycle: "Maîtrise",
    resume: "Conversation soutenue, rédaction, autonomie totale." },
];

export const cycles = ["Initiation", "Fondations", "Consolidation", "Maîtrise"] as const;
