require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Chapter = require('../models/Chapter');
const Note = require('../models/Note');

// Path to the APP/data/notes directory
const NOTES_BASE = path.resolve(__dirname, '../../../APP/data/notes');

const seedChapters = async () => {
    // Discover all chapter folders
    const chapterDirs = fs.readdirSync(NOTES_BASE).filter(d =>
        fs.statSync(path.join(NOTES_BASE, d)).isDirectory()
    );

    let created = 0, updated = 0, notes = 0;

    for (const dir of chapterDirs) {
        const filePath = path.join(NOTES_BASE, dir, 'notes.json');
        if (!fs.existsSync(filePath)) {
            console.warn(`  ⚠ No notes.json in ${dir}, skipping`);
            continue;
        }

        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);

        // --- 1. Upsert Chapter (metadata + summary + practice) ---
        const result = await Chapter.findOneAndUpdate(
            { chapterId: data.id },
            {
                chapterId: data.id,
                title:     data.title,
                order:     data.order || 0,
                summary:   data.summary || {},
                practice:  data.practice || []
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (result.createdAt === result.updatedAt) {
            created++;
        } else {
            updated++;
        }

        // --- 2. Replace Note docs for this chapter ---
        await Note.deleteMany({ chapterId: data.id });

        const noteDocs = (data.content || []).map((block, i) => ({
            chapterId: data.id,
            type:      block.type      || 'paragraph',
            heading:   block.heading   || '',
            text:      block.text      || '',
            items:     block.items     || [],
            code:      block.code      || '',
            language:  block.language  || '',
            order:     i
        }));

        if (noteDocs.length) {
            await Note.insertMany(noteDocs);
            notes += noteDocs.length;
        }

        console.log(`  ✅ Chapter ${data.id} — ${noteDocs.length} note blocks`);
    }

    console.log(`\n📚 Chapters: ${created} created, ${updated} updated`);
    console.log(`📝 Notes:    ${notes} blocks inserted total`);
};

// Run standalone
if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI)
        .then(async () => {
            console.log('MongoDB connected — seeding chapters & notes…\n');
            await seedChapters();
            console.log('\n✔ Chapter + Note seed complete.');
            process.exit(0);
        })
        .catch(err => {
            console.error('Connection error:', err.message);
            process.exit(1);
        });
}

module.exports = seedChapters;
