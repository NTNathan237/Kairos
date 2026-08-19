const data = [
  {
    "id":0,
    "title": "Réorganiser mes dossiers",
    "type": "Productivité",
    "content": "Organisez vos dossiers dans votre ordinateur ou sur votre téléphone pour vous aider à trouver rapidement les informations que vous recherchez."
  },
  {
    "id":1,
    "title": "Apprendre une nouvelle langue",
    "type": "Éducation",
    "content": "Utilisez des applications telles que Duolingo ou Babbel pour apprendre une nouvelle langue et améliorer vos compétences en communication internationale."
  },
  {
    "id":6,
    "title": "Apprendre une nouvelle langue",
    "type": "Éducation",
    "content": "Utilisez des applications telles que Duolingo ou Babbel pour apprendre une nouvelle langue et améliorer vos compétences en communication internationale."
  },
  {
    "id":2,
    "title": "Faire de l'exercice régulièrement",
    "type": "Santé",
    "content": "Respectez un horaire d'exercice régulier pour améliorer votre santé physique et mentale, comme une promenade quotidienne ou des séances de musculation."
  },
  {
    "id":3,
    "title": "Créer un budget personnel",
    "type": "Finances",
    "content": "Définissez vos objectifs financiers et créez un budget pour vous aider à gérer vos dépenses et atteindre votre objectif de sécurité financière."
  },
  {
    "id":4,
    "title": "Réviser vos compétences en programmation",
    "type": "Formation",
    "content": "Utilisez des ressources en ligne telles que Codecademy ou Coursera pour améliorer vos compétences en programmation et augmenter vos chances d'emploi dans le secteur de la technologie."
  }
];

const types = [
  { libelle: 'Formation', theme: 'rgb(179,87,87)' },
  { libelle: 'Finances', theme: 'rgb(38,211,19)' },
  { libelle: 'Santé', theme: 'rgb(87,167,179)' },
  { libelle: 'Éducation', theme: 'rgb(179,179,87)' },
  { libelle: 'Productivité', theme: 'rgb(236,29,205)' },
  ]

const taches = [
  { label: 'Tache 1', jour: 'Lundi', etat: 'en_attente', id: 1 },
  { label: 'Tache 2', jour: 'Mardi', etat: 'fait', id: 2 },
  { label: 'Tâche 3', jour: 'Mercredi', etat: 'echec', id: 3 },
  { label: 'Tâche 4', jour: 'Jeudi', etat: 'en_attente', id: 4 },
  { label: 'Tâche 5', jour: 'Vendredi', etat: 'fait', id: 5 },
];

export {types, data}