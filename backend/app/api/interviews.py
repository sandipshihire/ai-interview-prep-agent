from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import (
    User,
    Resume,
    InterviewSession,
    InterviewQuestion,
    InterviewAnswer,
    UserSkill,
    LearningRecommendation
)
from app.schemas.schemas import (
    InterviewCreateRequest,
    InterviewSessionResponse,
    InterviewQuestionDetail,
    AnswerSubmitRequest,
    AnswerEvaluationResponse,
)
from app.api.deps import get_current_user
from app.services.question_service import question_service
from app.services.evaluation_service import evaluation_service

router = APIRouter(prefix="/interviews", tags=["Interviews"])


@router.post("", response_model=InterviewSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_interview(
    req: InterviewCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_role = req.target_role or "Full Stack Developer"
    role_key = req.role_id or "fullstack-dev"

    # Fetch resume text if requested
    resume_text = None
    if req.resume_id:
        resume = db.query(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id).first()
        if resume:
            resume_text = resume.extracted_text

    # Generate initial questions
    generated_q = await question_service.generate_questions(
        target_role=target_role,
        experience_level="Fresher",
        interview_type=req.interview_type,
        programming_language="Python" if "python" in target_role.lower() else "JavaScript",
        number_of_questions=req.question_count,
        difficulty_level=req.difficulty,
        resume_text=resume_text
    )

    session = InterviewSession(
        user_id=current_user.id,
        resume_id=req.resume_id,
        target_role=target_role,
        interview_type=req.interview_type,
        difficulty=req.difficulty,
        status="in_progress",
        time_limit_minutes=req.time_limit_minutes,
        started_at=datetime.now(timezone.utc)
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Save questions
    questions_list = []
    for idx, q_data in enumerate(generated_q, 1):
        q_record = InterviewQuestion(
            session_id=session.id,
            question_text=q_data["question"],
            category=q_data.get("category", "General"),
            difficulty=q_data.get("difficulty", req.difficulty),
            evaluation_criteria=q_data.get("evaluation_criteria"),
            hint=q_data.get("hints"),
            order_index=idx,
            is_follow_up=False
        )
        db.add(q_record)
        questions_list.append(q_record)

    db.commit()
    for q in questions_list:
        db.refresh(q)

    return InterviewSessionResponse(
        id=session.id,
        user_id=session.user_id,
        target_role=session.target_role,
        interview_type=session.interview_type,
        difficulty=session.difficulty,
        status=session.status,
        overall_score=session.overall_score,
        time_limit_minutes=session.time_limit_minutes,
        started_at=session.started_at,
        completed_at=session.completed_at,
        total_questions=len(questions_list),
        questions=[InterviewQuestionDetail.model_validate(q) for q in questions_list]
    )


@router.get("", response_model=List[InterviewSessionResponse])
def get_user_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.started_at.desc()).all()

    result = []
    for s in sessions:
        result.append(InterviewSessionResponse(
            id=s.id,
            user_id=s.user_id,
            target_role=s.target_role,
            interview_type=s.interview_type,
            difficulty=s.difficulty,
            status=s.status,
            overall_score=s.overall_score,
            time_limit_minutes=s.time_limit_minutes,
            started_at=s.started_at,
            completed_at=s.completed_at,
            total_questions=len(s.questions),
            questions=[InterviewQuestionDetail.model_validate(q) for q in s.questions]
        ))
    return result


@router.get("/{session_id}", response_model=InterviewSessionResponse)
def get_interview(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")

    return InterviewSessionResponse(
        id=session.id,
        user_id=session.user_id,
        target_role=session.target_role,
        interview_type=session.interview_type,
        difficulty=session.difficulty,
        status=session.status,
        overall_score=session.overall_score,
        time_limit_minutes=session.time_limit_minutes,
        started_at=session.started_at,
        completed_at=session.completed_at,
        total_questions=len(session.questions),
        questions=[InterviewQuestionDetail.model_validate(q) for q in session.questions]
    )


@router.post("/{session_id}/answer", response_model=AnswerEvaluationResponse)
async def submit_answer(
    session_id: int,
    payload: AnswerSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")

    question = db.query(InterviewQuestion).filter(
        InterviewQuestion.id == payload.question_id,
        InterviewQuestion.session_id == session.id
    ).first()
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found in this session")

    # Check for duplicate submission
    existing_answer = db.query(InterviewAnswer).filter(
        InterviewAnswer.session_id == session.id,
        InterviewAnswer.question_id == question.id
    ).first()
    if existing_answer:
        # Update existing answer to prevent duplicate crash
        answer_record = existing_answer
    else:
        answer_record = InterviewAnswer(session_id=session.id, question_id=question.id)

    # Evaluate answer across the 6 dimensions
    evaluation_result = await evaluation_service.evaluate_answer(
        question_text=question.question_text,
        answer_text=payload.answer_text,
        evaluation_criteria=question.evaluation_criteria,
        category=question.category,
        target_role=session.target_role
    )

    answer_record.answer_text = payload.answer_text
    answer_record.overall_score = evaluation_result["overall_score"]
    answer_record.evaluation_json = evaluation_result
    answer_record.submitted_at = datetime.now(timezone.utc)

    db.add(answer_record)
    db.commit()

    # If adaptive follow-up exists and session has room (< 10 questions), optionally insert follow-up
    follow_up_q = evaluation_result.get("follow_up_question")
    if follow_up_q and len(session.questions) < 8 and not question.is_follow_up:
        # Check if follow-up already inserted
        existing_fu = db.query(InterviewQuestion).filter(
            InterviewQuestion.session_id == session.id,
            InterviewQuestion.question_text == follow_up_q
        ).first()
        if not existing_fu:
            new_fu = InterviewQuestion(
                session_id=session.id,
                question_text=follow_up_q,
                category=f"{question.category} (Follow-up)",
                difficulty=question.difficulty,
                evaluation_criteria=f"Follow-up probe evaluating deeper practical knowledge of {question.category}.",
                hint="Expand on your previous answer with concrete edge cases and practical experience.",
                order_index=len(session.questions) + 1,
                is_follow_up=True
            )
            db.add(new_fu)
            db.commit()

    return evaluation_result


@router.post("/{session_id}/finish")
def finish_interview(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")

    answers = db.query(InterviewAnswer).filter(InterviewAnswer.session_id == session.id).all()
    avg_score = (
        round(sum(a.overall_score for a in answers) / len(answers), 1)
        if answers
        else 75.0
    )

    session.status = "completed"
    session.overall_score = avg_score
    session.completed_at = datetime.now(timezone.utc)
    db.commit()

    # Automatically update or seed UserSkill and LearningRecommendation
    skill_name = "Core Technical Concepts"
    existing_skill = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_name == skill_name
    ).first()
    if existing_skill:
        existing_skill.proficiency_estimate = round((existing_skill.proficiency_estimate + avg_score) / 2, 1)
    else:
        db.add(UserSkill(user_id=current_user.id, skill_name=skill_name, proficiency_estimate=avg_score))

    # Add learning recommendations based on weakest question
    if answers:
        lowest_ans = min(answers, key=lambda a: a.overall_score)
        rec_topic = lowest_ans.question.category
        rec_reason = f"Identified as an improvement area during mock session (Score: {lowest_ans.overall_score:.1f}%)"
        db.add(LearningRecommendation(
            user_id=current_user.id,
            topic=rec_topic,
            reason=rec_reason,
            priority="High" if lowest_ans.overall_score < 70 else "Medium"
        ))
    db.commit()

    return {
        "interviewId": session.id,
        "status": "completed",
        "overallScore": session.overall_score,
        "completedAt": session.completed_at,
        "resultUrl": f"/interview/{session.id}/result"
    }
