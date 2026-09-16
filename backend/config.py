import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_MODEL: str = "gemini-1.5-flash"
    FALLBACK_MODEL: str = "gemini-2.0-flash"
    
    # Institutional Metadata
    INSTITUTE_NAME: str = "P. R. Pote Patil College of Engineering & Management, Amravati"
    INSTITUTE_STATUS: str = "An Autonomous Institute"
    DEPARTMENT_NAME: str = "Department of Computer Science & Engineering (Artificial Intelligence & Machine Learning)"
    COURSE_NAME: str = "Artificial Intelligence"
    COURSE_CODE: str = "ML509PCC17"
    ACADEMIC_YEAR: str = "2026-2027"
    SEMESTER: str = "Fifth (V)"
    
    TOTAL_RUBRIC_MARKS: int = 25
    PROCESS_SKILLS_MARKS: int = 10
    PRODUCT_SKILLS_MARKS: int = 10
    VIVA_VOCE_MARKS: int = 5

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
