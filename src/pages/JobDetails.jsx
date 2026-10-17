import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Clock,
  HelpCircle,
  PlayCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import SkillBadge from '../components/SkillBadge';
import { getJobRoleById } from '../services/api';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configuration options for starting interview
  const [interviewCategory, setInterviewCategory] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [duration, setDuration] = useState('20 min');

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await getJobRoleById(id || 'frontend-dev');
        const data = res.data || res;
        setRole(data);
        if (data.difficulty) setDifficulty(data.difficulty);
      } catch (err) {
        console.error('Failed to load role details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id]);

  const handleStartInterview = () => {
    navigate(
      `/interview/setup?role=${role?.id || 'frontend-dev'}&type=${interviewCategory}&diff=${difficulty}&q=${questionCount}&time=${duration.replace(' min', '')}`
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back button */}
      <div>
        <NavLink
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Roles</span>
        </NavLink>
      </div>

      {/* Main Role Details Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary-900/10 via-secondary-900/10 to-accent-900/10 dark:from-primary-950/40 dark:via-secondary-950/40 dark:to-accent-950/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2.5 py-1 rounded-md">
              {role?.department || 'Engineering'}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {role?.experienceLevel || 'Entry - Mid Level'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            {role?.title || 'Frontend Developer'}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {role?.description}
          </p>
        </div>

        <div className="shrink-0">
          <Button
            variant="primary"
            size="lg"
            icon={PlayCircle}
            onClick={handleStartInterview}
            className="shadow-lg shadow-indigo-500/25 w-full md:w-auto"
          >
            Start AI Interview
          </Button>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Skills, Syllabus & Overview */}
        <div className="lg:col-span-7 space-y-6">
          {/* Required Skills Card */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Required Technical Skills
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Questions will evaluate your practical expertise in the following domains:
            </p>
            <div className="flex flex-wrap gap-2">
              {role?.requiredSkills?.map((skill, idx) => (
                <SkillBadge key={idx} name={skill} category="framework" size="md" />
              ))}
            </div>
          </Card>

          {/* Key Evaluation Dimensions */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Evaluation Rubric & Competency Areas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                  Technical Architecture
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Design patterns, component decomposition, state management, and edge cases.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                  Code Performance & Efficiency
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  DOM reflows, network caching, bundle optimization, and asynchronous tasks.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                  Verbal Clarity & Confidence
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Clear articulation, concise terminology, and structured problem framing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                  Real-World Problem Solving
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Handling unexpected bugs, trade-off evaluations, and team collaboration.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 5 Columns: Interactive Interview Configurator */}
        <div className="lg:col-span-5">
          <Card className="p-6 sticky top-24 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Configure Mock Drill
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize your AI interviewer parameters
              </p>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Interview Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Technical', 'HR', 'Behavioral'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setInterviewCategory(cat)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                      interviewCategory === cat
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                      difficulty === diff
                        ? 'border-secondary-500 bg-secondary-50 text-secondary-700 dark:bg-secondary-950/60 dark:text-secondary-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 rounded-xl text-xs font-semibold text-center border transition-all ${
                      questionCount === num
                        ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-950/60 dark:text-accent-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Interview Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['10 min', '20 min', '30 min'].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setDuration(dur)}
                    className={`py-2 rounded-xl text-xs font-semibold text-center border transition-all ${
                      duration === dur
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                icon={PlayCircle}
                className="w-full shadow-md shadow-indigo-500/25"
                onClick={handleStartInterview}
              >
                Launch AI Interview ({questionCount} Questions)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
