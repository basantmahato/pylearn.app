require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Chapter = require('../models/Chapter');
const Note = require('../models/Note');
const Quiz = require('../models/Quiz');

const APP_DATA_PATH = path.join(__dirname, '../../../APP/data');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Chapter.deleteMany({});
        await Note.deleteMany({});
        await Quiz.deleteMany({});
        console.log('Cleared existing collections');

        const chaptersPath = path.join(APP_DATA_PATH, 'notes');
        const chapterDirs = fs.readdirSync(chaptersPath).filter(f => fs.statSync(path.join(chaptersPath, f)).isDirectory());

        for (const dir of chapterDirs) {
            const notesFile = path.join(chaptersPath, dir, 'notes.json');
            if (fs.existsSync(notesFile)) {
                const data = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
                
                // Create Chapter
                const chapter = new Chapter({
                    chapterId: data.id,
                    title: data.title,
                    order: data.order,
                    summary: data.summary,
                    practice: data.practice
                });
                await chapter.save();
                console.log(`Migrated Chapter: ${data.title}`);

                // Create Notes (Content Items)
                if (data.content && Array.isArray(data.content)) {
                    for (let i = 0; i < data.content.length; i++) {
                        const item = data.content[i];
                        const note = new Note({
                            chapterId: data.id,
                            type: item.type,
                            heading: item.heading,
                            text: item.text,
                            items: item.items,
                            code: item.code,
                            language: item.language,
                            order: i
                        });
                        await note.save();
                    }
                    console.log(`Migrated ${data.content.length} content items for ${data.id}`);
                }
            }
        }

        const quizPath = path.join(APP_DATA_PATH, 'quiz');
        const quizFiles = fs.readdirSync(quizPath).filter(f => f.endsWith('.json'));

        for (const file of quizFiles) {
            const data = JSON.parse(fs.readFileSync(path.join(quizPath, file), 'utf8'));
            if (data.sets && Array.isArray(data.sets)) {
                for (const set of data.sets) {
                    const quizSet = new Quiz({
                        chapterId: data.chapterId,
                        setId: set.setId,
                        setName: set.setName,
                        difficulty: set.difficulty,
                        questions: set.questions
                    });
                    await quizSet.save();
                }
                console.log(`Migrated ${data.sets.length} quiz sets for ${data.chapterId}`);
            }
        }

        console.log('Migration completed successfully');
        process.exit();
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

migrate();
