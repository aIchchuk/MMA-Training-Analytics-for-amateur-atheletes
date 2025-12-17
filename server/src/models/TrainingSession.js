const mongoose = require('mongoose');

const sparringRoundSchema = new mongoose.Schema(
  {
    roundNumber: Number,
    durationSeconds: Number,
    partnerName: String,
    focus: String,
    perceivedControl: { type: Number, min: 1, max: 10 },
    damageTaken: { type: Number, min: 0, max: 10 },
    notes: String,
    videoUrl: String,
    aiFeedback: String,
  },
  { _id: false }
);

const recoveryBlockSchema = new mongoose.Schema(
  {
    modality: String,
    durationMinutes: Number,
    qualityScore: { type: Number, min: 1, max: 10 },
    notes: String,
  },
  { _id: false }
);

const trainingSessionSchema = new mongoose.Schema(
  {
    athlete: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete', required: true },
    sessionType: {
      type: String,
      enum: ['sparring', 'drilling', 'conditioning', 'recovery', 'competition'],
      required: true,
    },
    date: { type: Date, required: true },
    location: String,
    durationMinutes: Number,
    intensity: { type: Number, min: 1, max: 10 },
    fatigue: { type: Number, min: 1, max: 10 },
    recoveryScore: { type: Number, min: 1, max: 10 },
    sleepHours: Number,
    readinessScore: { type: Number, min: 1, max: 10 },
    heartRateAvg: Number,
    calories: Number,
    focusAreas: [{ type: String, trim: true }],
    subjectiveNotes: String,
    rounds: [sparringRoundSchema],
    recoveryWork: [recoveryBlockSchema],
    injuries: [
      {
        bodyPart: String,
        severity: { type: Number, min: 1, max: 10 },
        description: String,
        needsMedicalReview: Boolean,
      },
    ],
    wellness: {
      soreness: { type: Number, min: 1, max: 10 },
      stressLevel: { type: Number, min: 1, max: 10 },
      mood: { type: Number, min: 1, max: 10 },
    },
    attachments: [
      {
        label: String,
        url: String,
        type: { type: String, enum: ['video', 'image', 'doc', 'other'], default: 'other' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainingSession', trainingSessionSchema);

