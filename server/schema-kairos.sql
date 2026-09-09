-- ============================================
-- Schéma de base de données — Kairos
-- Reconstruit à partir des requêtes SQL du backend Express
-- ============================================

-- Table des types d'objectifs (catégories)
CREATE TABLE type (
    id_type SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL
);

-- Table des objectifs (suivi long terme)
CREATE TABLE objectif (
    id_objectif SERIAL PRIMARY KEY,
    libelle     VARCHAR(255) NOT NULL,
    type        VARCHAR(255) NOT NULL,  -- ⚠️ voir note ci-dessous
    etat        VARCHAR(50) NOT NULL DEFAULT 'en_attente'
);

-- Table des tâches réutilisables (le "template")
CREATE TABLE tache (
    id_tache SERIAL PRIMARY KEY,
    libelle  VARCHAR(255) NOT NULL
);

-- Table des semaines (grille hebdomadaire)
CREATE TABLE semaine (
    id_semaine  SERIAL PRIMARY KEY,
    date        DATE NOT NULL,
    note        INTEGER,
    nbre_taches INTEGER
);

-- Table des assignations (instance d'une tâche sur un jour donné)
CREATE TABLE assignation (
    id_ass      SERIAL PRIMARY KEY,
    libelle     VARCHAR(255) NOT NULL,
    jour        VARCHAR(20) NOT NULL,   -- 'Lundi', 'Mardi', ...
    id_semaine  INTEGER NOT NULL REFERENCES semaine(id_semaine) ON DELETE CASCADE,
    id_tache    INTEGER REFERENCES tache(id_tache) ON DELETE CASCADE,
    etat        VARCHAR(50) NOT NULL DEFAULT 'en_attente'
);

-- Index utiles pour les lectures fréquentes
CREATE INDEX idx_assignation_semaine ON assignation(id_semaine);
CREATE INDEX idx_assignation_tache ON assignation(id_tache);
