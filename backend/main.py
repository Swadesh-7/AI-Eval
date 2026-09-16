"""
FastAPI Server for AI-VivaEval: Automated Professor Replacement & Viva Examination System
Course: Artificial Intelligence (ML509PCC17) - P. R. Pote Patil College of Engg. & Mgmt.
"""

import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from backend.config import settings
from backend.rubric import PRACTICALS_SYLLABUS, RUBRIC_CRITERIA
from backend.evaluator import verify_lab_submission
from backend.viva_manager import generate_viva_question, evaluate_student_answer
from backend.report_generator import compile_assessment_dossier

app = FastAPI(
    title="AI-VivaEval: Automated Viva Voce & Lab Evaluation System",
    description="Automated continuous assessment engine for Artificial Intelligence Laboratory (ML509PCC17)",
    version="1.0.0"
)

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Request Models
class SubmissionRequest(BaseModel):
    fullName: str
    rollNo: str
    department: Optional[str] = settings.DEPARTMENT_NAME
    institute: Optional[str] = settings.INSTITUTE_NAME
    academicYear: Optional[str] = settings.ACADEMIC_YEAR
    semester: Optional[str] = settings.SEMESTER
    practicalNo: int
    sourceCode: str
    executionOutput: str
    writtenConclusion: str


class VivaStartRequest(BaseModel):
    studentProfile: Dict[str, Any]
    practicalNo: int
    sourceCode: str
    executionOutput: str
    diagnosticDossier: str


class VivaTurnRequest(BaseModel):
    turnNumber: int
    practicalNo: int
    studentName: str
    sourceCode: str
    executionOutput: str
    dossier: str
    examinerQuestion: str
    studentSpokenAnswer: str
    previousTurns: List[Dict[str, Any]] = []


class VivaFinalizeRequest(BaseModel):
    studentProfile: Dict[str, Any]
    practicalNo: int
    verificationDiagnostic: Dict[str, Any]
    vivaTurns: List[Dict[str, Any]]


@app.get("/api/health")
async def health():
    return {
        "status": "online",
        "service": "AI-VivaEval Engine",
        "institution": settings.INSTITUTE_NAME,
        "course": f"{settings.COURSE_NAME} ({settings.COURSE_CODE})",
        "model_configured": bool(settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY"))
    }


@app.get("/api/practicals")
async def list_practicals():
    return PRACTICALS_SYLLABUS


@app.get("/api/rubric")
async def get_rubric():
    return RUBRIC_CRITERIA


@app.post("/api/verify-submission")
async def verify_submission(req: SubmissionRequest):
    try:
        diagnostic = await verify_lab_submission(
            student_name=req.fullName,
            roll_no=req.rollNo,
            practical_no=req.practicalNo,
            source_code=req.sourceCode,
            execution_output=req.executionOutput,
            written_conclusion=req.writtenConclusion
        )
        return diagnostic
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/viva/start")
async def start_viva(req: VivaStartRequest):
    try:
        first_question = await generate_viva_question(
            turn_number=1,
            practical_no=req.practicalNo,
            student_name=req.studentProfile.get("fullName", "Student"),
            source_code=req.sourceCode,
            execution_output=req.executionOutput,
            dossier=req.diagnosticDossier,
            previous_turns=[]
        )
        return first_question
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/viva/turn")
async def execute_viva_turn(req: VivaTurnRequest):
    try:
        # 1. Evaluate current answer
        evaluation = await evaluate_student_answer(
            turn_number=req.turnNumber,
            practical_no=req.practicalNo,
            examiner_question=req.examinerQuestion,
            student_spoken_answer=req.studentSpokenAnswer,
            source_code=req.sourceCode,
            execution_output=req.executionOutput
        )
        
        # 2. If next turn exists (< 5), generate next question
        next_question = None
        if req.turnNumber < 5:
            turn_entry = {
                "turnNumber": req.turnNumber,
                "examinerQuestion": req.examinerQuestion,
                "studentAnswer": req.studentSpokenAnswer,
                "accuracyScore": evaluation.get("accuracyScore", 3.5),
                "examinerCritique": evaluation.get("examinerCritique", "")
            }
            updated_turns = req.previousTurns + [turn_entry]
            
            next_question = await generate_viva_question(
                turn_number=req.turnNumber + 1,
                practical_no=req.practicalNo,
                student_name=req.studentName,
                source_code=req.sourceCode,
                execution_output=req.executionOutput,
                dossier=req.dossier,
                previous_turns=updated_turns
            )
            
        return {
            "turnEvaluation": evaluation,
            "nextQuestion": next_question,
            "isCompleted": req.turnNumber >= 5
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/viva/finalize")
async def finalize_viva(req: VivaFinalizeRequest):
    try:
        ledger = await compile_assessment_dossier(
            student_profile=req.studentProfile,
            practical_no=req.practicalNo,
            verification_diag=req.verificationDiagnostic,
            viva_turns=req.vivaTurns
        )
        return ledger
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Mount static frontend if folder exists
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
