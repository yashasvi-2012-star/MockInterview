from typing import Any

from fastapi import APIRouter, Depends

from app.schemas.auth_schema import UserResponse
from app.services.auth_service import get_current_user
from app.services.report_service import ReportService


router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/sessions/{interview_id}")
def get_session_report(
    interview_id: str,
    current_user: UserResponse = Depends(get_current_user),
) -> dict[str, Any]:
    return ReportService.get_session_report(interview_id, current_user.id)


@router.get("/analytics")
def get_analytics_report(
    current_user: UserResponse = Depends(get_current_user),
) -> dict[str, Any]:
    return ReportService.get_analytics_report(current_user.id)
