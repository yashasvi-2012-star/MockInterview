from typing import Any

from fastapi import APIRouter, Depends

from app.schemas.auth_schema import UserResponse
from app.services.auth_service import get_current_user
from app.services.evaluation_service import EvaluationService


router = APIRouter(prefix="/evaluations", tags=["Evaluations"])


@router.post("/interviews/{interview_id}")
def evaluate_interview(
    interview_id: str,
    current_user: UserResponse = Depends(get_current_user),
) -> dict[str, Any]:
    return EvaluationService.evaluate_interview(interview_id, current_user.id)
