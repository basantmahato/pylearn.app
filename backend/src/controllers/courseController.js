const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Note = require('../models/Note');
const Quiz = require('../models/Quiz');
const SamplePaper = require('../models/SamplePaper');

// Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).sort({ createdAt: 1 });
        res.json({ success: true, data: courses });
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ success: false, msg: 'Server Error fetching courses' });
    }
};

// Create a new course
exports.createCourse = async (req, res) => {
    const { key, label, description, color, lightColor } = req.body;

    if (!key || !label) {
        return res.status(400).json({ success: false, msg: 'Key and Label are required.' });
    }

    try {
        const cleanKey = key.trim().toLowerCase();
        let existingCourse = await Course.findOne({ key: cleanKey });
        if (existingCourse) {
            return res.status(400).json({ success: false, msg: 'A course with this key already exists.' });
        }

        const newCourse = new Course({
            key: cleanKey,
            label: label.trim(),
            description: description ? description.trim() : '',
            color: color || '#005ab5',
            lightColor: lightColor || '#e8f0ff'
        });

        await newCourse.save();
        res.status(201).json({ success: true, data: newCourse });
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ success: false, msg: 'Server Error creating course' });
    }
};

// Update an existing course
exports.updateCourse = async (req, res) => {
    const { label, description, color, lightColor } = req.body;
    const { id } = req.params;

    try {
        let course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ success: false, msg: 'Course not found.' });
        }

        if (label) course.label = label.trim();
        if (description !== undefined) course.description = description.trim();
        if (color) course.color = color;
        if (lightColor) course.lightColor = lightColor;

        await course.save();
        res.json({ success: true, data: course });
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ success: false, msg: 'Server Error updating course' });
    }
};

// Delete a course (with safety validation)
exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ success: false, msg: 'Course not found.' });
        }

        const courseKey = course.key;

        // Safety Validation: Check if there is any active content bound to this category
        const chaptersCount = await Chapter.countDocuments({ category: courseKey });
        const notesCount = await Note.countDocuments({ category: courseKey });
        const quizzesCount = await Quiz.countDocuments({ category: courseKey });
        const samplePapersCount = await SamplePaper.countDocuments({ category: courseKey });

        if (chaptersCount > 0 || notesCount > 0 || quizzesCount > 0 || samplePapersCount > 0) {
            return res.status(400).json({
                success: false,
                msg: `Cannot delete course category '${course.label}'. It is currently in use by: ` +
                     `[${chaptersCount} chapters, ${notesCount} notes, ${quizzesCount} quizzes, ${samplePapersCount} sample papers]. ` +
                     `Please reassign or delete these contents first.`
            });
        }

        await Course.findByIdAndDelete(id);
        res.json({ success: true, msg: 'Course deleted successfully.' });
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ success: false, msg: 'Server Error deleting course' });
    }
};
