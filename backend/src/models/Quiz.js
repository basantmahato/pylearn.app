const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    setId: { type: String, required: true },
    setName: { type: String, required: true },
    difficulty: { type: String },
    class: { type: Number, enum: [11, 12], default: 12 },
    questions: [{
        id: String,
        question: String,
        options: [String],
        answer: Number,
        explanation: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
