const express = require('express');
const path = require('path');
const { authSequelize } = require('./config/dbConnection');
const logger = require('./config/logger');

const app = express();
authSequelize();

// Sécurité
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
const compression = require('compression');
const hpp = require('hpp');
const xssClean = require('xss-clean');

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./config/swagger');

// Protection avec Helmet (headers HTTP sécurisés)
app.use(helmet());

// Compression des réponses
app.use(compression());

// Protection contre HTTP Parameter Pollution
app.use(hpp());

// Protection contre les attaques XSS
app.use(xssClean());

// Logger les requêtes entrantes
app.use((req, res, next) => {
  logger.logRequest(req, 'Incoming request');
  next();
});

// Importation des routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const healthRoutes = require('./routes/health');

// Analyse du corps de la requête
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS - Configuration sécurisée avec whitelist
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3001',
  'http://localhost:3001',
  'http://localhost:3000',
  'http://localhost:3002',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );

  // Répondre directement aux requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Documentation Swagger (uniquement en développement)
if (process.env.NODE_ENV !== 'production') {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info('Swagger documentation available at /api-docs');
}

// Routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/health', healthRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  logger.logError(err, req);

  res.status(err.status || 500).json({
    error: {
      message:
        process.env.NODE_ENV === 'production'
          ? 'Une erreur est survenue'
          : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
});

// Route 404
app.use((req, res) => {
  logger.warn('Route not found', { url: req.originalUrl, method: req.method });
  res.status(404).json({ error: 'Route non trouvée' });
});

module.exports = app;
