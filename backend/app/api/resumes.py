import os
import shutil
import time
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Resume, ResumeAnalysis
from app.schemas.schemas import (
    ResumeResponse,
    ResumeAnalysisCreate,
    ResumeAnalysisResponse,
)
from app.api.deps import get_current_user
from app.services.resume_service import resume_service
from app.core.config import settings

router = APIRouter(tags=["Resumes & Analysis"])


@router.post("/resumes/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form("Full Stack Developer"),
    job_description: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate extension
    filename = file.filename or "resume.pdf"
    ext = Path(filename).suffix.lower()
    if ext not in [".pdf", ".docx", ".doc"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Only PDF and DOCX files are supported."
        )

    # Secure local storage path
    safe_name = f"user_{current_user.id}_{int(time.time())}_{Path(filename).name}"
    storage_path = Path(settings.UPLOAD_DIR) / safe_name

    # Save to disk and check file size limit (5MB)
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    total_bytes = 0

    try:
        with open(storage_path, "wb") as f:
            while chunk := await file.read(1024 * 1024):  # 1MB chunks
                total_bytes += len(chunk)
                if total_bytes > max_bytes:
                    f.close()
                    if storage_path.exists():
                        storage_path.unlink()
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
                    )
                f.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to save file: {str(e)}")

    # Extract text using PyMuPDF / python-docx
    try:
        extracted_text = resume_service.extract_text_from_file(str(storage_path))
    except Exception as e:
        if storage_path.exists():
            storage_path.unlink()
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    # Save Resume record in DB
    resume = Resume(
        user_id=current_user.id,
        original_filename=filename,
        private_storage_path=str(storage_path),
        extracted_text=extracted_text,
        file_size_bytes=total_bytes
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Automatically generate initial ResumeAnalysis
    analysis_dict = resume_service.analyze_resume_text(
        extracted_text,
        target_role=target_role or "Full Stack Developer",
        job_description=job_description or ""
    )
    analysis = ResumeAnalysis(
        user_id=current_user.id,
        resume_id=resume.id,
        target_role=target_role or "Full Stack Developer",
        job_description=job_description,
        analysis_json=analysis_dict,
        estimated_match_score=analysis_dict["matchScore"]
    )
    db.add(analysis)
    db.commit()

    return ResumeResponse(
        id=resume.id,
        original_filename=resume.original_filename,
        file_size_bytes=resume.file_size_bytes,
        created_at=resume.created_at,
        extracted_text_preview=extracted_text[:300] + "..." if len(extracted_text) > 300 else extracted_text
    )


@router.get("/resumes", response_model=List[ResumeResponse])
def get_user_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()
    results = []
    for r in resumes:
        results.append(ResumeResponse(
            id=r.id,
            original_filename=r.original_filename,
            file_size_bytes=r.file_size_bytes,
            created_at=r.created_at,
            extracted_text_preview=r.extracted_text[:200] if r.extracted_text else ""
        ))
    return results


@router.get("/resumes/{resume_id}")
def get_resume_by_id(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    latest_analysis = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.resume_id == resume.id,
        ResumeAnalysis.user_id == current_user.id
    ).order_by(ResumeAnalysis.created_at.desc()).first()

    return {
        "id": resume.id,
        "filename": resume.original_filename,
        "file_size_bytes": resume.file_size_bytes,
        "created_at": resume.created_at,
        "extracted_text": resume.extracted_text,
        "latest_analysis": latest_analysis.analysis_json if latest_analysis else None
    }


@router.delete("/resumes/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    # Delete physical file
    try:
        path = Path(resume.private_storage_path)
        if path.exists():
            path.unlink()
    except Exception:
        pass

    db.delete(resume)
    db.commit()
    return {"message": "Resume and associated analyses deleted successfully"}


@router.post("/resume-analysis", response_model=ResumeAnalysisResponse)
def analyze_resume(
    req: ResumeAnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    analysis_data = resume_service.analyze_resume_text(
        resume.extracted_text,
        target_role=req.target_role,
        job_description=req.job_description or ""
    )

    analysis = ResumeAnalysis(
        user_id=current_user.id,
        resume_id=resume.id,
        target_role=req.target_role,
        job_description=req.job_description,
        analysis_json=analysis_data,
        estimated_match_score=analysis_data["matchScore"]
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


@router.get("/resume-analysis/{analysis_id}", response_model=ResumeAnalysisResponse)
def get_resume_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == analysis_id,
        ResumeAnalysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis report not found")
    return analysis
