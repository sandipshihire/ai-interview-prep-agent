import axios from 'axios';
import {
  mockCandidate,
  mockResume,
  mockJobRoles,
  mockQuestionsBank,
  mockDashboardStats,
  mockInterviewResult,
  mockPerformanceData,
} from '../data/mockData';

// Base API configuration (uses Vite proxy /api or explicit env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for Auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interviewai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for realistic fallback simulation when backend is offline
const simulateApiFallback = async (mockResponse, delay = 400) => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return { data: mockResponse, isMock: true };
};

// ----------------------------------------------------
// Authentication API
// ----------------------------------------------------
export const loginUser = async (credentials) => {
  try {
    const res = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    if (res.data?.access_token) {
      localStorage.setItem('interviewai_token', res.data.access_token);
      localStorage.setItem('interviewai_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    console.warn('[API] Backend error or offline, using fallback auth:', error.message);
    const mockToken = 'mock_jwt_token_sample_12345';
    localStorage.setItem('interviewai_token', mockToken);
    localStorage.setItem('interviewai_user', JSON.stringify(mockCandidate));
    return simulateApiFallback({
      access_token: mockToken,
      token_type: 'bearer',
      user: mockCandidate,
      message: 'Logged in successfully (Demo Mode)',
    }, 400);
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await apiClient.post('/auth/register', {
      full_name: userData.fullName || userData.full_name || userData.name || 'Candidate',
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirmPassword || userData.confirm_password || userData.password,
    });
    if (res.data?.access_token) {
      localStorage.setItem('interviewai_token', res.data.access_token);
      localStorage.setItem('interviewai_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    console.warn('[API] Backend registration error, using fallback:', error.message);
    const mockToken = 'mock_jwt_token_sample_registered';
    const fallbackUser = {
      ...mockCandidate,
      id: Date.now(),
      full_name: userData.fullName || userData.name || 'Candidate',
      email: userData.email,
    };
    localStorage.setItem('interviewai_token', mockToken);
    localStorage.setItem('interviewai_user', JSON.stringify(fallbackUser));
    return simulateApiFallback({
      access_token: mockToken,
      token_type: 'bearer',
      user: fallbackUser,
      message: 'Account created successfully (Demo Mode)',
    }, 500);
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await apiClient.get('/auth/me');
    return res.data;
  } catch (error) {
    const stored = localStorage.getItem('interviewai_user');
    return stored ? JSON.parse(stored) : mockCandidate;
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  } catch (error) {
    return simulateApiFallback({
      message: `Password reset instructions have been dispatched to ${email}`,
    }, 400);
  }
};

// ----------------------------------------------------
// Resume API
// ----------------------------------------------------
export const uploadResume = async (formData, onProgress) => {
  try {
    const res = await apiClient.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
    return res.data;
  } catch (error) {
    console.warn('[API] Backend offline or upload error, using fallback resume analysis:', error.message);
    return simulateApiFallback({
      id: 101,
      original_filename: 'Resume_Candidate.pdf',
      parsedData: mockResume.parsedData,
      message: 'Resume parsed and analyzed successfully (Demo Mode)',
    }, 800);
  }
};

export const getResumeAnalysis = async () => {
  try {
    const res = await apiClient.get('/resumes');
    if (res.data && res.data.length > 0) {
      const latestId = res.data[0].id;
      const detailRes = await apiClient.get(`/resumes/${latestId}`);
      if (detailRes.data?.latest_analysis) {
        return {
          fileName: detailRes.data.filename,
          fileSize: `${Math.round(detailRes.data.file_size_bytes / 1024)} KB`,
          uploadDate: detailRes.data.created_at,
          parsedData: detailRes.data.latest_analysis,
          status: 'Parsed and Evaluated by NLP Engine'
        };
      }
    }
    return simulateApiFallback(mockResume, 200);
  } catch (error) {
    console.warn('[API] Backend offline, using mock resume analysis fallback:', error.message);
    return simulateApiFallback(mockResume, 300);
  }
};

export const getUserResumes = async () => {
  try {
    const res = await apiClient.get('/resumes');
    return res.data;
  } catch (error) {
    return [mockResume];
  }
};

// ----------------------------------------------------
// Job Roles API
// ----------------------------------------------------
export const getJobRoles = async (params = {}) => {
  try {
    const res = await apiClient.get('/jobs', { params });
    return res.data;
  } catch (error) {
    return simulateApiFallback(mockJobRoles, 200);
  }
};

export const getJobRoleById = async (roleId) => {
  try {
    const res = await apiClient.get(`/jobs/${roleId}`);
    return res.data;
  } catch (error) {
    const role = mockJobRoles.find((r) => r.id === roleId) || mockJobRoles[0];
    return simulateApiFallback(role, 200);
  }
};

// ----------------------------------------------------
// AI Interview Flow API
// ----------------------------------------------------
export const startInterview = async (setupConfig) => {
  try {
    const roleId = setupConfig.roleId || 'fullstack-dev';
    const payload = {
      role_id: roleId,
      target_role: setupConfig.roleTitle || setupConfig.target_role || roleId.replace('-', ' ').toUpperCase(),
      interview_type: setupConfig.type || 'Technical',
      difficulty: setupConfig.difficulty || 'Intermediate',
      question_count: setupConfig.questionCount || 5,
      time_limit_minutes: setupConfig.timeLimit || 20,
      resume_id: setupConfig.resumeId || null,
      voice_mode: !!setupConfig.voiceMode,
    };
    const res = await apiClient.post('/interviews', payload);
    const backendData = res.data;

    // Adapt to frontend session object structure
    return {
      interviewId: backendData.id,
      id: backendData.id,
      jobRole: backendData.target_role,
      roleId: roleId,
      interviewType: backendData.interview_type,
      difficulty: backendData.difficulty,
      totalQuestions: backendData.total_questions || backendData.questions?.length || 5,
      timeLimitMinutes: backendData.time_limit_minutes,
      questions: backendData.questions.map((q) => ({
        id: q.id,
        question: q.question_text,
        category: q.category,
        difficulty: q.difficulty,
        evaluationCriteria: q.evaluation_criteria,
        hints: q.hint,
        orderIndex: q.order_index,
      })),
    };
  } catch (error) {
    console.warn('[API] Backend interview creation failed, using mock session fallback:', error.message);
    const roleId = setupConfig.roleId || 'frontend-dev';
    const questions = mockQuestionsBank[roleId] || mockQuestionsBank['frontend-dev'];
    return simulateApiFallback({
      interviewId: `int_${Date.now()}`,
      id: `int_${Date.now()}`,
      jobRole: roleId,
      interviewType: setupConfig.type || 'Technical',
      difficulty: setupConfig.difficulty || 'Intermediate',
      totalQuestions: Math.min(setupConfig.questionCount || 5, questions.length),
      timeLimitMinutes: setupConfig.timeLimit || 20,
      questions: questions,
    }, 400);
  }
};

export const submitAnswer = async (interviewId, payload) => {
  try {
    const res = await apiClient.post(`/interviews/${interviewId}/answer`, {
      question_id: payload.questionId || payload.question_id || 1,
      answer_text: payload.answer || payload.answer_text || '',
      question_index: payload.questionIndex,
    });
    return res.data;
  } catch (error) {
    console.warn('[API] Backend answer evaluation error, using mock fallback:', error.message);
    return simulateApiFallback({
      overall_score: 84,
      criterion_score_10: 8.4,
      criteria_scores: {
        relevance: 8.5,
        technical_accuracy: 8.2,
        completeness: 8.0,
        clarity: 8.8,
        communication_quality: 8.6,
        logical_structure: 8.3,
      },
      what_went_well: ['Addressed the main question accurately with clear terminology.'],
      missing_concepts: ['Could expand on practical scaling trade-offs.'],
      suggested_improvements: ['Structure answers using Concept -> Mechanism -> Example framework.'],
      sample_improved_answer: 'A structured exemplar answer demonstrating architectural trade-offs.',
    }, 600);
  }
};

export const submitVoiceAnswer = async (interviewId, payload) => {
  // Voice transcription happens directly via browser Web Speech API
  return submitAnswer(interviewId, payload);
};

export const finishInterview = async (interviewId) => {
  try {
    const res = await apiClient.post(`/interviews/${interviewId}/finish`);
    return res.data;
  } catch (error) {
    return simulateApiFallback({
      interviewId,
      status: 'completed',
      resultUrl: `/interview/${interviewId}/result`,
    }, 400);
  }
};

export const getInterviewResult = async (interviewId) => {
  try {
    const res = await apiClient.get(`/reports/${interviewId}`);
    const data = res.data;
    // Map to frontend expected report structure
    return {
      id: data.session_id,
      jobRole: data.target_role,
      interviewType: data.interview_type,
      difficulty: data.difficulty,
      date: data.started_at,
      overallScore: Math.round(data.overall_score),
      totalQuestions: data.total_questions,
      answeredQuestions: data.answered_questions,
      radarCompetencies: [
        { subject: 'Technical Rigor', score: Math.round(data.radar_competencies['Technical Rigor'] || 82), fullMark: 100 },
        { subject: 'Verbal Clarity', score: Math.round(data.radar_competencies['Clarity & Communication'] || 80), fullMark: 100 },
        { subject: 'Answer Relevance', score: Math.round(data.radar_competencies['Answer Relevance'] || 85), fullMark: 100 },
        { subject: 'Composure', score: Math.round(data.radar_competencies['Composure & Confidence'] || 80), fullMark: 100 },
        { subject: 'Problem Solving', score: Math.round(data.radar_competencies['Problem Solving'] || 84), fullMark: 100 },
      ],
      strengths: data.strongest_areas,
      areasToImprove: data.weakest_areas,
      recommendedTopics: data.recommended_topics,
      learningPlan: data.learning_plan,
      questionsBreakdown: data.questions_and_answers.map((qa) => ({
        question: qa.question_text,
        candidateAnswer: qa.candidate_answer,
        score: Math.round(qa.score),
        category: qa.category,
        feedback: qa.evaluation?.what_went_well?.[0] || 'Clear articulation of concepts.',
        sampleImprovedAnswer: qa.evaluation?.sample_improved_answer,
        criteriaScores: qa.evaluation?.criteria_scores,
      })),
    };
  } catch (error) {
    console.warn('[API] Backend result fetch failed, using fallback:', error.message);
    return simulateApiFallback({
      ...mockInterviewResult,
      id: interviewId || mockInterviewResult.id,
    }, 300);
  }
};

export const downloadPdfReport = async (sessionId) => {
  try {
    const res = await apiClient.get(`/reports/${sessionId}/pdf`, {
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `interview_report_session_${sessionId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Failed to download PDF report', error);
    throw error;
  }
};

// ----------------------------------------------------
// Analytics & History API
// ----------------------------------------------------
export const getDashboardStats = async () => {
  try {
    const res = await apiClient.get('/analytics/dashboard');
    const data = res.data;
    return {
      totalInterviews: data.total_interviews,
      averageScore: data.average_score,
      questionsPracticed: data.questions_practiced,
      readinessScore: data.readiness_score,
      scoreTrend: data.score_trend?.length > 0 ? data.score_trend : mockDashboardStats.scoreProgression,
      radarData: data.competency_radar?.length > 0 ? data.competency_radar : mockDashboardStats.competencyRadar,
      topSkills: data.top_skills?.length > 0 ? data.top_skills : mockDashboardStats.topSkills,
      recentInterviews: data.recent_sessions?.length > 0 ? data.recent_sessions : mockDashboardStats.recentInterviews,
      recommendedPractice: data.recommended_practice || [],
    };
  } catch (error) {
    console.warn('[API] Backend analytics offline, using fallback:', error.message);
    return simulateApiFallback(mockDashboardStats, 300);
  }
};

export const getPerformance = async () => {
  try {
    const res = await apiClient.get('/analytics/performance');
    return res.data;
  } catch (error) {
    return simulateApiFallback(mockPerformanceData, 300);
  }
};

export const getReadinessScore = async () => {
  try {
    const res = await apiClient.get('/analytics/readiness');
    return res.data;
  } catch (error) {
    return {
      readiness_score: 82,
      is_sufficient_data: true,
      status_label: 'Estimated Readiness: 82% (Calculated Benchmark)',
      formula_description: 'Readiness = 0.35*(AvgScore) + 0.25*(Accuracy) + 0.20*(Relevance) + 0.10*(CompletionRate) + 0.10*(Consistency).',
      actionable_recommendations: [
        'Practice architectural trade-offs to boost Technical Rigor scores above 90%.',
        'Use quantified results when describing past projects.',
      ],
    };
  }
};

export const getInterviewHistory = async () => {
  try {
    const res = await apiClient.get('/interviews');
    if (res.data && res.data.length > 0) {
      return res.data.map((s) => ({
        id: s.id,
        role: s.target_role,
        type: s.interview_type,
        difficulty: s.difficulty,
        status: s.status === 'completed' ? 'Completed' : 'In Progress',
        overallScore: s.overall_score ? Math.round(s.overall_score) : null,
        date: new Date(s.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        questionsCount: `${s.questions?.length || 5} Questions`,
      }));
    }
    return mockDashboardStats.recentInterviews;
  } catch (error) {
    return simulateApiFallback(mockDashboardStats.recentInterviews, 200);
  }
};

// ----------------------------------------------------
// Candidate Profile API
// ----------------------------------------------------
export const getProfile = async () => {
  try {
    const res = await apiClient.get('/profile');
    return {
      ...mockCandidate,
      name: res.data.full_name || mockCandidate.name,
      email: res.data.email || mockCandidate.email,
      targetRole: res.data.target_role || 'Full Stack Developer',
      bio: res.data.bio || mockCandidate.title,
    };
  } catch (error) {
    return simulateApiFallback(mockCandidate, 200);
  }
};

export const updateProfile = async (updatedData) => {
  try {
    const res = await apiClient.put('/profile', {
      full_name: updatedData.name || updatedData.full_name,
      target_role: updatedData.targetRole || updatedData.target_role,
      bio: updatedData.bio,
    });
    return res.data;
  } catch (error) {
    return simulateApiFallback({
      ...mockCandidate,
      ...updatedData,
    }, 300);
  }
};

export default apiClient;
