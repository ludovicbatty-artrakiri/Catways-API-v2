const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateAPI } = require('../middlewares/auth');

/**
 * Routes CRUD pour la gestion des utilisateurs.
 * @module routes/userRoutes
 */

router.use(authenticateAPI);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200: { description: Liste des utilisateurs }
 *   post:
 *     summary: Crée un utilisateur
 *     tags: [Users]
 */
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Récupère un utilisateur par email
 *     tags: [Users]
 *   put:
 *     summary: Modifie un utilisateur
 *     tags: [Users]
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 */
router.get('/:email', userController.getUserByEmail);
router.put('/:email', userController.updateUser);
router.delete('/:email', userController.deleteUser);

module.exports = router;
