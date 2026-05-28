require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const path = require('path');

const seedChapters     = require('./chapterSeed');
const seedQuizzes      = require('./quizSeed');
const seedSamplePapers = require('./samplePaperSeed');

const runBCASeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected\n');
        console.log('========================================');
        console.log('🚀 Starting BCA Content Seed');
        console.log('========================================');

        const category = 'bca';
        const notesDir = path.resolve(__dirname, '../../../data/bca/notes');
        const quizDir = path.resolve(__dirname, '../../../data/bca/quiz');
        const sampleDir = path.resolve(__dirname, '../../../data/bca/samples');

        // 1 — Chapters + Notes
        console.log('📚 [1/3] Seeding BCA Chapters & Notes…');
        await seedChapters(category, notesDir);
        console.log('========================================');

        // 2 — Quizzes
        console.log('🧠 [2/3] Seeding BCA Quizzes…');
        await seedQuizzes(category, quizDir);
        console.log('========================================');

        // 3 — Sample Papers
        console.log('📄 [3/3] Seeding BCA Sample Papers…');
        await seedSamplePapers(category, sampleDir);
        console.log('========================================');

        console.log('\n🎉 BCA Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ BCA Seed failed:', err.message);
        process.exit(1);
    }
};

runBCASeed();
