const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Register Admin (Initial setup)
// @route   POST /api/admin/register
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.query.email && req.query.password ? req.query : req.body;

        // One-time use check - optional security
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already registered' });
        }

        const admin = await Admin.create({ email, password });

        res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login Admin
// @route   POST /api/admin/login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
