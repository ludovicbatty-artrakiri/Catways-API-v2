const catwayService = require('../services/catwayService');

/**
 * Contrôleur des catways. Ne contient aucune logique métier ni accès
 * direct au modèle Mongoose : tout passe par services/catwayService.js.
 * @module controllers/catwayController
 */

/**
 * GET /catways
 * Liste tous les catways.
 */
exports.getAllCatways = async (req, res, next) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.status(200).json(catways);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /catways/:id
 * Récupère les détails d'un catway (id = catwayNumber).
 */
exports.getCatwayById = async (req, res, next) => {
  try {
    const catway = await catwayService.getCatwayByNumber(req.params.id);
    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });
    res.status(200).json(catway);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /catways
 * Crée un nouveau catway.
 */
exports.createCatway = async (req, res, next) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    const catway = await catwayService.createCatway({ catwayNumber, catwayType, catwayState });
    res.status(201).json(catway);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /catways/:id
 * Modifie uniquement l'état (catwayState) d'un catway.
 * Le numéro et le type ne sont volontairement pas modifiables (brief).
 */
exports.updateCatway = async (req, res, next) => {
  try {
    const catway = await catwayService.updateCatwayState(req.params.id, req.body.catwayState);
    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });
    res.status(200).json(catway);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /catways/:id
 * Supprime un catway.
 */
exports.deleteCatway = async (req, res, next) => {
  try {
    const catway = await catwayService.deleteCatway(req.params.id);
    if (!catway) return res.status(404).json({ message: 'Catway introuvable' });
    res.status(200).json({ message: 'Catway supprimé' });
  } catch (err) {
    next(err);
  }
};
