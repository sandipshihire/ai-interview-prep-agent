import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// App / Dashboard Pages
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import JobRoles from './pages/JobRoles';
import JobDetails from './pages/JobDetails';
import InterviewSetup from './pages/InterviewSetup';
import Interview from './pages/Interview';
import InterviewResult from './pages/InterviewResult';
import Performance from './pages/Performance';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Marketing & Auth routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected App Routes wrapped inside DashboardLayout */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/jobs" element={<JobRoles />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/interview/setup" element={<InterviewSetup />} />
                <Route path="/interview/:id" element={<Interview />} />
                <Route path="/interview/:id/result" element={<InterviewResult />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
