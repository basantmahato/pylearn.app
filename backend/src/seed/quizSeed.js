require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Quiz = require('../models/Quiz');

const seedQuizzes = async (category, quizDir) => {
    // Clear existing quizzes for this category
    console.log(`  🧹 Clearing existing ${category} quizzes...`);
    await Quiz.deleteMany({ category: category });

    if (!fs.existsSync(quizDir)) {
        console.error(`  ❌ Path not found: ${quizDir}`);
        return;
    }

    const files = fs.readdirSync(quizDir).filter(f => f.endsWith('.json'));

    let inserted = 0, updated = 0;

    for (const file of files) {
        const filePath = path.join(quizDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Prepend category- to chapterId if not already present
        const dbChapterId = data.chapterId.startsWith(`${category}-`) ? data.chapterId : `${category}-${data.chapterId}`;

        for (const set of (data.sets || [])) {
            const filter = { chapterId: dbChapterId, setId: set.setId, category: category };
            const update = {
                chapterId:  dbChapterId,
                setId:      set.setId,
                setName:    set.setName,
                category:   category,
                difficulty: set.difficulty || 'Medium',
                questions:  set.questions  || []
            };

            const existing = await Quiz.findOne(filter);
            await Quiz.findOneAndUpdate(filter, update, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            });

            if (existing) { updated++; } else { inserted++; }
        }

        console.log(`  ✅ ${file} — ${data.sets?.length || 0} quiz sets`);
    }

    console.log(`\n🧠 Quizzes: ${inserted} inserted, ${updated} updated`);
};

// Run standalone
if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI)
        .then(async () => {
            console.log('MongoDB connected — seeding quizzes…\n');
            const cat = process.argv[2] || 'class12';
            const baseDir = process.argv[3] || path.resolve(__dirname, '../../../data/12th/quiz');
            await seedQuizzes(cat, baseDir);
            console.log('\n✔ Quiz seed complete.');
            process.exit(0);
        })
        .catch(err => {
            console.error('Connection error:', err.message);
            process.exit(1);
        });
}

module.exports = seedQuizzes;
