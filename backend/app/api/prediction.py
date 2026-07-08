from typing import Any

from fastapi import APIRouter, Depends

from app.schemas.auth_schema import UserResponse
from app.services.auth_service import get_current_user
from app.services.prediction_service import PredictionService


router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.get("/readiness")
def predict_readiness(
    current_user: UserResponse = Depends(get_current_user),
) -> dict[str, Any]:
    return PredictionService.predict_readiness(current_user.id)
