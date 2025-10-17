const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

router.post('/newpost', auth, multer, postCtrl.createPost);
router.get('/:id', auth, postCtrl.getOnePost);   
router.get('/', auth, postCtrl.getAllPosts);                   
router.put('/:id', auth, multer, postCtrl.modifyPost);  
router.delete('/:id',auth, multer, postCtrl.deletePost);
router.post('/:id/like', auth, postCtrl.likePost);
router.post('/:id/dislike', auth, postCtrl.dislikePost);

module.exports = router;