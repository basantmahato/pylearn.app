require('dotenv').config();
const mongoose = require('mongoose');
const SamplePaper = require('../models/SamplePaper');

async function migrateSamplePapers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update all sample papers without a class field to class: 12
        const result = await SamplePaper.updateMany(
            { class: { $exists: false } },
            { class: 12 }
        );

        console.log(`Updated ${result.modifiedCount} sample papers to class: 12`);

        // Verify the update
        const papers = await SamplePaper.find({});
        console.log(`Total sample papers in database: ${papers.length}`);
        console.log('Sample papers:', papers.slice(0, 3).map(p => ({
            paperId: p.paperId,
            title: p.title,
            class: p.class
        })));

        await mongoose.connection.close();
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

migrateSamplePapers();
