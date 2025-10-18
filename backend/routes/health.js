const express = require('express');
const router = express.Router();
const { authSequelize } = require('../config/dbConnection');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérification de l'état du serveur
 *     description: Endpoint pour vérifier que le serveur et la base de données fonctionnent correctement
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Serveur opérationnel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'OK'
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: string
 *                   example: 'connected'
 *       503:
 *         description: Serveur non disponible
 */
router.get('/', async (req, res) => {
    try {
        // Vérifier la connexion à la base de données
        const models = require('../models');
        await models.sequelize.authenticate();

        res.status(200).json({
            status: 'OK',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: 'connected',
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error.message
        });
    }
});

module.exports = router;
