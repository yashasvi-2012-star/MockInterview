from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.evaluation import router as evaluation_router
from app.api.interview import router as interview_router
from app.api.prediction import router as prediction_router
from app.api.report import router as report_router
from app.api.resume import router as resume_router


api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(interview_router)
api_router.include_router(evaluation_router)
api_router.include_router(prediction_router)
api_router.include_router(report_router)
api_router.include_router(resume_router)
