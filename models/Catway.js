const mongoose = require('mongoose');

/**
 * Modèle Mongoose représentant un catway (appontement).
 * @module models/Catway
 */

/**
 * @typedef Catway
 * @property {number} catwayNumber - Numéro unique du catway
 * @property {'long'|'short'} catwayType - Type de catway
 * @property {string} catwayState - Description de l'état de la passerelle
 */
const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: [true, 'Le numéro de catway est obligatoire'],
      unique: true,
    },
    catwayType: {
      type: String,
      required: [true, 'Le type de catway est obligatoire'],
      enum: {
        values: ['long', 'short'],
        message: 'Le type doit être "long" ou "short"',
      },
    },
    catwayState: {
      type: String,
      required: [true, "L'état du catway est obligatoire"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Catway', catwaySchema);
