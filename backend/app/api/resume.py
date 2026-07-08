from typing import Any

from fastapi import APIRouter, Depends, File, UploadFile, status

from app.schemas.auth_schema import UserResponse
from app.services.auth_service import get_current_user
from app.services.resume_service import ResumeService


router = APIRouter(prefix="/resume", tags=["Resume Analysis"])


@router.post("/analyze", status_code=status.HTTP_200_OK)
async def analyze_resume(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user),
) -> dict[str, Any]:
    return await ResumeService.analyze_resume(file, current_user.id)
