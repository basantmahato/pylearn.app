import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chapters from './pages/Chapters';
import Notes from './pages/Notes';
import Quizzes from './pages/Quizzes';
import SamplePapers from './pages/SamplePapers';
import Blogs from './pages/Blogs';
import ManageAds from './pages/ManageAds';
import Courses from './pages/Courses';
import Notifications from './pages/Notifications';
import Contacts from './pages/Contacts';


// Auth Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="chapters" element={<Chapters />} />
                    <Route path="notes" element={<Notes />} />
                    <Route path="quizzes" element={<Quizzes />} />
                    <Route path="sample-papers" element={<SamplePapers />} />
                    <Route path="blogs" element={<Blogs />} />
                    <Route path="ads" element={<ManageAds />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="contacts" element={<Contacts />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
