from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings"""
    # MongoDB
    MONGO_URI: str = "mongodb+srv://admin:lXg8rmRIqdBX1e0t@cluster0.irdtn5u.mongodb.net/electronics_store?retryWrites=true&w=majority&authSource=admin"


    DATABASE_NAME: str = "electronics_store"
    
    # Server
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    ALLOW_CREDENTIALS: bool = True
    
    # Application
    APP_NAME: str = "Electronics Kits Store API"
    API_V1_PREFIX: str = "/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

settings = get_settings()