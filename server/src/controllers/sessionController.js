const TrainingSession = require('../models/TrainingSession');
const { sessionSchema } = require('../utils/validators');

const buildSessionFilters = (query) => {
  const filters = {};
  if (query.athlete) filters.athlete = query.athlete;
  if (query.sessionType) filters.sessionType = query.sessionType;
  if (query.startDate || query.endDate) {
    filters.date = {};
    if (query.startDate) filters.date.$gte = new Date(query.startDate);
    if (query.endDate) filters.date.$lte = new Date(query.endDate);
  }
  return filters;
};

exports.createSession = async (req, res) => {
  try {
    const payload = sessionSchema.parse(req.body);
    const session = await TrainingSession.create(payload);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: 'Invalid session data', details: error.errors || error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const filters = buildSessionFilters(req.query);
    const sessions = await TrainingSession.find(filters)
      .populate('athlete')
      .sort({ date: -1 })
      .limit(Number(req.query.limit) || 50);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await TrainingSession.findById(req.params.id).populate('athlete');
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch session' });
  }
};
