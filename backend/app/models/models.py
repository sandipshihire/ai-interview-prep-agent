from datetime import datetime, timezone
import json
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    DateTime,
    ForeignKey,
    JSON,
    Boolean,
)
from sqlalchemy.orm import relationship
from app.database.session import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    target_role = Column(String(100), nullable=True, default="Full Stack Developer")
    bio = Column(Text, nullable=True)
    experience_level = Column(String(50), nullable=True, default="Fresher")
    created_at = Column(DateTime, default=utcnow)

    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("ResumeAnalysis", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("LearningRecommendation", back_populates="user", cascade="all, delete-orphan")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    original_filename = Column(String(255), nullable=False)
    private_storage_path = Column(String(500), nullable=False)
    extracted_text = Column(Text, nullable=False)
    file_size_bytes = Column(Integer, default=0)
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="resumes")
    analyses = relationship("ResumeAnalysis", back_populates="resume", cascade="all, delete-orphan")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    target_role = Column(String(100), nullable=False)
    job_description = Column(Text, nullable=True)
    analysis_json = Column(JSON, nullable=False)
    estimated_match_score = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    target_role = Column(String(100), nullable=False)
    interview_type = Column(String(50), nullable=False)  # Technical, HR, Behavioral, Coding, Project-Based, Mixed
    difficulty = Column(String(50), nullable=False, default="Intermediate")
    status = Column(String(50), nullable=False, default="in_progress")  # in_progress, completed, abandoned
    overall_score = Column(Float, nullable=True)
    time_limit_minutes = Column(Integer, default=20)
    started_at = Column(DateTime, default=utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="interviews")
    questions = relationship("InterviewQuestion", back_populates="session", cascade="all, delete-orphan", order_by="InterviewQuestion.order_index")
    answers = relationship("InterviewAnswer", back_populates="session", cascade="all, delete-orphan")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, default="General")
    difficulty = Column(String(50), nullable=False, default="Intermediate")
    evaluation_criteria = Column(Text, nullable=True)
    hint = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=False, default=1)
    is_follow_up = Column(Boolean, default=False)

    session = relationship("InterviewSession", back_populates="questions")
    answers = relationship("InterviewAnswer", back_populates="question", cascade="all, delete-orphan")


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("interview_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    answer_text = Column(Text, nullable=False)
    overall_score = Column(Float, nullable=False, default=0.0)
    evaluation_json = Column(JSON, nullable=False)
    submitted_at = Column(DateTime, default=utcnow)

    session = relationship("InterviewSession", back_populates="answers")
    question = relationship("InterviewQuestion", back_populates="answers")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(100), nullable=False)
    proficiency_estimate = Column(Float, nullable=False, default=70.0)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    user = relationship("User", back_populates="skills")


class LearningRecommendation(Base):
    __tablename__ = "learning_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic = Column(String(150), nullable=False)
    reason = Column(Text, nullable=False)
    priority = Column(String(20), default="Medium")  # High, Medium, Low
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="recommendations")
