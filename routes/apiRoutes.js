const express = require('express');
const router = express.Router();
const { authenticateAPI } = require('../middlewares/auth');
const reservationController = require('../controllers/reservationController');

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Renvoie les informations de l'utilisateur actuellement connecté
 *     tags: [Auth]
 *     responses:
 *       200: { description: Utilisateur connecté }
 *       401: { description: Non authentifié }
 */
router.get('/me', authenticateAPI, (req, res) => {
  res.status(200).json(req.user);
});

/**
 * @swagger
 * /api/reservations/current:
 *   get:
 *     summary: Liste toutes les réservations en cours aujourd'hui (tous catways confondus)
 *     tags: [Reservations]
 *     responses:
 *       200: { description: Liste des réservations en cours }
 */
router.get('/reservations/current', authenticateAPI, reservationController.getCurrentReservations);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Liste toutes les réservations, tous catways confondus
 *     tags: [Reservations]
 *     responses:
 *       200: { description: Liste complète des réservations }
 */
router.get('/reservations', authenticateAPI, reservationController.getAllReservations);

module.exports = router;
