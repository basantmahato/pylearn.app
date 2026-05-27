import { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { 
    Bell, 
    Send, 
    RefreshCw, 
    AlertCircle, 
    CheckCircle2,
    BookOpen,
    Zap,
    Flame,
    ChevronDown,
    ChevronUp,
    MousePointerClick,
    Clock,
    Sparkles
} from 'lucide-react';

// ── Premade Notification Templates ─────────────────────────────────────────
interface NotificationTemplate {
    title: string;
    body: string;
}

interface TemplateCategory {
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    templates: NotificationTemplate[];
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
    {
        label: 'Continue Learning',
        icon: <BookOpen className="h-4 w-4" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        templates: [
            {
                title: 'Continue Your Python Journey 🐍',
                body: 'Your next Python lesson is waiting. Pick up where you left off and keep building your skills!',

            },
            {
                title: 'Ready for the Next Chapter? 🚀',
                body: 'Unlock the next Python concept and level up your coding knowledge today.',

            },
            {
                title: "Don't Break the Flow 🔥",
                body: "You're making progress in Python. Continue learning and stay consistent.",

            },
            {
                title: 'One More Lesson Today 📘',
                body: 'Just 10 minutes of Python practice can sharpen your coding skills. Continue now!',

            },
            {
                title: 'Your Coding Session Awaits 💻',
                body: 'Jump back into Python and keep moving toward mastery.',

            },
        ],
    },
    {
        label: 'Daily Practice',
        icon: <Zap className="h-4 w-4" />,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        templates: [
            {
                title: 'Practice Python Daily ⚡',
                body: "Small daily practice leads to big coding improvements. Start today's session now.",

            },
            {
                title: 'Time to Code 🧠',
                body: 'Your daily Python practice is ready. Write code, solve problems, improve faster.',

            },
            {
                title: 'Daily Python Challenge 🎯',
                body: "Complete today's coding practice and strengthen your programming logic.",

            },
            {
                title: 'Consistency Builds Coders 🔁',
                body: 'Practice Python every day and become confident with real coding skills.',

            },
            {
                title: '15 Minutes of Python Today? ⏳',
                body: 'A quick practice session today can boost your coding streak and confidence.',

            },
        ],
    },
    {
        label: 'Streak & Engagement',
        icon: <Flame className="h-4 w-4" />,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        templates: [
            {
                title: 'Your Streak Is Incomplete 🔥',
                body: "You're close to maintaining your learning streak. Complete today's lesson now!",

            },
            {
                title: "Don't Lose Your Streak ⚠️",
                body: 'Your Python streak is active. Finish one lesson today to keep it alive.',

            },
            {
                title: 'Streak Alert 🚨',
                body: 'A quick Python session today will protect your learning streak.',

            },
            {
                title: 'Keep the Momentum Going 💪',
                body: "You've been learning consistently. Don't stop now — continue your Python journey.",

            },
            {
                title: 'Future Developer in Progress 👨‍💻',
                body: 'Every day you practice Python, you move one step closer to becoming a better developer.',

            },
        ],
    },
];

const Notifications = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [customData, setCustomData] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const [automationEnabled, setAutomationEnabled] = useState(false);
    const [fetchingConfig, setFetchingConfig] = useState(true);
    const [updatingAutomation, setUpdatingAutomation] = useState(false);

    const fetchNotificationConfig = async () => {
        setFetchingConfig(true);
        try {
            const response = await api.get('/admin/notifications/config');
            if (response.data?.success && response.data?.config) {
                setAutomationEnabled(response.data.config.automationEnabled);
            }
        } catch (err) {
            console.error('Error fetching notification config:', err);
        } finally {
            setFetchingConfig(false);
        }
    };

    useEffect(() => {
        fetchNotificationConfig();
    }, []);

    const handleToggleAutomation = async () => {
        setUpdatingAutomation(true);
        setError(null);
        setSuccess(null);
        try {
            const newValue = !automationEnabled;
            const response = await api.post('/admin/notifications/config', {
                automationEnabled: newValue
            });
            if (response.data?.success) {
                setAutomationEnabled(newValue);
                setSuccess(`Automation settings updated: Scheduled notifications are now ${newValue ? 'ENABLED' : 'DISABLED'}.`);
                setTimeout(() => setSuccess(null), 5000);
            }
        } catch (err: any) {
            console.error('Error toggling notification automation:', err);
            setError(err.response?.data?.msg || 'Failed to update automation settings.');
        } finally {
            setUpdatingAutomation(false);
        }
    };

    const handleSelectTemplate = (template: NotificationTemplate) => {
        setTitle(template.title);
        setBody(template.body);
        setSelectedTemplate(`${template.title}::${template.body}`);
        setError(null);
        setSuccess(null);
    };

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;

        setSending(true);
        setError(null);
        setSuccess(null);

        try {
            let parsedData = {};
            if (customData.trim()) {
                try {
                    parsedData = JSON.parse(customData);
                } catch (parseErr) {
                    setError('Invalid Custom Data JSON. Please verify syntax.');
                    setSending(false);
                    return;
                }
            }

            const response = await api.post('/admin/notifications/send', {
                title,
                body,
                data: parsedData
            });

            if (response.data?.success) {
                setSuccess(response.data.msg || 'Push notification broadcasted successfully!');
                setTitle('');
                setBody('');
                setCustomData('');
                setSelectedTemplate(null);
            }
        } catch (err: any) {
            console.error('Error sending push notification:', err);
            setError(err.response?.data?.msg || 'Failed to dispatch push notification. Check network.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Header section */}
            <div className="flex justify-between items-center border-b pb-5">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Android Push Notifications</h2>
                    <p className="text-muted-foreground text-sm mt-1">Broadcast real-time push alerts to all installed Android devices.</p>
                </div>
            </div>

            {/* ── Automation Scheduler Settings Toggle ── */}
            <Card className="shadow-sm border-muted/30 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="space-y-1 max-w-xl">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                                <Sparkles className={`h-5 w-5 ${automationEnabled ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                                Automatic Push Notifications (node-cron)
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Automatically broadcast high-engagement push alerts to study, practice, and retain streaks daily. When disabled, scheduled notifications pause instantly.
                            </p>
                            
                            {/* Schedule details timeline */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-muted/30">
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-blue-50/50 border border-blue-100/50 rounded-lg p-2">
                                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                                    <div>
                                        <div className="text-blue-600">09:00 AM Daily</div>
                                        <div className="text-[10px] text-muted-foreground">Continue Learning 🐍</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-amber-50/50 border border-amber-100/50 rounded-lg p-2">
                                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                                    <div>
                                        <div className="text-amber-600">01:00 PM Daily</div>
                                        <div className="text-[10px] text-muted-foreground">Daily Practice ⚡</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-rose-50/50 border border-rose-100/50 rounded-lg p-2">
                                    <Clock className="h-3.5 w-3.5 text-rose-500" />
                                    <div>
                                        <div className="text-rose-600">07:00 PM Daily</div>
                                        <div className="text-[10px] text-muted-foreground">Streak & Engagement 🔥</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Switch toggle control */}
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span className={`text-sm font-bold ${automationEnabled ? 'text-primary' : 'text-muted-foreground'}`}>
                                {fetchingConfig ? 'Checking...' : (automationEnabled ? 'Active / Automated' : 'Inactive / Disabled')}
                            </span>
                            <button
                                type="button"
                                aria-label="Toggle Push Notification Automation"
                                title="Toggle Push Notification Automation"
                                disabled={fetchingConfig || updatingAutomation}
                                onClick={handleToggleAutomation}
                                className={`${
                                    automationEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
                                } relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50`}
                            >
                                <span
                                    className={`${
                                        automationEnabled ? 'translate-x-7' : 'translate-x-0'
                                    } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
                                />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Messages */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p>{success}</p>
                </div>
            )}

            {/* ── Premade Templates Section ─────────────────────────────────── */}
            <Card className="shadow-sm border-muted/30">
                <CardHeader className="border-b bg-muted/10 p-5">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <MousePointerClick className="h-5 w-5 text-primary" />
                        Quick Templates
                        <span className="text-xs font-normal text-muted-foreground ml-1">— Click any template to auto-fill the form below</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    {TEMPLATE_CATEGORIES.map((category) => {
                        const isExpanded = expandedCategory === category.label;
                        return (
                            <div key={category.label} className={`rounded-xl border ${category.borderColor} overflow-hidden transition-all duration-200`}>
                                {/* Category Header (clickable toggle) */}
                                <button
                                    type="button"
                                    onClick={() => setExpandedCategory(isExpanded ? null : category.label)}
                                    className={`w-full flex items-center justify-between px-4 py-3 ${category.bgColor} hover:opacity-90 transition-opacity`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={category.color}>{category.icon}</span>
                                        <span className={`text-sm font-bold ${category.color}`}>{category.label}</span>
                                        <span className="text-[11px] text-muted-foreground font-medium ml-1">
                                            ({category.templates.length} templates)
                                        </span>
                                    </div>
                                    {isExpanded 
                                        ? <ChevronUp className={`h-4 w-4 ${category.color}`} /> 
                                        : <ChevronDown className={`h-4 w-4 ${category.color}`} />
                                    }
                                </button>

                                {/* Template Cards (shown when expanded) */}
                                {isExpanded && (
                                    <div className="p-3 grid gap-2 bg-white">
                                        {category.templates.map((template) => {
                                            const templateKey = `${template.title}::${template.body}`;
                                            const isSelected = selectedTemplate === templateKey;
                                            return (
                                                <button
                                                    key={templateKey}
                                                    type="button"
                                                    onClick={() => handleSelectTemplate(template)}
                                                    className={`text-left w-full px-4 py-3 rounded-lg border transition-all duration-150 hover:shadow-sm ${
                                                        isSelected
                                                            ? `${category.borderColor} ${category.bgColor} ring-2 ring-offset-1`
                                                            : 'border-muted/40 hover:border-muted-foreground/30 bg-muted/5'
                                                    }`}
                                                >
                                                    <p className={`text-sm font-bold ${isSelected ? category.color : 'text-gray-800'}`}>
                                                        {template.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                        {template.body}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* ── Compose Form ─────────────────────────────────────────────── */}
            <form onSubmit={handleSendNotification} className="space-y-6">
                <Card className="shadow-sm border-muted/30">
                    <CardHeader className="border-b bg-muted/10 p-5">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Compose Broadcast Message
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {/* Title input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Notification Title</label>
                            <Input 
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setSelectedTemplate(null); }}
                                placeholder="e.g. New Python Chapter Available! 🐍"
                                required
                                disabled={sending}
                                className="focus:ring-primary text-sm font-semibold"
                            />
                            <p className="text-[11px] text-muted-foreground">Keep it short and catchy to capture user attention instantly.</p>
                        </div>

                        {/* Body input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Message Content</label>
                            <textarea
                                value={body}
                                onChange={(e) => { setBody(e.target.value); setSelectedTemplate(null); }}
                                placeholder="e.g. Explore 'Chapter 12: Advanced OOP concepts in Python'. Tap here to learn!"
                                required
                                disabled={sending}
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-primary focus:border-primary border-muted-foreground/20 text-gray-800"
                            />
                            <p className="text-[11px] text-muted-foreground">Enter the main alert message body displayed in the device notification shade.</p>
                        </div>

                        {/* Custom Data payload input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Custom JSON Payload (Optional)</label>
                            <textarea
                                value={customData}
                                onChange={(e) => setCustomData(e.target.value)}
                                placeholder='e.g. { "screen": "chapter", "chapterId": "ch_12" }'
                                disabled={sending}
                                rows={2}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-muted/5 text-gray-700"
                            />
                            <p className="text-[11px] text-muted-foreground">Optional raw JSON data attached to the notification. Useful for navigation routing when user taps the notification.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Send Controls */}
                <div className="flex justify-end items-center gap-4">
                    <Button
                        type="button"
                        onClick={() => {
                            setTitle('');
                            setBody('');
                            setCustomData('');
                            setError(null);
                            setSuccess(null);
                            setSelectedTemplate(null);
                        }}
                        variant="outline"
                        disabled={sending}
                        className="font-semibold shadow-sm"
                    >
                        Clear Form
                    </Button>
                    <Button
                        type="submit"
                        disabled={sending || !title.trim() || !body.trim()}
                        className="flex items-center gap-2 font-semibold shadow-md px-6 bg-primary hover:bg-primary/95 text-white"
                    >
                        {sending ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Sending Broadcast...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Broadcast Notification
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Notifications;
