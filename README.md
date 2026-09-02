# API Catway — Port de Plaisance Russell

Application web (API Express + MongoDB + frontend EJS) de gestion des réservations
de catways pour la capitainerie du port de plaisance de Russell.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Import des données](#import-des-données)
- [Créer un premier compte](#créer-un-premier-compte)
- [Lancement](#lancement)
- [Routes de l'application](#routes-de-lapplication)
- [Documentation de l'API](#documentation-de-lapi)
- [Déploiement](#déploiement)
- [Versioning / Git](#versioning--git)

## Fonctionnalités

- Authentification par JWT (cookie httpOnly) — l'utilisateur n'a pas besoin de se reconnecter à chaque requête (session valable 24h)
- CRUD complet : utilisateurs, catways, réservations (sous-ressource des catways)
- Page d'accueil publique (présentation + connexion + lien vers la doc)
- Tableau de bord protégé (infos utilisateur, date du jour, réservations en cours chargées de façon asynchrone via l'API)
- Pages CRUD dédiées (catways / réservations / utilisateurs), protégées côté serveur
- Documentation Swagger interactive (`/api-docs`)
- Toutes les données sensibles (secrets, URI MongoDB) sont dans `.env`, jamais commitées

## Technologies utilisées

| Catégorie       | Choix                                          |
|-----------------|--------------------------------------------------|
| Serveur         | Node.js, Express                                  |
| Base de données | MongoDB + Mongoose (ODM)                          |
| Authentification| JSON Web Token (JWT) + cookie httpOnly, bcryptjs (hash des mots de passe) |
| Moteur de templates | EJS                                          |
| Documentation   | Swagger (swagger-jsdoc + swagger-ui-express) + JSDoc dans le code |

## Architecture du projet

Le projet suit une architecture en couches, avec une **séparation stricte des responsabilités** :
les controllers ne contiennent aucune logique métier et ne touchent jamais directement
aux modèles Mongoose — ils délèguent systématiquement aux services.

```
Route  →  Controller (HTTP : req/res)  →  Service (logique métier)  →  Model (Mongoose / MongoDB)
```

```
catway-api/
├── server.js              # point d'entrée
├── app.js                 # configuration Express
├── config/
│   ├── db.js               # connexion MongoDB
│   └── swagger.js          # config Swagger
├── models/                 # schémas Mongoose (User, Catway, Reservation)
├── services/                # LOGIQUE MÉTIER — seule couche autorisée à appeler les models
│   ├── authService.js
│   ├── userService.js
│   ├── catwayService.js
│   └── reservationService.js
├── controllers/             # logique HTTP uniquement (req/res), appelle les services
├── routes/                  # authRoutes, userRoutes, catwayRoutes, apiRoutes, viewRoutes
├── middlewares/              # auth JWT (API + vues), gestion d'erreurs
├── views/                    # pages EJS (frontend, rendu côté serveur)
│   ├── partials/               # head.ejs, menu.ejs (réutilisés sur toutes les pages)
│   ├── index.ejs, dashboard.ejs, catways.ejs, reservations.ejs, users.ejs
├── public/                   # CSS + JS statique (interactions CRUD via fetch)
├── data/                     # catways.json / reservations.json (fournis avec le sujet)
├── scripts/
│   └── createAdmin.js        # crée un premier utilisateur
└── docs/
    └── API_DOCUMENTATION.md
```

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- Une instance MongoDB accessible : locale ([MongoDB Community](https://www.mongodb.com/try/download/community))
  ou dans le cloud ([MongoDB Atlas](https://www.mongodb.com/atlas), offre gratuite M0)

## Installation

```bash
git clone <url-de-votre-depot>
cd catway-api
npm install
```

## Configuration

Copiez le fichier d'exemple puis renseignez vos propres valeurs :

```bash
cp .env.example .env
```

| Variable          | Description                                         |
|-------------------|------------------------------------------------------|
| `PORT`            | Port d'écoute du serveur (3000 par défaut)            |
| `MONGODB_URI`     | Chaîne de connexion MongoDB                           |
| `JWT_SECRET`      | Secret utilisé pour signer les tokens JWT (à changer !) |
| `JWT_EXPIRES_IN`  | Durée de validité du token (ex : `24h`)                |
| `NODE_ENV`        | `development` ou `production`                         |

> ⚠️ Le fichier `.env` n'est jamais commité (il est dans `.gitignore`). Seul `.env.example`,
> qui ne contient aucune valeur réelle, est versionné.

## Import des données

Les fichiers `data/catways.json` (24 catways) et `data/reservations.json` (6 réservations)
fournis avec le sujet sont inclus dans le projet. Importez-les dans MongoDB :

```bash
mongoimport --jsonArray --db catway-db --collection catways --file data/catways.json
mongoimport --jsonArray --db catway-db --collection reservations --file data/reservations.json
```

(ou utilisez [Mongo Compass](https://www.mongodb.com/products/compass) en import graphique)

> Remarque : les réservations fournies datent de 2024, donc antérieures à aujourd'hui.
> Le tableau de bord n'affiche que les réservations "en cours" (startDate ≤ aujourd'hui ≤ endDate) :
> il sera donc vide tant que vous n'ajoutez pas une réservation avec des dates actuelles/futures.

## Créer un premier compte

```bash
node scripts/createAdmin.js capitainerie admin@russell-port.fr MotDePasse123
```

## Lancement

```bash
npm run dev     # avec nodemon (rechargement auto)
# ou
npm start
```

Le terminal doit afficher :
```
MongoDB connecté avec succès
Serveur démarré sur http://localhost:3000
```

Puis ouvrez :
- `http://localhost:3000/` → page d'accueil / connexion
- `http://localhost:3000/dashboard` → tableau de bord (après connexion)
- `http://localhost:3000/api-docs` → documentation Swagger

> Si "MongoDB connecté avec succès" ne s'affiche pas, le serveur ne pourra pas fonctionner :
> vérifiez que MongoDB tourne bien et que `MONGODB_URI` dans `.env` est correct.

## Routes de l'application

### Pages (frontend)

| Méthode | Route              | Description                          | Accès      |
|---------|---------------------|----------------------------------------|------------|
| GET     | /                   | Accueil + formulaire de connexion       | Public     |
| GET     | /dashboard          | Tableau de bord                         | Protégé    |
| GET     | /catways-page       | Gestion CRUD des catways                 | Protégé    |
| GET     | /reservations-page  | Gestion CRUD des réservations             | Protégé    |
| GET     | /users-page         | Gestion CRUD des utilisateurs             | Protégé    |
| GET     | /api-docs           | Documentation Swagger interactive        | Public     |

### API

Voir le détail complet dans [`docs/API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md)
ou la version interactive sur `/api-docs`. Résumé :

| Méthode | Route                                        |
|---------|------------------------------------------------|
| POST    | /login                                          |
| GET     | /logout                                         |
| GET / POST | /users                                       |
| GET / PUT / DELETE | /users/:email                        |
| GET / POST | /catways                                     |
| GET / PUT / DELETE | /catways/:id                         |
| GET / POST | /catways/:id/reservations                    |
| GET / PUT / DELETE | /catways/:id/reservations/:idReservation |

## Documentation de l'API

- Interactive : `http://localhost:3000/api-docs` (générée automatiquement depuis les
  annotations `@swagger` présentes dans `routes/*.js`)
- Écrite : [`docs/API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md)
- Le code est également commenté avec **JSDoc** (models, services, controllers, middlewares)

## Déploiement

Guide pas à pas (Render + MongoDB Atlas, les deux gratuits) :

1. **MongoDB Atlas** : créer un cluster gratuit (M0) sur [mongodb.com/atlas](https://www.mongodb.com/atlas),
   créer un utilisateur de base de données, autoriser l'accès réseau depuis `0.0.0.0/0`,
   puis récupérer la chaîne de connexion (`Connect` → `Drivers`).
2. **Importer les données** vers Atlas :
   ```bash
   mongoimport --uri "<votre-uri-atlas>" --collection catways --file data/catways.json --jsonArray
   mongoimport --uri "<votre-uri-atlas>" --collection reservations --file data/reservations.json --jsonArray
   ```
3. **Pousser le code sur GitHub** (voir section [Versioning / Git](#versioning--git)).
4. **Render** : créer un compte sur [render.com](https://render.com), puis `New +` → `Web Service`
   et sélectionner le dépôt GitHub.
5. **Configuration du service** :
   - Build Command : `npm install`
   - Start Command : `npm start`
   - Plan : Free
6. **Variables d'environnement** (dans Render, onglet Environment) :

   | Variable         | Valeur                                   |
   |------------------|--------------------------------------------|
   | `MONGODB_URI`    | La chaîne de connexion Atlas (avec mot de passe) |
   | `JWT_SECRET`     | Une chaîne aléatoire longue, différente de celle en local |
   | `JWT_EXPIRES_IN` | `24h`                                       |
   | `NODE_ENV`       | `production`                                |

   (Ne pas définir `PORT` : Render le fournit automatiquement.)
7. **Déployer**, puis vérifier dans les logs Render que `MongoDB connecté avec succès` s'affiche.
8. **Créer le compte de démonstration** via l'onglet "Shell" de Render :
   ```bash
   node scripts/createAdmin.js capitainerie admin@russell-port.fr MotDePasse123
   ```
9. **Tester** l'URL fournie par Render (`https://votre-app.onrender.com`). Sur le plan gratuit,
   le service se met en veille après inactivité : le premier chargement peut prendre 30 à 60 secondes.

## Versioning / Git

Pour un historique de commits propre (à privilégier plutôt que "Add files via upload"
sur l'interface web de GitHub, qui crée un commit unique et ne reflète pas votre travail) :

```bash
git init
git add .
git commit -m "Initial commit - structure du projet"
git branch -M main
git remote add origin <url-de-votre-repo>
git push -u origin main
```

Puis, pour chaque évolution, faites des commits réguliers et explicites au fur et à mesure
du développement (ex : `git commit -m "Ajout du CRUD catways"`,
`git commit -m "Ajout de l'authentification JWT"`, etc.) plutôt qu'un seul gros commit final.
