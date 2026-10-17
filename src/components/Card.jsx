import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${
        glass
          ? 'glass-panel'
          : 'bg-white dark:bg-darkCard border border-slate-200/80 dark:border-slate-800 shadow-sm'
      } ${
        hoverEffect ? 'hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700/60 hover:-translate-y-0.5' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', title, subtitle, action }) => {
  if (title || subtitle || action) {
    return (
      <div className={`p-5 md:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4 ${className}`}>
        <div>
          {title && <h3 className="font-semibold text-slate-900 dark:text-white text-base md:text-lg">{title}</h3>}
          {subtitle && <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }
  return <div className={`p-5 md:p-6 border-b border-slate-100 dark:border-slate-800/80 ${className}`}>{children}</div>;
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={`p-5 md:p-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={`p-4 md:p-5 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/80 rounded-b-2xl ${className}`}>{children}</div>;
};

export default Card;
