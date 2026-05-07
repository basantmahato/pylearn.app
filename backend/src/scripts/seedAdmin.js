require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = new Admin({
            username: 'admin',
            password: process.env.ADMIN_PASSWORD || 'admin123'
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log('Username: admin');
        console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123');
        process.exit();
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
