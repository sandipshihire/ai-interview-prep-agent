import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  Mic,
  Shield,
  Trash2,
  Lock,
  User,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const toast = useToast();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [defaultVoiceMode, setDefaultVoiceMode] = useState(true);
  const [autoTimerSubmission, setAutoTimerSubmission] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSavePreferences = () => {
    toast.success('Settings updated successfully!');
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    toast.error('Account deleted in demo mode.');
    logout();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Application Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize UI appearance, notification alerts, interview behavior, and privacy.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Appearance / Theme */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base">
            {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <span>Appearance & Theme</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your preferred display theme for the InterviewAI dashboard.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-semibold text-xs md:text-sm text-slate-900 dark:text-white">
                Dark Mode
              </h4>
              <p className="text-xs text-slate-500">
                Use deep dark palette (#0F172A) for eye comfort during long study sessions.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </Card>

        {/* 2. Notifications */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base">
            <Bell className="w-5 h-5 text-primary-500" />
            <span>Notification Preferences</span>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs md:text-sm text-slate-900 dark:text-white">
                  Email Notifications
                </h4>
                <p className="text-xs text-slate-500">
                  Receive email copies of mock interview performance reports and skill recommendations.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Interview Reminders */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs md:text-sm text-slate-900 dark:text-white">
                  Interview Practice Reminders
                </h4>
                <p className="text-xs text-slate-500">
                  Get daily streak reminders to maintain consistent interview preparation habits.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={interviewReminders}
                  onChange={(e) => setInterviewReminders(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* 3. Interview Session Preferences */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base">
            <Mic className="w-5 h-5 text-secondary-500" />
            <span>Interview Session Preferences</span>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Default Voice Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs md:text-sm text-slate-900 dark:text-white">
                  Default Voice Mode
                </h4>
                <p className="text-xs text-slate-500">
                  Automatically enable microphone recorder and audio visualizer on every new drill.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={defaultVoiceMode}
                  onChange={(e) => setDefaultVoiceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Auto Submit Timer */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs md:text-sm text-slate-900 dark:text-white">
                  Automatic Submission on Timer Expiry
                </h4>
                <p className="text-xs text-slate-500">
                  Submit the typed or spoken answer automatically when the question countdown reaches 00:00.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTimerSubmission}
                  onChange={(e) => setAutoTimerSubmission(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* 4. Privacy */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base">
            <Shield className="w-5 h-5 text-accent-500" />
            <span>Privacy & Resume Confidentiality</span>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-xs md:text-sm text-slate-900 dark:text-white">
                Anonymized Resume Diagnostic Data
              </h4>
              <p className="text-xs text-slate-500">
                Allow anonymous extraction benchmarks to improve question relevance algorithms.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dataCollection}
                onChange={(e) => setDataCollection(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button variant="primary" size="md" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </div>

        {/* 5. Danger Zone / Delete Account */}
        <Card className="p-6 border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10 space-y-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-xs md:text-sm text-slate-900 dark:text-white">
                Delete Candidate Account
              </h4>
              <p className="text-xs text-slate-500">
                Permanently purge your account, uploaded resume files, and all historical interview scores.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        subtitle="This action cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete your InterviewAI candidate account? All your uploaded resume records, practice history, and rubric scores will be permanently cleared.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleDeleteAccount}
            >
              Yes, Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
