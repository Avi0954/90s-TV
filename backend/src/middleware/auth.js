const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                return res.status(401).json({ message: 'Unauthorized: Admin not found' });
            }

            if (typeof next === 'function') {
                return next();
            } else {
                console.error('ERROR: next is not a function in protect middleware');
                return res.status(500).json({ message: 'Internal Server Error: Middleware Chain Broken' });
            }
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
};

module.exports = { protect };
