const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Couche service : logique métier liée à l'authentification.
 * @module services/authService
 */

/**
 * Génère un token JWT signé pour un utilisateur donné.
 * @param {Object} user - Document utilisateur Mongoose (doit avoir un champ _id)
 * @returns {string} Le token JWT signé
 */
function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}

/**
 * Authentifie un utilisateur à partir de son email et mot de passe.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: Object, token: string}|null>} null si les identifiants sont invalides
 */
async function login(email, password) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) return null;

  const isValid = await user.comparePassword(password);
  if (!isValid) return null;

  const token = signToken(user);
  return { user, token };
}

module.exports = { login, signToken };
