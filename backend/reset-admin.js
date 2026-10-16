const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const resetAdmin = async () => {
    try {
        const email = process.argv[2];
        const newPassword = process.argv[3];

        if (!email || !newPassword) {
            console.log('Usage: node reset-admin.js <admin-email> <new-password>');
            process.exit(1);
        }

        if (newPassword.length < 8) {
            console.error('Password must be at least 8 characters long');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            console.log(`Admin ${email} not found.`);
        } else {
            admin.password = newPassword;
            await admin.save();
            console.log(`Password reset successfully for ${email}`);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

resetAdmin();
