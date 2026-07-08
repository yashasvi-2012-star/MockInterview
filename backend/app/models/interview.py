from datetime import datetime, timezone
from typing import Any

from app.schemas.interview_schema import InterviewCreate, InterviewResponse


class InterviewModel:
    collection_name = "interviews"

    @staticmethod
    def to_mongo(payload: InterviewCreate, user_id: str) -> dict[str, Any]:
        now = datetime.now(timezone.utc)

        return {
            "user_id": user_id,
            "title": payload.title.strip(),
            "role": payload.role.strip(),
            "difficulty": payload.difficulty,
            "skills": [skill.strip() for skill in payload.skills],
            "experience_level": payload.experience_level.strip() if payload.experience_level else None,
            "interview_type": payload.interview_type.strip() if payload.interview_type else None,
            "question_count": payload.question_count,
            "questions": [],
            "answers": [],
            "evaluations": [],
            "feedback": None,
            "status": "created",
            "started_at": None,
            "completed_at": None,
            "created_at": now,
            "updated_at": now,
        }

    @staticmethod
    def from_mongo(document: dict[str, Any]) -> InterviewResponse:
        return InterviewResponse(
            id=str(document["_id"]),
            user_id=document["user_id"],
            title=document["title"],
            role=document["role"],
            difficulty=document["difficulty"],
            skills=document.get("skills", []),
            experience_level=document.get("experience_level"),
            interview_type=document.get("interview_type"),
            question_count=document.get("question_count", 0),
            questions=document.get("questions", []),
            answers=document.get("answers", []),
            evaluations=document.get("evaluations", []),
            feedback=document.get("feedback"),
            status=document["status"],
            started_at=document.get("started_at"),
            completed_at=document.get("completed_at"),
            created_at=document["created_at"],
            updated_at=document.get("updated_at", document["created_at"]),
        )
