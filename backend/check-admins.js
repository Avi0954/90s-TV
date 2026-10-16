const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const checkAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admins = await Admin.find({}, 'email');
        if (admins.length === 0) {
            console.log('No admins registered yet.');
        } else {
            console.log('Registered Admins:');
            admins.forEach(admin => console.log(`- ${admin.email}`));
        }
        process.exit();
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

checkAdmins();
