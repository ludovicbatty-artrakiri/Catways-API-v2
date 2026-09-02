const reservationService = require('../services/reservationService');

/**
 * Contrôleur des réservations (sous-ressource des catways). Ne contient
 * aucune logique métier ni accès direct au modèle Mongoose : tout passe
 * par services/reservationService.js.
 * @module controllers/reservationController
 */

/**
 * GET /catways/:id/reservations
 * Liste les réservations d'un catway donné.
 */
exports.getAllReservationsForCatway = async (req, res, next) => {
  try {
    const reservations = await reservationService.getReservationsForCatway(req.params.id);
    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reservations
 * Liste toutes les réservations, tous catways confondus (usage frontend).
 */
exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reservations/current
 * Liste les réservations en cours aujourd'hui, tous catways confondus
 * (utilisé par le tableau de bord, chargé de façon asynchrone).
 */
exports.getCurrentReservations = async (req, res, next) => {
  try {
    const reservations = await reservationService.getCurrentReservations();
    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /catways/:id/reservations/:idReservation
 * Détails d'une réservation précise.
 */
exports.getReservationById = async (req, res, next) => {
  try {
    const reservation = await reservationService.getReservationById(
      req.params.id,
      req.params.idReservation
    );
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    res.status(200).json(reservation);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /catways/:id/reservations
 * Crée une réservation pour un catway.
 */
exports.createReservation = async (req, res, next) => {
  try {
    const reservation = await reservationService.createReservation(req.params.id, req.body);
    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /catways/:id/reservations/:idReservation
 * Modifie une réservation existante.
 */
exports.updateReservation = async (req, res, next) => {
  try {
    const idReservation = req.params.idReservation || req.body.idReservation;
    const reservation = await reservationService.updateReservation(
      req.params.id,
      idReservation,
      req.body
    );
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    res.status(200).json(reservation);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /catways/:id/reservations/:idReservation
 * Supprime une réservation.
 */
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await reservationService.deleteReservation(
      req.params.id,
      req.params.idReservation
    );
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    res.status(200).json({ message: 'Réservation supprimée' });
  } catch (err) {
    next(err);
  }
};
