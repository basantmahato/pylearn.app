require('dotenv').config();
const mongoose = require('mongoose');
const Chapter = require('../models/Chapter');

async function migrateChapters() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update all chapters without a class field to class: 12
        const result = await Chapter.updateMany(
            { class: { $exists: false } },
            { class: 12 }
        );

        console.log(`Updated ${result.modifiedCount} chapters to class: 12`);

        // Verify the update
        const chapters = await Chapter.find({});
        console.log(`Total chapters in database: ${chapters.length}`);
        console.log('Sample chapters:', chapters.slice(0, 3).map(c => ({
            chapterId: c.chapterId,
            title: c.title,
            class: c.class
        })));

        await mongoose.connection.close();
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

migrateChapters();
