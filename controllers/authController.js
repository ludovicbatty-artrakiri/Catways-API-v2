const authService = require('../services/authService');

/**
 * Contrôleur d'authentification.
 * @module controllers/authController
 */

/**
 * POST /login
 * Authentifie un utilisateur et pose un cookie JWT httpOnly.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const result = await authService.login(email, password);
    if (!result) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const { user, token } = result;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /logout
 * Supprime le cookie de session et déconnecte l'utilisateur.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(200).json({ message: 'Déconnexion réussie' });
  }
  res.redirect('/');
};
