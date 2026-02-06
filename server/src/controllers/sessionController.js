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

        // Trigger AI Analysis Service
        try {
            console.log(`📡 Triggering AI Service for Session: ${newSession._id}`);
            // Non-blocking call to Python service - using 127.0.0.1 to avoid localhost IPv6 issues
            fetch('http://127.0.0.1:5001/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoUrl: newSession.videoUrl,
                    sessionId: newSession._id
                })
            }).then(resp => {
                console.log(`🤖 AI Service Response Status: ${resp.status}`);
            }).catch(err => {
                console.error("❌ AI Service Error (Async):", err.message);
            });

            // Update status to 'analyzing'
            newSession.status = 'analyzing';
            await newSession.save();
        } catch (aiErr) {
            console.error("❌ Failed to trigger AI Service:", aiErr.message);
        }

        res.status(201).json({
            message: 'Video uploaded successfully. Analysis starting...',
            session: newSession
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
};

// Update Session Results (Called by Python AI Service)
exports.updateSessionResults = async (req, res) => {
    try {
        const { metrics, feedback, status } = req.body;
        const session = await TrainingSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.metrics = metrics;
        session.feedback = feedback;
        session.status = status || 'completed';

        await session.save();
        res.status(200).json({ message: 'Session results updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating session results', error: error.message });
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
