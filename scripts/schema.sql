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
