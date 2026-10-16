const validateEnv = () => {
    const required = ['MONGO_URI', 'JWT_SECRET'];
    const missing = required.filter((key) => !process.env[key] || process.env[key].trim() === '');

    if (missing.length > 0) {
        console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
        console.error('Please configure them in your .env file.');
        process.exit(1);
    }

    if (process.env.JWT_SECRET === 'supersecretkey') {
        console.error('FATAL: Insecure JWT_SECRET detected. Refusing to start with default fallback "supersecretkey".');
        process.exit(1);
    }

    if (process.env.JWT_SECRET.length < 16) {
        console.error('FATAL: JWT_SECRET must be at least 16 characters long for security.');
        process.exit(1);
    }
};

const getEnv = () => ({
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    adminRegistrationSecret: process.env.ADMIN_REGISTRATION_SECRET || null
});

module.exports = {
    validateEnv,
    getEnv
};
