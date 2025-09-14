# backend/main.py

import re
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from pypdf import PdfReader # Changed from PyPDF2 to pypdf for consistency
from io import BytesIO

# Import the parsing functions from the new file
from .resume_parser import extract_skills_and_education # No need for keywords here
# from .resume_parser import SKILL_KEYWORDS, EDU_KEYWORDS # Removed these, as they are used internally by extract_skills_and_education

# Import Pydantic models from models.py
from .models import CandidateProfile, EducationItem, ExperienceItem

app = FastAPI()

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
async def parse_resume(file: UploadFile = File(...)):
    """
    Upload a resume (PDF) and extract skills and education details.
    Returns a processed CandidateProfile.
    """
    try:
        # 1. Extract text from PDF
        pdf_text = extract_text_from_pdf(file.file)
        if not pdf_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        # 2. Extract all data using the enhanced function
        extracted_data = extract_skills_and_education(pdf_text)
        
        # 3. Create a CandidateProfile using extracted data
        candidate_profile = CandidateProfile(
            id="temp-" + extracted_data.get('email', 'id'), # Use email or generate unique ID
            name=extracted_data.get('name', 'Extracted Candidate'),
            email=extracted_data.get('email', 'extracted@example.com'),
            jobTitle=extracted_data.get('jobTitle', 'Unspecified'),
            location=extracted_data.get('location', 'Unspecified'),
            profilePicture="https://via.placeholder.com/100", # Still placeholder for pic
            bio="Skills and details extracted from resume.", # Updated bio
            skills=extracted_data['skills'],
            education=[
                EducationItem(**edu) for edu in extracted_data['education']
            ],
            experience=[
                ExperienceItem(**exp) for exp in extracted_data['experience']
            ],
        )

        return candidate_profile
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error during resume upload and extraction: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")