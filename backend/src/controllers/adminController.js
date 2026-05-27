const Admin = require('../models/Admin');
const Chapter = require('../models/Chapter');
const Note = require('../models/Note');
const Quiz = require('../models/Quiz');
const SamplePaper = require('../models/SamplePaper');
const Blog = require('../models/Blog');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        let admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            admin: { id: admin.id }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        // Retrieve all course keys dynamically from DB
        const dbCourses = await Course.find({}, 'key');
        const categories = dbCourses.map(c => c.key);

        // 1. Total counts across all models
        const totalChapters = await Chapter.countDocuments();
        const totalNotes = await Note.countDocuments();
        const totalQuizzes = await Quiz.countDocuments();
        const totalSamplePapers = await SamplePaper.countDocuments();
        const totalBlogs = await Blog.countDocuments();

        // 2. Breakdown per category
        const categoryStats = {};
        for (const cat of categories) {
            categoryStats[cat] = {
                chapters: await Chapter.countDocuments({ category: cat }),
                quizzes: await Quiz.countDocuments({ category: cat }),
                samplePapers: await SamplePaper.countDocuments({ category: cat }),
                notes: await Note.countDocuments({ category: cat })
            };
        }

        // 3. Blog specific metrics
        const blogStats = {
            total: totalBlogs,
            published: await Blog.countDocuments({ status: 'published' }),
            draft: await Blog.countDocuments({ status: 'draft' }),
            featured: await Blog.countDocuments({ isFeatured: true })
        };

        // 4. Practice and Quiz Questions Counts
        const chapters = await Chapter.find({}, 'practice');
        const totalPracticeQuestions = chapters.reduce((acc, ch) => acc + (ch.practice ? ch.practice.length : 0), 0);

        const quizzes = await Quiz.find({}, 'questions');
        const totalQuizQuestions = quizzes.reduce((acc, q) => acc + (q.questions ? q.questions.length : 0), 0);

        res.json({
            success: true,
            summary: {
                totalChapters,
                totalNotes,
                totalQuizzes,
                totalSamplePapers,
                totalBlogs,
                totalPracticeQuestions,
                totalQuizQuestions
            },
            categories: categoryStats,
            blogs: blogStats
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ success: false, msg: 'Server Error fetching dashboard stats' });
    }
};
