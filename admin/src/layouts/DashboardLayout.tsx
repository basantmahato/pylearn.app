import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
    BookOpen, 
    FileText, 
    LogOut, 
    HelpCircle,
    ScrollText,
    Newspaper,
    LayoutGrid,
    Megaphone,
    GraduationCap,
    Bell
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            active ? "bg-muted text-primary" : "text-muted-foreground"
        )}
    >
        <Icon className="h-4 w-4" />
        {label}
    </Link>
);

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            <div className="hidden border-r bg-muted/10 md:block w-64 shrink-0">
                <div className="flex h-full flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <BookOpen className="h-6 w-6" />
                            <span> Admin Dashbaord</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
                            <SidebarLink to="/dashboard" icon={LayoutGrid} label="Overview" active={location.pathname.startsWith('/dashboard')} />
                            <SidebarLink to="/chapters" icon={BookOpen} label="Chapters" active={location.pathname.startsWith('/chapters')} />
                            <SidebarLink to="/notes" icon={FileText} label="Notes & Content" active={location.pathname.startsWith('/notes')} />
                            <SidebarLink to="/quizzes" icon={HelpCircle} label="Quizzes" active={location.pathname.startsWith('/quizzes')} />
                            <SidebarLink to="/sample-papers" icon={ScrollText} label="Sample Papers" active={location.pathname.startsWith('/sample-papers')} />
                            <SidebarLink to="/blogs" icon={Newspaper} label="Blogs" active={location.pathname.startsWith('/blogs')} />
                            <SidebarLink to="/ads" icon={Megaphone} label="Manage Ads" active={location.pathname.startsWith('/ads')} />
                            <SidebarLink to="/courses" icon={GraduationCap} label="Manage Courses" active={location.pathname.startsWith('/courses')} />
                            <SidebarLink to="/notifications" icon={Bell} label="Push Notifications" active={location.pathname.startsWith('/notifications')} />
                        </nav>
                    </div>
                    <div className="mt-auto p-4 border-t">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-destructive"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/10 px-4 lg:h-[60px] lg:px-6">
                    <div className="w-full flex-1">
                        <h1 className="text-lg font-semibold">

                            {location.pathname.startsWith('/dashboard') && 'System Overview'}
                            {location.pathname.startsWith('/chapters') && 'Manage Chapters'}
                            {location.pathname.startsWith('/notes') && 'Manage Notes'}
                            {location.pathname.startsWith('/quizzes') && 'Manage Quizzes'}
                            {location.pathname.startsWith('/sample-papers') && 'Manage Sample Papers'}
                            {location.pathname.startsWith('/blogs') && 'Manage Blogs'}
                            {location.pathname.startsWith('/ads') && 'Manage Ads Settings'}
                            {location.pathname.startsWith('/courses') && 'Manage Courses'}
                            {location.pathname.startsWith('/notifications') && 'Android Push Alerts'}
                        </h1>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
