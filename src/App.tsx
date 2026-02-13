import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Pages
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import AdminDashboard from './pages/AdminDashboard';
import StudentManagement from './pages/StudentManagement';
import MarksManagement from './pages/MarksManagement';
import AnnouncementsManagement from './pages/AnnouncementsManagement';
import StudentDashboard from './pages/StudentDashboard';
import MyResults from './pages/MyResults';
import MyProfile from './pages/MyProfile';
import Loader from './components/common/Loader';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; role: 'admin' | 'student' }> = ({ children, role }) => {
  const { user, isLoading, isAdmin, isStudent } = useAuth();

  if (isLoading) return <Loader fullScreen />;
  if (!user) return <Navigate to={role === 'admin' ? '/admin/login' : '/student/login'} replace />;
  if (role === 'admin' && !isAdmin) return <Navigate to="/" replace />;
  if (role === 'student' && !isStudent) return <Navigate to="/" replace />;

  return <>{children}</>;
};

// Public route - redirect if already logged in
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, isAdmin, isStudent } = useAuth();

  if (isLoading) return <Loader fullScreen />;
  if (user && isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (user && isStudent) return <Navigate to="/student/dashboard" replace />;

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
      <Route path="/student/login" element={<PublicRoute><StudentLogin /></PublicRoute>} />
      <Route path="/student/signup" element={<PublicRoute><StudentSignup /></PublicRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute role="admin"><StudentManagement /></ProtectedRoute>} />
      <Route path="/admin/marks" element={<ProtectedRoute role="admin"><MarksManagement /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute role="admin"><AnnouncementsManagement /></ProtectedRoute>} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/results" element={<ProtectedRoute role="student"><MyResults /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><MyProfile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
