from pathlib import Path
from typing import Any, Optional

import joblib
import numpy as np
import pandas as pd

from app.ml.train_model import DEFAULT_MODEL_PATH, FEATURE_COLUMNS


class ReadinessPredictor:
    def __init__(self, model_path: Optional[str] = None) -> None:
        self.model_path = Path(model_path) if model_path else DEFAULT_MODEL_PATH
        self.model = None
        self.feature_columns = FEATURE_COLUMNS
        self.metadata: dict[str, Any] = {}
        self._load_model()

    def predict(self, features: dict[str, float]) -> dict[str, Any]:
        normalized_features = self._normalize_features(features)

        if self.model is None:
            return self._heuristic_prediction(normalized_features)

        frame = pd.DataFrame([normalized_features], columns=self.feature_columns)
        probabilities = self.model.predict_proba(frame)[0]
        classes = list(self.model.classes_)

        ready_index = classes.index(1) if 1 in classes else int(np.argmax(probabilities))
        pass_probability = round(float(probabilities[ready_index]) * 100, 2)
        readiness_score = self._readiness_score(normalized_features, pass_probability)

        return {
            "pass_probability": pass_probability,
            "readiness_score": readiness_score,
            "recommendation": self._recommendation(readiness_score, normalized_features),
            "model_source": "random_forest",
            "features": normalized_features,
        }

    def _load_model(self) -> None:
        if not self.model_path.exists() or self.model_path.stat().st_size == 0:
            return

        artifact = joblib.load(self.model_path)

        if isinstance(artifact, dict):
            self.model = artifact.get("model")
            self.feature_columns = artifact.get("feature_columns", FEATURE_COLUMNS)
            self.metadata = artifact.get("metadata", {})
        else:
            self.model = artifact

    def _normalize_features(self, features: dict[str, float]) -> dict[str, float]:
        normalized = {column: float(features.get(column, 0) or 0) for column in self.feature_columns}

        for percentage_column in ["average_score", "pass_rate", "completion_rate", "improvement_trend"]:
            normalized[percentage_column] = min(max(normalized[percentage_column], 0.0), 100.0)

        for count_column in ["questions_answered", "questions_skipped", "number_of_sessions"]:
            normalized[count_column] = max(normalized[count_column], 0.0)

        normalized["average_time"] = max(normalized["average_time"], 0.0)
        return normalized

    def _heuristic_prediction(self, features: dict[str, float]) -> dict[str, Any]:
        readiness_score = round(
            features["average_score"] * 0.35
            + features["pass_rate"] * 0.2
            + features["completion_rate"] * 0.2
            + min(features["number_of_sessions"] * 5, 15)
            + features["improvement_trend"] * 0.1
            - min(features["questions_skipped"] * 2, 10),
            2,
        )
        readiness_score = min(max(readiness_score, 0.0), 100.0)

        return {
            "pass_probability": readiness_score,
            "readiness_score": readiness_score,
            "recommendation": self._recommendation(readiness_score, features),
            "model_source": "heuristic_fallback",
            "features": features,
        }

    @staticmethod
    def _readiness_score(features: dict[str, float], pass_probability: float) -> float:
        score = (
            pass_probability * 0.5
            + features["average_score"] * 0.25
            + features["completion_rate"] * 0.15
            + features["improvement_trend"] * 0.1
        )
        return round(min(max(score, 0.0), 100.0), 2)

    @staticmethod
    def _recommendation(readiness_score: float, features: dict[str, float]) -> str:
        if readiness_score >= 85:
            return "Ready for interviews. Continue practicing advanced and role-specific scenarios."
        if readiness_score >= 70:
            return "Almost ready. Focus on consistency, skipped questions, and stronger answer structure."
        if features["completion_rate"] < 60:
            return "Improve completion rate by answering more questions in each mock session."
        if features["average_score"] < 60:
            return "Strengthen fundamentals and review feedback before attempting harder interviews."
        return "Needs more practice. Complete additional sessions and track improvement over time."
