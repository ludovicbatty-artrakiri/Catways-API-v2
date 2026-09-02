# Documentation API — Port de Plaisance Russell

Documentation interactive (Swagger) disponible sur `/api-docs` une fois le serveur lancé.

## Architecture

L'API suit une architecture en couches : `Route → Controller → Service → Model`.
Les controllers ne contiennent aucune logique métier ; toute la logique (requêtes MongoDB,
règles métier) est centralisée dans `services/`.

## Authentification

Toutes les routes `/catways/*` et `/users/*` nécessitent d'être authentifié.
Le token JWT est transmis soit via un cookie `token` (httpOnly, posé automatiquement au login),
soit via l'en-tête `Authorization: Bearer <token>`.

| Méthode | Route      | Description                          | Body                              |
|---------|-----------|---------------------------------------|------------------------------------|
| POST    | /login    | Authentifie l'utilisateur, pose le cookie | `{ email, password }`         |
| GET     | /logout   | Déconnexion (supprime le cookie)      | -                                  |

## Utilisateurs

| Méthode | Route            | Description                     |
|---------|------------------|----------------------------------|
| GET     | /users           | Liste tous les utilisateurs      |
| GET     | /users/:email    | Détails d'un utilisateur         |
| POST    | /users           | Crée un utilisateur              |
| PUT     | /users/:email    | Modifie un utilisateur           |
| DELETE  | /users/:email    | Supprime un utilisateur          |

## Catways

| Méthode | Route            | Description                                  |
|---------|------------------|-----------------------------------------------|
| GET     | /catways         | Liste tous les catways                         |
| GET     | /catways/:id     | Détails d'un catway (`id` = catwayNumber)       |
| POST    | /catways         | Crée un catway                                  |
| PUT     | /catways/:id     | Modifie l'état d'un catway (seul `catwayState` est modifiable) |
| DELETE  | /catways/:id     | Supprime un catway                              |

## Réservations (sous-ressource de catway)

| Méthode | Route                                        | Description                        |
|---------|-----------------------------------------------|-------------------------------------|
| GET     | /catways/:id/reservations                     | Liste les réservations d'un catway  |
| GET     | /catways/:id/reservations/:idReservation      | Détails d'une réservation           |
| POST    | /catways/:id/reservations                     | Crée une réservation                |
| PUT     | /catways/:id/reservations/:idReservation      | Modifie une réservation             |
| DELETE  | /catways/:id/reservations/:idReservation      | Supprime une réservation            |

> Note : le brief mentionne aussi `PUT /catways/:id/reservations` (sans id de réservation).
> Cette route existe également dans le code pour respecter le brief à la lettre, mais elle est
> moins RESTful — préférez la route avec `:idReservation` en pratique.

## Exemples de requêtes

### Connexion
```
POST /login
Content-Type: application/json

{ "email": "admin@russell-port.fr", "password": "motdepasse123" }
```

### Créer un catway
```
POST /catways
Content-Type: application/json
Cookie: token=...

{ "catwayNumber": 6, "catwayType": "long", "catwayState": "bon état" }
```

### Créer une réservation
```
POST /catways/6/reservations
Content-Type: application/json
Cookie: token=...

{
  "clientName": "Paul Martin",
  "boatName": "Le Cormoran",
  "startDate": "2026-08-01",
  "endDate": "2026-08-05"
}
```

## Codes de réponse

- `200` OK
- `201` Créé
- `400` Erreur de validation
- `401` Non authentifié / identifiants invalides
- `404` Ressource introuvable
- `409` Conflit (doublon, ex : email ou catwayNumber déjà utilisé)
- `500` Erreur serveur

## Routes additionnelles (usage frontend uniquement)

Ces routes ne font pas partie du brief initial mais facilitent le frontend statique :

| Méthode | Route                      | Description                                  |
|---------|-----------------------------|-----------------------------------------------|
| GET     | /api/me                    | Infos de l'utilisateur connecté (pour le menu/dashboard) |
| GET     | /api/reservations          | Toutes les réservations, tous catways confondus |
| GET     | /api/reservations/current  | Réservations en cours aujourd'hui (dashboard) |
