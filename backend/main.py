# backend/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from io import BytesIO
from datetime import timedelta

from bson.objectid import ObjectId
from pypdf import PdfReader
from pymongo.database import Database

from . import auth
from .database import get_mongo_db, close_mongo_connection
from .models import CandidateProfile, Token
from .resume_parser import extract_skills_and_education

app = FastAPI()

# Add event handlers for MongoDB connection lifecycle
@app.on_event("shutdown")
def shutdown_db_client():
    close_mongo_connection()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file: BytesIO) -> str:
    """Extracts text content from a PDF file."""
    text = ""
    try:
        pdf_reader = PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""
    return text.strip()

# --- Authentication Endpoints ---

@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Database = Depends(get_mongo_db)
):
    """
    Takes a username and password, verifies against the DB, and returns a JWT token.
    """
    user_in_db = db["users"].find_one({"username": form_data.username})

    if not user_in_db or not auth.verify_password(form_data.password, user_in_db["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user_in_db["username"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/register")
async def register_user(username: str, password: str, db: Database = Depends(get_mongo_db)):
    """
    Registers a new user in the database.
    """
    if db["users"].find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(password)
    db["users"].insert_one({"username": username, "hashed_password": hashed_password})
    
    return {"status": f"User '{username}' registered successfully"}

# --- Candidate Endpoints ---

@app.post("/parse_resume/", response_model=CandidateProfile)
async def parse_resume(
    file: UploadFile = File(...),
    db: Database = Depends(get_mongo_db)
):
    """
    Uploads a resume, extracts data, and saves it to the MongoDB database.
    """
    try:
        pdf_text = extract_text_from_pdf(file.file)
        if not pdf_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        extracted_data = extract_skills_and_education(pdf_text)

        candidate_profile = CandidateProfile(
            name=extracted_data.get('name', 'Extracted Candidate'),
            email=extracted_data.get('email', 'extracted@example.com'),
            jobTitle=extracted_data.get('jobTitle', 'Unspecified'),
            location=extracted_data.get('location', 'Unspecified'),
            profilePicture="https://via.placeholder.com/100",
            bio="Skills and details extracted from resume.",
            skills=extracted_data['skills'],
            education=extracted_data['education'],
            experience=extracted_data['experience'],
        )

        profile_dict = candidate_profile.model_dump(by_alias=True, exclude_unset=True)
        result = db["candidates"].insert_one(profile_dict)
        candidate_profile.id = str(result.inserted_id)

        return candidate_profile

    except Exception as e:
        print(f"❌ Error during resume processing or DB insertion: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

@app.get("/candidates/", response_model=List[CandidateProfile])
async def get_all_candidates(db: Database = Depends(get_mongo_db)):
    """
    Retrieves all candidate profiles from the database.
    """
    try:
        all_candidates = []
        for candidate in db["candidates"].find({}):
            candidate["_id"] = str(candidate["_id"])  # Convert ObjectId to string
            all_candidates.append(candidate)
        return all_candidates
    except Exception as e:
        print(f"❌ Error fetching candidates: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch candidates from database.")

@app.get("/candidates/{candidate_id}", response_model=CandidateProfile)
async def get_candidate_by_id(candidate_id: str, db: Database = Depends(get_mongo_db)):
    """
    Retrieves a single candidate profile from the database by their ID.
    """
    try:
        obj_id = ObjectId(candidate_id)
        candidate = db["candidates"].find_one({"_id": obj_id})
        
        if candidate:
            # This is the crucial fix: convert ObjectId to a string
            candidate["_id"] = str(candidate["_id"])
            return candidate
        
        raise HTTPException(status_code=404, detail=f"Candidate with ID {candidate_id} not found")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid ID format or error fetching data: {e}")