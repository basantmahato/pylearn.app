require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const path = require('path');

const seedChapters     = require('./chapterSeed');
const seedQuizzes      = require('./quizSeed');
const seedSamplePapers = require('./samplePaperSeed');

const run11thSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected\n');
        console.log('========================================');
        console.log('🚀 Starting Class 11th Content Seed');
        console.log('========================================');

        const category = 'class11';
        const notesDir = path.resolve(__dirname, '../../../data/11th/notes');
        const quizDir = path.resolve(__dirname, '../../../data/11th/quiz');
        const sampleDir = path.resolve(__dirname, '../../../data/11th/samples');

        // 1 — Chapters + Notes
        console.log('📚 [1/3] Seeding Class 11 Chapters & Notes…');
        await seedChapters(category, notesDir);
        console.log('========================================');

        // 2 — Quizzes
        console.log('🧠 [2/3] Seeding Class 11 Quizzes…');
        await seedQuizzes(category, quizDir);
        console.log('========================================');

        // 3 — Sample Papers
        console.log('📄 [3/3] Seeding Class 11 Sample Papers…');
        await seedSamplePapers(category, sampleDir);
        console.log('========================================');

        console.log('\n🎉 Class 11th Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Class 11th Seed failed:', err.message);
        process.exit(1);
    }
};

run11thSeed();
