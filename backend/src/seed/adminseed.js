require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
        console.log('  ℹ Admin user already exists — skipping.');
        return;
    }

    const admin = new Admin({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123'
    });

    await admin.save();
    console.log('  ✅ Admin user created!');
    console.log('     Username:', admin.username);
    console.log('     Password:', process.env.ADMIN_PASSWORD || 'admin123');
};

// Run standalone
if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pylearn12')
        .then(async () => {
            console.log('MongoDB connected — seeding admin…\n');
            await seedAdmin();
            console.log('\n✔ Admin seed complete.');
            process.exit(0);
        })
        .catch(err => {
            console.error('Error seeding admin:', err.message);
            process.exit(1);
        });
}

module.exports = seedAdmin;
