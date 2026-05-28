import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import AuthPage from './pages/Auth';
import HomePage from './pages/Home';
import ChatPage from './pages/Chat';
import HoroscopePage from './pages/Horoscope';
import PalmistryPage from './pages/Palmistry';
import AdminDashboard from './pages/Admin';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    
    if (loading) return null;
    if (!user) return <Navigate to="/auth" />;
    
    return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/horoscope" element={
                        <ProtectedRoute>
                            <HoroscopePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/palm" element={
                        <ProtectedRoute>
                            <PalmistryPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}
