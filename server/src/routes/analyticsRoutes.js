const express = require('express');
const { getAthleteAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/:athleteId', getAthleteAnalytics);

module.exports = router;

