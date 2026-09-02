const userService = require('../services/userService');

/**
 * Contrôleur des utilisateurs. Ne contient aucune logique métier ni accès
 * direct au modèle Mongoose : tout passe par services/userService.js.
 * @module controllers/userController
 */

/**
 * GET /users
 * Liste tous les utilisateurs.
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /users/:email
 * Récupère un utilisateur par email.
 */
exports.getUserByEmail = async (req, res, next) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /users
 * Crée un nouvel utilisateur.
 */
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await userService.createUser({ username, email, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /users/:email
 * Met à jour un utilisateur existant.
 */
exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.email, req.body);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /users/:email
 * Supprime un utilisateur.
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.email);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    next(err);
  }
};
