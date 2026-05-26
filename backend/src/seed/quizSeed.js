require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Quiz = require('../models/Quiz');

const QUIZ_DIR = path.resolve(__dirname, '../../../APP/data/quiz');

const seedQuizzes = async () => {
    const files = fs.readdirSync(QUIZ_DIR).filter(f => f.endsWith('.json'));

    let inserted = 0, updated = 0;

    for (const file of files) {
        const filePath = path.join(QUIZ_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        const chapterId = data.chapterId;

        for (const set of (data.sets || [])) {
            const filter = { chapterId, setId: set.setId, category: 'class12' };
            const update = {
                chapterId,
                setId:      set.setId,
                setName:    set.setName,
                category:   'class12',
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
            await seedQuizzes();
            console.log('\n✔ Quiz seed complete.');
            process.exit(0);
        })
        .catch(err => {
            console.error('Connection error:', err.message);
            process.exit(1);
        });
}

module.exports = seedQuizzes;
