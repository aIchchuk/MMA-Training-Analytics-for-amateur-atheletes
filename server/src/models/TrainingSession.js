const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    date: { type: Date, default: Date.now },

    // Analytics Data
    metrics: {
        guardStability: { type: Number }, // 0-100 score
        takedownSpeed: { type: Number }, // in ms
        strikeVolume: { type: Number },
        accuracyScore: { type: Number }
    },

    // Detailed feedback array
    feedback: [{
        timestamp: Number,
        issue: String,
        suggestion: String,
        severity: { type: String, enum: ['low', 'medium', 'high'] }
    }],

    status: { type: String, enum: ['pending', 'analyzing', 'completed', 'failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('TrainingSession', trainingSessionSchema);
