const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    author: { type: String, default: 'PyLearn Team' },
    tags: [{ type: String }],
    category: { type: String, default: 'General' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: [{ type: String }],
    publishedAt: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    readingTime: { type: Number, default: 0 },
    linkedChapterId: { type: String, default: null },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save hook to calculate reading time
BlogSchema.pre('save', function(next) {
    if (this.content) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }
    next();
});

module.exports = mongoose.model('Blog', BlogSchema);
