import { useEffect, useState } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
    BookOpen, 
    FileText, 
    HelpCircle, 
    ScrollText, 
    Newspaper, 
    GraduationCap, 
    TrendingUp, 
    RefreshCw, 
    FileSignature, 
    Bookmark, 
    PenTool
} from 'lucide-react';

interface StatsSummary {
    totalChapters: number;
    totalNotes: number;
    totalQuizzes: number;
    totalSamplePapers: number;
    totalBlogs: number;
    totalPracticeQuestions: number;
    totalQuizQuestions: number;
}

interface CategoryDetail {
    chapters: number;
    quizzes: number;
    samplePapers: number;
    notes: number;
}

interface BlogStats {
    total: number;
    published: number;
    draft: number;
    featured: number;
}

interface DashboardStats {
    success: boolean;
    summary: StatsSummary;
    categories: Record<string, CategoryDetail>;
    blogs: BlogStats;
}

const CATEGORY_META = {
    class12: { label: 'Class 12', color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/10 text-blue-600', iconColor: 'text-blue-500' },
    class11: { label: 'Class 11', color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/10 text-purple-600', iconColor: 'text-purple-500' },
    bca: { label: 'BCA', color: 'border-green-500 bg-green-50/50 dark:bg-green-950/10 text-green-600', iconColor: 'text-green-500' },
    btech: { label: 'B.Tech', color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/10 text-amber-600', iconColor: 'text-amber-500' },
    aiml: { label: 'AI / ML', color: 'border-red-500 bg-red-50/50 dark:bg-red-950/10 text-red-600', iconColor: 'text-red-500' },
} as const;

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const response = await api.get<DashboardStats>('/admin/dashboard-stats');
            if (response.data.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">Loading dashboard overview...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Card className="max-w-md border-destructive/20 bg-destructive/5 text-center">
                    <CardHeader>
                        <CardTitle className="text-destructive">Failed to Load Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">We encountered an issue fetching platform metrics. Please check your connection and try again.</p>
                        <Button onClick={() => fetchStats()} variant="outline" className="w-full">
                            Retry Connection
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { summary, categories, blogs } = stats;

    return (
        <div className="space-y-8 pb-10">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Overview Dashboard</h2>
                    <p className="text-muted-foreground text-sm mt-1">Real-time status, counts, and contents distribution metrics across all PyLearn resources.</p>
                </div>
                <Button 
                    onClick={() => fetchStats(true)} 
                    disabled={refreshing}
                    variant="outline"
                    className="flex items-center gap-2 shadow-sm font-medium"
                >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh Metrics'}
                </Button>
            </div>

            {/* Core Aggregates grid */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                <Card className="shadow-sm border-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Chapters</span>
                        <BookOpen className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-black">{summary.totalChapters}</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Syllabus modules</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Notes</span>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-black">{summary.totalNotes}</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Content blocks</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Quizzes</span>
                        <HelpCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-black">{summary.totalQuizzes}</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Quiz bundles</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Papers</span>
                        <ScrollText className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-black">{summary.totalSamplePapers}</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Model sets</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Blogs</span>
                        <Newspaper className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-black">{summary.totalBlogs}</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Articles list</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/30 bg-primary/5 border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <span className="text-xs font-semibold uppercase text-primary">Practice Qs</span>
                        <PenTool className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-black text-primary">{summary.totalPracticeQuestions}</div>
                        <p className="text-[10px] text-primary/75 mt-0.5">Revision tasks</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted/30 bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-500/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <span className="text-xs font-semibold uppercase text-indigo-600">Quiz Qs</span>
                        <GraduationCap className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-black text-indigo-600">{summary.totalQuizQuestions}</div>
                        <p className="text-[10px] text-indigo-600/75 mt-0.5">MCQ elements</p>
                    </CardContent>
                </Card>
            </div>

            {/* Second row: Categories distribution & Blogs */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Category stats breakdown cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-xl font-bold tracking-tight">Resource Distribution by Category</h3>
                    </div>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {Object.entries(categories).map(([key, data]) => {
                            const meta = CATEGORY_META[key as keyof typeof CATEGORY_META] || {
                                label: key.toUpperCase(),
                                color: 'border-muted bg-muted/20 text-muted-foreground',
                                iconColor: 'text-muted-foreground'
                            };

                            return (
                                <Card key={key} className={`border-l-4 shadow-sm ${meta.color} transition-all duration-200 hover:shadow-md`}>
                                    <CardHeader className="p-5 pb-3">
                                        <CardTitle className="text-lg font-bold flex items-center justify-between">
                                            <span>{meta.label}</span>
                                            <GraduationCap className={`h-5 w-5 ${meta.iconColor}`} />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-5 pt-0 space-y-2.5 text-sm text-foreground/90 font-medium">
                                        <div className="flex justify-between items-center pb-1.5 border-b border-border/20">
                                            <span className="text-muted-foreground font-normal">Chapters</span>
                                            <span>{data.chapters}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-1.5 border-b border-border/20">
                                            <span className="text-muted-foreground font-normal">Notes Blocks</span>
                                            <span>{data.notes}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-1.5 border-b border-border/20">
                                            <span className="text-muted-foreground font-normal">Quizzes</span>
                                            <span>{data.quizzes}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground font-normal">Sample Papers</span>
                                            <span>{data.samplePapers}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Blogs overview card */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Newspaper className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-xl font-bold tracking-tight">Blogs & Articles Distribution</h3>
                    </div>
                    <Card className="shadow-sm border-muted/30">
                        <CardHeader className="border-b bg-muted/10 p-5">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <FileSignature className="h-5 w-5 text-rose-500" />
                                Publishing Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Big total count bubble */}
                            <div className="flex items-center gap-5 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-500/10">
                                <div className="text-4xl font-black text-rose-600">{blogs.total}</div>
                                <div className="text-sm font-semibold text-rose-800/80">
                                    Total Articles Created
                                    <p className="text-[10px] text-muted-foreground font-normal mt-0.5">Published or saved as draft</p>
                                </div>
                            </div>

                            {/* Breakdown table */}
                            <div className="space-y-3.5 text-sm font-semibold text-foreground/90">
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-green-500" />
                                        <span className="text-muted-foreground font-normal">Published Articles</span>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">{blogs.published}</span>
                                </div>

                                <div className="flex justify-between items-center pb-2 border-b">
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-amber-500" />
                                        <span className="text-muted-foreground font-normal">Drafts & Backlog</span>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{blogs.draft}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2.5">
                                        <Bookmark className="h-4.5 w-4.5 text-purple-500" />
                                        <span className="text-muted-foreground font-normal">Featured on Home Screen</span>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">{blogs.featured}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
