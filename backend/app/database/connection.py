from functools import lru_cache
from typing import Optional

from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, ConfigurationError

from app.config import get_env


class MongoDBConnection:
    def __init__(self) -> None:
        self._client: Optional[MongoClient] = None
        self._database: Optional[Database] = None

    @property
    def client(self) -> MongoClient:
        if self._client is None:
            self._client = self._create_client()
        return self._client

    @property
    def database(self) -> Database:
        if self._database is None:
            database_name = get_env("DATABASE_NAME")

            if not database_name:
                raise RuntimeError("DATABASE_NAME environment variable is not configured.")

            self._database = self.client[database_name]

        return self._database

    def connect(self) -> Database:
        db = self.database
        self.client.admin.command("ping")
        return db

    def close(self) -> None:
        if self._client is not None:
            self._client.close()
            self._client = None
            self._database = None

    def _create_client(self) -> MongoClient:
        mongodb_uri = get_env("MONGODB_URI")
        environment = get_env("ENVIRONMENT", "development").lower()

        if not mongodb_uri:
            raise RuntimeError("MONGODB_URI environment variable is not configured.")

        try:
            return MongoClient(
                mongodb_uri,
                appname=f"Prepify-{environment}",
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                socketTimeoutMS=20000,
                maxPoolSize=50,
                retryWrites=True,
            )
        except ConfigurationError as exc:
            raise RuntimeError("Invalid MongoDB configuration.") from exc


@lru_cache(maxsize=1)
def get_mongodb_connection() -> MongoDBConnection:
    return MongoDBConnection()


def get_database() -> Database:
    try:
        return get_mongodb_connection().connect()
    except (ConnectionFailure, ConfigurationError, RuntimeError) as exc:
        close_database_connection()
        raise RuntimeError("Unable to connect to MongoDB Atlas.") from exc


def close_database_connection() -> None:
    get_mongodb_connection().close()
