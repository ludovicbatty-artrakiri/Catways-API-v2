const express = require('express');
const router = express.Router();
const { authenticateView } = require('../middlewares/auth');
const reservationService = require('../services/reservationService');
const catwayService = require('../services/catwayService');
const userService = require('../services/userService');

/**
 * Routes "vues" : rendent les pages HTML (EJS) de l'application.
 * @module routes/viewRoutes
 */

/**
 * GET /
 * Page d'accueil publique : présentation + formulaire de connexion + lien doc.
 */
router.get('/', (req, res) => {
  res.render('index', { title: 'Accueil' });
});

/**
 * GET /dashboard
 * Tableau de bord (protégé). Affiche l'utilisateur connecté et la date du jour ;
 * les réservations en cours sont chargées de façon asynchrone côté client.
 */
router.get('/dashboard', authenticateView, (req, res) => {
  res.render('dashboard', {
    title: 'Tableau de bord',
    user: req.user,
    today: new Date().toLocaleDateString('fr-FR'),
  });
});

/**
 * GET /catways-page
 * Page CRUD catways (protégée).
 */
router.get('/catways-page', authenticateView, async (req, res, next) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.render('catways', { title: 'Catways', user: req.user, catways });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /reservations-page
 * Page CRUD réservations (protégée).
 */
router.get('/reservations-page', authenticateView, async (req, res, next) => {
  try {
    const [reservations, catways] = await Promise.all([
      reservationService.getAllReservations(),
      catwayService.getAllCatways(),
    ]);
    res.render('reservations', { title: 'Réservations', user: req.user, reservations, catways });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users-page
 * Page CRUD utilisateurs (protégée).
 */
router.get('/users-page', authenticateView, async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.render('users', { title: 'Utilisateurs', user: req.user, users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
