import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Chapters from './pages/Chapters';
import Notes from './pages/Notes';
import Quizzes from './pages/Quizzes';
import SamplePapers from './pages/SamplePapers';
import Blogs from './pages/Blogs';

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
                    <Route index element={<div className="p-8 text-center text-muted-foreground">Select a category from the sidebar to manage your content.</div>} />
                    <Route path="chapters" element={<Chapters />} />
                    <Route path="notes" element={<Notes />} />
                    <Route path="quizzes" element={<Quizzes />} />
                    <Route path="sample-papers" element={<SamplePapers />} />
                    <Route path="blogs" element={<Blogs />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
