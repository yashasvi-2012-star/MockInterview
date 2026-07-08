from datetime import datetime, timezone
from typing import Any, Optional

from pymongo.collection import Collection

from app.database.connection import get_database
from app.ml.predict import ReadinessPredictor
from app.models.interview import InterviewModel


class PredictionService:
    passing_score = 70.0

    @classmethod
    def predict_readiness(cls, user_id: str) -> dict[str, Any]:
        interviews = list(cls._interviews_collection().find({"user_id": user_id}).sort("created_at", 1))
        features = cls.build_features(interviews)
        prediction = ReadinessPredictor().predict(features)

        return {
            "user_id": user_id,
            "generated_at": datetime.now(timezone.utc),
            "pass_probability": prediction["pass_probability"],
            "readiness_score": prediction["readiness_score"],
            "recommendation": prediction["recommendation"],
            "model_source": prediction["model_source"],
            "input_features": prediction["features"],
        }

    @classmethod
    def build_features(cls, interviews: list[dict[str, Any]]) -> dict[str, float]:
        scores = [score for score in (cls._interview_score(item) for item in interviews) if score is not None]
        completed = [item for item in interviews if item.get("status") == "completed"]
        answered_count = sum(len(item.get("answers", [])) for item in interviews)
        expected_questions = sum(len(item.get("questions", [])) or item.get("question_count", 0) for item in interviews)
        skipped_count = max(expected_questions - answered_count, 0)

        return {
            "average_score": round(sum(scores) / len(scores), 2) if scores else 0.0,
            "pass_rate": cls._percentage(sum(1 for score in scores if score >= cls.passing_score), len(scores)),
            "completion_rate": cls._percentage(len(completed), len(interviews)),
            "questions_answered": float(answered_count),
            "questions_skipped": float(skipped_count),
            "average_time": cls._average_session_minutes(interviews),
            "improvement_trend": cls._improvement_trend(scores),
            "number_of_sessions": float(len(interviews)),
        }

    @classmethod
    def _interview_score(cls, interview: dict[str, Any]) -> Optional[float]:
        evaluations = interview.get("evaluations", [])
        scores = [
            score
            for score in (cls._score_from_evaluation(evaluation) for evaluation in evaluations)
            if score is not None
        ]
        return round(sum(scores) / len(scores), 2) if scores else None

    @staticmethod
    def _score_from_evaluation(evaluation: dict[str, Any]) -> Optional[float]:
        score = evaluation.get("score")
        max_score = evaluation.get("max_score", 10)

        if score is None:
            return None

        try:
            return round((float(score) / float(max_score)) * 100, 2)
        except (TypeError, ValueError, ZeroDivisionError):
            return None

    @classmethod
    def _average_session_minutes(cls, interviews: list[dict[str, Any]]) -> float:
        durations = []

        for interview in interviews:
            started_at = interview.get("started_at")
            completed_at = interview.get("completed_at")

            if started_at and completed_at:
                durations.append((completed_at - started_at).total_seconds() / 60)

        return round(sum(durations) / len(durations), 2) if durations else 0.0

    @staticmethod
    def _improvement_trend(scores: list[float]) -> float:
        if len(scores) < 2:
            return 0.0

        midpoint = max(len(scores) // 2, 1)
        first_half = scores[:midpoint]
        second_half = scores[midpoint:]

        if not second_half:
            return 0.0

        first_average = sum(first_half) / len(first_half)
        second_average = sum(second_half) / len(second_half)
        return round(max(min(second_average - first_average, 100.0), 0.0), 2)

    @staticmethod
    def _percentage(numerator: int, denominator: int) -> float:
        if denominator <= 0:
            return 0.0
        return round((numerator / denominator) * 100, 2)

    @staticmethod
    def _interviews_collection() -> Collection:
        return get_database()[InterviewModel.collection_name]
