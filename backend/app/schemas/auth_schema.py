from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str | None = None
    location: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    role: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=100)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
