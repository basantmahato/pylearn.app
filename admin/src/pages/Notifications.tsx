import { useState } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { 
    Bell, 
    Send, 
    RefreshCw, 
    AlertCircle, 
    CheckCircle2 
} from 'lucide-react';

const Notifications = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [customData, setCustomData] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
                                onChange={(e) => setTitle(e.target.value)}
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
                                onChange={(e) => setBody(e.target.value)}
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
