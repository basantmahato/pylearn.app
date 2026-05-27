import { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Save, 
    X, 
    RefreshCw, 
    AlertCircle, 
    CheckCircle2, 
    GraduationCap,
    Palette
} from 'lucide-react';

interface Course {
    _id: string;
    key: string;
    label: string;
    description?: string;
    color: string;
    lightColor: string;
    createdAt?: string;
}

const PRESET_THEMES = [
    { name: 'Indigo / Purple', color: '#8b5cf6', lightColor: '#f5f3ff' },
    { name: 'Classic Blue', color: '#005ab5', lightColor: '#e8f0ff' },
    { name: 'Emerald Teal', color: '#10b981', lightColor: '#ecfdf5' },
    { name: 'Amber Orange', color: '#f59e0b', lightColor: '#fffbeb' },
    { name: 'Crimson Red', color: '#ef4444', lightColor: '#fef2f2' },
    { name: 'Teal Forest', color: '#0d9488', lightColor: '#f0fdfa' },
    { name: 'Rose Pink', color: '#ec4899', lightColor: '#fdf2f8' }
];

const Courses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Course>>({});
    const [isAdding, setIsAdding] = useState(false);
    
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchCourses = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const res = await api.get('/courses');
            if (res.data && res.data.success) {
                setCourses(res.data.data);
            }
        } catch (err: any) {
            console.error('Error fetching courses:', err);
            setErrorMessage(err.response?.data?.msg || 'Failed to fetch courses from database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const triggerNotification = (type: 'success' | 'error', msg: string) => {
        if (type === 'success') {
            setSuccessMessage(msg);
            setErrorMessage(null);
            setTimeout(() => setSuccessMessage(null), 4000);
        } else {
            setErrorMessage(msg);
            setSuccessMessage(null);
            setTimeout(() => setErrorMessage(null), 6000);
        }
    };

    const handleAddClick = () => {
        setIsAdding(true);
        setEditingId(null);
        setEditForm({
            key: '',
            label: '',
            description: '',
            color: PRESET_THEMES[0].color,
            lightColor: PRESET_THEMES[0].lightColor
        });
    };

    const handleEditClick = (course: Course) => {
        setEditingId(course._id);
        setIsAdding(false);
        setEditForm({ ...course });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm.key || !editForm.label) {
            triggerNotification('error', 'Course Key and Label are mandatory fields.');
            return;
        }

        // Validate Key (alphanumeric, no spaces)
        const keyRegex = /^[a-zA-Z0-9_-]+$/;
        if (!keyRegex.test(editForm.key)) {
            triggerNotification('error', 'Course Key must be alphanumeric (letters, numbers, underscores, dashes only) with no spaces.');
            return;
        }

        setSaving(true);
        setErrorMessage(null);
        try {
            if (editingId) {
                // Update
                const res = await api.put(`/admin/courses/${editingId}`, editForm);
                if (res.data && res.data.success) {
                    triggerNotification('success', `Course "${editForm.label}" updated successfully!`);
                }
            } else {
                // Create
                const res = await api.post('/admin/courses', editForm);
                if (res.data && res.data.success) {
                    triggerNotification('success', `New course "${editForm.label}" added successfully!`);
                }
            }
            setEditingId(null);
            setIsAdding(false);
            fetchCourses();
        } catch (err: any) {
            console.error('Error saving course:', err);
            triggerNotification('error', err.response?.data?.msg || 'Server error saving course.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (course: Course) => {
        if (window.confirm(`Are you absolutely sure you want to delete course category "${course.label}"?`)) {
            setErrorMessage(null);
            try {
                const res = await api.delete(`/admin/courses/${course._id}`);
                if (res.data) {
                    triggerNotification('success', `Course "${course.label}" deleted successfully.`);
                    fetchCourses();
                }
            } catch (err: any) {
                console.error('Error deleting course:', err);
                triggerNotification('error', err.response?.data?.msg || `Failed to delete course "${course.label}".`);
            }
        }
    };

    const selectThemePreset = (preset: typeof PRESET_THEMES[0]) => {
        setEditForm(prev => ({
            ...prev,
            color: preset.color,
            lightColor: preset.lightColor
        }));
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">Loading Course Categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-5">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Courses</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Dynamically configure categories for the mobile client. Add, edit, or configure theme colors for each syllabus.
                    </p>
                </div>
                {!isAdding && !editingId && (
                    <Button onClick={handleAddClick} className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white">
                        <Plus className="h-4 w-4" /> Add Course
                    </Button>
                )}
            </div>

            {/* Notifications */}
            {errorMessage && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-medium animate-in fade-in duration-300">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{errorMessage}</p>
                </div>
            )}

            {successMessage && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-sm font-medium animate-in fade-in duration-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p>{successMessage}</p>
                </div>
            )}

            {/* Add / Edit Form Card */}
            {(isAdding || editingId) && (
                <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden animate-in slide-in-from-top-3 duration-300">
                    <form onSubmit={handleSave}>
                        <CardContent className="pt-6 space-y-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                {editingId ? `Edit Course: ${editForm.label}` : 'Create New Course / Syllabus'}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Course Key */}
                                <div className="space-y-2">
                                    <label htmlFor="course-key" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Course ID / Unique Key
                                    </label>
                                    <Input
                                        id="course-key"
                                        placeholder="e.g. bca, rag, class12 (lowercase, no spaces)"
                                        value={editForm.key}
                                        onChange={e => setEditForm({ ...editForm, key: e.target.value.toLowerCase() })}
                                        disabled={!!editingId} // Unique key cannot be changed after creation to prevent db broken joins
                                        required
                                        className="font-mono text-sm focus:ring-primary focus:border-primary"
                                    />
                                    {!editingId && (
                                        <p className="text-[11px] text-muted-foreground/80">
                                            This is the internal identifier (join key) and cannot be changed later.
                                        </p>
                                    )}
                                </div>

                                {/* Label */}
                                <div className="space-y-2">
                                    <label htmlFor="course-label" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Course Display Label
                                    </label>
                                    <Input
                                        id="course-label"
                                        placeholder="e.g. BCA, RAG Systems, Class 12 CS"
                                        value={editForm.label}
                                        onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="course-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Subtitle / Description
                                    </label>
                                    <Input
                                        id="course-desc"
                                        placeholder="e.g. Retrieval-Augmented Generation & Large Language Models"
                                        value={editForm.description}
                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    />
                                </div>

                                {/* Color Configuration */}
                                <div className="space-y-3 md:col-span-2 border-t pt-4">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Palette className="h-4 w-4 text-primary" />
                                        Visual Theme Selection
                                    </label>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Color Selection Presets */}
                                        <div className="space-y-2">
                                            <span className="text-[11px] font-bold text-muted-foreground block">Preset Themes</span>
                                            <div className="flex flex-wrap gap-2">
                                                {PRESET_THEMES.map((theme, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        title={theme.name}
                                                        onClick={() => selectThemePreset(theme)}
                                                        className={`w-7 h-7 rounded-full border transition-all relative ${
                                                            editForm.color === theme.color ? 'scale-110 ring-2 ring-primary ring-offset-2' : ''
                                                        }`}
                                                        style={{ backgroundColor: theme.color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Color Code Inputs */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <span className="text-[11px] font-bold text-muted-foreground block">Primary Text/Icon</span>
                                                <Input 
                                                    value={editForm.color} 
                                                    onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                                                    placeholder="#005ab5"
                                                    className="font-mono text-xs p-2 h-9"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[11px] font-bold text-muted-foreground block">Card Background</span>
                                                <Input 
                                                    value={editForm.lightColor} 
                                                    onChange={e => setEditForm({ ...editForm, lightColor: e.target.value })}
                                                    placeholder="#e8f0ff"
                                                    className="font-mono text-xs p-2 h-9"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div className="pt-2">
                                        <span className="text-[11px] font-bold text-muted-foreground block mb-2">In-App Selected State Card Preview</span>
                                        <div 
                                            className="p-5 rounded-3xl border transition-all w-full max-w-sm"
                                            style={{ 
                                                backgroundColor: editForm.lightColor || '#f9f9ff',
                                                borderColor: `${editForm.color || '#005ab5'}25`
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-10 h-10 rounded-2xl items-center justify-center flex"
                                                    style={{ backgroundColor: `${editForm.color || '#005ab5'}15` }}
                                                >
                                                    <GraduationCap style={{ color: editForm.color || '#005ab5' }} className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-extrabold text-sm" style={{ color: editForm.color || '#000000' }}>
                                                        {editForm.label || 'Course Title'}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-0.5" style={{ color: `${editForm.color || '#000000'}80` }}>
                                                        {editForm.description || 'Course description or subtitle'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t pt-4">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => { setEditingId(null); setIsAdding(false); setErrorMessage(null); }}
                                    disabled={saving}
                                >
                                    <X className="mr-2 h-4 w-4" /> Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={saving}
                                    className="bg-primary hover:bg-primary/95 text-white flex items-center gap-2 px-5"
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" /> Save Course
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            )}

            {/* Courses List Table */}
            <div className="grid gap-4">
                {courses.map(course => (
                    <Card key={course._id} className="hover:shadow-md transition-shadow duration-200 border-muted/30 overflow-hidden">
                        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                {/* Large dynamic theme icon */}
                                <div 
                                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
                                    style={{ 
                                        backgroundColor: course.lightColor || '#f9f9ff',
                                        borderColor: `${course.color}15`
                                    }}
                                >
                                    <GraduationCap style={{ color: course.color }} className="h-7 w-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-extrabold text-lg text-foreground">{course.label}</h3>
                                        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-muted text-muted-foreground border">
                                            ID: {course.key}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                                        {course.description || 'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex gap-2 self-end sm:self-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => handleEditClick(course)}
                                    title="Edit Course"
                                >
                                    <Pencil className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="text-destructive hover:bg-destructive/5" 
                                    onClick={() => handleDelete(course)}
                                    title="Delete Course"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {courses.length === 0 && (
                    <Card className="border-dashed py-16 text-center">
                        <CardContent className="flex flex-col items-center justify-center space-y-3">
                            <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
                            <h3 className="font-bold text-lg text-foreground">No Courses Found</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                Database has not been seeded or has no courses. Click "Add Course" above to add your first category!
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Courses;
