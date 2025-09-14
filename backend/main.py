# backend/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pypdf import PdfReader
from io import BytesIO
from pymongo.database import Database
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from bson import ObjectId
from . import auth
from .models import Token
from .resume_parser import extract_skills_and_education
from .models import CandidateProfile
from .database import get_mongo_db, close_mongo_connection

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

@app.post("/parse_resume/", response_model=CandidateProfile)
async def parse_resume(
    file: UploadFile = File(...),
    db: Database = Depends(get_mongo_db)
):
    """
    Upload a resume, extract data, and save it to the MongoDB database.
    """
    try:
        # 1. Extract text
        pdf_text = extract_text_from_pdf(file.file)
        if not pdf_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        # 2. Extract data
        extracted_data = extract_skills_and_education(pdf_text)

        # 3. Create a CandidateProfile object
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

        # 4. Save to MongoDB
        profile_dict = candidate_profile.model_dump(by_alias=True, exclude_unset=True)
        result = db["candidates"].insert_one(profile_dict)
        print(f"✅ Successfully inserted profile for {candidate_profile.email} into the database.")
        
        # 5. Add the new DB-generated ID to the response object
        candidate_profile.id = str(result.inserted_id)

        return candidate_profile

    except Exception as e:
        print(f"❌ Error during resume processing or DB insertion: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

@app.get("/candidates/{candidate_id}", response_model=CandidateProfile)
async def get_candidate_by_id(candidate_id: str, db: Database = Depends(get_mongo_db)):
    """
    Retrieves a single candidate profile from the database by their ID.
    """
    try:
        # MongoDB requires the string ID to be converted to an ObjectId
        obj_id = ObjectId(candidate_id)
        
        # Find the document with the matching _id
        candidate = db["candidates"].find_one({"_id": obj_id})
        
        if candidate:
            return candidate
        
        # If no candidate is found, raise a 404 error
        raise HTTPException(status_code=404, detail=f"Candidate with ID {candidate_id} not found")

    except Exception as e:
        # This handles cases like an invalid ID format
        raise HTTPException(status_code=400, detail=f"Invalid ID format or error fetching data: {e}")
