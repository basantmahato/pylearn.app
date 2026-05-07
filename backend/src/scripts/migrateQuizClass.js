require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');

async function migrateQuizzes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update all quizzes without a class field to class: 12
        const result = await Quiz.updateMany(
            { class: { $exists: false } },
            { class: 12 }
        );

        console.log(`Updated ${result.modifiedCount} quizzes to class: 12`);

        // Verify the update
        const quizzes = await Quiz.find({});
        console.log(`Total quizzes in database: ${quizzes.length}`);
        console.log('Sample quizzes:', quizzes.slice(0, 3).map(q => ({
            setId: q.setId,
            setName: q.setName,
            class: q.class
        })));

        await mongoose.connection.close();
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

migrateQuizzes();
