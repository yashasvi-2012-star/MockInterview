from datetime import datetime, timezone
from typing import Any

from app.schemas.auth_schema import UserResponse


class UserModel:
    collection_name = "users"

    @staticmethod
    def to_mongo(name: str, email: str, hashed_password: str) -> dict[str, Any]:
        now = datetime.now(timezone.utc)

        return {
            "name": name.strip(),
            "email": email.lower().strip(),
            "hashed_password": hashed_password,
            "role": None,
            "location": None,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }

    @staticmethod
    def from_mongo(document: dict[str, Any]) -> UserResponse:
        return UserResponse(
            id=str(document["_id"]),
            name=document["name"],
            email=document["email"],
            role=document.get("role"),
            location=document.get("location"),
            is_active=document.get("is_active", True),
            created_at=document["created_at"],
            updated_at=document.get("updated_at", document["created_at"]),
        )
