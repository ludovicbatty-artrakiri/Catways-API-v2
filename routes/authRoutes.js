const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Routes d'authentification (login / logout).
 * @module routes/authRoutes
 */
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentifie un utilisateur et renvoie un token JWT (cookie httpOnly)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Connexion réussie }
 *       401: { description: Identifiants invalides }
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Déconnecte l'utilisateur (supprime le cookie de session)
 *     tags: [Auth]
 *     responses:
 *       200: { description: Déconnexion réussie }
 */
router.get('/logout', authController.logout);

module.exports = router;
