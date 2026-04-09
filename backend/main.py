from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import engine
from config import settings
import models
from routers import auth_router, menu_router, orders_router

# Create all tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router.router)
app.include_router(menu_router.router)
app.include_router(orders_router.router)

@app.get("/", tags=["Health"])
def root():
    return {"message": f"Welcome to {settings.APP_TITLE} v{settings.APP_VERSION}", "status": "healthy"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
