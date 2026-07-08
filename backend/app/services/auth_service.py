import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import bcrypt
from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pymongo.collection import Collection
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from app.config import (
    get_jwt_algorithm,
    get_jwt_expire_minutes,
    get_jwt_secret_key,
)
from app.database.connection import get_database
from app.models.user import UserModel
from app.schemas.auth_schema import LoginRequest, TokenResponse, UserCreate, UserResponse, UserUpdate


logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
MAX_BCRYPT_PASSWORD_BYTES = 72


class AuthService:
    @staticmethod
    def register_user(payload: UserCreate) -> TokenResponse:
        users = AuthService._users_collection()
        AuthService._ensure_indexes(users)

        email = payload.email.lower()
        if users.find_one({"email": email}):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists.",
            )

        try:
            hashed = AuthService.hash_password(payload.password)
            user_document = UserModel.to_mongo(
                name=payload.name,
                email=email,
                hashed_password=hashed,
            )

            result = users.insert_one(user_document)
            created_user = users.find_one({"_id": result.inserted_id})

            if not created_user:
                logger.error("User insertion returned no document for payload: %s", email)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="User registration failed.",
                )

            return AuthService._build_token_response(created_user)
        except DuplicateKeyError as exc:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists.",
            ) from exc
        except HTTPException:
            raise
        except Exception as exc:  # pragma: no cover - unexpected DB or hashing error
            logger.exception("Error during user registration for %s", email)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User registration failed.",
            ) from exc

    @staticmethod
    def login_user(payload: LoginRequest) -> TokenResponse:
        user = AuthService.authenticate_user(payload.email, payload.password)

        return AuthService._build_token_response(user)

    @staticmethod
    def request_password_reset(email: str) -> dict[str, str]:
        AuthService._users_collection().find_one({"email": email.lower()})
        return {"message": "If that email is registered, a password reset link will be sent."}

    @staticmethod
    def update_user_profile(user_id: str, payload: UserUpdate) -> UserResponse:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user id.",
            )

        updates = {
            field: value.strip() if isinstance(value, str) else value
            for field, value in payload.model_dump(exclude_unset=True).items()
            if value is not None
        }

        if not updates:
            user = AuthService._users_collection().find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
            return UserModel.from_mongo(user)

        updates["updated_at"] = datetime.now(timezone.utc)
        result = AuthService._users_collection().find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": updates},
            return_document=ReturnDocument.AFTER,
        )

        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        return UserModel.from_mongo(result)

    @staticmethod
    def authenticate_user(email: str, password: str) -> dict[str, Any]:
        user = AuthService._users_collection().find_one({"email": email.lower()})

        if not user or not AuthService.verify_password(password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive.",
            )

        return user

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[UserResponse]:
        if not ObjectId.is_valid(user_id):
            return None

        user = AuthService._users_collection().find_one({"_id": ObjectId(user_id)})
        if not user:
            return None

        return UserModel.from_mongo(user)

    @staticmethod
    def hash_password(password: str) -> str:
        password_bytes = AuthService._password_bytes(password)
        return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        password_bytes = AuthService._password_bytes(plain_password, reject_too_long=False)
        try:
            return bcrypt.checkpw(password_bytes, hashed_password.encode("utf-8"))
        except ValueError:
            logger.warning("Stored password hash is not a valid bcrypt hash.")
            return False

    @staticmethod
    def _password_bytes(password: str, reject_too_long: bool = True) -> bytes:
        password_bytes = str(password).encode("utf-8")

        if len(password_bytes) <= MAX_BCRYPT_PASSWORD_BYTES:
            return password_bytes

        if reject_too_long:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Password must be {MAX_BCRYPT_PASSWORD_BYTES} bytes or fewer.",
            )

        return password_bytes[:MAX_BCRYPT_PASSWORD_BYTES]

    @staticmethod
    def create_access_token(subject: str, claims: Optional[dict[str, Any]] = None) -> str:
        secret_key = get_jwt_secret_key()
        expire_minutes = get_jwt_expire_minutes()
        now = datetime.now(timezone.utc)

        payload = {
            "sub": subject,
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(minutes=expire_minutes)).timestamp()),
        }

        if claims:
            payload.update(claims)

        return jwt.encode(
            payload,
            secret_key,
            algorithm=get_jwt_algorithm(),
        )

    @staticmethod
    def _build_token_response(user: dict[str, Any]) -> TokenResponse:
        access_token = AuthService.create_access_token(
            subject=str(user["_id"]),
            claims={"email": user["email"]},
        )
        return TokenResponse(
            access_token=access_token,
            user=UserModel.from_mongo(user),
        )

    @staticmethod
    def decode_access_token(token: str) -> dict[str, Any]:
        try:
            secret_key = get_jwt_secret_key()
        except RuntimeError:
            logger.error("JWT_SECRET_KEY is missing when decoding a token.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server misconfiguration: JWT secret not configured.",
            )

        try:
            return jwt.decode(
                token,
                secret_key,
                algorithms=[get_jwt_algorithm()],
            )
        except JWTError as exc:
            logger.warning("Failed to decode JWT token: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token.",
                headers={"WWW-Authenticate": "Bearer"},
            ) from exc

    @staticmethod
    def _users_collection() -> Collection:
        return get_database()[UserModel.collection_name]

    @staticmethod
    def _ensure_indexes(users: Collection) -> None:
        users.create_index("email", unique=True)


def get_current_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    payload = AuthService.decode_access_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = AuthService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user was not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
