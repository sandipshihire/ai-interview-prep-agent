import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const InterviewTimer = ({
  initialSeconds = 1200, // 20 minutes default
  onTimeUp,
  isPaused = false,
  className = '',
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isPaused, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = secondsLeft < 180 && secondsLeft > 45; // Under 3 mins
  const isDanger = secondsLeft <= 45; // Under 45 secs

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
        isDanger
          ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse'
          : isWarning
          ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      } ${className}`}
    >
      {isDanger ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <Clock className="w-4 h-4 text-primary-500" />}
      <span className="tabular-nums tracking-wider">{formattedTime}</span>
    </div>
  );
};

export default InterviewTimer;
