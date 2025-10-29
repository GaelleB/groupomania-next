const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // Retirer l'extension du nom original
        const nameWithoutExt = file.originalname.replace(/\.[^/.]+$/, '');

        // Nettoyer le nom de fichier pour éviter les attaques path traversal
        const safeName = nameWithoutExt
            .replace(/[^a-zA-Z0-9-]/g, '_')    // Remplacer tous les caractères non alphanumériques
            .replace(/_+/g, '_')               // Éviter les underscores multiples
            .substring(0, 50);                 // Limiter la longueur

        const extension = MIME_TYPES[file.mimetype];
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);

        // Nom final: timestamp_random_nomoriginal.extension
        callback(null, `${timestamp}_${randomStr}_${safeName}.${extension}`);
    }
});

// Configuration avec limites et validation
module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,  // Limite de 5 MB
        files: 1                     // Un seul fichier à la fois
    },
    fileFilter: (req, file, callback) => {
        // Vérifier que le type MIME est autorisé
        if (!MIME_TYPES[file.mimetype]) {
            return callback(new Error('Type de fichier non autorisé'), false);
        }
        callback(null, true);
    }
}).single('image');