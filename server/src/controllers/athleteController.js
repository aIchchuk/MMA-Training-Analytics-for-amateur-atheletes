const Athlete = require('../models/Athlete');
const { athleteSchema } = require('../utils/validators');

const buildFilters = (query) => {
  const filters = {};
  if (query.gym) filters.gym = query.gym;
  if (query.weightClass) filters.weightClass = query.weightClass;
  if (query.stance) filters.stance = query.stance;
  return filters;
};

exports.createAthlete = async (req, res) => {
  try {
    const payload = athleteSchema.parse(req.body);
    const athlete = await Athlete.create(payload);
    res.status(201).json(athlete);
  } catch (error) {
    res.status(400).json({ message: 'Invalid athlete data', details: error.errors || error.message });
  }
};

exports.getAthletes = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const athletes = await Athlete.find(filters).sort({ createdAt: -1 });
    res.json(athletes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch athletes' });
  }
};

exports.getAthlete = async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.params.id);
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }
    res.json(athlete);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch athlete' });
  }
};

