/**
 * Middleware de gestion centralisée des erreurs Express.
 * @module middlewares/errorHandler
 */

/**
 * Intercepte toutes les erreurs transmises via next(err) et renvoie
 * une réponse JSON cohérente selon le type d'erreur.
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Erreur de validation', errors: messages });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Ressource déjà existante (doublon)', field: err.keyValue });
  }

  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
}

module.exports = errorHandler;
