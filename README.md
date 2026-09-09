# Kairos

**Application web de planification hebdomadaire de tâches et de suivi d'objectifs**

Kairos est une application de productivité personnelle qui permet d'organiser sa semaine à court terme (tâches) et de suivre sa progression à long terme (objectifs) en un seul endroit. Pensée pour un usage desktop, elle combine une grille hebdomadaire interactive avec un système de suivi d'objectifs catégorisés.

Premier projet d'une suite de cinq applications destinées à converger vers un dashboard unifié.

---

## 🎯 Aperçu

Kairos distingue deux échelles de temps :

- **Les tâches** — organisées sur une grille hebdomadaire (semaine × jour), déplaçables par glisser-déposer, avec un statut évolutif (En attente / Fait / Échec)
- **Les objectifs** — suivis sur le long terme, classés par type personnalisable, indépendants du rythme hebdomadaire

---

## ✨ Fonctionnalités

- 📅 **Grille hebdomadaire** avec vue par semaine (lundi à dimanche)
- 🖱️ **Glisser-déposer** interactif des tâches vers un jour précis (via `@dnd-kit`)
- 🔁 **Tâches réutilisables** — une même tâche peut être assignée à plusieurs jours sans duplication
- 🎯 **Suivi d'objectifs** catégorisés par type personnalisable
- 🟢🔵🔴 **Statuts visuels** (Fait / En attente / Échec) sur tâches et objectifs
- 📊 **Score de progression** par semaine (tâches accomplies / tâches prévues)
- 💾 **Persistance complète** des données via une API REST connectée à PostgreSQL

---

## 🛠️ Stack technique

### Frontend
- **React 19** + Vite
- **Tailwind CSS** pour le styling
- **@dnd-kit/core** pour le glisser-déposer
- **Shadcn/ui** & **Radix UI** pour les composants
- **Lucide React** pour les icônes

### Backend
- **Node.js** + Express
- **PostgreSQL** avec `pg` et `pg-promise`
- **API REST** (routes : `taches`, `objectifs`, `types`, `semaines`, `assignations`)
- **Authentication** avec JWT et bcryptjs
- **WebSocket** support via Socket.IO

---

## 📁 Structure du projet

```
Kairos/
├── src/                         # Frontend React (Vite)
│   ├── App.jsx                  # Point d'entrée, état global, DndContext
│   ├── weekView.jsx             # Grille hebdomadaire
│   ├── tasksView.jsx            # Panneau des tâches réutilisables (source du drag)
│   ├── objectiveView.jsx        # Vue et gestion des objectifs
│   ├── components/              # Composants réutilisables
│   └── assets/                  # Données statiques, icônes
│
├── server/                      # Backend Express
│   ├── index.js                 # Point d'entrée du serveur
│   ├── config/                  # Configuration
│   │   ├── db.js                # Connexion PostgreSQL
│   │   └── cors.js              # Configuration CORS
│   ├── routes/                  # Routes API
│   │   ├── authRoutes.js        # Authentification
│   │   └── crud/                # CRUD pour tâches, objectifs, etc.
│   ├── middlewares/             # Middlewares Express
│   └── package.json             # Dépendances backend
│
├── package.json                 # Dépendances frontend
├── vite.config.js               # Configuration Vite
├── tailwind.config.js           # Configuration Tailwind CSS
├── index.html                   # Point d'entrée HTML
└── README.md                    # Documentation
```

---

## 🔗 Fonctionnement global

L'application fonctionne selon ce flux :

1. **Chargement initial** — Au démarrage, l'application charge toutes les assignations depuis `/kairos/assignation`
2. **Glisser-déposer** — L'utilisateur drag-and-drop une tâche du panneau latéral vers un jour de la grille
3. **Création d'assignation** — Un POST vers `/kairos/assignation` crée le lien entre la tâche et le jour
4. **Mise à jour de l'état** — L'état local (React) est synchronisé avec la base de données PostgreSQL

Le contexte **DndContext** de `@dnd-kit` encapsule toute l'application pour gérer les interactions de drag-and-drop.

---

## 🗄️ Modèle de données

| Table | Rôle |
|---|---|
| `taches` | Tâches réutilisables (libellé) |
| `assignations` | Instance d'une tâche sur un jour/semaine donné, avec statut propre |
| `objectifs` | Objectifs long terme, liés à un type |
| `types` | Catégories d'objectifs (personnalisables) |
| `semaines` | Métadonnées de chaque semaine (score, nombre de tâches) |

---

## 🚀 Installation et démarrage

### Prérequis
- **Node.js** (v18+)
- **PostgreSQL** (v12+)

### Backend

```bash
cd server
npm install
```

Configurer la connexion à la base de données dans `server/config/db.js` :

```javascript
const db = new pgPromise.Database({
  user: 'votre_utilisateur',
  password: 'votre_mdp',
  host: 'localhost',
  port: 5432,
  database: 'kairos'
});
```

Puis démarrer le serveur :

```bash
npm start
```

Le serveur démarre par défaut sur `http://localhost:3000`.

### Frontend

```bash
npm install
npm run dev
```

L'application React est accessible sur `http://localhost:5173`.

### Build pour la production

```bash
npm run build
```

---

## 📝 API Endpoints

### Authentification
- `POST /kairos/auth/login` — Connexion utilisateur
- `POST /kairos/auth/register` — Création de compte

### Tâches
- `GET /kairos/tache` — Récupérer toutes les tâches
- `POST /kairos/tache` — Créer une nouvelle tâche
- `PUT /kairos/tache/:id` — Modifier une tâche
- `DELETE /kairos/tache/:id` — Supprimer une tâche

### Assignations
- `GET /kairos/assignation` — Récupérer toutes les assignations
- `POST /kairos/assignation` — Créer une assignation (drag-drop)
- `PUT /kairos/assignation/:id` — Modifier le statut d'une assignation
- `DELETE /kairos/assignation/:id` — Supprimer une assignation

### Objectifs
- `GET /kairos/objectif` — Récupérer tous les objectifs
- `POST /kairos/objectif` — Créer un objectif
- `PUT /kairos/objectif/:id` — Modifier un objectif
- `DELETE /kairos/objectif/:id` — Supprimer un objectif

### Autres
- `GET /kairos/types` — Récupérer les types d'objectifs
- `GET /kairos/semaines` — Récupérer les métadonnées des semaines

---

## ⚠️ Limitations connues

- **Pas d'authentification utilisateur** — L'application est actuellement mono-utilisateur
- **Pas de tests automatisés** — Aucune suite de tests
- **Interface non responsive** — Conçue pour une utilisation desktop
- **Pas de versioning des données** — Aucun historique des modifications

---

## 🔮 Suite du projet

Kairos est le premier maillon d'une suite de cinq applications :
1. **Kairos** — Planification hebdomadaire (ce projet)
2. **My Fitness** — Suivi d'entraînement
3. **Eureka** — Gestion d'idées et créativité
4. **Second Gear** — Suivi de projet personnel
5. **RelShip** — Gestion des relations personnelles

Ces applications seront unifiées dans un **dashboard personnel commun**.

---

## 👤 Auteur

**NTNathan_237** (avec contributeur GGX)

---

## 📜 Licence

ISC

---

## 🤝 Contribuer

Les contributions sont bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nom-feature`)
3. Committer vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

## 💡 Prochaines étapes suggérées

- Ajouter l'authentification multi-utilisateur
- Mettre en place une suite de tests (Jest, Vitest)
- Rendre l'interface responsive (mobile/tablet)
- Ajouter la synchronisation en temps réel (WebSocket)
- Créer une intégration avec les autres applications de la suite
