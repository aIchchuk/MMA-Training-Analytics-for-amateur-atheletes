const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

router.post('/', auth, sessionController.createSession);
router.get('/', auth, sessionController.getUserSessions);
router.get('/:id', auth, sessionController.getSessionById);

module.exports = router;
