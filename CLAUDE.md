# Institut Al-Irtiqā' — Site web premium

## Vue d'ensemble
Site vitrine + outil pour un institut d'apprentissage de la langue arabe (méthode égyptienne).
Cible : francophones (France + Maghreb + Europe). Cours 100% en ligne via Zoom.

## Stack technique
- **Framework** : Next.js 14 (App Router)
- **Styling** : TailwindCSS
- **Animations** : Framer Motion
- **Base de données** : Neon (PostgreSQL serverless, free tier)
- **Auth admin** : NextAuth Credentials + bcrypt
- **Mail** : SMTP Hostinger via nodemailer
- **Validation** : Zod
- **Déploiement** : Vercel (preview + prod)
- **Domaine** : institut-alirtiqa.com (acheté sur Hostinger)
- **Hostinger Business** : domaine + mail SMTP uniquement (pas l'hébergement Node)

## Design system
- **Couleurs** : bleu nuit (#0A1A3F), doré (#C9A961), blanc cassé (#FAF7F0)
- **Fonts** : Cinzel (titres) + Inter (corps) — Google Fonts
- **Ambiance** : sérieux, élégant, moderne, premium
- **Pattern** : arabesque dorée subtile en background SVG
- **Animations** : fluides, ≤ 300ms, respectent prefers-reduced-motion

## Architecture des pages

### Public
- `/` Home (hero, méthode, 15 niveaux, programmes, tarifs, CTA)
- `/a-propos`
- `/programme` + `/programme/[niveau]` (15 pages SEO)
- `/methode-egyptienne` (page niche SEO)
- `/tarifs`
- `/test-de-niveau` + `/test-de-niveau/resultat/[id]`
- `/inscription`
- `/contact`
- `/blog` + `/blog/[slug]` (phase 5)
- `/merci`, `/mentions-legales`, `/confidentialite`

### Admin (phase 3)
- `/admin/login`
- `/admin/dashboard`
- `/admin/inscriptions`
- `/admin/tests`
- `/admin/pdfs`
- `/admin/contenu` (CMS léger)
- `/admin/questions` (CRUD quiz)
- `/admin/stats`

## Roadmap par phases

### Phase 1 — Fondations + site vitrine (EN COURS)
- [ ] Setup Next.js + Tailwind + Framer Motion
- [ ] Design system (colors, fonts, components UI de base)
- [ ] Page d'accueil premium avec animations
- [ ] Pages programme + tarifs (statiques)
- [ ] Formulaire inscription basique (mailto + WhatsApp deep-link)
- [ ] SEO de base (meta, sitemap, robots, JSON-LD EducationalOrganization)
- [ ] Déploiement Vercel preview

### Phase 2 — Test de niveau
- Quiz adaptatif "ladder" (niveau ±1 selon réponses, 15 niveaux)
- Pool ~150 questions en BDD, 6 catégories
- Stockage Neon (test_attempts + test_answers + questions)
- Page résultat avec OG image dynamique partageable
- Email auto admin

### Phase 3 — Dashboard admin
- Auth NextAuth + bcrypt
- KPI cards, tables filtrables, export CSV
- Upload PDFs
- CMS léger pour textes
- CRUD questions du quiz

### Phase 4 — SEO & polish
- Sitemap, JSON-LD, OG dynamiques, blog setup, chatbot règles, Lighthouse > 95

### Phase 5 — Différenciants
- i18n FR/AR avec RTL
- PWA installable
- Système parrainage
- Quiz quotidien home
- Newsletter SMTP

## Structure DB Neon (PostgreSQL)
Tables : `admins`, `questions`, `test_attempts`, `test_answers`, `inscriptions`, `pdfs`, `content_blocks`, `visitors_log`, `newsletter_subscribers`, `audit_log`.
Détails complets dans le plan initial.

## Logique du test de niveau
- Algorithme adaptatif "ladder", démarrage niveau 3
- Bonne réponse → +1, mauvaise → -1, bornes [1,15]
- Stop : 15 questions OU stabilisation (3 oscillations)
- Niveau final = médiane des 5 dernières positions
- Forces/faiblesses par catégorie
- 1 question par écran, autosave localStorage, support clavier

## Mots-clés SEO cibles
apprendre arabe, cours arabe en ligne, institut arabe, grammaire arabe,
Al-Furqan, Ajurrumiyya, méthode égyptienne, arabe coranique

## Contact institut
- WhatsApp : 06 50 84 97 38
- Mail : al-irtiqa@outlook.com
- Telegram : @Alirtiqafilougha_cours_arabes
- Cours sur Zoom

## Tarifs
- Cours particulier : 72 € / 8h par mois
- Cours en duo : 63 € / 8h par mois
- Cours en groupe (≥3) : 50 € / 8h par mois
- Frais d'inscription : 10 € (fournitures)
- Public : enfants à partir de 10 ans + adultes

## Branche Git
`claude/plan-arabic-institute-site-hDcAu`

## Décisions importantes
- DB sur Neon (pas MySQL Hostinger) → meilleure DX, branching, free tier
- Hosting sur Vercel (pas Hostinger Node) → CI/CD auto, preview URLs
- Hostinger uniquement pour domaine + SMTP
- Pas d'IA payante : test = algo, chatbot = arbre de décision
- 100% gratuit côté services
