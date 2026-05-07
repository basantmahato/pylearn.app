require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const seedAdmin        = require('./adminseed');
const seedChapters     = require('./chapterSeed');
const seedQuizzes      = require('./quizSeed');
const seedSamplePapers = require('./samplePaperSeed');

const runAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected\n');
        console.log('========================================');

        // 1 — Admin
        console.log('🔑 [1/4] Seeding Admin…');
        await seedAdmin();
        console.log('========================================');

        // 2 — Chapters + Notes
        console.log('📚 [2/4] Seeding Chapters & Notes…');
        await seedChapters();
        console.log('========================================');

        // 3 — Quizzes
        console.log('🧠 [3/4] Seeding Quizzes…');
        await seedQuizzes();
        console.log('========================================');

        // 4 — Sample Papers
        console.log('📄 [4/4] Seeding Sample Papers…');
        await seedSamplePapers();
        console.log('========================================');

        console.log('\n🎉 All seeds completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Seed failed:', err.message);
        process.exit(1);
    }
};

runAll();
