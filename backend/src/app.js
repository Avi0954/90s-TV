const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { getEnv } = require('./config/env');

const app = express();
const { allowedOrigins, nodeEnv } = getEnv();

// Security Headers with Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Disabled on API server so frontend embedding is unhindered
}));

// Strictly Configured CORS
app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server or tools with no origin, or whitelisted domains
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked: Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate Limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 attempts
    message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 600, // 600 requests per 15 min per IP
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/admin/auth/login', authLimiter);
app.use('/api', apiLimiter);

// Routes
const publicRoutes = require('./routes/public.routes');
const adminAuthRoutes = require('./routes/admin.auth.routes');
const adminChannelRoutes = require('./routes/admin.channel.routes');
const adminShowRoutes = require('./routes/admin.show.routes');
const adminBannerRoutes = require('./routes/admin.banner.routes');

app.use('/api', publicRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/channels', adminChannelRoutes);
app.use('/api/admin/shows', adminShowRoutes);
app.use('/api/admin/banners', adminBannerRoutes);

// Root Health Route
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        service: '90s TV Cartoon Hub API',
        version: '1.0.0'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler (Never expose credentials, database connection strings, or stacks in production)
app.use((err, req, res, _next) => {
    const isDev = nodeEnv === 'development';
    
    // Log sanitized error message internally
    console.error(`[API ERROR] ${err.name || 'Error'}: ${err.message}`);

    const statusCode = err.status || err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
    
    res.status(statusCode).json({
        message: isDev ? err.message : (statusCode === 500 ? 'Internal Server Error' : err.message),
        stack: isDev ? err.stack : undefined
    });
});

module.exports = app;
