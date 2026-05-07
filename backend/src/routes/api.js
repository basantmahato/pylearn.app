const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController   = require('../controllers/adminController');
const contentController = require('../controllers/contentController');
const blogController = require('../controllers/blogController');

// ── Admin Auth ───────────────────────────────────────────────────────────────
router.post('/admin/login', adminController.login);

// ── Chapters ─────────────────────────────────────────────────────────────────
router.get   ('/chapters',     contentController.getChapters);
router.get   ('/chapters/:id', contentController.getChapterById);
router.post  ('/chapters',     auth, contentController.createChapter);
router.put   ('/chapters/:id', auth, contentController.updateChapter);
router.delete('/chapters/:id', auth, contentController.deleteChapter);

// ── Notes ────────────────────────────────────────────────────────────────────
router.get   ('/notes',                contentController.getAllNotes);
router.get   ('/notes/:chapterId',     contentController.getNotesByChapter);
router.post  ('/notes',                auth, contentController.createNote);
router.put   ('/notes/:id',            auth, contentController.updateNote);
router.delete('/notes/:id',            auth, contentController.deleteNote);

// ── Quizzes ──────────────────────────────────────────────────────────────────
router.get   ('/quizzes',              contentController.getAllQuizzes);
router.get   ('/quizzes/:chapterId',   contentController.getQuizzesByChapter);
router.post  ('/quizzes',              auth, contentController.createQuiz);
router.put   ('/quizzes/:id',          auth, contentController.updateQuiz);
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

module.exports = router;
