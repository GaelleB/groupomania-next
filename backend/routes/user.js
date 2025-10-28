const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup);  
router.post('/login', userCtrl.login); 
router.get('/profile/:id', auth, userCtrl.getOneUser);  
router.get('/profile', auth, userCtrl.getAllUsers); 
router.put('/profile/:id', auth, multer, userCtrl.modifyUser);
router.delete('/profile/:id', auth, multer, userCtrl.deleteUser); 

module.exports = router;