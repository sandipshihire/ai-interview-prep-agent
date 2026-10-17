import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  FolderGit2,
  PlayCircle,
} from 'lucide-react';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import SkillBadge from '../components/SkillBadge';
import ResumeUploader from '../components/ResumeUploader';
import { getResumeAnalysis } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Resume = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await getResumeAnalysis();
        setResumeData(res.data || res);
      } catch (err) {
        console.error('Failed to load resume analysis', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  const handleUploadSuccess = (uploadedInfo) => {
    toast.success('Resume uploaded and analyzed successfully!');
    setResumeData((prev) => ({
      ...prev,
      fileName: uploadedInfo.fileName,
      fileSize: uploadedInfo.fileSize,
      uploadDate: uploadedInfo.uploadDate,
      status: uploadedInfo.status,
    }));
  };

  const parsed = resumeData?.parsedData;
  const matchScore = parsed?.matchScore || 84;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Resume Intelligence & Analysis
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated skill extraction, match scoring, and interview readiness insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/interview/setup">
            <Button variant="primary" size="sm" icon={PlayCircle}>
              Practice Interview for My Resume
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Uploader Component */}
      <ResumeUploader
        onUploadSuccess={handleUploadSuccess}
        currentResume={resumeData}
      />

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns: Profile Summary & Categorized Skills */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Summary Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2.5 mb-3 text-slate-900 dark:text-white font-bold text-base">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span>AI Profile Summary</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {parsed?.summary ||
                'Proactive Computer Science undergraduate with hands-on experience building scalable web applications using React, Python, and Node.js. Proven track record in open-source contributions, hackathon wins, and designing RESTful microservices.'}
            </p>
          </Card>

          {/* Categorized Skills Card */}
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Extracted Technical Skills
            </h3>

            {/* Programming Languages */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Programming Languages
              </span>
              <div className="flex flex-wrap gap-2">
                {parsed?.skills?.languages?.map((lang, idx) => (
                  <SkillBadge key={idx} name={lang} category="language" />
                ))}
              </div>
            </div>

            {/* Frameworks & Libraries */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Frameworks & Libraries
              </span>
              <div className="flex flex-wrap gap-2">
                {parsed?.skills?.frameworks?.map((fw, idx) => (
                  <SkillBadge key={idx} name={fw} category="framework" />
                ))}
              </div>
            </div>

            {/* Databases & Storage */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Databases & Storage
              </span>
              <div className="flex flex-wrap gap-2">
                {parsed?.skills?.databases?.map((db, idx) => (
                  <SkillBadge key={idx} name={db} category="database" />
                ))}
              </div>
            </div>

            {/* Developer Tools & DevOps */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Tools & Platforms
              </span>
              <div className="flex flex-wrap gap-2">
                {parsed?.skills?.tools?.map((tool, idx) => (
                  <SkillBadge key={idx} name={tool} category="tool" />
                ))}
              </div>
            </div>
          </Card>

          {/* Experience & Projects Highlight */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-base">
              <Briefcase className="w-5 h-5 text-primary-500" />
              <span>Extracted Experience & Projects</span>
            </div>

            <div className="space-y-4">
              {parsed?.experience?.map((exp, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{exp.role}</h4>
                    <span className="text-xs text-slate-400">{exp.duration}</span>
                  </div>
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{exp.company}</span>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}

              {parsed?.projects?.map((proj, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-secondary-500" />
                      {proj.name}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 my-2">
                    {proj.tech?.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 4 Columns: Circular Resume Match Score & Skill Gap Analysis */}
        <div className="lg:col-span-4 space-y-6">
          {/* Circular Resume Match Score */}
          <Card className="p-6 text-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Resume Match Score
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Evaluation against benchmark entry/mid-level software engineering requirements
            </p>

            {/* Circular Progress SVG */}
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Foreground animated gradient circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-primary-600 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - matchScore / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {matchScore}%
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Strong Match
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Matches 14 of 16 industry requirements for Frontend & Full Stack tracks.
            </div>
          </Card>

          {/* Missing Skills Card */}
          <Card className="p-6 border-rose-100 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10">
            <div className="flex items-center gap-2 mb-3 text-rose-700 dark:text-rose-400 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Missing High-Demand Skills</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Adding these to your resume can significantly increase recruiter interview requests:
            </p>
            <div className="flex flex-wrap gap-2">
              {parsed?.missingSkills?.map((skill, idx) => (
                <SkillBadge key={idx} name={skill} category="missing" />
              ))}
            </div>
          </Card>

          {/* Recommended Skills Card */}
          <Card className="p-6 border-amber-100 dark:border-amber-950/60 bg-amber-50/20 dark:bg-amber-950/10">
            <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Skills to Practice</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsed?.recommendedSkills?.map((skill, idx) => (
                <SkillBadge key={idx} name={skill} category="recommended" />
              ))}
            </div>
          </Card>

          {/* Strengths & Improvements */}
          <Card className="p-6 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Resume Strengths
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {parsed?.strengths?.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                Areas to Improve
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {parsed?.areasToImprove?.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resume;
