const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../config/logger');

/**
 * Middleware pour optimiser les images uploadées avec Sharp
 * - Redimensionne les images trop grandes
 * - Optimise la qualité
 * - Convertit en format WebP si possible
 */
const optimizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const inputPath = req.file.path;
    const outputFilename = `optimized_${Date.now()}_${path.parse(req.file.filename).name}.webp`;
    const outputPath = path.join('images', outputFilename);

    try {
        await sharp(inputPath)
            .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(outputPath);

        // Supprimer l'image originale
        await fs.unlink(inputPath);

        // Mettre à jour req.file avec le nouveau fichier
        req.file.filename = outputFilename;
        req.file.path = outputPath;

        logger.info('Image optimized successfully', {
            original: inputPath,
            optimized: outputPath,
            size: req.file.size
        });

        next();
    } catch (error) {
        logger.error('Image optimization failed', {
            error: error.message,
            file: inputPath
        });

        // Si l'optimisation échoue, continuer avec l'image originale
        next();
    }
};

module.exports = optimizeImage;
