const express = require('express');
const cors = require('cors');

const app = express();

const publicRoutes = require('./routes/public.routes');
const adminAuthRoutes = require('./routes/admin.auth.routes');
const adminChannelRoutes = require('./routes/admin.channel.routes');
const adminShowRoutes = require('./routes/admin.show.routes');
const adminBannerRoutes = require('./routes/admin.banner.routes');
const { protect } = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', publicRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/channels', adminChannelRoutes);
app.use('/api/admin/shows', adminShowRoutes);
app.use('/api/admin/banners', adminBannerRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Cartoon Hub Backend API Running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;
