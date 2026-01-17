const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const { profileStorage } = require('../config/cloudinary');

const upload = multer({ storage: profileStorage });

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/profile/image', auth, upload.single('profileImage'), userController.updateProfileImage);

module.exports = router;
