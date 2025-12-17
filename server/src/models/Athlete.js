const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    gym: { type: String, trim: true },
    weightClass: { type: String, trim: true },
    stance: { type: String, enum: ['orthodox', 'southpaw', 'switch', 'other'], default: 'other' },
    experienceYears: { type: Number, default: 0 },
    focusAreas: [{ type: String, trim: true }],
    coach: { type: String, trim: true },
    contact: {
      phone: String,
      email: String,
    },
    baselineMetrics: {
      restingHeartRate: Number,
      walkAroundWeightKg: Number,
      grapplingStrengthScore: Number,
      strikingSharpnessScore: Number,
    },
    injuryHistory: [
      {
        injury: String,
        occurredOn: Date,
        recoveredOn: Date,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Athlete', athleteSchema);

