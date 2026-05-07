require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const SamplePaper = require('../models/SamplePaper');

const SAMPLES_DIR = path.resolve(__dirname, '../../../APP/data/samples');

const seedSamplePapers = async () => {
    const files = fs.readdirSync(SAMPLES_DIR)
        .filter(f => f.endsWith('.json') && f !== 'index.ts');

    let inserted = 0, updated = 0;

    for (const file of files) {
        const filePath = path.join(SAMPLES_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        const filter = { paperId: data.paperId };
        const update = {
            paperId:    data.paperId,
            title:      data.title,
            subtitle:   data.subtitle   || '',
            duration:   data.duration   || '',
            totalMarks: data.totalMarks || 0,
            difficulty: data.difficulty || 'Medium',
            sections:   data.sections   || []
        };

        const existing = await SamplePaper.findOne(filter);
        await SamplePaper.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });

        if (existing) { updated++; } else { inserted++; }
        console.log(`  ✅ ${file} — paperId: ${data.paperId}`);
    }

    console.log(`\n📄 Sample Papers: ${inserted} inserted, ${updated} updated`);
};

// Run standalone
if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI)
        .then(async () => {
            console.log('MongoDB connected — seeding sample papers…\n');
            await seedSamplePapers();
            console.log('\n✔ Sample Paper seed complete.');
            process.exit(0);
        })
        .catch(err => {
            console.error('Connection error:', err.message);
            process.exit(1);
        });
}

module.exports = seedSamplePapers;
