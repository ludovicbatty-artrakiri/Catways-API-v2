const Catway = require('../models/Catway');

/**
 * Couche service : logique métier liée aux catways.
 * @module services/catwayService
 */

/**
 * Récupère tous les catways.
 * @returns {Promise<Array>}
 */
async function getAllCatways() {
  return Catway.find();
}

/**
 * Récupère un catway par son numéro.
 * @param {number|string} catwayNumber
 * @returns {Promise<Object|null>}
 */
async function getCatwayByNumber(catwayNumber) {
  return Catway.findOne({ catwayNumber });
}

/**
 * Crée un nouveau catway.
 * @param {{catwayNumber: number, catwayType: string, catwayState: string}} data
 * @returns {Promise<Object>}
 */
async function createCatway({ catwayNumber, catwayType, catwayState }) {
  return Catway.create({ catwayNumber, catwayType, catwayState });
}

/**
 * Met à jour l'état d'un catway. Seul catwayState est modifiable
 * (catwayNumber et catwayType doivent rester figés, conformément au brief).
 * @param {number|string} catwayNumber
 * @param {string} catwayState
 * @returns {Promise<Object|null>}
 */
async function updateCatwayState(catwayNumber, catwayState) {
  return Catway.findOneAndUpdate(
    { catwayNumber },
    { catwayState },
    { new: true, runValidators: true }
  );
}

/**
 * Supprime un catway par son numéro.
 * @param {number|string} catwayNumber
 * @returns {Promise<Object|null>}
 */
async function deleteCatway(catwayNumber) {
  return Catway.findOneAndDelete({ catwayNumber });
}

module.exports = {
  getAllCatways,
  getCatwayByNumber,
  createCatway,
  updateCatwayState,
  deleteCatway,
};
