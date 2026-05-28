const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Chapter = require('../models/Chapter');

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected.');

        // 1. Delete bad chapters
        const result = await Chapter.deleteMany({ chapterId: { $regex: /^class11-11th-ch/ } });
        console.log(`Deleted ${result.deletedCount} bad chapters.`);

        // 2. Fix JSON files
        const notesDir = path.resolve(__dirname, '../../../data/11th/notes');
        for (let i = 1; i <= 11; i++) {
            const filePath = path.join(notesDir, `ch${i}`, 'notes.json');
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf-8');
                content = content.replace(`"id": "11th-ch${i}"`, `"id": "ch${i}"`);
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log(`Fixed ch${i}/notes.json`);
            }
        }

        console.log('Done fixing JSONs and DB.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fix();
