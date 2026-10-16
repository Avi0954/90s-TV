const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Register Admin (Bootstrap / One-time setup only)
// @route   POST /api/admin/auth/register
// @access  Restricted (Bootstrap only)
exports.registerAdmin = async (req, res) => {
    try {
        // Strictly reject any query-parameter credentials
        if (req.query && (req.query.email || req.query.password)) {
            return res.status(400).json({
                message: 'Credentials in query parameters are strictly forbidden for security reasons'
            });
        }

        const { email, password, registrationSecret } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Validate registration bootstrap secret first to fail fast and protect DB
        const { adminRegistrationSecret } = getEnv();
        if (!adminRegistrationSecret || registrationSecret !== adminRegistrationSecret) {
            return res.status(403).json({
                message: 'Invalid or missing admin registration secret'
            });
        }

        // Check if an admin already exists (One-time bootstrap protection)
        const totalAdmins = await Admin.countDocuments();
        if (totalAdmins > 0) {
            return res.status(403).json({
                message: 'Admin registration is closed. An administrator account is already established.'
            });
        }

        const admin = await Admin.create({ email, password });

        res.status(201).json({
            message: 'Admin account initialized successfully',
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login Admin
// @route   POST /api/admin/auth/login
// @access  Public (Rate limited)
exports.loginAdmin = async (req, res) => {
    try {
        // Strictly reject any query-parameter credentials
        if (req.query && (req.query.email || req.query.password)) {
            return res.status(400).json({
                message: 'Credentials in query parameters are strictly forbidden for security reasons'
            });
        }

        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid payload types' });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const { jwtSecret } = getEnv();
        if (!jwtSecret) {
            return res.status(500).json({ message: 'Server configuration error: Missing JWT secret' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            jwtSecret,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (_error) {
        res.status(500).json({ message: 'Authentication error: Unable to log in' });
    }
};
