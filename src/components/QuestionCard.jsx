import React, { useState } from 'react';
import Card from './Card';
import { HelpCircle, Lightbulb, Sparkles } from 'lucide-react';

export const QuestionCard = ({
  currentIndex = 1,
  totalQuestions = 10,
  question,
  category = 'Technical',
  difficulty = 'Medium',
  hint,
}) => {
  const [showHint, setShowHint] = useState(false);

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    Hard: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  };

  return (
    <Card className="p-6 md:p-8 border-primary-100 dark:border-primary-950 shadow-md">
      {/* Top Meta info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2.5 py-1 rounded-md">
            Question {currentIndex} of {totalQuestions}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {category}
          </span>
        </div>

        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
            difficultyColors[difficulty] || difficultyColors.Medium
          }`}
        >
          {difficulty}
        </span>
      </div>

      {/* Main Question Text */}
      <div className="my-4">
        <h2 className="text-lg md:text-xl font-semibold leading-relaxed text-slate-900 dark:text-white">
          {question}
        </h2>
      </div>

      {/* AI Hint Section */}
      {hint && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Need a hint? (Click to reveal AI guidelines)</span>
            </button>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3.5 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5 animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">AI Guidance:</span>
                {hint}
              </div>
              <button
                onClick={() => setShowHint(false)}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-800 text-xs font-semibold"
              >
                Hide
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;
