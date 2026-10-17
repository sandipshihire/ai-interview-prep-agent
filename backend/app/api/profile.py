from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User
from app.schemas.schemas import UserResponse, ProfileUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/profile", tags=["User Profile"])


@router.get("", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("", response_model=UserResponse)
def update_profile(
    req: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.full_name is not None and req.full_name.strip():
        current_user.full_name = req.full_name.strip()
    if req.target_role is not None:
        current_user.target_role = req.target_role.strip()
    if req.bio is not None:
        current_user.bio = req.bio.strip()
    if req.experience_level is not None:
        current_user.experience_level = req.experience_level.strip()

    db.commit()
    db.refresh(current_user)
    return current_user
