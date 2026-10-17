from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.models import User, InterviewSession, InterviewAnswer
from app.schemas.schemas import InterviewReportResponse, AnswerDetailInReport
from app.api.deps import get_current_user
from app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["Interview Reports"])


def build_session_report_dict(session: InterviewSession, answers: List[InterviewAnswer]) -> Dict[str, Any]:
    total_q = len(session.questions)
    ans_q = len(answers)
    overall_score = session.overall_score if session.overall_score is not None else 80.0

    # Aggregate 6-dimension scores
    accuracies = []
    relevances = []
    clarities = []
    communications = []
    structures = []

    qa_list = []
    for a in answers:
        eval_json = a.evaluation_json if isinstance(a.evaluation_json, dict) else {}
        crit = eval_json.get("criteria_scores", {})
        if "technical_accuracy" in crit:
            accuracies.append(float(crit["technical_accuracy"]) * 10)
        if "relevance" in crit:
            relevances.append(float(crit["relevance"]) * 10)
        if "clarity" in crit:
            clarities.append(float(crit["clarity"]) * 10)
        if "communication_quality" in crit:
            communications.append(float(crit["communication_quality"]) * 10)
        if "logical_structure" in crit:
            structures.append(float(crit["logical_structure"]) * 10)

        qa_list.append({
            "question_id": a.question_id,
            "question_text": a.question.question_text if a.question else "Question",
            "category": a.question.category if a.question else "General",
            "difficulty": a.question.difficulty if a.question else "Intermediate",
            "candidate_answer": a.answer_text,
            "score": a.overall_score,
            "evaluation": eval_json
        })

    avg_acc = round(sum(accuracies) / len(accuracies), 1) if accuracies else overall_score
    avg_rel = round(sum(relevances) / len(relevances), 1) if relevances else overall_score
    avg_comm = round(sum(communications) / len(communications), 1) if communications else overall_score

    radar_competencies = {
        "Technical Rigor": avg_acc,
        "Clarity & Communication": avg_comm,
        "Answer Relevance": avg_rel,
        "Composure & Confidence": 82.0,
        "Problem Solving": round((avg_acc + avg_rel) / 2, 1)
    }

    strongest = []
    weakest = []
    if qa_list:
        sorted_qa = sorted(qa_list, key=lambda x: x["score"], reverse=True)
        strongest = [f"{sorted_qa[0]['category']} ({sorted_qa[0]['score']:.0f}%)"]
        weakest = [f"{sorted_qa[-1]['category']} ({sorted_qa[-1]['score']:.0f}%)"]

    return {
        "session_id": session.id,
        "target_role": session.target_role,
        "interview_type": session.interview_type,
        "difficulty": session.difficulty,
        "started_at": session.started_at,
        "completed_at": session.completed_at,
        "total_questions": total_q,
        "answered_questions": ans_q,
        "overall_score": overall_score,
        "radar_competencies": radar_competencies,
        "average_accuracy": avg_acc,
        "average_relevance": avg_rel,
        "average_communication": avg_comm,
        "strongest_areas": strongest or ["Core Technical Vocabulary", "Prompt Communication"],
        "weakest_areas": weakest or ["Edge-case Architectural Deep Dives"],
        "recommended_topics": [
            f"Advanced {session.target_role} Architecture",
            "System Performance Profiling",
            "STAR Method Practical Scenarios"
        ],
        "learning_plan": [
            {"topic": "System Architecture Trade-offs", "action": "Practice articulating distributed caching and CAP theorem choices."},
            {"topic": "Structured STAR Responses", "action": "Draft 3 personal technical challenge narratives emphasizing measurable impact."}
        ],
        "questions_and_answers": qa_list
    }


@router.get("/{session_id}", response_model=InterviewReportResponse)
def get_report(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview report not found")

    answers = db.query(InterviewAnswer).filter(InterviewAnswer.session_id == session.id).all()
    report_dict = build_session_report_dict(session, answers)
    return report_dict


@router.get("", response_model=List[InterviewReportResponse])
def get_all_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id,
        InterviewSession.status == "completed"
    ).order_by(InterviewSession.completed_at.desc()).all()

    reports = []
    for s in sessions:
        ans = db.query(InterviewAnswer).filter(InterviewAnswer.session_id == s.id).all()
        reports.append(build_session_report_dict(s, ans))
    return reports


@router.get("/{session_id}/pdf")
def download_pdf_report(
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
    report_dict = build_session_report_dict(session, answers)

    pdf_bytes = report_service.generate_pdf_report(report_dict)
    filename = f"interview_ai_report_session_{session_id}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )
