from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status

from app.models.interview import InterviewModel
from app.services.gemini_service import get_gemini_service
from app.services.interview_service import InterviewService


class EvaluationService:
    @staticmethod
    def evaluate_interview(interview_id: str, user_id: str) -> dict[str, Any]:
        interviews = InterviewService._interviews_collection()
        interview = InterviewService._get_owned_interview(interviews, interview_id, user_id)
        questions = interview.get("questions", [])
        answers = interview.get("answers", [])

        if not questions:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Generate interview questions before evaluating answers.",
            )

        if not answers:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Save candidate answers before evaluation.",
            )

        question_map = {str(item.get("question_id")): item for item in questions}
        gemini = get_gemini_service()
        evaluations = []

        for answer in answers:
            question_id = str(answer.get("question_id"))
            question = question_map.get(question_id)

            if not question:
                continue

            evaluation = gemini.evaluate_candidate_answer(
                question=question.get("question", ""),
                answer=answer.get("answer", ""),
                role=interview.get("role"),
                expected_points=question.get("expected_points", []),
            )
            evaluation.update(
                {
                    "question_id": question_id,
                    "skill": question.get("skill"),
                    "category": question.get("category"),
                }
            )
            evaluations.append(evaluation)

        feedback = gemini.generate_feedback(
            role=interview.get("role", ""),
            evaluations=evaluations,
            interview_metadata={
                "difficulty": interview.get("difficulty"),
                "skills": interview.get("skills", []),
                "question_count": interview.get("question_count", 0),
            },
        )

        interviews.update_one(
            {"_id": interview["_id"]},
            {
                "$set": {
                    "evaluations": evaluations,
                    "feedback": feedback,
                    "status": "completed",
                    "completed_at": interview.get("completed_at") or datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc),
                }
            },
        )
        updated_interview = interviews.find_one({"_id": interview["_id"]})

        return {
            "interview": InterviewModel.from_mongo(updated_interview),
            "evaluations": evaluations,
            "feedback": feedback,
        }
