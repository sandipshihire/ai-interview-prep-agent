from typing import Optional, List, Dict, Any, Union
from datetime import datetime
import re
from pydantic import BaseModel, Field, field_validator, ConfigDict


def validate_email_format(email: str) -> str:
    cleaned = email.strip().lower()
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", cleaned):
        raise ValueError("Invalid email address format")
    return cleaned


# ----------------------------------------------------
# Auth Schemas
# ----------------------------------------------------
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: str
    password: str = Field(..., min_length=6, max_length=128)
    confirm_password: Optional[str] = None

    @field_validator("email")
    @classmethod
    def check_email(cls, v):
        return validate_email_format(v)

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, values):
        if v is not None and "password" in values.data and v != values.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class UserLogin(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def check_email(cls, v):
        return validate_email_format(v)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    target_role: Optional[str] = None
    bio: Optional[str] = None
    experience_level: Optional[str] = None
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    target_role: Optional[str] = None
    bio: Optional[str] = None
    experience_level: Optional[str] = None


# ----------------------------------------------------
# Resume Schemas
# ----------------------------------------------------
class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    original_filename: str
    file_size_bytes: int
    created_at: datetime
    extracted_text_preview: Optional[str] = None


class ResumeAnalysisCreate(BaseModel):
    resume_id: int
    target_role: str = "Full Stack Developer"
    job_description: Optional[str] = None
    experience_level: Optional[str] = "Fresher"


class ResumeAnalysisResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    resume_id: int
    target_role: str
    job_description: Optional[str] = None
    estimated_match_score: float
    analysis_json: Dict[str, Any]
    created_at: datetime


# ----------------------------------------------------
# Question Generation Schemas
# ----------------------------------------------------
class QuestionGenerateRequest(BaseModel):
    target_role: str = "Python Developer"
    experience_level: str = "Fresher"  # Fresher, Intermediate, Experienced
    interview_type: str = "Technical"  # Technical, HR, Behavioral, Coding, Project-Based, Mixed
    programming_language: Optional[str] = "Python"
    topics: Optional[List[str]] = []
    number_of_questions: int = Field(default=5, ge=1, le=20)
    difficulty_level: str = "Intermediate"  # Beginner, Intermediate, Advanced
    job_description: Optional[str] = None
    resume_id: Optional[int] = None


class GeneratedQuestionItem(BaseModel):
    question: str
    category: str
    difficulty: str
    relevant_skill: str
    evaluation_criteria: str
    hints: Optional[str] = None


class QuestionSetResponse(BaseModel):
    target_role: str
    interview_type: str
    difficulty_level: str
    questions: List[GeneratedQuestionItem]


# ----------------------------------------------------
# Interview Session Schemas
# ----------------------------------------------------
class InterviewCreateRequest(BaseModel):
    role_id: Optional[str] = "fullstack-dev"
    target_role: Optional[str] = "Full Stack Developer"
    interview_type: str = "Technical"
    difficulty: str = "Intermediate"
    question_count: int = Field(default=5, ge=1, le=15)
    time_limit_minutes: int = Field(default=20, ge=5, le=60)
    resume_id: Optional[int] = None
    voice_mode: bool = False


class InterviewQuestionDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    session_id: int
    question_text: str
    category: str
    difficulty: str
    evaluation_criteria: Optional[str] = None
    hint: Optional[str] = None
    order_index: int
    is_follow_up: bool = False


class InterviewSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    target_role: str
    interview_type: str
    difficulty: str
    status: str
    overall_score: Optional[float] = None
    time_limit_minutes: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    total_questions: int
    questions: List[InterviewQuestionDetail] = []


class AnswerSubmitRequest(BaseModel):
    question_id: int
    answer_text: str
    question_index: Optional[int] = None


class CriteriaScores(BaseModel):
    relevance: float = Field(..., ge=0, le=10)
    technical_accuracy: float = Field(..., ge=0, le=10)
    completeness: float = Field(..., ge=0, le=10)
    clarity: float = Field(..., ge=0, le=10)
    communication_quality: float = Field(..., ge=0, le=10)
    logical_structure: float = Field(..., ge=0, le=10)


class AnswerEvaluationResponse(BaseModel):
    overall_score: float  # scaled 0 - 100
    criterion_score_10: float  # scaled 0 - 10
    criteria_scores: CriteriaScores
    what_went_well: List[str]
    missing_concepts: List[str]
    incorrect_statements: List[str] = []
    suggested_improvements: List[str]
    sample_improved_answer: str
    recommended_follow_up_topic: Optional[str] = None
    follow_up_question: Optional[str] = None


# ----------------------------------------------------
# Reports & Analytics Schemas
# ----------------------------------------------------
class AnswerDetailInReport(BaseModel):
    question_id: int
    question_text: str
    category: str
    difficulty: str
    candidate_answer: str
    score: float
    evaluation: Dict[str, Any]


class InterviewReportResponse(BaseModel):
    session_id: int
    target_role: str
    interview_type: str
    difficulty: str
    started_at: datetime
    completed_at: Optional[datetime]
    total_questions: int
    answered_questions: int
    overall_score: float
    radar_competencies: Dict[str, float]
    average_accuracy: float
    average_relevance: float
    average_communication: float
    strongest_areas: List[str]
    weakest_areas: List[str]
    recommended_topics: List[str]
    learning_plan: List[Dict[str, str]]
    questions_and_answers: List[AnswerDetailInReport]


class DashboardStatsResponse(BaseModel):
    total_interviews: int
    average_score: float
    questions_practiced: int
    readiness_score: float
    recent_sessions: List[Dict[str, Any]]
    score_trend: List[Dict[str, Any]]
    competency_radar: List[Dict[str, Any]]
    top_skills: List[Dict[str, Any]]
    recommended_practice: List[Dict[str, Any]]


class ReadinessScoreResponse(BaseModel):
    readiness_score: float
    is_sufficient_data: bool
    status_label: str
    component_breakdown: Dict[str, float]
    formula_description: str
    actionable_recommendations: List[str]
