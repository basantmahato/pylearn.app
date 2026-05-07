const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    chapterId: { type: String, required: true }, // Linking via chapterId string
    type: { type: String, required: true }, // paragraph, bullet_list, code
    heading: { type: String },
    text: { type: String },
    items: [String], // For bullet_list
    code: { type: String },
    language: { type: String },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
