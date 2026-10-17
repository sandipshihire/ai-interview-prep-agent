import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Briefcase,
  PlayCircle,
  Eye,
  Clock,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import SkillBadge from '../components/SkillBadge';
import { getJobRoles } from '../services/api';

export const JobRoles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getJobRoles();
        setRoles(res.data || res);
      } catch (err) {
        console.error('Failed to load job roles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // Filter logic
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesExperience =
      selectedExperience === 'All' || role.experienceLevel.toLowerCase().includes(selectedExperience.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || role.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDifficulty =
      selectedDifficulty === 'All' || role.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesExperience && matchesCategory && matchesDifficulty;
  });

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    Hard: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Explore Target Job Roles
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select an industry role to launch a personalized mock interview drill.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-darkCard border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job roles, technologies (e.g. React, Python, Machine Learning)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Experience Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Experience:</span>
            {['All', 'Entry', 'Mid', 'Senior'].map((exp) => (
              <button
                key={exp}
                onClick={() => setSelectedExperience(exp)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedExperience === exp
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Type:</span>
            {['All', 'Technical', 'Behavioral', 'Mixed'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Difficulty:</span>
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Job Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <Card
            key={role.id}
            hoverEffect
            className="p-6 flex flex-col justify-between"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded">
                  {role.department}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    difficultyColors[role.difficulty] || difficultyColors.Medium
                  }`}
                >
                  {role.difficulty}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {role.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {role.shortDescription}
              </p>

              {/* Skills preview */}
              <div className="mt-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Required Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role.requiredSkills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {role.requiredSkills.length > 4 && (
                    <span className="text-[11px] px-1.5 py-0.5 text-slate-400">
                      +{role.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Duration & Questions stats */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {role.estimatedDuration}
                </span>
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  {role.totalQuestions} Questions
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => navigate(`/jobs/${role.id}`)}
              >
                Role Details
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={PlayCircle}
                className="flex-1 text-xs"
                onClick={() => navigate(`/interview/setup?role=${role.id}`)}
              >
                Start Interview
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-darkCard border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No job roles matched your search criteria. Try loosening your filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedExperience('All');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobRoles;
