import React from 'react';

export const ProgressBar = ({
  progress = 0,
  label = '',
  sublabel = '',
  showPercentage = true,
  height = 'h-2.5',
  color = 'primary', // 'primary', 'success', 'warning', 'danger', 'gradient'
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const colorStyles = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    accent: 'bg-accent-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs md:text-sm">
          <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
            {label && <span>{label}</span>}
            {sublabel && <span className="text-slate-400 font-normal">{sublabel}</span>}
          </div>
          {showPercentage && (
            <span className="font-semibold text-slate-900 dark:text-white">{clampedProgress}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out ${
            colorStyles[color] || colorStyles.primary
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
