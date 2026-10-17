import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PlayCircle,
  Sparkles,
  Briefcase,
  Layers,
  HelpCircle,
  Clock,
  Mic,
  ShieldCheck,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { mockJobRoles } from '../data/mockData';
import { startInterview } from '../services/api';
import { useToast } from '../context/ToastContext';

export const InterviewSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const initialRole = searchParams.get('role') || 'frontend-dev';
  const initialType = searchParams.get('type') || 'Technical Interview';
  const initialDiff = searchParams.get('diff') || 'Medium';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [interviewType, setInterviewType] = useState(initialType);
  const [difficulty, setDifficulty] = useState(initialDiff);
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(20);
  const [voiceMode, setVoiceMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const interviewTypes = [
    { label: 'Technical Interview', desc: 'Coding patterns, framework architecture, DSA & database design' },
    { label: 'HR Interview', desc: 'Culture fit, career aspirations, salary expectations & work ethic' },
    { label: 'Behavioral Interview', desc: 'STAR technique, problem solving, conflict resolution & teamwork' },
    { label: 'Mixed Interview', desc: 'Well-rounded combination of technical challenges and behavioral questions' },
  ];

  const currentRoleObj = mockJobRoles.find((r) => r.id === selectedRole) || mockJobRoles[0];

  const handleStart = async () => {
    setLoading(true);
    try {
      const config = {
        roleId: selectedRole,
        type: interviewType,
        difficulty,
        questionCount,
        timeLimit,
        voiceMode,
      };

      const res = await startInterview(config);
      const data = res.data || res;
      toast.success('Interview session configured. Good luck!');
      navigate(`/interview/${data.interviewId || 'int_live_session'}`, {
        state: { config, session: data },
      });
    } catch (err) {
      toast.error('Could not start interview session. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Interactive Session Wizard</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Configure Your Mock Interview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize target focus, duration, difficulty, and question mode for your mock drill.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Target Job Role Selection */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <Briefcase className="w-5 h-5 text-primary-500" />
            <span>1. Select Target Job Role</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {mockJobRoles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedRole === role.id
                    ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 shadow-sm ring-1 ring-primary-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs md:text-sm text-slate-900 dark:text-white truncate">
                    {role.title}
                  </span>
                  {selectedRole === role.id && (
                    <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{role.department}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* 2. Interview Type */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <Layers className="w-5 h-5 text-secondary-500" />
            <span>2. Select Interview Focus & Category</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {interviewTypes.map((type) => (
              <button
                key={type.label}
                type="button"
                onClick={() => setInterviewType(type.label)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  interviewType === type.label
                    ? 'border-secondary-500 bg-secondary-50/70 dark:bg-secondary-950/40 shadow-sm ring-1 ring-secondary-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                    {type.label}
                  </span>
                  {interviewType === type.label && (
                    <CheckCircle2 className="w-4 h-4 text-secondary-600 dark:text-secondary-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {type.desc}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* 3. Difficulty, Question Count & Time Limit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Difficulty */}
          <Card className="p-5 space-y-3">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    difficulty === diff
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </Card>

          {/* Number of Questions */}
          <Card className="p-5 space-y-3">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    questionCount === num
                      ? 'border-secondary-500 bg-secondary-50 text-secondary-700 dark:bg-secondary-950 dark:text-secondary-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </Card>

          {/* Time Limit */}
          <Card className="p-5 space-y-3">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Time Limit
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[10, 20, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTimeLimit(mins)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    timeLimit === mins
                      ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 4. Voice Mode Toggle */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Voice Interview Mode
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enable live microphone recording and speech waveform analysis during the interview
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={voiceMode}
              onChange={(e) => setVoiceMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </Card>

        {/* Preview Banner */}
        <Card className="p-5 border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-950/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-300">
                Personalized AI Session Preview
              </h4>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                You will receive personalized questions based on your resume and selected job role (
                <strong>{currentRoleObj.title}</strong>). The evaluation rubric will adapt to{' '}
                <strong>{difficulty}</strong> difficulty across {questionCount} questions within a{' '}
                {timeLimit}-minute window.
              </p>
            </div>
          </div>
        </Card>

        {/* Launch Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            icon={PlayCircle}
            onClick={handleStart}
            isLoading={loading}
            className="w-full shadow-xl shadow-indigo-500/25 text-base py-3.5"
          >
            Start Interview Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
