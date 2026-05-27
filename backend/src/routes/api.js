const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController   = require('../controllers/adminController');
const contentController = require('../controllers/contentController');
const blogController = require('../controllers/blogController');
const courseController = require('../controllers/courseController');
const validate = require('../middleware/validate');
const { chapterSchema, noteSchema, quizSchema } = require('../validations/schemas');
const notificationController = require('../controllers/notificationController');
const contactController = require('../controllers/contactController');

// ── Admin Auth ───────────────────────────────────────────────────────────────
router.post('/admin/login', adminController.login);
router.get('/admin/dashboard-stats', auth, adminController.getDashboardStats);

// ── Dynamic Courses & Categories ─────────────────────────────────────────────
router.get   ('/courses',            courseController.getCourses);
router.post  ('/admin/courses',      auth, courseController.createCourse);
router.put   ('/admin/courses/:id',  auth, courseController.updateCourse);
router.delete('/admin/courses/:id',  auth, courseController.deleteCourse);

// ── Chapters ─────────────────────────────────────────────────────────────────
router.get   ('/chapters',     contentController.getChapters);
router.get   ('/chapters/:id', contentController.getChapterById);
router.post  ('/chapters',     auth, validate(chapterSchema), contentController.createChapter);
router.put   ('/chapters/:id', auth, validate(chapterSchema), contentController.updateChapter);
router.delete('/chapters/:id', auth, contentController.deleteChapter);

// ── Notes ────────────────────────────────────────────────────────────────────
router.get   ('/notes',                contentController.getAllNotes);
router.get   ('/notes/:chapterId',     contentController.getNotesByChapter);
router.post  ('/notes',                auth, validate(noteSchema), contentController.createNote);
router.put   ('/notes/:id',            auth, validate(noteSchema), contentController.updateNote);
router.delete('/notes/:id',            auth, contentController.deleteNote);

// ── Quizzes ──────────────────────────────────────────────────────────────────
router.get   ('/quizzes',              contentController.getAllQuizzes);
router.get   ('/quizzes/:chapterId',   contentController.getQuizzesByChapter);
router.post  ('/quizzes',              auth, validate(quizSchema), contentController.createQuiz);
router.put   ('/quizzes/:id',          auth, validate(quizSchema), contentController.updateQuiz);
router.delete('/quizzes/:id',          auth, contentController.deleteQuiz);

// ── Sample Papers ─────────────────────────────────────────────────────────────
router.get   ('/sample-papers',        contentController.getSamplePapers);
router.get   ('/sample-papers/:id',    contentController.getSamplePaperById);
router.post  ('/sample-papers',        auth, contentController.createSamplePaper);
router.put   ('/sample-papers/:id',    auth, contentController.updateSamplePaper);
router.delete('/sample-papers/:id',    auth, contentController.deleteSamplePaper);

// ── Blogs ─────────────────────────────────────────────────────────────────────
// Public routes
router.get   ('/blogs',                blogController.getAllBlogs);
router.get   ('/blogs/featured',       blogController.getFeaturedBlogs);
router.get   ('/blogs/chapter/:chapterId', blogController.getBlogsByChapter);
router.get   ('/blogs/:slug',          blogController.getBlogBySlug);

// Admin routes
router.get   ('/admin/blogs',          auth, blogController.getAllBlogsAdmin);
router.post  ('/blogs',                auth, blogController.createBlog);
router.put   ('/blogs/:id',            auth, blogController.updateBlog);
router.delete('/blogs/:id',            auth, blogController.deleteBlog);
// ── Ads Configuration ────────────────────────────────────────────────────────
const AdConfig = require('../models/AdConfig');

// Public route to get current Ads config (for mobile app client)
router.get('/ads/config', async (req, res) => {
    try {
        let config = await AdConfig.findOne();
        if (!config) {
            config = new AdConfig();
            await config.save();
        }
        res.json(config);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Admin route to get current Ads config (for admin editor)
router.get('/admin/ads/config', auth, async (req, res) => {
    try {
        let config = await AdConfig.findOne();
        if (!config) {
            config = new AdConfig();
            await config.save();
        }
        res.json(config);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Admin route to update/create Ads config
router.post('/admin/ads/config', auth, async (req, res) => {
    try {
        let config = await AdConfig.findOne();
        if (!config) {
            config = new AdConfig(req.body);
        } else {
            Object.assign(config, req.body);
        }
        await config.save();
        res.json({ success: true, config });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// ── Push Notifications ────────────────────────────────────────────────────────
router.post('/devices/register', notificationController.registerDeviceToken);
router.post('/admin/notifications/send', auth, notificationController.sendPushNotification);
router.get('/admin/notifications/config', auth, notificationController.getNotificationConfig);
router.post('/admin/notifications/config', auth, notificationController.updateNotificationConfig);

// ── Contact Inquiries ────────────────────────────────────────────────────────
router.post('/contacts', contactController.createContact);
router.get('/admin/contacts', auth, contactController.getContacts);
router.delete('/admin/contacts/:id', auth, contactController.deleteContact);

module.exports = router;
