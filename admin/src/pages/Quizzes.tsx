import { useEffect, useState } from 'react';
import api from '../api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Plus, Pencil, Trash2, Save, HelpCircle } from 'lucide-react';

interface Question {
    id: string;
    question: string;
    options: string[];
    answer: number;
    explanation?: string;
}

interface QuizSet {
    _id: string;
    chapterId: string;
    setId: string;
    setName: string;
    difficulty: string;
    category: string;
    questions: Question[];
}

const CATEGORIES = [
    { key: 'class12', label: 'Class 12' },
    { key: 'class11', label: 'Class 11' },
    { key: 'bca',     label: 'BCA' },
    { key: 'btech',   label: 'B.Tech' },
    { key: 'aiml',    label: 'AI / ML & Data Sci' },
] as const;

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState<QuizSet[]>([]);
    const [chapters, setChapters] = useState<{chapterId: string, title: string}[]>([]);
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('class12');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<QuizSet>>({});

    useEffect(() => {
        fetchChapters();
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedChapter) {
            fetchQuizzes();
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
                setQuizzes([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizzes = async () => {
        try {
            const res = await api.get(`/quizzes/${selectedChapter}?category=${selectedCategory}`);
            setQuizzes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (quiz: QuizSet) => {
        setEditingId(quiz._id);
        setEditForm({ ...quiz, category: quiz.category || selectedCategory });
    };

    const handleSave = async () => {
        try {
            const payload = { ...editForm, chapterId: selectedChapter, category: selectedCategory };
            if (editingId && editingId !== 'new') {
                await api.put(`/quizzes/${editingId}`, payload);
            } else {
                await api.post('/quizzes', payload);
            }
            setEditingId(null);
            fetchQuizzes();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this quiz set?')) {
            try {
                await api.delete(`/quizzes/${id}`);
                fetchQuizzes();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const addNewSet = () => {
        setEditingId('new');
        setEditForm({
            setId: 's' + (quizzes.length + 1),
            setName: '',
            difficulty: 'Easy',
            category: selectedCategory,
            questions: [{ id: 'q1', question: '', options: ['', '', '', ''], answer: 0 }]
        });
    };

    const addQuestion = () => {
        const newQuestions = [...(editForm.questions || [])];
        newQuestions.push({ 
            id: 'q' + (newQuestions.length + 1), 
            question: '', 
            options: ['', '', '', ''], 
            answer: 0 
        });
        setEditForm({...editForm, questions: newQuestions});
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setSelectedChapter('');
        setQuizzes([]);
    };

    if (loading) return <div>Loading Chapters...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Quiz Management</h2>
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
                    <Button onClick={addNewSet} disabled={!selectedChapter}>
                        <Plus className="mr-2 h-4 w-4" /> Add Quiz Set
                    </Button>
                </div>
            </div>

            {editingId && (
                <Card className="border-primary/20 bg-primary/5 max-h-[80vh] overflow-auto">
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Set Name</label>
                                <Input value={editForm.setName} onChange={e => setEditForm({...editForm, setName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Difficulty</label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editForm.difficulty} 
                                    onChange={e => setEditForm({...editForm, difficulty: e.target.value})}
                                    aria-label="Difficulty"
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold border-b pb-2">Questions</h4>
                            {editForm.questions?.map((q, qIdx) => (
                                <div key={qIdx} className="p-4 border rounded-lg bg-background space-y-4 relative">
                                    <button 
                                        className="absolute top-2 right-2 text-destructive"
                                        onClick={() => {
                                            const newQs = editForm.questions?.filter((_, i) => i !== qIdx);
                                            setEditForm({...editForm, questions: newQs});
                                        }}
                                        aria-label="Remove Question"
                                    ><Trash2 className="h-4 w-4" /></button>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold">Question {qIdx + 1}</label>
                                        <Input value={q.question} onChange={e => {
                                            const newQs = [...(editForm.questions || [])];
                                            newQs[qIdx].question = e.target.value;
                                            setEditForm({...editForm, questions: newQs});
                                        }} />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex gap-2 items-center">
                                                <input 
                                                    type="radio" 
                                                    checked={q.answer === oIdx} 
                                                    onChange={() => {
                                                        const newQs = [...(editForm.questions || [])];
                                                        newQs[qIdx].answer = oIdx;
                                                        setEditForm({...editForm, questions: newQs});
                                                    }}
                                                    aria-label={`Option ${oIdx + 1} Correct`}
                                                />
                                                <Input 
                                                    placeholder={`Option ${oIdx + 1}`}
                                                    value={opt} 
                                                    onChange={e => {
                                                        const newQs = [...(editForm.questions || [])];
                                                        newQs[qIdx].options[oIdx] = e.target.value;
                                                        setEditForm({...editForm, questions: newQs});
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase text-muted-foreground">Explanation (Optional)</label>
                                        <Input value={q.explanation} onChange={e => {
                                            const newQs = [...(editForm.questions || [])];
                                            newQs[qIdx].explanation = e.target.value;
                                            setEditForm({...editForm, questions: newQs});
                                        }} />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full" onClick={addQuestion}>Add Question</Button>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-primary/5 py-2 border-t">
                            <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Quiz Set</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map(quiz => (
                    <Card key={quiz._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <HelpCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{quiz.setName}</h3>
                                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted border">
                                            {quiz.category}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{quiz.difficulty} • {quiz.questions.length} Questions</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(quiz)}><Pencil className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(quiz._id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {quizzes.length === 0 && !loading && selectedChapter && (
                    <p className="col-span-2 text-center py-10 text-muted-foreground">No quiz sets found for this chapter.</p>
                )}
            </div>
        </div>
    );
};

export default Quizzes;
