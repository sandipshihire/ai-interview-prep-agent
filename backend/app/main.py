from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base, SessionLocal
from app.models.models import User
from app.core.security import get_password_hash
from app.services.ai_service import ai_service

# Import API Routers
from app.api.auth import router as auth_router
from app.api.resumes import router as resumes_router
from app.api.questions import router as questions_router
from app.api.interviews import router as interviews_router
from app.api.reports import router as reports_router
from app.api.analytics import router as analytics_router
from app.api.profile import router as profile_router
from app.api.jobs import router as jobs_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all database tables on startup
    Base.metadata.create_all(bind=engine)

    # Seed demo user if none exists
    db = SessionLocal()
    try:
        demo_user = db.query(User).filter(User.email == "demo@interviewai.io").first()
        if not demo_user:
            demo_user = User(
                full_name="Alex Chen",
                email="demo@interviewai.io",
                password_hash=get_password_hash("Password123!"),
                target_role="Full Stack Developer",
                bio="Final-year CS student focusing on React, Python, and scalable distributed systems.",
                experience_level="Fresher"
            )
            db.add(demo_user)
            db.commit()
    finally:
        db.close()

    yield


app = FastAPI(
    title="InterviewAI API",
    description="Backend REST API for AI-Powered Interview Preparation Agent",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health & AI Status Endpoint
@app.get("/api/health", tags=["System"])
def health_check():
    ai_status = ai_service.get_provider_status()
    return {
        "status": "healthy",
        "service": "InterviewAI REST API",
        "version": "1.0.0",
        "ai_engine": ai_status,
        "database": "sqlite/postgresql operational"
    }

# Mount API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(resumes_router, prefix=settings.API_V1_STR)
app.include_router(questions_router, prefix=settings.API_V1_STR)
app.include_router(interviews_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
