const User = require('../models/User');

/**
 * Couche service : contient toute la logique métier liée aux utilisateurs.
 * Les controllers ne doivent JAMAIS appeler le modèle Mongoose directement :
 * ils passent systématiquement par ce service.
 * @module services/userService
 */

/**
 * Récupère tous les utilisateurs.
 * @returns {Promise<Array>} Liste des utilisateurs
 */
async function getAllUsers() {
  return User.find();
}

/**
 * Récupère un utilisateur par son adresse email.
 * @param {string} email - Adresse email de l'utilisateur
 * @returns {Promise<Object|null>} L'utilisateur trouvé, ou null
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Crée un nouvel utilisateur (le mot de passe est hashé automatiquement
 * par le hook pre('save') défini dans le modèle).
 * @param {{username: string, email: string, password: string}} data
 * @returns {Promise<Object>} L'utilisateur créé
 */
async function createUser({ username, email, password }) {
  return User.create({ username, email, password });
}

/**
 * Met à jour un utilisateur existant identifié par son email.
 * @param {string} email - Email de l'utilisateur à modifier
 * @param {Object} updates - Champs à mettre à jour (username, email, password...)
 * @returns {Promise<Object|null>} L'utilisateur mis à jour, ou null s'il n'existe pas
 */
async function updateUser(email, updates) {
  const user = await User.findOne({ email });
  if (!user) return null;

  Object.assign(user, updates);
  await user.save(); // .save() (et non findOneAndUpdate) pour déclencher le hash du mot de passe si modifié
  return user;
}

/**
 * Supprime un utilisateur par son email.
 * @param {string} email
 * @returns {Promise<Object|null>} L'utilisateur supprimé, ou null s'il n'existait pas
 */
async function deleteUser(email) {
  return User.findOneAndDelete({ email });
}

module.exports = {
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
