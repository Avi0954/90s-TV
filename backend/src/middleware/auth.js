const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { getEnv } = require('../config/env');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const { jwtSecret } = getEnv();

            if (!jwtSecret) {
                return res.status(500).json({ message: 'Server configuration error: Missing JWT secret' });
            }

            const decoded = jwt.verify(token, jwtSecret);
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                return res.status(401).json({ message: 'Unauthorized: Admin account not found' });
            }

            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: Session expired, please log in again' });
            }
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    }

    return res.status(401).json({ message: 'Unauthorized: Authorization token required' });
};

module.exports = { protect };
