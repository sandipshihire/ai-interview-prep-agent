import os
import json
from pathlib import Path
from typing import List, Union

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "InterviewAI - AI-Powered Interview Preparation Agent")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "interviewai_development_secret_key_2026_jwt_token_secure")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./interview_ai.db")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "5"))
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "demo")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "")

    @property
    def cors_origins(self) -> List[str]:
        raw = os.getenv("BACKEND_CORS_ORIGINS", '["http://localhost:3000","http://127.0.0.1:3000","http://localhost:5173"]')
        try:
            return json.loads(raw)
        except Exception:
            return ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "*"]

settings = Settings()

# Ensure uploads directory exists
upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)
