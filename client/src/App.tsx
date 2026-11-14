import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FieldsPage from './pages/FieldsPage';
import NewAdvisoryPage from './pages/advisory/NewAdvisoryPage';
import AdvisoryDetailPage from './pages/advisory/AdvisoryDetailPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/auth/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/auth/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/fields"
          element={<ProtectedRoute><FieldsPage /></ProtectedRoute>}
        />
        <Route
          path="/advisory/new"
          element={<ProtectedRoute><NewAdvisoryPage /></ProtectedRoute>}
        />
        <Route
          path="/advisory/:id"
          element={<ProtectedRoute><AdvisoryDetailPage /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><HistoryPage /></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
