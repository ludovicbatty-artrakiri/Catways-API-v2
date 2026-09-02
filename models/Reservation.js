const mongoose = require('mongoose');

/**
 * Modèle Mongoose représentant une réservation de catway.
 * @module models/Reservation
 */

/**
 * @typedef Reservation
 * @property {number} catwayNumber - Numéro du catway réservé
 * @property {string} clientName - Nom du client
 * @property {string} boatName - Nom du bateau amarré
 * @property {Date} startDate - Date de début de la réservation
 * @property {Date} endDate - Date de fin de la réservation (doit être postérieure à startDate)
 */
const reservationSchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: [true, 'Le numéro de catway est obligatoire'],
    },
    clientName: {
      type: String,
      required: [true, 'Le nom du client est obligatoire'],
      trim: true,
    },
    boatName: {
      type: String,
      required: [true, 'Le nom du bateau est obligatoire'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'La date de début est obligatoire'],
    },
    endDate: {
      type: Date,
      required: [true, 'La date de fin est obligatoire'],
      validate: {
        /**
         * Vérifie que la date de fin est postérieure à la date de début.
         * @param {Date} value - Date de fin candidate
         * @returns {boolean}
         */
        validator: function (value) {
          return value > this.startDate;
        },
        message: 'La date de fin doit être postérieure à la date de début',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
