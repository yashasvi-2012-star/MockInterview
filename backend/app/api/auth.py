from fastapi import APIRouter, Depends, HTTPException, status
import logging

from app.schemas.auth_schema import ForgotPasswordRequest, LoginRequest, TokenResponse, UserCreate, UserResponse, UserUpdate
from app.services.auth_service import AuthService, get_current_user


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate) -> TokenResponse:
    try:
        return AuthService.register_user(payload)
    except HTTPException:
        # Re-raise HTTP exceptions (already client-safe)
        raise
    except Exception as exc:  # pragma: no cover - unexpected server error
        logger.exception("Unhandled exception during user registration")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User registration failed.",
        ) from exc


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    try:
        return AuthService.login_user(payload)
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - unexpected server error
        logger.exception("Unhandled exception during login")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed.",
        ) from exc


@router.get("/me", response_model=UserResponse)
def get_authenticated_user(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_authenticated_user(
    payload: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    return AuthService.update_user_profile(current_user.id, payload)


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest) -> dict[str, str]:
    try:
        return AuthService.request_password_reset(payload.email)
    except Exception as exc:
        logger.exception("Unhandled exception during forgot-password")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset request failed.",
        ) from exc
