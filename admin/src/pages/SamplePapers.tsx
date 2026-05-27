import { useEffect, useState } from 'react';
import api from '../api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Plus, Pencil, Trash2, Save, ScrollText, Clock, Star } from 'lucide-react';

interface SectionQuestion {
    id: string;
    question: string;
    options?: string[];
    answer?: number | string;
    marks?: number;
    explanation?: string;
    keywords?: string[];
    hints?: string[];
}

interface Section {
    sectionId: string;
    title: string;
    marks: number;
    questions: SectionQuestion[];
}

interface Paper {
    _id: string;
    paperId: string;
    title: string;
    subtitle?: string;
    duration?: string;
    totalMarks?: number;
    difficulty?: string;
    category: string;
    sections?: Section[];
}

interface Category {
    key: string;
    label: string;
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const SamplePapers = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [papers, setPapers]           = useState<Paper[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading]         = useState(true);
    const [editingId, setEditingId]     = useState<string | null>(null);
    const [editForm, setEditForm]       = useState<Partial<Paper>>({});
    const [viewSections, setViewSections] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/courses');
                if (res.data && res.data.success) {
                    const dbCats = res.data.data.map((c: any) => ({
                        key: c.key,
                        label: c.label
                    }));
                    setCategories(dbCats);
                    if (dbCats.length > 0) {
                        setSelectedCategory(dbCats[0].key);
                    }
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchPapers();
        }
    }, [selectedCategory]);

    const fetchPapers = async () => {
        try {
            const res = await api.get(`/sample-papers?category=${selectedCategory}`);
            setPapers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (paper: Paper) => {
        try {
            const res = await api.get(`/sample-papers/${paper._id}`);
            setEditingId(paper._id);
            setEditForm({ ...res.data, category: res.data.category || selectedCategory });
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewSections = async (paperId: string) => {
        if (viewSections === paperId) { setViewSections(null); return; }
        setViewSections(paperId);
    };

    const handleSave = async () => {
        try {
            const payload = { ...editForm, category: selectedCategory };
            if (editingId && editingId !== 'new') {
                await api.put(`/sample-papers/${editingId}`, payload);
            } else {
                await api.post('/sample-papers', payload);
            }
            setEditingId(null);
            setEditForm({});
            fetchPapers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this sample paper? This cannot be undone.')) return;
        try {
            await api.delete(`/sample-papers/${id}`);
            fetchPapers();
        } catch (err) {
            console.error(err);
        }
    };

    const startNew = () => {
        setEditingId('new');
        setEditForm({
            paperId:    `py-sample-${papers.length + 1}`,
            title:      '',
            subtitle:   '',
            duration:   '90 minutes',
            totalMarks: 100,
            difficulty: 'Medium',
            category: selectedCategory,
            sections:   []
        });
    };

    const addSection = () => {
        const sections = [...(editForm.sections || [])];
        sections.push({
            sectionId: String.fromCharCode(65 + sections.length), // A, B, C…
            title:     'New Section',
            marks:     20,
            questions: []
        });
        setEditForm({ ...editForm, sections });
    };

    const updateSection = (idx: number, key: keyof Section, value: string | number) => {
        const sections = [...(editForm.sections || [])];
        sections[idx] = { ...sections[idx], [key]: value };
        setEditForm({ ...editForm, sections });
    };

    const removeSection = (idx: number) => {
        const sections = (editForm.sections || []).filter((_, i) => i !== idx);
        setEditForm({ ...editForm, sections });
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setPapers([]);
    };

    const difficultyColor = (d?: string) => {
        if (d === 'Easy')   return 'text-emerald-500 bg-emerald-50';
        if (d === 'Hard')   return 'text-rose-500 bg-rose-50';
        return 'text-amber-500 bg-amber-50';
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">
            Loading Sample Papers…
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Sample Papers</h2>
                    <select
                        title="Select Category"
                        value={selectedCategory}
                        onChange={e => handleCategoryChange(e.target.value)}
                        className="px-3 py-2 rounded-md border border-input bg-background"
                    >
                        {categories.map(cat => (
                            <option key={cat.key} value={cat.key}>{cat.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        {papers.length} paper{papers.length !== 1 ? 's' : ''} in the database
                    </p>
                    <Button onClick={startNew} id="add-paper-btn">
                        <Plus className="mr-2 h-4 w-4" /> Add Sample Paper
                    </Button>
                </div>
            </div>

            {editingId && (
                <Card className="border-primary/20 bg-primary/5 max-h-[85vh] overflow-auto">
                    <CardContent className="pt-6 space-y-6">
                        <h3 className="font-bold text-lg border-b pb-2">
                            {editingId === 'new' ? '✚ New Sample Paper' : '✏ Edit Sample Paper'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Paper ID</label>
                                <Input
                                    value={editForm.paperId || ''}
                                    onChange={e => setEditForm({ ...editForm, paperId: e.target.value })}
                                    placeholder="py-sample-22"
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Title</label>
                                <Input
                                    value={editForm.title || ''}
                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    placeholder="Python Mastery Sample Paper"
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Subtitle</label>
                                <Input
                                    value={editForm.subtitle || ''}
                                    onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })}
                                    placeholder="Class 11 Revision — Comprehensive Assessment"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Duration</label>
                                <Input
                                    value={editForm.duration || ''}
                                    onChange={e => setEditForm({ ...editForm, duration: e.target.value })}
                                    placeholder="90 minutes"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Total Marks</label>
                                <Input
                                    type="number"
                                    value={editForm.totalMarks ?? ''}
                                    onChange={e => setEditForm({ ...editForm, totalMarks: Number(e.target.value) })}
                                    placeholder="100"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Difficulty</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editForm.difficulty || 'Medium'}
                                    onChange={e => setEditForm({ ...editForm, difficulty: e.target.value })}
                                    aria-label="Difficulty"
                                >
                                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h4 className="font-bold">Sections ({editForm.sections?.length || 0})</h4>
                                <Button variant="outline" size="sm" onClick={addSection}>
                                    <Plus className="h-3 w-3 mr-1" /> Add Section
                                </Button>
                            </div>
                            {editForm.sections?.map((sec, sIdx) => (
                                <div key={sIdx} className="p-4 border rounded-lg bg-background space-y-3 relative">
                                    <button
                                        className="absolute top-2 right-2 text-destructive hover:opacity-80"
                                        onClick={() => removeSection(sIdx)}
                                        aria-label="Remove Section"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground">Section ID</label>
                                            <Input
                                                value={sec.sectionId}
                                                onChange={e => updateSection(sIdx, 'sectionId', e.target.value)}
                                                placeholder="A"
                                            />
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <label className="text-xs font-semibold text-muted-foreground">Title</label>
                                            <Input
                                                value={sec.title}
                                                onChange={e => updateSection(sIdx, 'title', e.target.value)}
                                                placeholder="Multiple Choice Questions"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground">Marks</label>
                                            <Input
                                                type="number"
                                                value={sec.marks}
                                                onChange={e => updateSection(sIdx, 'marks', Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-primary/5 py-3 border-t">
                            <Button variant="ghost" onClick={() => { setEditingId(null); setEditForm({}); }}>
                                Cancel
                            </Button>
                            <Button id="save-paper-btn" onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> Save Paper
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {papers.map(paper => (
                    <Card key={paper._id} className="hover:shadow-md transition-shadow group">
                        <CardContent className="p-5 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <ScrollText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold leading-tight line-clamp-2 text-sm">{paper.title}</h3>
                                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted border">
                                                {paper.category}
                                            </span>
                                        </div>
                                        {paper.subtitle && (
                                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{paper.subtitle}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(paper)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(paper._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs">
                                {paper.difficulty && (
                                    <span className={`px-2 py-0.5 rounded-full font-medium ${difficultyColor(paper.difficulty)}`}>
                                        <Star className="inline h-3 w-3 mr-0.5" />
                                        {paper.difficulty}
                                    </span>
                                )}
                                {paper.duration && (
                                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                        <Clock className="inline h-3 w-3 mr-0.5" />
                                        {paper.duration}
                                    </span>
                                )}
                                {paper.totalMarks !== undefined && (
                                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                        {paper.totalMarks} marks
                                    </span>
                                )}
                            </div>

                            <button
                                className="text-xs text-primary underline-offset-2 hover:underline text-left"
                                onClick={() => handleViewSections(paper._id)}
                            >
                                {viewSections === paper._id ? 'Hide sections ▲' : 'View sections ▼'}
                            </button>

                            {viewSections === paper._id && (
                                <SectionPreview paperId={paper._id} />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {papers.length === 0 && !editingId && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
                    <ScrollText className="h-12 w-12 opacity-30" />
                    <p>No sample papers found for this category.</p>
                </div>
            )}
        </div>
    );
};

const SectionPreview = ({ paperId }: { paperId: string }) => {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        api.get(`/sample-papers/${paperId}`)
            .then(res => setSections(res.data.sections || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [paperId]);

    if (loading) return <p className="text-xs text-muted-foreground animate-pulse">Loading…</p>;

    return (
        <div className="space-y-1">
            {sections.map(sec => (
                <div key={sec.sectionId} className="flex justify-between items-center text-xs px-2 py-1 rounded bg-muted/50">
                    <span className="font-medium">Section {sec.sectionId}: {sec.title}</span>
                    <span className="text-muted-foreground">{sec.questions?.length || 0} Qs · {sec.marks} marks</span>
                </div>
            ))}
        </div>
    );
};

export default SamplePapers;
