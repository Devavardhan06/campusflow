from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.database.mongo import init_db
from app.database.seed import seed_if_empty

# Ensure uploads directory exists
UPLOADS_DIR = Path(__file__).parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)
from app.routes import auth, dashboard, documents, fees, courses, hostel, notifications, ai_assistant, profile, admin

app = FastAPI(title="CampusFlow AI", version="1.0.0")

# CORS middleware — exact origins required when allow_credentials=True (no "*")
origins = [
    "http://localhost:5173",  # local dev (Vite)
    "https://tranquil-perception-production.up.railway.app",  # production frontend
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    await init_db()
    await seed_if_empty()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(fees.router, prefix="/api/fees", tags=["Fees"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(hostel.router, prefix="/api/hostel", tags=["Hostel"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(ai_assistant.router, prefix="/api/ai", tags=["AI Assistant"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

@app.get("/")
async def root():
    return {"message": "CampusFlow AI API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
