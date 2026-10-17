import React from 'react';
import Card from './Card';
import ProgressBar from './ProgressBar';
import { CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import SkillBadge from './SkillBadge';

export const FeedbackCard = ({
  categories = [],
  strengths = [],
  areasToImprove = [],
  aiFeedback = '',
  recommendedTopics = [],
}) => {
  return (
    <div className="space-y-6">
      {/* AI Qualitative Feedback Box */}
      {aiFeedback && (
        <Card className="p-6 border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-950/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                AI Interviewer Comprehensive Evaluation
              </h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {aiFeedback}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Categories Score Breakdown */}
      {categories.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold text-slate-900 dark:text-white text-base mb-4">
            Performance Breakdown
          </h4>
          <div className="space-y-4">
            {categories.map((cat, idx) => (
              <ProgressBar
                key={idx}
                label={cat.name}
                progress={cat.score}
                color={cat.score >= 80 ? 'primary' : cat.score >= 70 ? 'accent' : 'warning'}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Strengths and Areas to Improve Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6 border-emerald-100 dark:border-emerald-950/50 bg-emerald-50/30 dark:bg-emerald-950/10">
          <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            <span>Key Strengths</span>
          </div>
          <ul className="space-y-2.5">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Areas to Improve */}
        <Card className="p-6 border-amber-100 dark:border-amber-950/50 bg-amber-50/30 dark:bg-amber-950/10">
          <div className="flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-400 font-semibold">
            <AlertCircle className="w-5 h-5" />
            <span>Areas to Improve</span>
          </div>
          <ul className="space-y-2.5">
            {areasToImprove.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recommended Topics */}
      {recommendedTopics.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-primary-500" />
            <span>Recommended Topics to Review</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedTopics.map((topic, i) => (
              <SkillBadge key={i} name={topic} category="framework" size="md" />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FeedbackCard;
