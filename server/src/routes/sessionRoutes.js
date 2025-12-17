const express = require('express');
const { createSession, getSessions, getSession } = require('../controllers/sessionController');

const router = express.Router();

router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSession);

module.exports = router;

