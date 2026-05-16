import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.database import engine, Base
from backend.routers import auth_router, reports_router, bids_router, progress_router, reviews_router, users_router, notifications_router, analytics_router, speech_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="UrbanLens API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
os.makedirs("uploads/reports/images", exist_ok=True)
os.makedirs("uploads/reports/videos", exist_ok=True)
os.makedirs("uploads/reports/audio", exist_ok=True)
os.makedirs("uploads/progress", exist_ok=True)

# Static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include Routers
app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(reports_router.router, prefix="/api/reports", tags=["reports"])
app.include_router(bids_router.router, prefix="/api/bids", tags=["bids"])
app.include_router(progress_router.router, prefix="/api/progress", tags=["progress"])
app.include_router(reviews_router.router, prefix="/api/reviews", tags=["reviews"])
app.include_router(users_router.router, prefix="/api/users", tags=["users"])
app.include_router(notifications_router.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(analytics_router.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(speech_router.router, prefix="/api/speech", tags=["speech"])

@app.get("/")
async def root():
    return {"message": "UrbanLens API is running"}
