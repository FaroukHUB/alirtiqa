-- Admins (modérateurs / gestion du dashboard)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Avis (témoignages élèves, modérés depuis le dashboard)
CREATE TABLE IF NOT EXISTS avis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
  texte TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'pending' CHECK (statut IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  moderated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_avis_statut ON avis(statut);
CREATE INDEX IF NOT EXISTS idx_avis_created_at ON avis(created_at DESC);

-- Chatbot — log des messages pour rate limiting par IP (nettoyage automatique > 7 jours)
CREATE TABLE IF NOT EXISTS chatbot_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_log_ip_created ON chatbot_log(ip, created_at DESC);

-- Inscriptions (demandes d'inscription depuis le formulaire public, suivi pipeline)
CREATE TABLE IF NOT EXISTS inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  age TEXT,
  formule TEXT NOT NULL CHECK (formule IN ('particulier', 'duo', 'groupe')),
  niveau TEXT,
  disponibilite TEXT,
  message TEXT,
  statut TEXT NOT NULL DEFAULT 'nouveau'
    CHECK (statut IN ('nouveau', 'contacte', 'essai', 'inscrit', 'refus', 'sans_suite')),
  note_admin TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inscriptions_statut ON inscriptions(statut);
CREATE INDEX IF NOT EXISTS idx_inscriptions_created_at ON inscriptions(created_at DESC);

-- Questions du test de niveau (pool, modéré par l'admin avant publication)
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('qcm', 'vf')),
  enonce TEXT NOT NULL,
  arabe TEXT,
  choix JSONB NOT NULL,
  bonne_reponse INT NOT NULL,
  explication TEXT,
  niveau INT NOT NULL CHECK (niveau BETWEEN 1 AND 15),
  categorie TEXT NOT NULL
    CHECK (categorie IN ('vocabulaire', 'grammaire', 'sarf', 'lecture', 'comprehension', 'coran')),
  statut TEXT NOT NULL DEFAULT 'draft'
    CHECK (statut IN ('draft', 'published', 'archived')),
  source TEXT NOT NULL DEFAULT 'manuel'
    CHECK (source IN ('manuel', 'ia_seed', 'ia_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_statut ON questions(statut);
CREATE INDEX IF NOT EXISTS idx_questions_niveau_categorie ON questions(niveau, categorie);
CREATE INDEX IF NOT EXISTS idx_questions_published_pool ON questions(niveau, categorie) WHERE statut = 'published';

-- Tentatives de test (1 par session de test)
CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_level INT NOT NULL DEFAULT 3,
  niveau_final INT,
  finished_at TIMESTAMPTZ,
  prenom TEXT,
  email TEXT,
  telephone TEXT,
  age TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_attempts_created_at ON test_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_attempts_finished ON test_attempts(finished_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_test_attempts_email ON test_attempts(email) WHERE email IS NOT NULL;

-- Réponses individuelles d'une tentative
CREATE TABLE IF NOT EXISTS test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  level_at_time INT NOT NULL,
  categorie TEXT NOT NULL,
  choix_donne INT NOT NULL,
  est_correcte BOOLEAN NOT NULL,
  ordre INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_answers_attempt_ordre ON test_answers(attempt_id, ordre);
