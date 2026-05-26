const mongoose = require('mongoose');

const CATEGORIES = ['class11', 'class12', 'bca', 'btech', 'aiml'];

const QuizSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    setId: { type: String, required: true },
    setName: { type: String, required: true },
    difficulty: { type: String },
    category: { type: String, enum: CATEGORIES, default: 'class12' },
    questions: [{
        id: String,
        question: String,
        options: [String],
        answer: Number,
        explanation: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
