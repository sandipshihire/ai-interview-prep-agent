import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sun,
  Moon,
  Bell,
  Menu,
  Sparkles,
  Bot,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: 'Resume Analyzed Successfully',
      desc: 'Resume match score calculated for Frontend Developer.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Mock Interview Feedback Ready',
      desc: 'Overall score: 82%. View your detailed report.',
      time: '2h ago',
      unread: false,
    },
    {
      id: 3,
      title: 'New Recommended Questions',
      desc: 'React 19 hooks and Concurrent Mode questions available.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-darkCard/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex md:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-bold text-base bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              AI Engine Ready
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Quick Practice Pill */}
          <NavLink
            to="/interview/setup"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            <span>Quick Practice</span>
          </NavLink>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-scale-up">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Notifications
                  </span>
                  <span className="text-[11px] text-primary-600 dark:text-primary-400 font-medium cursor-pointer">
                    Mark all read
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {mockNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        n.unread ? 'bg-primary-50/30 dark:bg-primary-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-slate-900 dark:text-white">{n.title}</h5>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <NavLink
            to="/profile"
            className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/30"
            />
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
