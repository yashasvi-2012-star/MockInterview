from fastapi import APIRouter, Depends, status

from app.schemas.auth_schema import UserResponse
from app.schemas.interview_schema import (
    AnswerSaveRequest,
    InterviewCreate,
    InterviewResponse,
    InterviewStartResponse,
)
from app.services.auth_service import get_current_user
from app.services.interview_service import InterviewService


router = APIRouter(prefix="/interviews", tags=["Interviews"])


@router.post("", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
def create_interview(
    payload: InterviewCreate,
    current_user: UserResponse = Depends(get_current_user),
) -> InterviewResponse:
    return InterviewService.create_interview(payload, current_user.id)


@router.post("/{interview_id}/start", response_model=InterviewStartResponse)
def start_interview(
    interview_id: str,
    current_user: UserResponse = Depends(get_current_user),
) -> InterviewStartResponse:
    return InterviewService.start_interview(interview_id, current_user.id)


@router.post("/{interview_id}/questions/generate", response_model=InterviewResponse)
def generate_interview_questions(
    interview_id: str,
    current_user: UserResponse = Depends(get_current_user),
) -> InterviewResponse:
    return InterviewService.generate_questions(interview_id, current_user.id)


@router.patch("/{interview_id}/answers", response_model=InterviewResponse)
def save_answers(
    interview_id: str,
    payload: AnswerSaveRequest,
    current_user: UserResponse = Depends(get_current_user),
) -> InterviewResponse:
    return InterviewService.save_answers(interview_id, current_user.id, payload)


@router.get("/history", response_model=list[InterviewResponse])
def interview_history(
    current_user: UserResponse = Depends(get_current_user),
) -> list[InterviewResponse]:
    return InterviewService.get_interview_history(current_user.id)
