import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.config import get_cors_origins, get_env, get_bool_env, is_development, load_environment
from app.database.connection import close_database_connection, get_database


load_environment()

logging.basicConfig(level=get_env("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    validate_mongodb = get_bool_env("MONGODB_VALIDATE_ON_STARTUP", False)

    if validate_mongodb:
        get_database()

    yield

    close_database_connection()


fastapi_app = FastAPI(
    title="Prepify API",
    description="Backend API for AI-powered mock interview management and analytics.",
    version=get_env("APP_VERSION", "1.0.0"),
    docs_url="/docs" if is_development() else None,
    redoc_url="/redoc" if is_development() else None,
    openapi_url="/openapi.json" if is_development() else None,
    lifespan=lifespan,
)

fastapi_app.include_router(api_router, prefix="/api/v1")


@fastapi_app.get("/health", tags=["Health"])
def health_check() -> dict[str, Any]:
    return {
        "status": "healthy",
        "service": "Prepify-api",
        "environment": get_env("ENVIRONMENT", "development"),
    }


fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app = fastapi_app
