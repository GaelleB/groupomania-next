const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

// Rate limiting pour le login (protection contre brute-force)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                    // 5 tentatives max
    message: 'Trop de tentatives de connexion, réessayez dans 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/signup', userCtrl.signup);
router.post('/login', loginLimiter, userCtrl.login); 
router.get('/profile/:id', auth, userCtrl.getOneUser);  
router.get('/profile', auth, userCtrl.getAllUsers); 
router.put('/profile/:id', auth, multer, userCtrl.modifyUser);
router.delete('/profile/:id', auth, multer, userCtrl.deleteUser); 

module.exports = router;