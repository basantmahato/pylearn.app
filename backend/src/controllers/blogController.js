const Blog = require('../models/Blog');

// Public: Get all published blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const { category, tag, limit = 10, page = 1 } = req.query;
        const query = { status: 'published' };
        
        if (category) query.category = category;
        if (tag) query.tags = { $in: [tag] };
        
        const blogs = await Blog.find(query)
            .sort({ publishedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');
        
        const count = await Blog.countDocuments(query);
        
        res.json({
            blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Public: Get single blog by slug (for SEO-friendly URLs)
exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ 
            slug: req.params.slug, 
            status: 'published' 
        }).select('-__v');
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Public: Get blogs by chapter
exports.getBlogsByChapter = async (req, res) => {
    try {
        const blogs = await Blog.find({
            linkedChapterId: req.params.chapterId,
            status: 'published'
        }).sort({ publishedAt: -1 }).select('-__v');
        
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Public: Get featured blogs
exports.getFeaturedBlogs = async (req, res) => {
    try {
        const limit = req.query.limit || 3;
        const blogs = await Blog.find({
            isFeatured: true,
            status: 'published'
        })
        .sort({ publishedAt: -1 })
        .limit(limit * 1)
        .select('-__v');
        
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Create blog
exports.createBlog = async (req, res) => {
    try {
        const blog = new Blog(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Slug already exists' });
        }
        res.status(400).json({ message: err.message });
    }
};

// Admin: Update blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        res.json(blog);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Slug already exists' });
        }
        res.status(400).json({ message: err.message });
    }
};

// Admin: Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Get all blogs (including drafts)
exports.getAllBlogsAdmin = async (req, res) => {
    try {
        const { status, search, limit = 20, page = 1 } = req.query;
        const query = {};
        
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } }
            ];
        }
        
        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');
        
        const count = await Blog.countDocuments(query);
        
        res.json({
            blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
