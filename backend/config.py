from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_TITLE: str = "FoodRush API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Backend API for FoodRush Food Delivery Platform"

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    DATABASE_URL: str = "sqlite:///./foodrush.db"
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    ADMIN_EMAIL: str = "admin@foodrush.com"
    ADMIN_PASSWORD: str = "Admin@1234"
    ADMIN_NAME: str = "Super Admin"

    class Config:
        env_file = ".env"

settings = Settings()
