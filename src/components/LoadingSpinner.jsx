import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingSpinner = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div
          className={`${sizeMap[size] || sizeMap.md} rounded-full border-2 border-primary-200 dark:border-primary-900 border-t-primary-600 animate-spin`}
        />
        <Sparkles className="w-4 h-4 text-secondary-500 absolute animate-pulse" />
      </div>
      {text && (
        <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-darkBg/80 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export const SkeletonCard = ({ rows = 3, className = '' }) => {
  return (
    <div className={`p-6 bg-white dark:bg-darkCard rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-4 ${className}`}>
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md"
            style={{ width: `${85 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
