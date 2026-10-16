const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = 'admin4@example.com';
        const newPassword = 'admin123';

        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log(`Admin ${email} not found.`);
        } else {
            admin.password = newPassword;
            await admin.save();
            console.log(`Password reset successfully for ${email}`);
            console.log(`New Credentials:`);
            console.log(`Email: ${email}`);
            console.log(`Password: ${newPassword}`);
        }
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

resetAdmin();
