import { useEffect, useState } from 'react';
import api from '../api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, Star, Search } from 'lucide-react';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    tags: string[];
    category: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    publishedAt: string;
    status: 'draft' | 'published';
    readingTime: number;
    linkedChapterId: string | null;
    isFeatured: boolean;
    createdAt: string;
}

interface Chapter {
    chapterId: string;
    title: string;
}

const Blogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [editForm, setEditForm] = useState<Partial<Blog>>({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        author: 'PyLearn Team',
        tags: [],
        category: 'General',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: [],
        publishedAt: new Date().toISOString().split('T')[0],
        status: 'draft',
        isFeatured: false,
        linkedChapterId: null
    });

    useEffect(() => {
        fetchBlogs();
        fetchChapters();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await api.get('/admin/blogs');
            setBlogs(res.data.blogs || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchChapters = async () => {
        try {
            const res = await api.get('/chapters');
            setChapters(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (blog: Blog) => {
        setEditingId(blog._id);
        setIsAdding(false);
        setEditForm({
            ...blog,
            tags: blog.tags || [],
            metaKeywords: blog.metaKeywords || [],
            publishedAt: blog.publishedAt ? blog.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0]
        });
    };

    const handleAddNew = () => {
        setIsAdding(true);
        setEditingId(null);
        setEditForm({
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            featuredImage: '',
            author: 'PyLearn Team',
            tags: [],
            category: 'General',
            metaTitle: '',
            metaDescription: '',
            metaKeywords: [],
            publishedAt: new Date().toISOString().split('T')[0],
            status: 'draft',
            isFeatured: false,
            linkedChapterId: null
        });
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 60);
    };

    const handleTitleChange = (title: string) => {
        setEditForm(prev => ({
            ...prev,
            title,
            slug: prev.slug || generateSlug(title),
            metaTitle: prev.metaTitle || title
        }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...editForm,
                tags: (typeof editForm.tags === 'string' 
                    ? (editForm.tags as string).split(',').map(t => t.trim()).filter(Boolean)
                    : editForm.tags) as string[],
                metaKeywords: (typeof editForm.metaKeywords === 'string'
                    ? (editForm.metaKeywords as string).split(',').map(k => k.trim()).filter(Boolean)
                    : editForm.metaKeywords) as string[],
                publishedAt: new Date(editForm.publishedAt || Date.now())
            };

            if (editingId) {
                await api.put(`/blogs/${editingId}`, payload);
            } else {
                await api.post('/blogs', payload);
            }
            setEditingId(null);
            setIsAdding(false);
            fetchBlogs();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error saving blog');
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await api.delete(`/blogs/${id}`);
                fetchBlogs();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleToggleStatus = async (blog: Blog) => {
        try {
            const newStatus = blog.status === 'published' ? 'draft' : 'published';
            await api.put(`/blogs/${blog._id}`, { status: newStatus });
            fetchBlogs();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleFeatured = async (blog: Blog) => {
        try {
            await api.put(`/blogs/${blog._id}`, { isFeatured: !blog.isFeatured });
            fetchBlogs();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             blog.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Blog Management</h2>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add Blog
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-md border border-input bg-background"
                >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            {/* Blog Form */}
            {(isAdding || editingId) && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Title *</label>
                                <Input
                                    placeholder="Blog title"
                                    value={editForm.title}
                                    onChange={e => handleTitleChange(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Slug *</label>
                                <Input
                                    placeholder="url-friendly-slug"
                                    value={editForm.slug}
                                    onChange={e => setEditForm({...editForm, slug: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Category</label>
                                <Input
                                    placeholder="e.g., Python Tips"
                                    value={editForm.category}
                                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Excerpt *</label>
                                <textarea
                                    className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
                                    placeholder="Short description for blog cards..."
                                    value={editForm.excerpt}
                                    onChange={e => setEditForm({...editForm, excerpt: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Content (HTML) *</label>
                                <textarea
                                    className="w-full min-h-[200px] px-3 py-2 rounded-md border border-input bg-background font-mono text-sm"
                                    placeholder="<h2>Heading</h2><p>Content...</p>"
                                    value={editForm.content}
                                    onChange={e => setEditForm({...editForm, content: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Featured Image URL</label>
                                <Input
                                    placeholder="https://..."
                                    value={editForm.featuredImage}
                                    onChange={e => setEditForm({...editForm, featuredImage: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Author</label>
                                <Input
                                    placeholder="Author name"
                                    value={editForm.author}
                                    onChange={e => setEditForm({...editForm, author: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Tags (comma separated)</label>
                                <Input
                                    placeholder="Python, CBSE, Tips"
                                    value={Array.isArray(editForm.tags) ? editForm.tags.join(', ') : editForm.tags}
                                    onChange={e => setEditForm({...editForm, tags: e.target.value as any})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Linked Chapter</label>
                                <select
                                    value={editForm.linkedChapterId || ''}
                                    onChange={e => setEditForm({...editForm, linkedChapterId: e.target.value || null})}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="">None (Standalone)</option>
                                    {chapters.map(ch => (
                                        <option key={ch.chapterId} value={ch.chapterId}>{ch.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Published Date</label>
                                <Input
                                    type="date"
                                    value={editForm.publishedAt}
                                    onChange={e => setEditForm({...editForm, publishedAt: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Status</label>
                                <select
                                    value={editForm.status}
                                    onChange={e => setEditForm({...editForm, status: e.target.value as 'draft' | 'published'})}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    checked={editForm.isFeatured}
                                    onChange={e => setEditForm({...editForm, isFeatured: e.target.checked})}
                                    className="h-4 w-4"
                                />
                                <label htmlFor="isFeatured" className="text-sm font-medium">Featured on Homepage</label>
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="pt-4 border-t border-border">
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">SEO Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">Meta Title</label>
                                    <Input
                                        placeholder="SEO title"
                                        value={editForm.metaTitle}
                                        onChange={e => setEditForm({...editForm, metaTitle: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">Meta Keywords (comma separated)</label>
                                    <Input
                                        placeholder="keyword1, keyword2"
                                        value={Array.isArray(editForm.metaKeywords) ? editForm.metaKeywords.join(', ') : editForm.metaKeywords}
                                        onChange={e => setEditForm({...editForm, metaKeywords: e.target.value as any})}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">Meta Description</label>
                                    <textarea
                                        className="w-full min-h-[60px] px-3 py-2 rounded-md border border-input bg-background"
                                        placeholder="SEO description..."
                                        value={editForm.metaDescription}
                                        onChange={e => setEditForm({...editForm, metaDescription: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="ghost" onClick={() => { setEditingId(null); setIsAdding(false); }}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> Save Blog
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Blog List */}
            <div className="grid gap-4">
                {filteredBlogs.map(blog => (
                    <Card key={blog._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold truncate">{blog.title}</h3>
                                        {blog.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                                        <span className={`text-xs px-2 py-0.5 rounded ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {blog.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">/{blog.slug}</p>
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        <span>{blog.category}</span>
                                        <span>•</span>
                                        <span>{blog.author}</span>
                                        <span>•</span>
                                        <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                                        {blog.readingTime > 0 && (
                                            <><span>•</span><span>{blog.readingTime} min read</span></>
                                        )}
                                    </div>
                                    {blog.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {blog.tags.map((tag, i) => (
                                                <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 rounded">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleToggleStatus(blog)}
                                        title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                                    >
                                        {blog.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleToggleFeatured(blog)}
                                        title={blog.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                                        className={blog.isFeatured ? 'text-yellow-500' : ''}
                                    >
                                        <Star className={`h-4 w-4 ${blog.isFeatured ? 'fill-yellow-500' : ''}`} />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => handleEdit(blog)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(blog._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Blogs;
