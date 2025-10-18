const { body, param, validationResult } = require('express-validator');
const logger = require('../config/logger');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation failed', {
            errors: errors.array(),
            url: req.originalUrl,
            method: req.method
        });
        return res.status(400).json({
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Validation pour signup
const validateSignup = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2 }).withMessage('Le nom doit contenir au minimum 2 caractères')
        .matches(/^[a-zA-Z-\s]+$/).withMessage('Le nom ne doit contenir que des lettres, espaces et tirets'),

    body('prenom')
        .trim()
        .notEmpty().withMessage('Le prénom est requis')
        .isLength({ min: 2 }).withMessage('Le prénom doit contenir au minimum 2 caractères')
        .matches(/^[a-zA-Z-\s]+$/).withMessage('Le prénom ne doit contenir que des lettres, espaces et tirets'),

    body('email')
        .trim()
        .notEmpty().withMessage('L\'email est requis')
        .isEmail().withMessage('Format d\'email invalide')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Le mot de passe est requis')
        .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au minimum 6 caractères')
        .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule')
        .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
        .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre'),

    handleValidationErrors
];

// Validation pour login
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('L\'email est requis')
        .isEmail().withMessage('Format d\'email invalide')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Le mot de passe est requis'),

    handleValidationErrors
];

// Validation pour modification d'utilisateur
const validateModifyUser = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID utilisateur invalide'),

    body('nom')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Le nom doit contenir au minimum 2 caractères')
        .matches(/^[a-zA-Z-\s]+$/).withMessage('Le nom ne doit contenir que des lettres, espaces et tirets'),

    body('prenom')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Le prénom doit contenir au minimum 2 caractères')
        .matches(/^[a-zA-Z-\s]+$/).withMessage('Le prénom ne doit contenir que des lettres, espaces et tirets'),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Format d\'email invalide')
        .normalizeEmail(),

    handleValidationErrors
];

// Validation pour création de post
const validateCreatePost = [
    body('title')
        .trim()
        .notEmpty().withMessage('Le titre est requis')
        .isLength({ min: 3, max: 200 }).withMessage('Le titre doit contenir entre 3 et 200 caractères'),

    body('content')
        .trim()
        .notEmpty().withMessage('Le contenu est requis')
        .isLength({ min: 10, max: 5000 }).withMessage('Le contenu doit contenir entre 10 et 5000 caractères'),

    handleValidationErrors
];

// Validation pour création de commentaire
const validateCreateComment = [
    body('content')
        .trim()
        .notEmpty().withMessage('Le commentaire ne peut pas être vide')
        .isLength({ min: 1, max: 1000 }).withMessage('Le commentaire doit contenir entre 1 et 1000 caractères'),

    body('postId')
        .isInt({ min: 1 }).withMessage('ID de post invalide'),

    handleValidationErrors
];

// Validation pour param ID
const validateId = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID invalide'),

    handleValidationErrors
];

module.exports = {
    validateSignup,
    validateLogin,
    validateModifyUser,
    validateCreatePost,
    validateCreateComment,
    validateId,
    handleValidationErrors
};
