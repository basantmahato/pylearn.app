const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    key: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true 
    },
    label: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
    color: { 
        type: String, 
        default: '#005ab5' 
    },
    lightColor: { 
        type: String, 
        default: '#e8f0ff' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
