const mongoose = require('mongoose');

const CATEGORIES = ['class11', 'class12', 'bca', 'btech', 'aiml'];

const NoteSchema = new mongoose.Schema({
    chapterId: { type: String, required: true }, // Linking via chapterId string
    category:  { type: String, enum: CATEGORIES, default: 'class12' }, // Mandatory for separation
    type:      { type: String, required: true }, // paragraph, bullet_list, code
    heading:   { type: String },
    text:      { type: String },
    items:     [String], // For bullet_list
    code:      { type: String },
    language:  { type: String },
    order:     { type: Number, default: 0 }
}, { timestamps: true });

// Index for faster lookups
NoteSchema.index({ chapterId: 1, category: 1 });

module.exports = mongoose.model('Note', NoteSchema);
