const TrainingSession = require('../models/TrainingSession');

// Create New Session with Video Upload
exports.createSession = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const newSession = new TrainingSession({
            user: req.user.id,
            videoUrl: req.file.path, // Cloudinary URL
            cloudinaryId: req.file.filename,
            status: 'pending'
        });

        await newSession.save();
        res.status(201).json({
            message: 'Video uploaded successfully. Analysis starting...',
            session: newSession
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
};

// Get All Sessions for logged in user
exports.getUserSessions = async (req, res) => {
    try {
        const sessions = await TrainingSession.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sessions', error: error.message });
    }
};

// Get Single Session Details
exports.getSessionById = async (req, res) => {
    try {
        const session = await TrainingSession.findOne({ _id: req.params.id, user: req.user.id });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching session details', error: error.message });
    }
};
