from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./internship_matching.db"

# Create the SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} # Needed for SQLite
)

# Create a SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for your ORM models
Base = declarative_base()

# Function to get database session (used as FastAPI dependency)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Example SQLAlchemy model (you'll define full models in models.py if truly using DB)
# from sqlalchemy import Column, Integer, String
# class DBCandidate(Base):
#     __tablename__ = "candidates"
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, index=True)
#     email = Column(String, unique=True, index=True)
#     skills = Column(String) # Store as comma-separated string or use a relationship table
#     # ... more fields