const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    class: { type: Number, enum: [11, 12], default: 12 },
    summary: {
        short_summary: String,
        detailed_summary: String,
        exam_focus: [String],
        revision_notes: [String]
    },
    practice: [{
        id: String,
        q: String,
        type: { type: String }, // theory, coding
        difficulty: String,
        hints: [String],
        solution: {
            explanation: String,
            code: String,
            example: String
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Chapter', ChapterSchema);
