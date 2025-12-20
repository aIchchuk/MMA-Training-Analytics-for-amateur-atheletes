const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, gym, level } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            name,
            email,
            password,
            gym: gym || 'Independent',
            level: level || 'beginner'
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '7d'
        });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gym: user.gym,
                level: user.level
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // You would typically use a method on the model to compare passwords
        // For now, we'll assume the simple bcrypt compare logic in the model or here
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '7d'
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gym: user.gym,
                level: user.level
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};
