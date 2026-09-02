const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/**
 * Couche service : logique métier liée aux réservations.
 * @module services/reservationService
 */

/**
 * Récupère toutes les réservations d'un catway donné.
 * @param {number|string} catwayNumber
 * @returns {Promise<Array>}
 */
async function getReservationsForCatway(catwayNumber) {
  return Reservation.find({ catwayNumber });
}

/**
 * Récupère toutes les réservations, tous catways confondus, triées
 * par date de début décroissante (utile pour la page CRUD réservations).
 * @returns {Promise<Array>}
 */
async function getAllReservations() {
  return Reservation.find().sort({ startDate: -1 });
}

/**
 * Récupère les réservations en cours à la date du jour (utile pour le tableau de bord).
 * @returns {Promise<Array>}
 */
async function getCurrentReservations() {
  const today = new Date();
  return Reservation.find({
    startDate: { $lte: today },
    endDate: { $gte: today },
  }).sort({ endDate: 1 });
}

/**
 * Récupère une réservation précise, appartenant à un catway donné.
 * @param {number|string} catwayNumber
 * @param {string} reservationId
 * @returns {Promise<Object|null>}
 */
async function getReservationById(catwayNumber, reservationId) {
  return Reservation.findOne({ _id: reservationId, catwayNumber });
}

/**
 * Crée une réservation pour un catway. Vérifie d'abord que le catway existe.
 * @param {number|string} catwayNumber
 * @param {{clientName: string, boatName: string, startDate: Date, endDate: Date}} data
 * @returns {Promise<Object>} La réservation créée
 * @throws {Error} Erreur avec `status = 404` si le catway n'existe pas
 */
async function createReservation(catwayNumber, { clientName, boatName, startDate, endDate }) {
  const catway = await Catway.findOne({ catwayNumber });
  if (!catway) {
    const err = new Error('Catway introuvable');
    err.status = 404;
    throw err;
  }
  return Reservation.create({ catwayNumber, clientName, boatName, startDate, endDate });
}

/**
 * Met à jour une réservation existante.
 * @param {number|string} catwayNumber
 * @param {string} reservationId
 * @param {Object} updates
 * @returns {Promise<Object|null>}
 */
async function updateReservation(catwayNumber, reservationId, updates) {
  const { clientName, boatName, startDate, endDate } = updates;
  return Reservation.findOneAndUpdate(
    { _id: reservationId, catwayNumber },
    { clientName, boatName, startDate, endDate },
    { new: true, runValidators: true }
  );
}

/**
 * Supprime une réservation.
 * @param {number|string} catwayNumber
 * @param {string} reservationId
 * @returns {Promise<Object|null>}
 */
async function deleteReservation(catwayNumber, reservationId) {
  return Reservation.findOneAndDelete({ _id: reservationId, catwayNumber });
}

module.exports = {
  getReservationsForCatway,
  getAllReservations,
  getCurrentReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
