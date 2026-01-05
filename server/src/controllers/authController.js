const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Helper to send email
const sendVerificationEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Combat Analytics" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code - MMA Training Analytics',
        html: `
            <div style="font-family: 'Roboto', sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; max-width: 500px;">
                <h2 style="color: #2563eb;">Verify Your Account</h2>
                <p>Welcome to Kathmandu Performance Lab. Use the code below to complete your registration:</p>
                <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #0f172a;">${otp}</span>
                </div>
                <p style="color: #64748b; font-size: 12px;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

// Register User (Step 1: Create unverified user and send OTP)
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({ message: 'User already exists and is verified' });
            }
            // If user exists but not verified, we'll update them with a new OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            existingUser.name = name;
            existingUser.password = password; // Will be hashed by pre-save hook
            existingUser.verificationCode = otp;
            await existingUser.save();
            await sendVerificationEmail(email, otp);
            return res.status(200).json({ message: 'Verification code resent' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            name,
            email,
            password,
            verificationCode: otp
        });

        await user.save();
        await sendVerificationEmail(email, otp);

        res.status(201).json({ message: 'Verification code sent to email' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Error during registration', error: error.message });
    }
};

// Verify OTP (Step 2)
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email, verificationCode: otp });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '7d'
        });

        res.status(200).json({
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
        res.status(500).json({ message: 'Verification fail', error: error.message });
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

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }

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
