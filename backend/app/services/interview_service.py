from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.collection import Collection

from app.database.connection import get_database
from app.models.interview import InterviewModel
from app.schemas.interview_schema import (
    AnswerSaveRequest,
    InterviewCreate,
    InterviewResponse,
    InterviewStartResponse,
)
from app.services.gemini_service import get_gemini_service


class InterviewService:
    @staticmethod
    def create_interview(payload: InterviewCreate, user_id: str) -> InterviewResponse:
        interviews = InterviewService._interviews_collection()
        InterviewService._ensure_indexes(interviews)

        document = InterviewModel.to_mongo(payload, user_id)
        result = interviews.insert_one(document)

        created_interview = interviews.find_one({"_id": result.inserted_id})
        if not created_interview:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Interview creation failed.",
            )

        return InterviewModel.from_mongo(created_interview)

    @staticmethod
    def start_interview(interview_id: str, user_id: str) -> InterviewStartResponse:
        interviews = InterviewService._interviews_collection()
        interview = InterviewService._get_owned_interview(interviews, interview_id, user_id)

        if interview["status"] == "completed":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Completed interviews cannot be restarted.",
            )

        now = datetime.now(timezone.utc)
        updates: dict[str, Any] = {
            "status": "in_progress",
            "updated_at": now,
        }

        if not interview.get("started_at"):
            updates["started_at"] = now

        interviews.update_one({"_id": interview["_id"]}, {"$set": updates})
        updated_interview = interviews.find_one({"_id": interview["_id"]})

        return InterviewStartResponse(
            interview=InterviewModel.from_mongo(updated_interview),
            message="Interview started successfully.",
        )

    @staticmethod
    def generate_questions(interview_id: str, user_id: str) -> InterviewResponse:
        interviews = InterviewService._interviews_collection()
        interview = InterviewService._get_owned_interview(interviews, interview_id, user_id)

        gemini_result = get_gemini_service().generate_interview_questions(
            role=interview["role"],
            skills=interview.get("skills", []),
            difficulty=interview.get("difficulty", "medium"),
            question_count=interview.get("question_count", 5),
            experience_level=interview.get("experience_level"),
            interview_type=interview.get("interview_type"),
        )
        questions = gemini_result.get("questions", [])

        if not isinstance(questions, list) or not questions:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini did not return interview questions.",
            )

        interviews.update_one(
            {"_id": interview["_id"]},
            {
                "$set": {
                    "questions": questions,
                    "question_count": len(questions),
                    "updated_at": datetime.now(timezone.utc),
                }
            },
        )
        updated_interview = interviews.find_one({"_id": interview["_id"]})
        return InterviewModel.from_mongo(updated_interview)

    @staticmethod
    def save_answers(
        interview_id: str,
        user_id: str,
        payload: AnswerSaveRequest,
    ) -> InterviewResponse:
        interviews = InterviewService._interviews_collection()
        interview = InterviewService._get_owned_interview(interviews, interview_id, user_id)

        if interview["status"] == "completed":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Answers cannot be changed after an interview is completed.",
            )

        now = datetime.now(timezone.utc)
        existing_answers = interview.get("answers", [])
        merged_answers: list[dict[str, Any]] = []
        answer_index = {str(item.get("question_id")): item for item in existing_answers if item.get("question_id")}

        for answer in payload.answers:
            answer_index[str(answer.question_id)] = answer.model_dump()

        for item in existing_answers:
            question_id = str(item.get("question_id")) if item.get("question_id") else None
            if question_id and question_id in answer_index:
                merged_answers.append(answer_index.pop(question_id))
            elif question_id:
                merged_answers.append(item)

        merged_answers.extend(answer_index.values())
        status_value = "completed" if payload.mark_completed else "in_progress"

        update_fields: dict[str, Any] = {
            "answers": merged_answers,
            "status": status_value,
            "updated_at": now,
        }

        if payload.mark_completed:
            update_fields["completed_at"] = now

        if not interview.get("started_at"):
            update_fields["started_at"] = now

        interviews.update_one({"_id": interview["_id"]}, {"$set": update_fields})
        updated_interview = interviews.find_one({"_id": interview["_id"]})

        return InterviewModel.from_mongo(updated_interview)

    @staticmethod
    def get_interview_history(user_id: str) -> list[InterviewResponse]:
        interviews = InterviewService._interviews_collection()
        InterviewService._ensure_indexes(interviews)

        cursor = interviews.find({"user_id": user_id}).sort("created_at", -1)
        return [InterviewModel.from_mongo(interview) for interview in cursor]

    @staticmethod
    def _get_owned_interview(
        interviews: Collection,
        interview_id: str,
        user_id: str,
    ) -> dict[str, Any]:
        if not ObjectId.is_valid(interview_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid interview id.",
            )

        interview = interviews.find_one({"_id": ObjectId(interview_id), "user_id": user_id})
        if not interview:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview not found.",
            )

        return interview

    @staticmethod
    def _interviews_collection() -> Collection:
        return get_database()[InterviewModel.collection_name]

    @staticmethod
    def _ensure_indexes(interviews: Collection) -> None:
        interviews.create_index([("user_id", 1), ("created_at", -1)])
        interviews.create_index("status")
