const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['athlete', 'coach'], default: 'athlete' },
    gym: { type: String, default: 'Independent' }, // Kathmandu Gyms
    level: { type: String, enum: ['beginner', 'amateur', 'pro'], default: 'beginner' },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
