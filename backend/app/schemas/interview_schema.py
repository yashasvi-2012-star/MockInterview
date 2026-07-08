from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


InterviewDifficulty = Literal["easy", "medium", "hard"]
InterviewStatus = Literal["created", "in_progress", "completed"]


class InterviewCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    role: str = Field(..., min_length=2, max_length=100)
    difficulty: InterviewDifficulty = "medium"
    skills: list[str] = Field(default_factory=list, max_length=20)
    experience_level: str | None = Field(default=None, max_length=50)
    interview_type: str | None = Field(default=None, max_length=50)
    question_count: int = Field(default=5, ge=1, le=25)


class InterviewQuestion(BaseModel):
    question_id: str
    question: str
    category: Optional[str] = None
    difficulty: Optional[InterviewDifficulty] = None


class InterviewAnswer(BaseModel):
    question_id: str
    answer: str = Field(..., min_length=1)


class AnswerSaveRequest(BaseModel):
    answers: list[InterviewAnswer] = Field(..., min_length=1)
    mark_completed: bool = False


class InterviewResponse(BaseModel):
    id: str
    user_id: str
    title: str
    role: str
    difficulty: InterviewDifficulty
    skills: list[str]
    experience_level: str | None = None
    interview_type: str | None = None
    question_count: int
    questions: list[InterviewQuestion | dict]
    answers: list[InterviewAnswer | dict]
    evaluations: list[dict] = Field(default_factory=list)
    feedback: dict | None = None
    status: InterviewStatus
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class InterviewStartResponse(BaseModel):
    interview: InterviewResponse
    message: str
