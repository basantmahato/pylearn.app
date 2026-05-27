import { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Trash2, Search, Mail, Calendar, User, MessageSquare, AlertCircle } from 'lucide-react';

interface ContactInquiry {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
}

const Contacts = () => {
    const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/contacts');
            if (res.data && res.data.success) {
                setInquiries(res.data.data);
            }
        } catch (err: any) {
            console.error('Error fetching contacts:', err);
            setError('Failed to fetch contact inquiries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Mark this inquiry as resolved and delete it permanently?')) {
            try {
                const res = await api.delete(`/admin/contacts/${id}`);
                if (res.data && res.data.success) {
                    setInquiries(inquiries.filter((inq) => inq._id !== id));
                }
            } catch (err) {
                console.error('Error deleting contact:', err);
                alert('Failed to resolve and delete inquiry.');
            }
        }
    };

    // Filter inquiries based on search query
    const filteredInquiries = inquiries.filter((inq) => {
        const query = searchQuery.toLowerCase();
        return (
            inq.name.toLowerCase().includes(query) ||
            inq.email.toLowerCase().includes(query) ||
            inq.subject.toLowerCase().includes(query) ||
            inq.message.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Contact Inquiries</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage customer support messages, feedback, and legal requests.
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search inquiries..."
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-destructive/15 border border-destructive/25 text-destructive p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">{error}</span>
                </div>
            )}

            {/* Inquiries Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground font-semibold text-sm">Loading inquiries...</p>
                </div>
            ) : filteredInquiries.length === 0 ? (
                <div className="text-center py-20 bg-muted/10 rounded-[32px] border border-dashed border-muted/30">
                    <Mail className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
                    <h3 className="font-extrabold text-lg text-foreground">No inquiries found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 leading-relaxed">
                        {searchQuery ? "We couldn't find any contact inquiries matching your search." : "No student or user inquiries have been received yet."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredInquiries.map((inq) => (
                        <Card key={inq._id} className="hover:shadow-md transition-shadow duration-300">
                            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-muted/50 gap-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <CardTitle className="text-base font-extrabold">{inq.subject}</CardTitle>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            New
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" />
                                            {inq.name}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5" />
                                            <a href={`mailto:${inq.email}`} className="hover:underline text-primary">
                                                {inq.email}
                                            </a>
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(inq.createdAt).toLocaleDateString()} at{' '}
                                            {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(inq._id)}
                                    className="flex items-center gap-1.5 self-end sm:self-auto shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Mark Resolved
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex gap-3 items-start">
                                    <MessageSquare className="h-5 w-5 text-muted-foreground/60 shrink-0 mt-0.5" />
                                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                        {inq.message}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Contacts;
