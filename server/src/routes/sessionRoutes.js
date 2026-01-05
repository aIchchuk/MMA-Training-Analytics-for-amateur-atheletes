const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('video'), sessionController.createSession);
router.patch('/:id/results', sessionController.updateSessionResults); // Internal route for AI results
router.get('/', auth, sessionController.getUserSessions);
router.get('/:id', auth, sessionController.getSessionById);

module.exports = router;
