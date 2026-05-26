import { useEffect, useState } from 'react';
import api from '../api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Plus, Pencil, Trash2, Save, X, FileText, Code, List, ChevronDown, ChevronUp } from 'lucide-react';

interface Chapter {
    _id: string;
    chapterId: string;
    title: string;
    order: number;
    category: string;
}

const CATEGORIES = [
    { key: 'class12', label: 'Class 12', color: 'bg-blue-100 text-blue-700' },
    { key: 'class11', label: 'Class 11', color: 'bg-purple-100 text-purple-700' },
    { key: 'bca',     label: 'BCA',     color: 'bg-green-100 text-green-700' },
    { key: 'btech',   label: 'B.Tech',  color: 'bg-yellow-100 text-yellow-700' },
    { key: 'aiml',    label: 'AI / ML & Data Sci', color: 'bg-red-100 text-red-700' },
] as const;

interface Note {
    _id: string;
    chapterId: string;
    type: 'paragraph' | 'bullet_list' | 'code';
    heading?: string;
    text?: string;
    items?: string[];
    code?: string;
    language?: string;
    order: number;
}

const Chapters = () => {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Chapter>>({});
    const [isAdding, setIsAdding] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('class12');
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
    const [notes, setNotes] = useState<Record<string, Note[]>>({});
    const [editingNote, setEditingNote] = useState<{ chapterId: string, noteId: string | null, form: Partial<Note> } | null>(null);

    useEffect(() => {
        fetchChapters();
    }, [selectedCategory]);

    const fetchChapters = async () => {
        try {
            const res = await api.get(`/chapters?category=${selectedCategory}`);
            setChapters(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (chapter: Chapter) => {
        setEditingId(chapter._id);
        setEditForm({ ...chapter, category: chapter.category || 'class12' });
        setIsAdding(false);
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await api.put(`/chapters/${editingId}`, editForm);
            } else {
                await api.post('/chapters', editForm);
            }
            setEditingId(null);
            setIsAdding(false);
            fetchChapters();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this chapter?')) {
            try {
                await api.delete(`/chapters/${id}`);
                fetchChapters();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const fetchNotes = async (chapterId: string) => {
        try {
            const res = await api.get(`/notes/${chapterId}?category=${selectedCategory}`);
            setNotes(prev => ({ ...prev, [chapterId]: res.data }));
        } catch (err) {
            console.error(err);
        }
    };

    const toggleExpand = async (chapterId: string) => {
        if (expandedChapter === chapterId) {
            setExpandedChapter(null);
        } else {
            setExpandedChapter(chapterId);
            if (!notes[chapterId]) {
                await fetchNotes(chapterId);
            }
        }
    };

    const addNote = (chapterId: string, type: 'paragraph' | 'bullet_list' | 'code') => {
        const chapterNotes = notes[chapterId] || [];
        setEditingNote({
            chapterId,
            noteId: null,
            form: {
                type,
                heading: '',
                text: '',
                items: type === 'bullet_list' ? [''] : [],
                code: '',
                language: 'python',
                order: chapterNotes.length
            }
        });
    };

    const editNote = (chapterId: string, note: Note) => {
        setEditingNote({
            chapterId,
            noteId: note._id,
            form: note
        });
    };

    const saveNote = async () => {
        if (!editingNote) return;
        const { chapterId, noteId, form } = editingNote;
        try {
            if (noteId) {
                await api.put(`/notes/${noteId}`, form);
            } else {
                await api.post('/notes', { ...form, chapterId });
            }
            setEditingNote(null);
            await fetchNotes(chapterId);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNote = async (noteId: string, chapterId: string) => {
        if (window.confirm('Delete this note?')) {
            try {
                await api.delete(`/notes/${noteId}`);
                await fetchNotes(chapterId);
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Chapters</h2>
                <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => { setSelectedCategory(cat.key); setEditingId(null); setIsAdding(false); }}
                                className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                                    selectedCategory === cat.key
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background border-input hover:bg-accent'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                        <Button onClick={() => { setIsAdding(true); setEditingId(null); setEditForm({ chapterId: '', title: '', order: chapters.length + 1, category: selectedCategory }); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Chapter
                        </Button>
                    </div>
            </div>

            {(isAdding || editingId) && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="chapter-id" className="text-xs font-semibold uppercase text-muted-foreground">Chapter ID</label>
                                <Input 
                                    id="chapter-id"
                                    placeholder="e.g. ch1" 
                                    value={editForm.chapterId} 
                                    onChange={e => setEditForm({...editForm, chapterId: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="chapter-title" className="text-xs font-semibold uppercase text-muted-foreground">Title</label>
                                <Input 
                                    id="chapter-title"
                                    placeholder="e.g. Intro to Python" 
                                    value={editForm.title} 
                                    onChange={e => setEditForm({...editForm, title: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="chapter-order" className="text-xs font-semibold uppercase text-muted-foreground">Order</label>
                                <Input 
                                    id="chapter-order"
                                    type="number" 
                                    value={editForm.order} 
                                    onChange={e => setEditForm({...editForm, order: parseInt(e.target.value)})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="chapter-class" className="text-xs font-semibold uppercase text-muted-foreground">Category</label>
                                <select
                                    id="chapter-class"
                                    value={editForm.category || selectedCategory}
                                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.key} value={cat.key}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="ghost" onClick={() => { setEditingId(null); setIsAdding(false); }}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> Save Chapter
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {chapters.map(chapter => (
                    <div key={chapter._id} className="space-y-2">
                        <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold">
                                    {chapter.order}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{chapter.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded ${CATEGORIES.find(c => c.key === chapter.category)?.color ?? 'bg-gray-100 text-gray-700'}`}>
                                            {CATEGORIES.find(c => c.key === chapter.category)?.label ?? chapter.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{chapter.chapterId}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => toggleExpand(chapter._id)}>
                                    {expandedChapter === chapter._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleEdit(chapter)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(chapter._id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    {expandedChapter === chapter._id && (
                        <Card className="ml-4 border-primary/10 bg-primary/5">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold">Notes for {chapter.title}</h4>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => addNote(chapter._id, 'paragraph')}>
                                            <FileText className="h-3 w-3 mr-1" /> Paragraph
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => addNote(chapter._id, 'bullet_list')}>
                                            <List className="h-3 w-3 mr-1" /> List
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => addNote(chapter._id, 'code')}>
                                            <Code className="h-3 w-3 mr-1" /> Code
                                        </Button>
                                    </div>
                                </div>

                                {editingNote && editingNote.chapterId === chapter._id && (
                                    <Card className="mb-4 border-primary/20 bg-background">
                                        <CardContent className="p-4 space-y-3">
                                            <Input
                                                aria-label="Heading"
                                                placeholder="Heading (optional)"
                                                value={editingNote.form.heading || ''}
                                                onChange={e => setEditingNote({ ...editingNote, form: { ...editingNote.form, heading: e.target.value } })}
                                            />
                                            {editingNote.form.type === 'paragraph' && (
                                                <Input
                                                    aria-label="Text content"
                                                    placeholder="Text content"
                                                    value={editingNote.form.text || ''}
                                                    onChange={e => setEditingNote({ ...editingNote, form: { ...editingNote.form, text: e.target.value } })}
                                                />
                                            )}
                                            {editingNote.form.type === 'bullet_list' && (
                                                <div className="space-y-2">
                                                    {(editingNote.form.items || []).map((item, idx) => (
                                                        <Input
                                                            key={idx}
                                                            aria-label={`Bullet ${idx + 1}`}
                                                            placeholder={`Bullet ${idx + 1}`}
                                                            value={item}
                                                            onChange={e => {
                                                                const newItems = [...(editingNote.form.items || [])];
                                                                newItems[idx] = e.target.value;
                                                                setEditingNote({ ...editingNote, form: { ...editingNote.form, items: newItems } });
                                                            }}
                                                        />
                                                    ))}
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        const newItems = [...(editingNote.form.items || []), ''];
                                                        setEditingNote({ ...editingNote, form: { ...editingNote.form, items: newItems } });
                                                    }}>Add Bullet</Button>
                                                </div>
                                            )}
                                            {editingNote.form.type === 'code' && (
                                                 <div className="space-y-2">
                                                    <Input
                                                        aria-label="Language"
                                                        placeholder="Language (e.g., python)"
                                                        value={editingNote.form.language || ''}
                                                        onChange={e => setEditingNote({ ...editingNote, form: { ...editingNote.form, language: e.target.value } })}
                                                    />
                                                    <textarea
                                                        aria-label="Code"
                                                        className="w-full min-h-32 p-3 rounded-md border border-input bg-background"
                                                        placeholder="Code"
                                                        value={editingNote.form.code || ''}
                                                        onChange={e => setEditingNote({ ...editingNote, form: { ...editingNote.form, code: e.target.value } })}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Button onClick={saveNote}><Save className="h-4 w-4 mr-1" /> Save</Button>
                                                <Button variant="ghost" onClick={() => setEditingNote(null)}>Cancel</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="space-y-2">
                                    {(notes[chapter._id] || []).map(note => (
                                        <Card key={note._id} className="bg-background">
                                            <CardContent className="p-3 flex justify-between items-start gap-2">
                                                <div className="flex-1">
                                                    {note.heading && <h5 className="font-medium text-sm">{note.heading}</h5>}
                                                    {note.type === 'paragraph' && <p className="text-sm text-muted-foreground">{note.text}</p>}
                                                    {note.type === 'bullet_list' && (
                                                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                                                            {(note.items || []).map((item, idx) => <li key={idx}>{item}</li>)}
                                                        </ul>
                                                    )}
                                                    {note.type === 'code' && (
                                                        <pre className="text-sm bg-muted p-2 rounded overflow-x-auto"><code>{note.code}</code></pre>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => editNote(chapter._id, note)}>
                                                        <Pencil className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteNote(note._id, chapter._id)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {(!notes[chapter._id] || notes[chapter._id].length === 0) && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No notes yet. Add content above.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chapters;
