import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import Button from './Button';
import ProgressBar from './ProgressBar';

export const ResumeUploader = ({
  onUploadSuccess,
  currentResume = null,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const allowedExtensions = ['pdf', 'docx', 'doc'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      setError('Invalid file format. Please upload a PDF or DOCX resume.');
      return false;
    }
    if (selectedFile.size > maxSizeBytes) {
      setError('File is too large. Maximum allowed file size is 5MB.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      processUpload(selectedFile);
    }
  };

  const processUpload = (selectedFile) => {
    setUploading(true);
    setProgress(10);

    // Simulate AI parsing stages
    const timer1 = setTimeout(() => setProgress(45), 300);
    const timer2 = setTimeout(() => setProgress(80), 650);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setUploading(false);
      if (onUploadSuccess) {
        onUploadSuccess({
          fileName: selectedFile.name,
          fileSize: `${(selectedFile.size / 1024).toFixed(1)} KB`,
          uploadDate: new Date().toISOString(),
          status: 'Parsed Successfully',
        });
      }
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {/* Upload Drop Zone */}
      {!file && !uploading && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-darkCard/60 hover:border-primary-400 dark:hover:border-primary-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleChange}
            className="hidden"
          />

          <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            Upload Your Resume
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Drag and drop your file here, or click to browse. Supported formats: <span className="font-semibold text-slate-700 dark:text-slate-300">PDF, DOCX</span> (Max 5MB)
          </p>

          <div className="mt-6 flex justify-center">
            <Button variant="outline" size="sm" type="button">
              Select Resume File
            </Button>
          </div>
        </div>
      )}

      {/* Uploading / Progress State */}
      {uploading && (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkCard rounded-2xl p-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-950/50 rounded-xl text-primary-600 dark:text-primary-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Parsing & Extracting Resume Skills...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {file?.name || 'Resume'} ({progress < 50 ? 'Analyzing document structure' : 'Extracting tech stack & competencies'})
              </p>
            </div>
          </div>
          <ProgressBar progress={progress} color="gradient" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-3 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Uploaded File Summary */}
      {(file || currentResume) && !uploading && (
        <div className="mt-4 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                  {file?.name || currentResume?.fileName}
                </h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3" />
                  {currentResume?.status || 'Parsed Successfully'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Size: {file ? `${(file.size / 1024).toFixed(1)} KB` : currentResume?.fileSize} • Uploaded:{' '}
                {currentResume?.uploadDate
                  ? new Date(currentResume.uploadDate).toLocaleDateString()
                  : 'Just now'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetUpload();
                fileInputRef.current?.click();
              }}
              className="text-xs"
            >
              Replace Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
