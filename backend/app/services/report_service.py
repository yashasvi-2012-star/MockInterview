from collections import Counter, defaultdict
from datetime import datetime, timezone
from typing import Any, Optional

from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.collection import Collection

from app.database.connection import get_database
from app.models.interview import InterviewModel
from app.services.prediction_service import PredictionService


class ReportService:
    passing_score = 70.0

    @classmethod
    def get_session_report(cls, interview_id: str, user_id: str) -> dict[str, Any]:
        interviews = cls._interviews_collection()
        interview = cls._get_owned_interview(interviews, interview_id, user_id)
        evaluations = interview.get("evaluations", [])
        answers = interview.get("answers", [])
        questions = interview.get("questions", [])
        average_score = cls._average_score(evaluations)

        return {
            "interview_id": str(interview["_id"]),
            "title": interview.get("title"),
            "role": interview.get("role"),
            "difficulty": interview.get("difficulty"),
            "status": interview.get("status"),
            "started_at": interview.get("started_at"),
            "completed_at": interview.get("completed_at"),
            "generated_at": datetime.now(timezone.utc),
            "summary": {
                "question_count": len(questions) or interview.get("question_count", 0),
                "answered_count": len(answers),
                "average_score": average_score,
                "passed": average_score is not None and average_score >= cls.passing_score,
                "completion_rate": cls._completion_rate(interview),
            },
            "performance": cls._session_performance(evaluations),
            "skill_breakdown": cls._skill_breakdown(evaluations),
            "recommendations": cls._recommendations(interview, average_score),
        }

    @classmethod
    def get_analytics_report(cls, user_id: str) -> dict[str, Any]:
        interviews = list(
            cls._interviews_collection()
            .find({"user_id": user_id})
            .sort("created_at", -1)
        )

        total_interviews = len(interviews)
        completed_interviews = [item for item in interviews if item.get("status") == "completed"]
        started_interviews = [item for item in interviews if item.get("status") in {"in_progress", "completed"}]
        session_scores = [score for score in (cls._interview_score(item) for item in interviews) if score is not None]
        passed_sessions = [score for score in session_scores if score >= cls.passing_score]

        return {
            "generated_at": datetime.now(timezone.utc),
            "totals": {
                "interviews": total_interviews,
                "started": len(started_interviews),
                "completed": len(completed_interviews),
                "in_progress": sum(1 for item in interviews if item.get("status") == "in_progress"),
                "created": sum(1 for item in interviews if item.get("status") == "created"),
            },
            "analytics": {
                "average_score": round(sum(session_scores) / len(session_scores), 2) if session_scores else None,
                "pass_rate": cls._percentage(len(passed_sessions), len(session_scores)),
                "completion_rate": cls._percentage(len(completed_interviews), total_interviews),
                "start_rate": cls._percentage(len(started_interviews), total_interviews),
            },
            "statistics": {
                "by_role": cls._count_by_field(interviews, "role"),
                "by_difficulty": cls._count_by_field(interviews, "difficulty"),
                "by_status": cls._count_by_field(interviews, "status"),
                "top_skills": cls._top_skills(interviews),
                "recent_sessions": cls._recent_sessions(interviews),
            },
            "readiness_prediction": PredictionService.predict_readiness(user_id),
        }

    @classmethod
    def _session_performance(cls, evaluations: list[dict[str, Any]]) -> dict[str, Any]:
        scores = cls._scores_from_evaluations(evaluations)
        ratings = Counter(str(item.get("rating", "unrated")) for item in evaluations)

        return {
            "average_score": round(sum(scores) / len(scores), 2) if scores else None,
            "highest_score": max(scores) if scores else None,
            "lowest_score": min(scores) if scores else None,
            "ratings": dict(ratings),
        }

    @classmethod
    def _skill_breakdown(cls, evaluations: list[dict[str, Any]]) -> list[dict[str, Any]]:
        grouped_scores: dict[str, list[float]] = defaultdict(list)

        for evaluation in evaluations:
            score = cls._score_from_evaluation(evaluation)
            skill = evaluation.get("skill") or evaluation.get("category") or "general"

            if score is not None:
                grouped_scores[str(skill)].append(score)

        return [
            {
                "skill": skill,
                "average_score": round(sum(scores) / len(scores), 2),
                "attempts": len(scores),
            }
            for skill, scores in sorted(grouped_scores.items())
        ]

    @classmethod
    def _recommendations(cls, interview: dict[str, Any], average_score: Optional[float]) -> list[str]:
        recommendations: list[str] = []

        if interview.get("status") != "completed":
            recommendations.append("Complete the interview to unlock a full performance report.")

        if average_score is None:
            recommendations.append("Evaluate submitted answers to calculate score-based insights.")
        elif average_score < cls.passing_score:
            recommendations.append("Review weak areas and retry a similar interview after focused practice.")
        else:
            recommendations.append("Performance is strong. Increase difficulty or practice system design scenarios.")

        if cls._completion_rate(interview) < 100:
            recommendations.append("Answer all generated questions for a more accurate readiness signal.")

        return recommendations

    @classmethod
    def _recent_sessions(cls, interviews: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return [
            {
                "interview_id": str(item["_id"]),
                "title": item.get("title"),
                "role": item.get("role"),
                "status": item.get("status"),
                "score": cls._interview_score(item),
                "created_at": item.get("created_at"),
            }
            for item in interviews[:5]
        ]

    @staticmethod
    def _top_skills(interviews: list[dict[str, Any]]) -> list[dict[str, Any]]:
        counter: Counter[str] = Counter()

        for interview in interviews:
            counter.update(str(skill).lower() for skill in interview.get("skills", []))

        return [{"skill": skill, "count": count} for skill, count in counter.most_common(10)]

    @staticmethod
    def _count_by_field(interviews: list[dict[str, Any]], field: str) -> dict[str, int]:
        return dict(Counter(str(item.get(field, "unknown")) for item in interviews))

    @classmethod
    def _completion_rate(cls, interview: dict[str, Any]) -> float:
        question_count = len(interview.get("questions", [])) or interview.get("question_count", 0)
        answer_count = len(interview.get("answers", []))
        return cls._percentage(answer_count, question_count)

    @classmethod
    def _average_score(cls, evaluations: list[dict[str, Any]]) -> Optional[float]:
        scores = cls._scores_from_evaluations(evaluations)
        return round(sum(scores) / len(scores), 2) if scores else None

    @classmethod
    def _interview_score(cls, interview: dict[str, Any]) -> Optional[float]:
        return cls._average_score(interview.get("evaluations", []))

    @classmethod
    def _scores_from_evaluations(cls, evaluations: list[dict[str, Any]]) -> list[float]:
        return [
            score
            for score in (cls._score_from_evaluation(item) for item in evaluations)
            if score is not None
        ]

    @staticmethod
    def _score_from_evaluation(evaluation: dict[str, Any]) -> Optional[float]:
        score = evaluation.get("score")
        max_score = evaluation.get("max_score", 10)

        if score is None:
            return None

        try:
            normalized_score = (float(score) / float(max_score)) * 100
        except (TypeError, ValueError, ZeroDivisionError):
            return None

        return round(normalized_score, 2)

    @staticmethod
    def _percentage(numerator: int, denominator: int) -> float:
        if denominator <= 0:
            return 0.0
        return round((numerator / denominator) * 100, 2)

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
