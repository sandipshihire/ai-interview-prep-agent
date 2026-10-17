import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic frontend validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = await login({ email, password });
    if (res.success) {
      toast.success('Welcome back, Candidate!');
      navigate('/dashboard');
    } else {
      setError(res.error || 'Failed to authenticate.');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('candidate@interviewai.dev');
    setPassword('demopass123');
    const res = await login({ email: 'candidate@interviewai.dev', password: 'demopass123' });
    if (res.success) {
      toast.success('Signed in as Demo Candidate!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slateBg dark:bg-darkBg flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkCard">
        {/* Left Side: Brand Showcase */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white flex flex-col justify-between hidden md:flex">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">InterviewAI</span>
          </div>

          <div className="space-y-4 my-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent-300" />
              <span>AI Placement Preparation</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold leading-snug">
              Master your next tech interview with confidence.
            </h2>
            <p className="text-white/80 text-xs lg:text-sm leading-relaxed">
              Personalized mock interviews, resume matching, realistic voice evaluations, and actionable analytics.
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 text-xs text-white/70">
            Final-Year B.Tech Capstone Demonstration
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back 👋</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sign in to your InterviewAI candidate dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <NavLink
                  to="/forgot-password"
                  className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Forgot password?
                </NavLink>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Quick Button */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoLogin}
              className="w-full text-xs font-semibold text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950/40"
            >
              ⚡ Instant Demo Sign-In (One-Click)
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <NavLink to="/register" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              Create an account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
