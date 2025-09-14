from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# --- Shared Models (e.g., for Timeline items) ---
class EducationItem(BaseModel):
    degree: str
    institution: str
    year: str

class ExperienceItem(BaseModel):
    role: str
    company: str
    duration: str
    description: Optional[str] = None # Added description

# Removed SkillTag as skills are just List[str] in CandidateProfile

# --- Candidate Profile Models ---
class CandidateProfile(BaseModel):
    id: str
    name: str
    email: str
    jobTitle: str
    location: str
    profilePicture: str
    bio: str
    skills: List[str]
    education: List[EducationItem]
    experience: List[ExperienceItem]

# Removed InternshipPostRequest and CompanyInternship for brevity (assuming they are elsewhere or not needed for this flow)
# Removed AdminAnalytics for brevity