const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        // Sanitize error message so credentials in connection strings are never logged
        const sanitizedMsg = (error.message || '').replace(/mongodb(\+srv)?:\/\/[^@]+@/, 'mongodb://***:***@');
        console.error(`Database Connection Error: ${sanitizedMsg}`);
        process.exit(1);
    }
};

module.exports = connectDB;
