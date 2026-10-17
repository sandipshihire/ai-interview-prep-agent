import React from 'react';

export const SkillBadge = ({
  name,
  category = 'default', // 'language', 'framework', 'database', 'tool', 'missing', 'recommended'
  size = 'md',
  onRemove,
  highlight = false,
}) => {
  const categoryStyles = {
    language: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    framework: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    database: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    tool: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
    missing: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    recommended: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    default: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-xs md:text-sm px-3 py-1.5',
    lg: 'text-sm px-3.5 py-2',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all ${
        sizes[size] || sizes.md
      } ${categoryStyles[category] || categoryStyles.default} ${
        highlight ? 'ring-2 ring-primary-500 ring-offset-1' : ''
      }`}
    >
      <span>{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(name);
          }}
          className="ml-1 hover:text-rose-500 font-bold p-0.5 focus:outline-none"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
