const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

/**
 * Route temporaire permettant de créer le premier compte administrateur
 * sans avoir besoin d'un accès Shell (indisponible sur le plan gratuit Render).
 * Protégée par un secret défini dans la variable d'environnement SETUP_SECRET.
 *
 * ⚠️ À utiliser une seule fois après le déploiement, puis à retirer de
 * l'environnement (supprimer SETUP_SECRET dans Render) une fois le compte créé.
 * @module routes/setupRoutes
 */

/**
 * GET /setup-admin?secret=...&username=...&email=...&password=...
 * Crée un utilisateur si le secret fourni correspond à SETUP_SECRET.
 */
router.get('/setup-admin', async (req, res, next) => {
  try {
    if (!process.env.SETUP_SECRET) {
      return res.status(403).json({ message: 'Route désactivée (SETUP_SECRET non configuré)' });
    }

    const { secret, username, email, password } = req.query;

    if (secret !== process.env.SETUP_SECRET) {
      return res.status(403).json({ message: 'Secret invalide' });
    }

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Paramètres manquants',
        usage: '/setup-admin?secret=VOTRE_SECRET&username=admin&email=admin@russell-port.fr&password=MotDePasse123',
      });
    }

    const existing = await userService.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà', email });
    }

    const user = await userService.createUser({ username, email, password });
    res.status(201).json({
      message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.',
      user,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
