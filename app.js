const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const apiRoutes = require('./routes/apiRoutes');
const viewRoutes = require('./routes/viewRoutes');
const setupRoutes = require('./routes/setupRoutes');
const errorHandler = require('./middlewares/errorHandler');

/**
 * Configuration principale de l'application Express.
 * @module app
 */

const app = express();

// Moteur de templates (EJS), requis par le brief
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globaux
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Documentation Swagger interactive
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes "vues" (pages HTML rendues côté serveur)
app.use('/', viewRoutes);

// Routes API — montées exactement sur les chemins demandés dans le brief
app.use('/', authRoutes); // POST /login, GET /logout
app.use('/users', userRoutes); // /users, /users/:email
app.use('/catways', catwayRoutes); // /catways, /catways/:id, /catways/:id/reservations...
app.use('/api', apiRoutes); // /api/me, /api/reservations, /api/reservations/current (usage frontend)
app.use('/', setupRoutes); // /setup-admin (temporaire, protégé par secret)

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

// Gestion centralisée des erreurs
app.use(errorHandler);

module.exports = app;
