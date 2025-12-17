const { z } = require('zod');

const toDate = z.preprocess((val) => {
  if (!val) return undefined;
  const parsed = new Date(val);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}, z.date());

const roundSchema = z.object({
  roundNumber: z.number().int().min(1).optional(),
  durationSeconds: z.number().int().positive().optional(),
  partnerName: z.string().min(1).max(120).optional(),
  focus: z.string().max(120).optional(),
  perceivedControl: z.number().min(1).max(10).optional(),
  damageTaken: z.number().min(0).max(10).optional(),
  notes: z.string().max(500).optional(),
  videoUrl: z.string().url().optional(),
  aiFeedback: z.string().max(500).optional(),
});

const recoveryBlockSchema = z.object({
  modality: z.string().max(120).optional(),
  durationMinutes: z.number().int().positive().optional(),
  qualityScore: z.number().min(1).max(10).optional(),
  notes: z.string().max(300).optional(),
});

const sessionSchema = z.object({
  athlete: z.string().min(1, 'Athlete id required'),
  sessionType: z.enum(['sparring', 'drilling', 'conditioning', 'recovery', 'competition']),
  date: toDate,
  location: z.string().max(160).optional(),
  durationMinutes: z.number().int().positive('Duration required').optional(),
  intensity: z.number().min(1).max(10).optional(),
  fatigue: z.number().min(1).max(10).optional(),
  recoveryScore: z.number().min(1).max(10).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  readinessScore: z.number().min(1).max(10).optional(),
  heartRateAvg: z.number().min(0).optional(),
  calories: z.number().min(0).optional(),
  focusAreas: z.array(z.string().max(60)).optional(),
  subjectiveNotes: z.string().max(1000).optional(),
  rounds: z.array(roundSchema).optional(),
  recoveryWork: z.array(recoveryBlockSchema).optional(),
  injuries: z
    .array(
      z.object({
        bodyPart: z.string(),
        severity: z.number().min(1).max(10),
        description: z.string().max(500).optional(),
        needsMedicalReview: z.boolean().optional(),
      })
    )
    .optional(),
  wellness: z
    .object({
      soreness: z.number().min(1).max(10).optional(),
      stressLevel: z.number().min(1).max(10).optional(),
      mood: z.number().min(1).max(10).optional(),
    })
    .optional(),
  attachments: z
    .array(
      z.object({
        label: z.string().max(120).optional(),
        url: z.string().url(),
        type: z.enum(['video', 'image', 'doc', 'other']).optional(),
      })
    )
    .optional(),
});

const athleteSchema = z.object({
  fullName: z.string().min(2),
  gym: z.string().max(160).optional(),
  weightClass: z.string().max(60).optional(),
  stance: z.enum(['orthodox', 'southpaw', 'switch', 'other']).optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  focusAreas: z.array(z.string().max(60)).optional(),
  coach: z.string().max(120).optional(),
  contact: z
    .object({
      phone: z.string().max(30).optional(),
      email: z.string().email().optional(),
    })
    .optional(),
  baselineMetrics: z
    .object({
      restingHeartRate: z.number().min(20).max(120).optional(),
      walkAroundWeightKg: z.number().min(30).max(200).optional(),
      grapplingStrengthScore: z.number().min(1).max(10).optional(),
      strikingSharpnessScore: z.number().min(1).max(10).optional(),
    })
    .optional(),
  injuryHistory: z
    .array(
      z.object({
        injury: z.string(),
        occurredOn: toDate.optional(),
        recoveredOn: toDate.optional(),
        notes: z.string().max(500).optional(),
      })
    )
    .optional(),
});

module.exports = {
  sessionSchema,
  athleteSchema,
};

