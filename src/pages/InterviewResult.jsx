import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  LayoutDashboard,
  FileText,
  Clock,
  Download,
  Share2,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import FeedbackCard from '../components/FeedbackCard';
import SkillBadge from '../components/SkillBadge';
import { getInterviewResult, downloadPdfReport } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

export const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'questions'

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await downloadPdfReport(id);
      toast.success('Interview evaluation report downloaded as PDF!');
    } catch (err) {
      toast.error('Failed to download PDF report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    // Trigger celebratory confetti on initial load
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Confetti fallback
    }

    const fetchResult = async () => {
      try {
        const res = await getInterviewResult(id);
        setResult(res.data || res);
      } catch (err) {
        console.error('Failed to fetch interview result', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  const score = result?.overallScore || 82;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Evaluation Report Generated</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Interview Completed 🎉
          </h1>
          <p className="text-white/85 text-xs md:text-sm max-w-xl leading-relaxed">
            Great performance! Your mock session for{' '}
            <span className="font-bold underline">{result?.jobRole || 'Frontend Developer'}</span>{' '}
            has been evaluated across 5 key industry competencies.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="md"
            icon={Download}
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="bg-white/20 text-white border-white/50 hover:bg-white/30 font-semibold"
          >
            {downloading ? 'Downloading...' : 'Download PDF Report'}
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={RotateCcw}
            onClick={() => navigate('/interview/setup')}
            className="bg-white text-slate-900 border-white hover:bg-slate-100 font-semibold"
          >
            Practice Again
          </Button>
          <NavLink to="/dashboard">
            <Button variant="ghost" size="md" icon={LayoutDashboard} className="text-white hover:bg-white/10">
              Dashboard
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Top Overview: Overall Score Circular Meter + Radar Competency Chart */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Overall Score Meter (5 Cols) */}
        <div className="md:col-span-5">
          <Card className="p-8 text-center h-full flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Composite Performance
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-6">
                Overall Interview Score
              </h3>

              {/* Circular Gauge */}
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-primary-600 transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {score}%
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    Exceeds Benchmark
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div>
                <span className="block text-slate-400">Time Taken</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {result?.durationTaken || '18m 42s'}
                </span>
              </div>
              <div>
                <span className="block text-slate-400">Questions Answered</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {result?.answeredQuestions || 5} of {result?.totalQuestions || 5}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recharts Radar Chart for Multi-dimensional Evaluation (7 Cols) */}
        <div className="md:col-span-7">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Multi-Dimensional Competency Radar
                </h3>
                <span className="text-xs text-slate-400">Candidate vs Target Benchmark</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Comparison of your skills across technical knowledge, communication, relevance, confidence, and problem solving.
              </p>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={result?.radarData || []}>
                  <PolarGrid stroke="#334155" opacity={0.2} />
                  <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#94A3B8" fontSize={10} />
                  <Radar
                    name="Candidate"
                    dataKey="candidate"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.45}
                  />
                  <Radar
                    name="Target Benchmark"
                    dataKey="target"
                    stroke="#06B6D4"
                    fill="#06B6D4"
                    fillOpacity={0.15}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                <span>Your Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-400"></span>
                <span>Target Benchmark (80%)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs Navigation: Summary vs Question Breakdown */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'summary'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Overview & Rubric Feedback
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'questions'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Question-by-Question Analysis
        </button>
      </div>

      {/* TAB 1: Summary, Categories, Strengths & Recommendations */}
      {activeTab === 'summary' && (
        <FeedbackCard
          categories={result?.categories || []}
          strengths={result?.strengths || []}
          areasToImprove={result?.areasToImprove || []}
          aiFeedback={result?.aiFeedback || ''}
          recommendedTopics={result?.recommendedTopics || []}
        />
      )}

      {/* TAB 2: Question by Question Detailed Breakdown */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {result?.questionsDetail?.map((item) => (
            <Card key={item.qIndex} className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 dark:bg-primary-950/60 px-2.5 py-1 rounded-md">
                  Question {item.qIndex}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Score: {item.score}%
                </span>
              </div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                {item.question}
              </h4>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                <strong className="block mb-1 text-slate-500 font-sans">Your Answer:</strong>
                "{item.userAnswer}"
              </div>

              <div className="p-3 rounded-xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40 text-xs text-primary-900 dark:text-primary-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">AI Evaluator Feedback:</span>
                  {item.feedback}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bottom CTA & Navigation */}
      <div className="p-6 rounded-2xl bg-white dark:bg-darkCard border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            Ready for your next mock drill?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Strengthen your weak areas or practice a different tech stack role.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/history')}
          >
            View Full History
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/interview/setup')}
          >
            Practice Next Role
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;
