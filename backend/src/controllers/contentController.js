const Chapter     = require('../models/Chapter');
const Note        = require('../models/Note');
const Quiz        = require('../models/Quiz');
const SamplePaper = require('../models/SamplePaper');

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTERS
// ─────────────────────────────────────────────────────────────────────────────
exports.getChapters = async (req, res) => {
    try {
        const query = {};
        if (req.query.class) {
            const classNum = parseInt(req.query.class);
            // Find chapters with matching class OR without class field (treat as class 12)
            query.$or = [
                { class: classNum },
                { class: { $exists: false } }
            ];
        }
        const chapters = await Chapter.find(query).sort({ order: 1 });
        res.json(chapters);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });
        res.json(chapter);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.createChapter = async (req, res) => {
    try {
        const newChapter = new Chapter(req.body);
        const chapter = await newChapter.save();
        res.status(201).json(chapter);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.updateChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
        );
        if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });
        res.json(chapter);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });
        // Also remove all associated notes
        await Note.deleteMany({ chapterId: chapter.chapterId });
        res.json({ msg: 'Chapter and its notes deleted' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTES
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ chapterId: 1, order: 1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.getNotesByChapter = async (req, res) => {
    try {
        const notes = await Note.find({ chapterId: req.params.chapterId }).sort({ order: 1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.createNote = async (req, res) => {
    try {
        const newNote = new Note(req.body);
        const note = await newNote.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
        );
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        res.json({ msg: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZZES
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllQuizzes = async (req, res) => {
    try {
        const query = {};
        if (req.query.class) {
            const classNum = parseInt(req.query.class);
            query.$or = [
                { class: classNum },
                { class: { $exists: false } }
            ];
        }
        const quizzes = await Quiz.find(query).sort({ chapterId: 1, setId: 1 });
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.getQuizzesByChapter = async (req, res) => {
    try {
        const query = { chapterId: req.params.chapterId };
        if (req.query.class) {
            const classNum = parseInt(req.query.class);
            query.$or = [
                { class: classNum },
                { class: { $exists: false } }
            ];
        }
        const quizzes = await Quiz.find(query);
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.createQuiz = async (req, res) => {
    try {
        const newQuiz = new Quiz(req.body);
        const quiz = await newQuiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
        );
        if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
        res.json({ msg: 'Quiz deleted' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE PAPERS
// ─────────────────────────────────────────────────────────────────────────────
exports.getSamplePapers = async (req, res) => {
    try {
        const query = {};
        if (req.query.class) {
            const classNum = parseInt(req.query.class);
            query.$or = [
                { class: classNum },
                { class: { $exists: false } }
            ];
        }
        const papers = await SamplePaper.find(query)
            .select('-sections')   // exclude heavy sections for listing
            .sort({ paperId: 1 });
        res.json(papers);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.getSamplePaperById = async (req, res) => {
    try {
        const paper = await SamplePaper.findById(req.params.id);
        if (!paper) return res.status(404).json({ msg: 'Sample paper not found' });
        res.json(paper);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.createSamplePaper = async (req, res) => {
    try {
        const newPaper = new SamplePaper(req.body);
        const paper = await newPaper.save();
        res.status(201).json(paper);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.updateSamplePaper = async (req, res) => {
    try {
        const paper = await SamplePaper.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
        );
        if (!paper) return res.status(404).json({ msg: 'Sample paper not found' });
        res.json(paper);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.deleteSamplePaper = async (req, res) => {
    try {
        const paper = await SamplePaper.findByIdAndDelete(req.params.id);
        if (!paper) return res.status(404).json({ msg: 'Sample paper not found' });
        res.json({ msg: 'Sample paper deleted' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
