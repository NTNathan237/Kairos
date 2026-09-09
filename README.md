# Kairos

Application de planification de tâches et de suivi d'objectifs, pensée pour organiser sa semaine (tâches) et sa progression sur le long terme (objectifs) en un seul endroit.

Premier projet d'une suite de cinq applications de productivité personnelle, destinées à terme à converger vers un dashboard unifié.

## Aperçu

Kairos distingue deux échelles de temps :

- **Les tâches** — organisées sur une grille hebdomadaire (semaine × jour), déplaçables par glisser-déposer, avec un statut évolutif (En attente / Fait / Échec)
- **Les objectifs** — suivis sur le plus long terme, classés par type, indépendants du rythme hebdomadaire

## Fonctionnalités

- 📅 Grille hebdomadaire avec vue par semaine (lundi à dimanche)
- 🖱️ Glisser-déposer des tâches vers un jour précis (via `dnd-kit`)
- 🔁 Tâches réutilisables — une même tâche peut être assignée à plusieurs jours sans duplication
- 🎯 Suivi d'objectifs, catégorisés par type personnalisable
- 🟢🔵🔴 Statuts visuels (Fait / En attente / Échec) sur tâches et objectifs
- 📊 Score de progression par semaine (tâches accomplies / tâches prévues)
- 💾 Persistance complète des données via une API REST connectée à PostgreSQL

## Stack technique

**Frontend**
- React 19 + Vite
- Tailwind CSS
- [`@dnd-kit/core`](https://dndkit.com/) pour le glisser-déposer

**Backend**
- Node.js + Express
- PostgreSQL (`pg`)
- API REST (routes `taches`, `objectifs`, `types`, `semaines`, `assignations`)

## Structure du projet

```
Kairos/
├── src/
│   ├── App.jsx              # Point d'entrée, état global, DndContext
│   ├── objectiveView.jsx    # Vue et gestion des objectifs
│   ├── weekView.jsx         # Grille hebdomadaire
│   ├── tasksView.jsx        # Panneau des tâches réutilisables (source du drag)
│   ├── components/          # Composants partagés
│   └── assets/              # Données statiques, icônes
├── server/
│   ├── index.js             # Point d'entrée du serveur Express
│   └── config/
│       ├── db.js            # Connexion PostgreSQL
│       └── cors.js          # Configuration Cors
└── README.md
```

## Modèle de données

Le cœur du modèle repose sur une séparation entre **tâche** (le modèle réutilisable) et **assignation** (son instance placée sur un jour donné) :

| Table | Rôle |
|---|---|
| `taches` | Tâches réutilisables (libellé) |
| `assignations` | Instance d'une tâche sur un jour/semaine donné, avec son propre statut |
| `objectifs` | Objectifs long terme, liés à un type |
| `types` | Catégories d'objectifs |
| `semaines` | Métadonnées de chaque semaine (score, nombre de tâches) |

## Installation

### Prérequis
- Node.js
- PostgreSQL

### Backend

```bash
cd server
npm install
```

Configurer la connexion à la base dans `server/config/db.js`, puis :

```bash
node index.js
```

Le serveur démarre par défaut sur `http://localhost:3000`.

### Frontend

```bash
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.


## Limitations connues

- Pas d'authentification — l'application est actuellement mono-utilisateur
- Pas de tests automatisés
- Interface non responsive (pensée pour un usage desktop)

## Suite du projet

Kairos est le premier maillon d'une suite de cinq applications (Kairos, My Fitness, Eureka, Second Gear, RelShip), destinées à être unifiées dans un dashboard personnel commun.

## Auteur

GGX