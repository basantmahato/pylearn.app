import { useEffect, useState } from 'react';
import api from '../api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Pencil, Trash2, Save, X, FileText, Code, List } from 'lucide-react';

interface Note {
    _id: string;
    chapterId: string;
    category: string;
    type: 'paragraph' | 'bullet_list' | 'code';
    heading?: string;
    text?: string;
    items?: string[];
    code?: string;
    language?: string;
    order: number;
}

const CATEGORIES = [
    { key: 'class12', label: 'Class 12' },
    { key: 'class11', label: 'Class 11' },
    { key: 'bca',     label: 'BCA' },
    { key: 'btech',   label: 'B.Tech' },
    { key: 'aiml',    label: 'AI / ML & Data Sci' },
] as const;

const Notes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [chapters, setChapters] = useState<{chapterId: string, title: string, category?: string}[]>([]);
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('class12');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Note>>({});

    useEffect(() => {
        fetchChapters();
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedChapter) {
            fetchNotes();
        }
    }, [selectedChapter, selectedCategory]);

    const fetchChapters = async () => {
        try {
            const res = await api.get(`/chapters?category=${selectedCategory}`);
            setChapters(res.data);
            if (res.data.length > 0) {
                setSelectedChapter(res.data[0].chapterId);
            } else {
                setSelectedChapter('');
                setNotes([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotes = async () => {
        try {
            const res = await api.get(`/notes/${selectedChapter}?category=${selectedCategory}`);
            setNotes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (note: Note) => {
        setEditingId(note._id);
        setEditForm(note);
    };

    const handleSave = async () => {
        try {
            if (editingId && editingId !== 'new') {
                await api.put(`/notes/${editingId}`, { ...editForm, category: selectedCategory });
            } else {
                await api.post('/notes', { ...editForm, chapterId: selectedChapter, category: selectedCategory });
            }
            setEditingId(null);
            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this content item?')) {
            try {
                await api.delete(`/notes/${id}`);
                fetchNotes();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const addNew = (type: Note['type']) => {
        setEditingId('new');
        setEditForm({
            type,
            heading: '',
            text: '',
            items: type === 'bullet_list' ? [''] : [],
            code: '',
            language: 'python',
            order: notes.length
        });
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setSelectedChapter('');
        setNotes([]);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Notes & Content</h2>
                    <select
                        title="Select Category"
                        value={selectedCategory}
                        onChange={e => handleCategoryChange(e.target.value)}
                        className="px-3 py-2 rounded-md border border-input bg-background"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.key} value={cat.key}>{cat.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <select 
                        className="block w-full md:w-64 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-muted/50 border"
                        value={selectedChapter}
                        onChange={(e) => setSelectedChapter(e.target.value)}
                        aria-label="Select Chapter"
                    >
                        {chapters.length === 0 && <option value="">No chapters found</option>}
                        {chapters.map(c => <option key={c.chapterId} value={c.chapterId}>{c.title}</option>)}
                    </select>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => addNew('paragraph')} disabled={!selectedChapter}>
                            <FileText className="mr-2 h-4 w-4" /> Paragraph
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addNew('bullet_list')} disabled={!selectedChapter}>
                            <List className="mr-2 h-4 w-4" /> List
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addNew('code')} disabled={!selectedChapter}>
                            <Code className="mr-2 h-4 w-4" /> Code
                        </Button>
                    </div>
                </div>
            </div>

            {editingId && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Heading</label>
                                <Input value={editForm.heading} onChange={e => setEditForm({...editForm, heading: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Order</label>
                                <Input type="number" value={editForm.order} onChange={e => setEditForm({...editForm, order: parseInt(e.target.value)})} />
                            </div>
                        </div>

                        {editForm.type === 'paragraph' && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Text Content</label>
                                <textarea 
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={editForm.text} 
                                    onChange={e => setEditForm({...editForm, text: e.target.value})}
                                    placeholder="Enter your content here..."
                                    aria-label="Text Content"
                                />
                            </div>
                        )}

                        {editForm.type === 'code' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">Language</label>
                                    <Input value={editForm.language} onChange={e => setEditForm({...editForm, language: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">Code</label>
                                    <textarea 
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={editForm.code} 
                                        onChange={e => setEditForm({...editForm, code: e.target.value})}
                                        placeholder="Paste your code here..."
                                        aria-label="Code Content"
                                    />
                                </div>
                            </div>
                        )}

                        {editForm.type === 'bullet_list' && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">List Items</label>
                                {editForm.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input value={item} onChange={e => {
                                            const newItems = [...(editForm.items || [])];
                                            newItems[idx] = e.target.value;
                                            setEditForm({...editForm, items: newItems});
                                        }} />
                                        <Button variant="ghost" size="icon" onClick={() => {
                                            const newItems = editForm.items?.filter((_, i) => i !== idx);
                                            setEditForm({...editForm, items: newItems});
                                        }}><X className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => setEditForm({...editForm, items: [...(editForm.items || []), '']})}>
                                    Add Item
                                </Button>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Content</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {notes.map(note => (
                    <Card key={note._id} className="border-l-4 border-l-primary/30">
                        <CardContent className="p-4 flex justify-between items-start">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted border">
                                        {note.type}
                                    </span>
                                    {note.heading && <h4 className="font-bold">{note.heading}</h4>}
                                </div>
                                {note.type === 'paragraph' && <p className="text-sm text-muted-foreground line-clamp-2">{note.text}</p>}
                                {note.type === 'code' && <pre className="text-[10px] bg-muted p-2 rounded max-h-20 overflow-hidden">{note.code}</pre>}
                                {note.type === 'bullet_list' && <p className="text-sm text-muted-foreground">{note.items?.length} items in list</p>}
                            </div>
                            <div className="flex gap-2 ml-4">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(note)}><Pencil className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(note._id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {notes.length === 0 && !loading && selectedChapter && (
                    <p className="text-center py-10 text-muted-foreground">No notes found for this chapter.</p>
                )}
            </div>
        </div>
    );
};

export default Notes;
