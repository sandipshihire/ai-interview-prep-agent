import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Trophy,
  Award,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import Card from '../components/Card';
import ScoreCard from '../components/ScoreCard';
import ProgressBar from '../components/ProgressBar';
import { getPerformance } from '../services/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const Performance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const res = await getPerformance();
        setData(res.data || res);
      } catch (err) {
        console.error('Failed to load performance metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerf();
  }, []);

  const stats = data || {};

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Longitudinal Intelligence</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Performance Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics, score trajectory, and domain proficiency breakdown over time.
        </p>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ScoreCard
          title="Average Score"
          value={`${stats.averageScore || 78}%`}
          trend="+5.4% improvement"
          trendType="up"
          icon={Target}
          iconColor="text-primary-600"
          iconBg="bg-primary-50 dark:bg-primary-950/60"
        />
        <ScoreCard
          title="Highest Score"
          value={`${stats.highestScore || 91}%`}
          trend="Top 5% percentile"
          trendType="up"
          icon={Trophy}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <ScoreCard
          title="Lowest Score"
          value={`${stats.lowestScore || 62}%`}
          subtitle="Baseline score recorded"
          icon={Zap}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />
        <ScoreCard
          title="Total Interviews"
          value={stats.totalInterviews || 12}
          subtitle={`${stats.totalHoursPracticed || 4.8} hours total speech time`}
          icon={Clock}
          iconColor="text-accent-600"
          iconBg="bg-accent-50 dark:bg-accent-950/60"
        />
      </div>

      {/* Charts Row 1: Score Trend Over Time & Accuracy Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trend Over Time (8 Cols) */}
        <div className="lg:col-span-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Score Evolution Trend (Monthly)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Technical competency vs behavioral communication growth
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis domain={[40, 100]} stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="technical"
                    name="Technical Score"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="behavioral"
                    name="Behavioral Score"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="overall"
                    name="Composite"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Question Accuracy Pie Breakdown (4 Cols) */}
        <div className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Question Accuracy Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
                Rubric evaluations across 142 practiced questions
              </p>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.accuracyBreakdown || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.accuracyBreakdown?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`${val}%`, 'Accuracy']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {stats.accuracyBreakdown?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Charts Row 2: Skill Performance Bars & Milestone Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Skill Performance Bars (7 Cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Skill Performance & Proficiency
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated mastery based on questions successfully answered
              </p>
            </div>

            <div className="space-y-4 pt-1">
              {stats.skillProficiency?.map((skillItem, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {skillItem.skill}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {skillItem.score}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={skillItem.score}
                    showPercentage={false}
                    height="h-2.5"
                    color={
                      skillItem.score >= 85
                        ? 'success'
                        : skillItem.score >= 75
                        ? 'primary'
                        : skillItem.score >= 68
                        ? 'accent'
                        : 'warning'
                    }
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Improvement Over Time Milestones (5 Cols) */}
        <div className="lg:col-span-5">
          <Card className="p-6 h-full">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Improvement Milestones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Tracked breakthroughs in your interview preparation journey
            </p>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {stats.milestones?.map((m, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-primary-600 ring-4 ring-white dark:ring-darkCard" />
                  <div>
                    <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded">
                      {m.badge}
                    </span>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                      {m.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {m.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Performance;
