from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User
from app.schemas.schemas import DashboardStatsResponse, ReadinessScoreResponse
from app.api.deps import get_current_user
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics & Readiness"])


@router.get("/dashboard", response_model=DashboardStatsResponse)
def get_dashboard_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return analytics_service.get_user_dashboard_stats(db, current_user.id)


@router.get("/performance")
def get_performance_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = analytics_service.get_user_dashboard_stats(db, current_user.id)
    return {
        "score_trend": stats["score_trend"],
        "competency_radar": stats["competency_radar"],
        "top_skills": stats["top_skills"],
        "recommended_practice": stats["recommended_practice"]
    }


@router.get("/readiness", response_model=ReadinessScoreResponse)
def get_readiness_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return analytics_service.calculate_readiness_score(db, current_user.id)
