import React from 'react';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const ScoreCard = ({
  title,
  value,
  suffix = '',
  trend,
  trendType = 'up', // 'up' or 'down'
  subtitle,
  icon: Icon,
  iconColor = 'text-primary-500',
  iconBg = 'bg-primary-50 dark:bg-primary-950/50',
  className = '',
}) => {
  return (
    <Card className={`p-5 md:p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </h3>
            {suffix && <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{suffix}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md ${
                trendType === 'up'
                  ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              {trendType === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};

export default ScoreCard;
