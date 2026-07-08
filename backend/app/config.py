from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = BASE_DIR / ".env"


def load_environment() -> None:
    load_dotenv(dotenv_path=ENV_FILE)


def get_env(name: str, default: str = "", *, strip: bool = True) -> str:
    value = os.getenv(name, default)
    return value.strip() if strip and isinstance(value, str) else value


def get_gemini_model() -> str:
    return get_env("GEMINI_MODEL", "gemini-2.5-flash")


def get_bool_env(name: str, default: bool = False) -> bool:
    value = get_env(name, "true" if default else "false")
    return value.lower() in {"1", "true", "yes", "on"}


def get_int_env(name: str, default: int) -> int:
    raw_value = get_env(name, str(default))

    try:
        return int(raw_value)
    except (TypeError, ValueError):
        return default


def is_development() -> bool:
    return get_env("ENVIRONMENT", "development").lower() != "production"


def is_production() -> bool:
    return not is_development()


def get_jwt_secret_key() -> str:
    secret_key = get_env("JWT_SECRET_KEY")
    if secret_key:
        return secret_key

    raise RuntimeError("JWT_SECRET_KEY environment variable is not configured.")


def get_jwt_algorithm() -> str:
    return get_env("JWT_ALGORITHM", "HS256")


def get_jwt_expire_minutes() -> int:
    return get_int_env("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 60)


def get_cors_origins() -> list[str]:
    origins = get_env("CORS_ORIGINS")

    if origins:
        return [origin.strip() for origin in origins.split(",") if origin.strip()]

    if is_production():
        return []

    return [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
