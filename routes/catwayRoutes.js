const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const reservationController = require('../controllers/reservationController');
const { authenticateAPI } = require('../middlewares/auth');

/**
 * Routes CRUD pour la gestion des catways et de leurs réservations (sous-ressource).
 * @module routes/catwayRoutes
 */

router.use(authenticateAPI);

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *   post:
 *     summary: Crée un catway
 *     tags: [Catways]
 */
router.get('/', catwayController.getAllCatways);
router.post('/', catwayController.createCatway);

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Détails d'un catway
 *     tags: [Catways]
 *   put:
 *     summary: Modifie l'état d'un catway
 *     tags: [Catways]
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 */
router.get('/:id', catwayController.getCatwayById);
router.put('/:id', catwayController.updateCatway);
router.delete('/:id', catwayController.deleteCatway);

// --- Sous-ressource: réservations d'un catway ---

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Liste les réservations d'un catway
 *     tags: [Reservations]
 *   post:
 *     summary: Crée une réservation pour un catway
 *     tags: [Reservations]
 */
router.get('/:id/reservations', reservationController.getAllReservationsForCatway);
router.post('/:id/reservations', reservationController.createReservation);
// Route de mise à jour telle que spécifiée dans le brief (sans id de réservation dans l'URL)
router.put('/:id/reservations', reservationController.updateReservation);

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Détails d'une réservation
 *     tags: [Reservations]
 *   put:
 *     summary: Modifie une réservation (recommandé, plus RESTful que la route sans id)
 *     tags: [Reservations]
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Reservations]
 */
router.get('/:id/reservations/:idReservation', reservationController.getReservationById);
router.put('/:id/reservations/:idReservation', reservationController.updateReservation);
router.delete('/:id/reservations/:idReservation', reservationController.deleteReservation);

module.exports = router;
