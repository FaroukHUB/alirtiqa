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
