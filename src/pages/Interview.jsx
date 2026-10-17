import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Send,
  SkipForward,
  Mic,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import InterviewTimer from '../components/InterviewTimer';
import AudioRecorder from '../components/AudioRecorder';
import { mockQuestionsBank } from '../data/mockData';
import { submitAnswer, submitVoiceAnswer, finishInterview } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const sessionConfig = location.state?.config || {
    roleId: 'frontend-dev',
    type: 'Technical Interview',
    difficulty: 'Medium',
    questionCount: 5,
    timeLimit: 20,
    voiceMode: true,
  };

  // Questions from real backend session or fallback to mock
  const sessionData = location.state?.session;
  const questionsList =
    sessionData?.questions && sessionData.questions.length > 0
      ? sessionData.questions
      : mockQuestionsBank[sessionConfig.roleId] || mockQuestionsBank['frontend-dev'];
  const totalQuestions = questionsList.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answerText, setAnswerText] = useState('');
  const [recordedVoiceData, setRecordedVoiceData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiStatus, setAiStatus] = useState('Waiting for your answer');
  // AI Statuses: 'Speaking question...', 'Listening...', 'Waiting for your answer', 'AI is analyzing your answer...'
  const [isTtsActive, setIsTtsActive] = useState(false);

  const currentQuestion = questionsList[currentQuestionIndex - 1] || questionsList[0];
  const progressPercentage = Math.round(((currentQuestionIndex - 1) / totalQuestions) * 100);

  // Read question aloud using Web Speech Synthesis if available
  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      if (isTtsActive) {
        window.speechSynthesis.cancel();
        setIsTtsActive(false);
        setAiStatus('Waiting for your answer');
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
        utterance.rate = 0.95;
        utterance.onstart = () => {
          setIsTtsActive(true);
          setAiStatus('Speaking question...');
        };
        utterance.onend = () => {
          setIsTtsActive(false);
          setAiStatus('Waiting for your answer');
        };
        utterance.onerror = () => {
          setIsTtsActive(false);
          setAiStatus('Waiting for your answer');
        };
        window.speechSynthesis.speak(utterance);
      }
    } else {
      toast.info('Text-to-speech is not supported in this browser.');
    }
  };

  // Stop speech synthesis when changing questions or leaving
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestionIndex]);

  const handleVoiceRecorded = (voiceData) => {
    setRecordedVoiceData(voiceData);
    setAnswerText((prev) => (prev ? `${prev} ${voiceData.transcription}` : voiceData.transcription));
    setAiStatus('Listening...');
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < totalQuestions) {
      toast.info('Question skipped.');
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswerText('');
      setRecordedVoiceData(null);
      setAiStatus('Waiting for your answer');
    } else {
      completeInterview();
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() && !recordedVoiceData) {
      toast.error('Please provide a typed or voice answer before submitting.');
      return;
    }

    setIsSubmitting(true);
    setAiStatus('AI is analyzing your answer...');

    try {
      const qId = currentQuestion.id || currentQuestionIndex;
      const textToSubmit = answerText.trim() || recordedVoiceData?.transcription || '';

      await submitAnswer(id, {
        questionId: qId,
        questionIndex: currentQuestionIndex,
        answer: textToSubmit,
        audioData: recordedVoiceData,
      });

      // Brief AI evaluation status display
      await new Promise((r) => setTimeout(r, 600));

      if (currentQuestionIndex < totalQuestions) {
        toast.success(`Question ${currentQuestionIndex} evaluated.`);
        setCurrentQuestionIndex((prev) => prev + 1);
        setAnswerText('');
        setRecordedVoiceData(null);
        setAiStatus('Waiting for your answer');
      } else {
        completeInterview();
      }
    } catch (err) {
      toast.error('Evaluation service error. Moving to next question.');
      if (currentQuestionIndex < totalQuestions) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        completeInterview();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeInterview = async () => {
    setIsSubmitting(true);
    setAiStatus('Generating comprehensive evaluation report...');
    try {
      await finishInterview(id);
      toast.success('Interview session completed!');
      navigate(`/interview/${id}/result`);
    } catch (err) {
      navigate(`/interview/${id}/result`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    toast.error('Time limit reached! Finalizing interview session.');
    completeInterview();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* Top Session Status Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-darkCard border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {sessionConfig.type || 'Technical Interview'} • {sessionConfig.difficulty || 'Medium'}
            </h3>
            <p className="text-[11px] text-slate-500">
              Role: {sessionConfig.roleId} • Question {currentQuestionIndex} of {totalQuestions}
            </p>
          </div>
        </div>

        {/* Progress & Countdown Timer */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 w-36">
            <ProgressBar progress={progressPercentage} showPercentage={false} height="h-2" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {progressPercentage}%
            </span>
          </div>

          <InterviewTimer
            initialSeconds={(sessionConfig.timeLimit || 20) * 60}
            onTimeUp={handleTimeUp}
          />
        </div>
      </div>

      {/* Main Split Layout: Left AI Interviewer / Right Question & Answer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: AI Interviewer Persona (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 text-center space-y-5 border-primary-200/60 dark:border-primary-900/40">
            <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-600 to-accent-500 opacity-20 blur-lg transition-all duration-700 ${
                  aiStatus === 'Listening...'
                    ? 'scale-125 opacity-50'
                    : isSubmitting
                    ? 'animate-pulse'
                    : ''
                }`}
              />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-accent-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/30">
                <Bot className="w-12 h-12" />
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-darkCard"></span>
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Interviewer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Powered by Multi-Dimensional Technical Rubric
              </p>
            </div>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-500" />
                  <span>Analyzing answer...</span>
                </>
              ) : aiStatus === 'Listening...' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-rose-600 dark:text-rose-400">Listening...</span>
                </>
              ) : aiStatus === 'Speaking question...' ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-primary-500 animate-bounce" />
                  <span className="text-primary-600 dark:text-primary-400">Speaking...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Waiting for your answer</span>
                </>
              )}
            </div>

            {/* Audio Waveform visualization */}
            <div className="flex items-center justify-center gap-1.5 h-8 py-1">
              {[14, 28, 18, 36, 22, 16, 32, 26, 12, 24, 34, 20].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    aiStatus === 'Listening...' || isTtsActive
                      ? 'bg-gradient-to-t from-primary-500 to-accent-400 animate-wave'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  style={{
                    height: aiStatus === 'Listening...' || isTtsActive ? `${h}px` : '6px',
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>

            {/* Speech synthesis trigger */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                icon={isTtsActive ? VolumeX : Volume2}
                onClick={speakQuestion}
                className="w-full text-xs"
              >
                {isTtsActive ? 'Stop AI Speech' : 'Read Question Aloud (Voice)'}
              </Button>
            </div>
          </Card>

          {/* Quick tips panel */}
          <Card className="p-5 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span>Pro Interview Advice</span>
            </h4>
            <p className="leading-relaxed">
              • State the high-level concept before diving into code details.
            </p>
            <p className="leading-relaxed">
              • Highlight trade-offs (e.g. memory vs execution speed).
            </p>
            <p className="leading-relaxed">
              • If using voice mode, speak at an even pace without rushing.
            </p>
          </Card>
        </div>

        {/* RIGHT PANEL: Question Card & Answer Submission (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Card */}
          <QuestionCard
            currentIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            question={currentQuestion.question}
            category={currentQuestion.category}
            difficulty={currentQuestion.difficulty}
            hint={currentQuestion.hint}
          />

          {/* Voice Recorder Component (if Voice Mode enabled) */}
          {sessionConfig.voiceMode && (
            <AudioRecorder
              onVoiceRecorded={handleVoiceRecorded}
              disabled={isSubmitting}
            />
          )}

          {/* Answer Text Area */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Your Answer</span>
                <span className="text-slate-400 font-normal">
                  (Type or use voice speech above)
                </span>
              </label>
              <span className="text-xs text-slate-400">
                {answerText.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={7}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your structured answer here... Be sure to define key terminology, discuss trade-offs, and mention practical use cases."
              disabled={isSubmitting}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white leading-relaxed resize-y font-sans"
            />

            {/* Actions Toolbar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                icon={SkipForward}
                onClick={handleSkipQuestion}
                disabled={isSubmitting}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Skip Question
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  icon={currentQuestionIndex === totalQuestions ? CheckCircle2 : Send}
                  iconPosition="right"
                  onClick={handleSubmitAnswer}
                  isLoading={isSubmitting}
                  className="shadow-md shadow-indigo-500/20"
                >
                  {currentQuestionIndex === totalQuestions
                    ? 'Submit & Finish Interview'
                    : 'Submit Answer'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Overlay when evaluating */}
          {isSubmitting && (
            <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/80 flex items-center gap-3 animate-fade-in">
              <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
              <div className="text-xs">
                <span className="font-semibold text-primary-900 dark:text-primary-200 block">
                  AI is analyzing your answer...
                </span>
                <span className="text-primary-700 dark:text-primary-400">
                  Checking accuracy, keyword coverage, and structured reasoning.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
