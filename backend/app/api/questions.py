from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Resume
from app.schemas.schemas import QuestionGenerateRequest, QuestionSetResponse, GeneratedQuestionItem
from app.api.deps import get_current_user
from app.services.question_service import question_service

router = APIRouter(prefix="/questions", tags=["Question Generator"])


@router.post("/generate", response_model=QuestionSetResponse)
async def generate_questions(
    req: QuestionGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_text = None
    if req.resume_id:
        resume = db.query(Resume).filter(
            Resume.id == req.resume_id,
            Resume.user_id == current_user.id
        ).first()
        if resume:
            resume_text = resume.extracted_text

    questions_raw = await question_service.generate_questions(
        target_role=req.target_role,
        experience_level=req.experience_level,
        interview_type=req.interview_type,
        programming_language=req.programming_language or "Python",
        topics=req.topics or [],
        number_of_questions=req.number_of_questions,
        difficulty_level=req.difficulty_level,
        job_description=req.job_description,
        resume_text=resume_text
    )

    items = []
    for q in questions_raw:
        items.append(GeneratedQuestionItem(
            question=q.get("question", ""),
            category=q.get("category", "General"),
            difficulty=q.get("difficulty", req.difficulty_level),
            relevant_skill=q.get("relevant_skill", req.programming_language or "Software Engineering"),
            evaluation_criteria=q.get("evaluation_criteria", "Technical accuracy, clarity, and depth"),
            hints=q.get("hints")
        ))

    return QuestionSetResponse(
        target_role=req.target_role,
        interview_type=req.interview_type,
        difficulty_level=req.difficulty_level,
        questions=items
    )
