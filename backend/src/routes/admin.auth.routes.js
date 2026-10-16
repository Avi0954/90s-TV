const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminAuthController');

// @route   POST /api/admin/register
router.post('/register', registerAdmin);

// @route   POST /api/admin/login
router.post('/login', loginAdmin);

module.exports = router;
