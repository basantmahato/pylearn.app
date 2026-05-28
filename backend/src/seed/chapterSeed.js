require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Chapter = require('../models/Chapter');
const Note = require('../models/Note');

const seedChapters = async (category, notesBaseDir) => {
    // Clear existing chapters and notes for this category to avoid duplicates/orphans
    console.log(`  🧹 Clearing existing ${category} chapters and notes...`);
    await Chapter.deleteMany({ category: category });
    await Note.deleteMany({ category: category });

    // Discover all chapter folders
    if (!fs.existsSync(notesBaseDir)) {
        console.error(`  ❌ Path not found: ${notesBaseDir}`);
        return;
    }
    const chapterDirs = fs.readdirSync(notesBaseDir).filter(d =>
        fs.statSync(path.join(notesBaseDir, d)).isDirectory()
    );

    let created = 0, updated = 0, notes = 0;

    for (const dir of chapterDirs) {
        const filePath = path.join(notesBaseDir, dir, 'notes.json');
        if (!fs.existsSync(filePath)) {
            console.warn(`  ⚠ No notes.json in ${dir}, skipping`);
            continue;
        }

        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);

        // Prepend category- to chapterId if not already present
        const dbChapterId = data.id.startsWith(`${category}-`) ? data.id : `${category}-${data.id}`;

        // --- 1. Upsert Chapter (metadata + summary + practice) ---
        const result = await Chapter.findOneAndUpdate(
            { chapterId: dbChapterId, category: category },
            {
                chapterId: dbChapterId,
                title:     data.title,
                order:     data.order || 0,
                summary:   data.summary || {},
                practice:  data.practice || [],
                category:  category
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (result.createdAt === result.updatedAt) {
            created++;
        } else {
            updated++;
        }

        // --- 2. Replace Note docs for this chapter ---
        await Note.deleteMany({ chapterId: dbChapterId, category: category });

        const noteDocs = (data.content || []).map((block, i) => ({
            chapterId: dbChapterId,
            category:  category,
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
            const cat = process.argv[2] || 'class12';
            const baseDir = process.argv[3] || path.resolve(__dirname, '../../../data/12th/notes');
            await seedChapters(cat, baseDir);
            console.log('\n✔ Chapter + Note seed complete.');
            process.exit(0);
        })
        .catch(err => {
            console.error('Connection error:', err.message);
            process.exit(1);
        });
}

module.exports = seedChapters;
