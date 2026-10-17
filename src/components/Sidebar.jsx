import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  PlayCircle,
  BarChart3,
  History,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bot,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Resume', path: '/resume', icon: FileText, badge: 'AI Parsed' },
    { label: 'Job Roles', path: '/jobs', icon: Briefcase },
    { label: 'Start Interview', path: '/interview/setup', icon: PlayCircle, highlight: true },
    { label: 'Performance', path: '/performance', icon: BarChart3 },
    { label: 'Interview History', path: '/history', icon: History },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`hidden md:flex flex-col fixed top-0 left-0 z-30 h-screen bg-white dark:bg-darkCard border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 bg-clip-text text-transparent">
                InterviewAI
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                AI Interview Coach
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-sm shadow-primary-500/30'
                      : 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 font-semibold'
                    : item.highlight
                    ? 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  item.highlight ? 'text-primary-500' : ''
                }`}
              />
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <Sparkles className="w-3.5 h-3.5 text-primary-400 animate-pulse" />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Profile & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt="Candidate"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-primary-500 shrink-0"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || 'Candidate'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'candidate@demo.com'}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
