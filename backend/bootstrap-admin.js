const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const bootstrapAdmin = async () => {
    try {
        const email = process.argv[2];
        const password = process.argv[3];

        if (!email || !password) {
            console.log('Usage: node bootstrap-admin.js <admin-email> <admin-password>');
            process.exit(1);
        }

        if (password.length < 8) {
            console.error('Password must be at least 8 characters long');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);

        const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            console.log(`Admin account with email ${email} already exists.`);
            process.exit(0);
        }

        await Admin.create({ email: email.toLowerCase().trim(), password });
        console.log(`Administrator account created successfully for: ${email}`);
        process.exit(0);
    } catch (err) {
        console.error('Bootstrap Error:', err.message);
        process.exit(1);
    }
};

bootstrapAdmin();
