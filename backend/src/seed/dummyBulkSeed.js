require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const Chapter = require('../models/Chapter');
const Note = require('../models/Note');
const Quiz = require('../models/Quiz');
const SamplePaper = require('../models/SamplePaper');

const CATEGORIES = ['class11', 'bca', 'btech', 'aiml'];

const generateDummyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        // Clear existing dummy data for these categories to avoid duplicates
        console.log('🧹 Cleaning existing dummy data for selected categories...');
        await Chapter.deleteMany({ category: { $in: CATEGORIES } });
        await Note.deleteMany({ category: { $in: CATEGORIES } });
        await Quiz.deleteMany({ category: { $in: CATEGORIES } });
        await SamplePaper.deleteMany({ category: { $in: CATEGORIES } });

        for (const cat of CATEGORIES) {
            console.log(`\n🌱 Seeding category: ${cat}`);

            // 1. Create Chapters
            for (let i = 1; i <= 3; i++) {
                const chapterId = `${cat}-ch${i}`;
                const chapterTitle = `${cat.toUpperCase()} Chapter ${i}: Introduction to ${cat} Basics`;
                
                await Chapter.create({
                    chapterId,
                    title: chapterTitle,
                    order: i,
                    category: cat,
                    summary: {
                        short_summary: `This is a short summary for ${chapterTitle}.`,
                        detailed_summary: `This is a detailed summary for ${chapterTitle}. It covers the fundamental concepts of ${cat} in the ${i}-th chapter.`,
                        exam_focus: ['Important Concept A', 'Key Formula B', 'Common Question C'],
                        revision_notes: ['Review section 1.1', 'Practice diagram 1.2']
                    },
                    practice: [
                        {
                            id: `p1`,
                            q: `What is the main purpose of ${cat}?`,
                            type: 'theory',
                            difficulty: 'Easy',
                            hints: ['Think about its application.'],
                            solution: { explanation: `The main purpose is to provide a structured way to handle ${cat} related tasks.` }
                        }
                    ]
                });

                // 2. Create Notes for this chapter
                await Note.insertMany([
                    {
                        chapterId,
                        category: cat,
                        type: 'paragraph',
                        heading: 'Introduction',
                        text: `Welcome to ${chapterTitle}. In this section, we will explore the core pillars of ${cat}.`,
                        order: 0
                    },
                    {
                        chapterId,
                        category: cat,
                        type: 'bullet_list',
                        heading: 'Key Objectives',
                        items: ['Understand the basics', 'Master the syntax', 'Apply to real-world problems'],
                        order: 1
                    },
                    {
                        chapterId,
                        category: cat,
                        type: 'code',
                        heading: 'Example Implementation',
                        code: `function hello${cat}() {\n  console.log("Hello from ${cat}!");\n}`,
                        language: 'javascript',
                        order: 2
                    }
                ]);

                // 3. Create Quizzes for this chapter
                await Quiz.create({
                    chapterId,
                    setId: `set1`,
                    setName: `${cat.toUpperCase()} Quiz 1`,
                    difficulty: 'Medium',
                    category: cat,
                    questions: [
                        {
                            id: 'q1',
                            question: `Which of the following is a feature of ${cat}?`,
                            options: ['Option A', 'Option B', 'Option C', 'All of the above'],
                            answer: 3,
                            explanation: 'All the mentioned options are key features.'
                        },
                        {
                            id: 'q2',
                            question: `True or False: ${cat} is widely used in the industry.`,
                            options: ['True', 'False'],
                            answer: 0,
                            explanation: 'Yes, it is one of the most popular choices.'
                        }
                    ]
                });
            }

            // 4. Create Sample Papers
            for (let j = 1; j <= 2; j++) {
                const paperId = `${cat}-paper-${j}`;
                await SamplePaper.create({
                    paperId,
                    title: `${cat.toUpperCase()} Sample Paper ${j}`,
                    subtitle: `Annual Assessment ${new Date().getFullYear()}`,
                    duration: '3 Hours',
                    totalMarks: 100,
                    difficulty: j === 1 ? 'Medium' : 'Hard',
                    category: cat,
                    sections: [
                        {
                            sectionId: 'sec-a',
                            title: 'Section A: Multiple Choice',
                            marks: 20,
                            questions: [
                                {
                                    id: 'sq1',
                                    question: `Sample question for ${cat} in Paper ${j}?`,
                                    options: ['X', 'Y', 'Z', 'W'],
                                    answer: 1,
                                    marks: 2,
                                    explanation: 'Y is the correct answer because...'
                                }
                            ]
                        }
                    ]
                });
            }
        }

        console.log('\n🎉 Bulk seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Seed failed:', err);
        process.exit(1);
    }
};

generateDummyData();
