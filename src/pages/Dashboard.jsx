import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlayCircle,
  BarChart2,
  Trophy,
  Award,
  Clock,
  ArrowRight,
  Eye,
  FileCode2,
  Atom,
  Users,
  Database,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import Card, { CardHeader, CardBody } from '../components/Card';
import ScoreCard from '../components/ScoreCard';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.data || data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const practiceIcons = {
    FileCode2,
    Atom,
    Users,
    Database,
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              Good morning, {user?.name?.split(' ')[0] || 'Candidate'} 👋
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ready to improve your interview skills today?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/resume">
            <Button variant="outline" size="sm">
              Review Resume
            </Button>
          </NavLink>
          <NavLink to="/interview/setup">
            <Button variant="primary" size="sm" icon={PlayCircle} className="shadow-sm shadow-indigo-500/30">
              Start Practice Session
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ScoreCard
          title="Total Interviews"
          value={stats?.totalInterviews || 12}
          trend="+3 this month"
          trendType="up"
          icon={PlayCircle}
          iconColor="text-primary-600"
          iconBg="bg-primary-50 dark:bg-primary-950/60"
        />
        <ScoreCard
          title="Average Score"
          value={`${stats?.averageScore || 78}%`}
          trend="+5.4% increase"
          trendType="up"
          icon={BarChart2}
          iconColor="text-secondary-600"
          iconBg="bg-secondary-50 dark:bg-secondary-950/60"
        />
        <ScoreCard
          title="Best Score"
          value={`${stats?.bestScore || 91}%`}
          trend="Top 5% bracket"
          trendType="up"
          icon={Trophy}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <ScoreCard
          title="Questions Practiced"
          value={stats?.questionsPracticed || 142}
          trend="8 skills refined"
          trendType="up"
          icon={Award}
          iconColor="text-accent-600"
          iconBg="bg-accent-50 dark:bg-accent-950/60"
        />
      </div>

      {/* Performance Overview Chart & Continue Practice Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Score vs Interview Date Chart */}
        <div className="lg:col-span-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                  Performance Overview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Score progression across consecutive mock sessions
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                +29% Overall Growth
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats?.scoreHistoryChart || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis domain={[40, 100]} stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`${val}%`, 'Mock Score']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Continue Practice Card */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <Card className="p-6 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white shadow-xl h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-accent-300" />
                <span>Next Targeted Session</span>
              </div>
              <h3 className="text-xl font-bold">Continue Practice</h3>
              <p className="text-white/85 text-xs leading-relaxed">
                Your recent analysis shows high aptitude in Frontend Development. Take the React Hooks & System Design technical simulation to push your score past 95%.
              </p>
            </div>

            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                <span>Target Role: Frontend Developer</span>
                <span className="font-semibold">10 Questions</span>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/interview/setup?role=frontend-dev')}
                className="w-full bg-white text-slate-900 border-white hover:bg-slate-100 font-semibold"
                icon={PlayCircle}
              >
                Resume Frontend Drill
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended Practice Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recommended Practice
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized modules tailored to your target job profile
            </p>
          </div>
          <NavLink
            to="/jobs"
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <span>View All Job Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.recommendedPractice?.map((rec) => {
            const Icon = practiceIcons[rec.icon] || FileCode2;
            return (
              <Card
                key={rec.id}
                hoverEffect
                className="p-5 flex flex-col justify-between"
                onClick={() => navigate(`/interview/setup?role=${rec.roleId}`)}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${rec.badgeColor}`}>
                      {rec.difficulty}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rec.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Focus: {rec.focus}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {rec.duration}
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                    Start <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Interviews Table */}
      <Card className="overflow-hidden">
        <CardHeader
          title="Recent Interviews"
          subtitle="Review completed mock interviews and feedback reports"
          action={
            <NavLink to="/history">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" className="text-xs">
                View Full History
              </Button>
            </NavLink>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Job Role</th>
                <th className="px-6 py-3.5">Interview Type</th>
                <th className="px-6 py-3.5">Score</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {stats?.recentInterviews?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {item.jobRole}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg ${
                        item.score >= 85
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : item.score >= 70
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {item.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => navigate(`/interview/${item.id}/result`)}
                      className="text-xs"
                    >
                      View Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
