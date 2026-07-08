from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split


FEATURE_COLUMNS = [
    "average_score",
    "pass_rate",
    "completion_rate",
    "questions_answered",
    "questions_skipped",
    "average_time",
    "improvement_trend",
    "number_of_sessions",
]

DEFAULT_MODEL_PATH = Path(__file__).resolve().parent / "saved_models" / "random_forest_model.pkl"


def train_readiness_model(
    training_data_path: str,
    model_output_path: Optional[str] = None,
) -> dict[str, object]:
    data = pd.read_csv(training_data_path)
    missing_columns = [column for column in FEATURE_COLUMNS + ["is_ready"] if column not in data.columns]

    if missing_columns:
        raise ValueError(f"Training data is missing required columns: {', '.join(missing_columns)}")

    features = data[FEATURE_COLUMNS].fillna(0)
    labels = data["is_ready"].astype(int)

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        labels,
        test_size=0.2,
        random_state=42,
        stratify=labels if labels.nunique() > 1 else None,
    )

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        min_samples_leaf=2,
        random_state=42,
        class_weight="balanced",
    )
    model.fit(x_train, y_train)

    predictions = model.predict(x_test)
    output_path = Path(model_output_path) if model_output_path else DEFAULT_MODEL_PATH
    output_path.parent.mkdir(parents=True, exist_ok=True)

    joblib.dump(
        {
            "model": model,
            "feature_columns": FEATURE_COLUMNS,
            "metadata": {
                "accuracy": float(accuracy_score(y_test, predictions)),
                "feature_importances": dict(
                    zip(FEATURE_COLUMNS, np.round(model.feature_importances_, 4).tolist())
                ),
            },
        },
        output_path,
    )

    return {
        "model_path": str(output_path),
        "accuracy": float(accuracy_score(y_test, predictions)),
        "classification_report": classification_report(y_test, predictions, output_dict=True),
    }


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Train Prepify readiness prediction model.")
    parser.add_argument("training_data_path", help="Path to CSV file containing training data.")
    parser.add_argument("--output", default=None, help="Optional path for the trained model artifact.")
    args = parser.parse_args()

    result = train_readiness_model(args.training_data_path, args.output)
    print(result)
