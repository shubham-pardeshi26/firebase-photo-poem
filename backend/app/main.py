
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.db.database import Base, engine
# Make sure all models are imported before creating tables
from backend.app.models.user import User # noqa F401, must be imported for Base.metadata.create_all

from backend.app.api.endpoints import login, users

# Create database tables
# In a production app, you'd use Alembic migrations
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"/api/v1/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "http://127.0.0.1:9002"], # Adjust for your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router, prefix="/api/v1/login", tags=["login"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

@app.get("/")
async def root():
    return {"message": "PhotoPoet API"}

# If you need to load .env from backend/app, ensure your uvicorn command is run from backend/
# Example: cd backend && uvicorn app.main:app --reload
# And adjust .env path in config.py if needed, e.g. Path(__file__).resolve().parent.parent / '.env'
    