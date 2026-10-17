import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, RotateCcw, Volume2, Check } from 'lucide-react';
import Button from './Button';

export const AudioRecorder = ({
  onVoiceRecorded,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioWaves, setAudioWaves] = useState([12, 24, 18, 30, 20, 15, 28, 22, 10, 18, 32, 25]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
        // Randomize audio wave heights for dynamic audio waveform look
        setAudioWaves(
          Array.from({ length: 16 }, () => Math.floor(Math.random() * 28) + 8)
        );
      }, 150);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Check if getUserMedia is supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
          // Graceful fallback for demo or permissions blocked
          console.log('[AudioRecorder] Mic permissions optional for interactive UI test');
        });
      }
    } catch (e) {
      console.log('[AudioRecorder] Simulation active');
    }
    setRecordTime(0);
    setRecordedAudio(null);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    const simulatedAudioData = {
      durationSeconds: Math.max(1, Math.floor(recordTime / 6.6)),
      transcription:
        'In JavaScript, let and const are block scoped, whereas var is function scoped. Additionally, var declarations are hoisted and initialized to undefined, while let and const stay uninitialized inside the temporal dead zone.',
    };
    setRecordedAudio(simulatedAudioData);
    if (onVoiceRecorded) {
      onVoiceRecorded(simulatedAudioData);
    }
  };

  const resetRecording = () => {
    setIsRecording(false);
    setRecordTime(0);
    setRecordedAudio(null);
  };

  const seconds = Math.floor(recordTime / 6.6);
  const formattedTime = `00:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* State Indicator */}
        <div className="flex items-center gap-3">
          {isRecording ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Recording Audio
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {formattedTime}
              </span>
            </div>
          ) : recordedAudio ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Check className="w-4 h-4" />
              <span>Voice answer recorded ({recordedAudio.durationSeconds}s)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <Mic className="w-4 h-4 text-primary-500" />
              <span>Click to record voice answer instead of typing</span>
            </div>
          )}
        </div>

        {/* Animated Waveform display during recording */}
        {isRecording && (
          <div className="flex items-center gap-1 h-8 px-3 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
            {audioWaves.map((h, idx) => (
              <span
                key={idx}
                className="w-1 bg-gradient-to-t from-primary-500 to-accent-400 rounded-full transition-all duration-150"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {!isRecording && !recordedAudio && (
            <Button
              variant="outline"
              size="sm"
              icon={Mic}
              onClick={startRecording}
              disabled={disabled}
              className="text-primary-600 border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950/40"
            >
              Record Voice
            </Button>
          )}

          {isRecording && (
            <Button
              variant="danger"
              size="sm"
              icon={Square}
              onClick={stopRecording}
            >
              Stop & Use Voice
            </Button>
          )}

          {recordedAudio && (
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={resetRecording}
              className="text-xs text-slate-500"
            >
              Re-record
            </Button>
          )}
        </div>
      </div>

      {recordedAudio?.transcription && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 italic flex items-start gap-2">
          <Volume2 className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
          <span>
            <strong>AI Auto-Transcription:</strong> "{recordedAudio.transcription}"
          </span>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
