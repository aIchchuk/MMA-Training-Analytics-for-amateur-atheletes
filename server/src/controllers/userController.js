const User = require('../models/User');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, weight, division, background, history } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (weight) user.weight = weight;
        if (division) user.division = division;
        if (background) user.background = background;
        if (history !== undefined) user.history = history;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Update Profile Image
exports.updateProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profileImage = req.file.path;
        await user.save();

        res.json({ message: 'Profile image updated successfully', profileImage: user.profileImage });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile image', error: error.message });
    }
};
