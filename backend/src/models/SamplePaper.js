const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    id: String,
    question: String,
    options: [String],
    answer: mongoose.Schema.Types.Mixed,   // Number or String
    marks: Number,
    explanation: String,
    keywords: [String],
    hints: [String]
}, { _id: false });

const SectionSchema = new mongoose.Schema({
    sectionId: { type: String, required: true },
    title: { type: String, required: true },
    marks: Number,
    questions: [QuestionSchema]
}, { _id: false });

const CATEGORIES = ['class11', 'class12', 'bca', 'btech', 'aiml'];

const SamplePaperSchema = new mongoose.Schema({
    paperId:    { type: String, required: true, unique: true },
    title:      { type: String, required: true },
    subtitle:   { type: String },
    duration:   { type: String },
    totalMarks: { type: Number },
    difficulty: { type: String },
    category:   { type: String, enum: CATEGORIES, default: 'class12' },
    sections:   [SectionSchema]
}, { timestamps: true });

module.exports = mongoose.model('SamplePaper', SamplePaperSchema);
