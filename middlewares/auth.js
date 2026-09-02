const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middlewares d'authentification.
 * @module middlewares/auth
 */

/**
 * Protège les routes API (JSON). Vérifie le token JWT (cookie httpOnly ou
 * header Authorization). Distingue une vraie erreur d'authentification (401)
 * d'une erreur technique côté serveur/BDD (500), pour faciliter le debug.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authenticateAPI(req, res, next) {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Erreur DB dans authenticateAPI :', err.message);
    return res.status(500).json({
      message: "Erreur serveur : impossible de vérifier l'utilisateur (vérifiez la connexion MongoDB)",
    });
  }
}

/**
 * Protège les routes "vues" (pages HTML rendues côté serveur). Si l'utilisateur
 * n'est pas authentifié, redirige vers la page d'accueil plutôt que de renvoyer
 * une erreur JSON. Rend l'utilisateur disponible dans les templates via res.locals.user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authenticateView(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.redirect('/');

    req.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    return res.redirect('/');
  }
}

module.exports = { authenticateAPI, authenticateView };
