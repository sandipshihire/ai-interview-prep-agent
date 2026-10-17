import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Mic,
  BarChart3,
  Brain,
  ShieldCheck,
  Zap,
  Code2,
  Users,
  Target,
  Award,
  PlayCircle,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

export const Landing = () => {
  const { isDark, toggleTheme } = useTheme();

  const features = [
    {
      title: 'Resume Analysis',
      description: 'Upload your PDF/DOCX resume for automated NLP skill extraction, strength discovery, and gap analysis.',
      icon: FileText,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Personalized Questions',
      description: 'Adaptive questions dynamically generated to match your exact resume projects, experience, and target tech stack.',
      icon: Target,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'AI Mock Interview',
      description: 'Real-time simulated interviewer with natural conversation flow, intelligent follow-ups, and adaptive difficulty.',
      icon: Bot,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Technical Interview',
      description: 'Deep dive into data structures, algorithms, system design, framework lifecycles, and database querying.',
      icon: Code2,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'HR & Behavioral',
      description: 'Master behavioral questions using the STAR framework, conflict resolution, leadership scenarios, and team alignment.',
      icon: Users,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Voice-Based Interview',
      description: 'Practice speaking out loud with real-time speech recording, waveform audio feedback, and speech transcription.',
      icon: Mic,
      color: 'from-rose-500 to-red-500',
    },
    {
      title: 'Instant AI Feedback',
      description: 'Receive multi-dimensional rubric scoring across technical clarity, answer relevance, problem solving, and confidence.',
      icon: Brain,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Performance Analytics',
      description: 'Track your growth over time with interactive Recharts radar charts, trend curves, and skill proficiency milestones.',
      icon: BarChart3,
      color: 'from-indigo-600 to-cyan-500',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Your Resume',
      desc: 'Drop your resume in PDF or DOCX format. The AI parses your tech stack, project ownership, and experience in seconds.',
    },
    {
      step: '02',
      title: 'Select Target Role',
      desc: 'Pick your dream role—Frontend, Backend, ML, Full Stack, or Behavioral—and customize question count and difficulty.',
    },
    {
      step: '03',
      title: 'Practice with AI',
      desc: 'Engage with our AI interviewer using voice or text answers with an active timer and realistic evaluation rubric.',
    },
    {
      step: '04',
      title: 'Review Actionable Report',
      desc: 'Inspect your radar competency scores, pinpoint strengths, address knowledge gaps, and watch your metrics climb.',
    },
  ];

  return (
    <div className="min-h-screen bg-slateBg dark:bg-darkBg text-lightText dark:text-darkText selection:bg-primary-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-darkBg/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 bg-clip-text text-transparent">
                InterviewAI
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Features
            </a>
            <a href="#analytics" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Analytics
            </a>
            <a href="#why-us" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Why InterviewAI
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
            </button>
            <NavLink to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </NavLink>
            <NavLink to="/dashboard">
              <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                Open App
              </Button>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary-500/15 via-secondary-500/15 to-accent-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800/80 text-primary-700 dark:text-primary-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen AI Interview Preparation Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Practice Smarter.{' '}
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 bg-clip-text text-transparent">
                Interview Better.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              An AI-powered interview preparation platform that analyzes your resume, generates personalized questions, conducts mock interviews, and provides actionable feedback.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <NavLink to="/interview/setup">
                <Button variant="primary" size="lg" icon={PlayCircle} className="shadow-lg shadow-indigo-500/25">
                  Start Interview Practice
                </Button>
              </NavLink>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Micro badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Resume Match Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Voice & Text Mode</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Multi-Dimensional Rubric</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Modern AI Interview Dashboard Mockup */}
          <div className="mt-12 md:mt-16 max-w-5xl mx-auto relative">
            <div className="rounded-3xl p-3 bg-gradient-to-b from-slate-200/80 to-slate-300/40 dark:from-slate-800 dark:to-slate-900/60 shadow-2xl border border-slate-200/60 dark:border-slate-800">
              <div className="rounded-2xl bg-white dark:bg-[#1E293B] overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Mockup Header bar */}
                <div className="h-10 bg-slate-100 dark:bg-slate-900/80 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-medium text-slate-500">
                      interviewai.app/interview/live
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    ● Live Session
                  </span>
                </div>

                {/* Mockup Content Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 dark:bg-slate-900/40">
                  {/* Left Mock Interviewer */}
                  <div className="md:col-span-4 p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-accent-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/30">
                        <Bot className="w-10 h-10" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-darkBg"></span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI Interviewer</h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Listening to candidate...</p>
                    </div>
                    {/* Mock Waveform */}
                    <div className="flex items-center gap-1 h-6">
                      {[12, 22, 16, 28, 20, 14, 26, 18, 10, 24].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-primary-500 to-accent-400 rounded-full animate-wave"
                          style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Mock Question & Answer */}
                  <div className="md:col-span-8 p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold">
                        Question 3 of 10
                      </span>
                      <span className="text-slate-400 font-mono">Timer: 18:42</span>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-slate-800 dark:text-white">
                      "Explain the difference between let, const, and var in JavaScript, and how temporal dead zone (TDZ) affects them."
                    </p>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                      &gt; Candidate answering via Voice Mode: "let and const provide block scoping, avoiding variable leaks into outer scopes..."
                    </div>
                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ Audio Stream Connected
                      </span>
                      <span className="px-3 py-1 bg-primary-600 text-white rounded-lg font-medium">
                        Submit Answer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-[#0F172A]/80 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">
              Workflow
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How InterviewAI Works
            </h3>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm md:text-base">
              From resume upload to interview mastery in four streamlined steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-darkCard border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group"
              >
                <span className="text-3xl font-extrabold text-primary-500/30 group-hover:text-primary-500 transition-colors">
                  {item.step}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" className="py-20 bg-slateBg dark:bg-darkBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">
              Built for Success
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need to Crack Your Dream Job
            </h3>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm md:text-base">
              Comprehensive interview preparation designed specifically for college placements and competitive tech roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} hoverEffect className="p-6 flex flex-col justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analytics Preview Section */}
      <section id="analytics" className="py-20 bg-white dark:bg-[#0F172A]/80 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400">
                Actionable Intelligence
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                Gain Deep Insights Into Your Interview Readiness
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Traditional mock interviews leave you with vague verbal notes. InterviewAI breaks down your performance across 5 key competencies: Technical Rigor, Verbal Delivery, Answer Relevance, Composure, and Problem Solving.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">
                    Comparative Radar visualizations across industry standards
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">
                    Targeted skill proficiency bars for Python, React, SQL & System Design
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">
                    Historical interview archive with side-by-side answer rubrics
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <NavLink to="/performance">
                  <Button variant="primary" icon={BarChart3}>
                    Explore Analytics Dashboard
                  </Button>
                </NavLink>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl p-6 bg-slate-50 dark:bg-darkCard border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      Sample Candidate Growth Trajectory
                    </h4>
                    <p className="text-xs text-slate-500">6 Mock Sessions • +29% Improvement</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                    Top 5% Ready
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-400">Total Practiced</span>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">12</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-400">Avg Score</span>
                    <p className="text-xl font-bold text-primary-600 mt-1">78%</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-400">Highest Score</span>
                    <p className="text-xl font-bold text-emerald-600 mt-1">91%</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-400">Resume Match</span>
                    <p className="text-xl font-bold text-secondary-600 mt-1">84%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 bg-slateBg dark:bg-darkBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">
              Why InterviewAI
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Designed for High-Impact Placement Success
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Zero Guesswork</h4>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Know exactly what concepts to study based on automated extraction of gaps between your resume and target industry job descriptions.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-950/60 text-secondary-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Safe Practice Arena</h4>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Make mistakes, test articulate responses, and build genuine confidence in a judgment-free, private AI sandbox.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-950/60 text-accent-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">College Project Ready</h4>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Engineered to production standards with modular architecture, clean FastAPI API-readiness, and modern UI/UX design.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 md:p-14 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white shadow-2xl text-center space-y-6 relative">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Ace Your Next Interview?
            </h3>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
              Upload your resume now, configure your customized AI mock session, and receive your comprehensive performance diagnostic.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <NavLink to="/dashboard">
                <Button variant="outline" size="lg" className="bg-white text-slate-900 border-white hover:bg-slate-100">
                  Launch Free Practice Session
                </Button>
              </NavLink>
              <NavLink to="/resume">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                  Upload Resume First
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-darkCard border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">
              InterviewAI
            </span>
            <span className="text-slate-400 ml-2">| Your Personal AI Interview Coach</span>
          </div>

          <div className="flex items-center gap-6">
            <NavLink to="/dashboard" className="hover:text-primary-600 transition-colors">
              Dashboard
            </NavLink>
            <NavLink to="/resume" className="hover:text-primary-600 transition-colors">
              Resume Analysis
            </NavLink>
            <NavLink to="/jobs" className="hover:text-primary-600 transition-colors">
              Job Roles
            </NavLink>
            <NavLink to="/performance" className="hover:text-primary-600 transition-colors">
              Analytics
            </NavLink>
          </div>

          <div>
            <p>© 2026 InterviewAI. Engineered for Final-Year Demonstration.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
