const express = require('express');
const { createAthlete, getAthletes, getAthlete } = require('../controllers/athleteController');

const router = express.Router();

router.post('/', createAthlete);
router.get('/', getAthletes);
router.get('/:id', getAthlete);

module.exports = router;

