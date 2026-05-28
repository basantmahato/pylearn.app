const mongoose = require('mongoose');
const Course = require('../models/Course');

const seedCourses = async () => {
    try {
        const count = await Course.countDocuments();
        if (count === 0) {
            console.log('🌱 No courses found in database. Seeding initial categories...');
            const defaultCourses = [
                {
                    key: "class11",
                    label: "Class 11",
                    description: "Computer Science (Python)",
                    color: "#8b5cf6",
                    lightColor: "#f5f3ff"
                },
                {
                    key: "class12",
                    label: "Class 12",
                    description: "Computer Science boards",
                    color: "#005ab5",
                    lightColor: "#e8f0ff"
                },
                {
                    key: "bca",
                    label: "BCA",
                    description: "Degree Foundation",
                    color: "#10b981",
                    lightColor: "#ecfdf5"
                },
                {
                    key: "btech",
                    label: "B.Tech",
                    description: "CS / IT Engineering",
                    color: "#f59e0b",
                    lightColor: "#fffbeb"
                },
                {
                    key: "aiml",
                    label: "AI / ML",
                    description: "Modern Data Science",
                    color: "#ef4444",
                    lightColor: "#fef2f2"
                }
            ];
            await Course.insertMany(defaultCourses);
            console.log('✅ Initial categories seeded successfully!');
        }
    } catch (err) {
        console.error('❌ Failed to seed initial categories:', err);
    }
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        // Run category/course seeding
        await seedCourses();
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
