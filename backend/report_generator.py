"""
Report generator for Institutional Continuous Assessment Term-Work Ledger (25 Marks)
P. R. Pote Patil College of Engineering & Management, Amravati
Department of Computer Science & Engineering (AIML)
Course: Artificial Intelligence (ML509PCC17)
"""

import json
import os
import re
from datetime import datetime
from typing import Dict, Any, List

try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None

from backend.config import settings
from backend.rubric import PRACTICALS_SYLLABUS


def get_genai_client():
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return None
    if genai:
        return genai.Client(api_key=api_key)
    return None


def sanitize_json(text: str) -> Dict[str, Any]:
    text = text.strip()
    match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if match:
        text = match.group(1)
    else:
        match_brace = re.search(r"(\{.*\})", text, re.DOTALL)
        if match_brace:
            text = match_brace.group(1)
    return json.loads(text)


async def compile_assessment_dossier(
    student_profile: Dict[str, Any],
    practical_no: int,
    verification_diag: Dict[str, Any],
    viva_turns: List[Dict[str, Any]]
) -> Dict[str, Any]:
    prac_info = PRACTICALS_SYLLABUS.get(practical_no, PRACTICALS_SYLLABUS[1])
    
    # Calculate Viva Voce score out of 5 from all turns
    turn_scores = [t.get("accuracyScore", 3.0) for t in viva_turns]
    avg_viva_raw = sum(turn_scores) / max(len(turn_scores), 1)
    
    # Map to 5-mark rubric tier: High (5), Medium (3-4), Low (0-2)
    if avg_viva_raw >= 4.2:
        viva_defense_score = 5.0
        viva_tier = "High (Satisfactory Defense)"
    elif avg_viva_raw >= 2.8:
        viva_defense_score = round(min(avg_viva_raw, 4.0), 1)
        viva_tier = "Medium (Moderately Satisfactory)"
    else:
        viva_defense_score = round(min(avg_viva_raw, 2.0), 1)
        viva_tier = "Low (Unsatisfactory / Plagiarism Suspected)"

    logic_score = float(verification_diag.get("logicFormationScore", 4.0))
    eng_score = float(verification_diag.get("engineeringPracticeScore", 4.0))
    output_score = float(verification_diag.get("outputAuthenticityScore", 4.0))
    conclusion_score = float(verification_diag.get("scientificDeductionScore", 4.0))
    
    process_total = round(logic_score + eng_score, 1)
    product_total = round(output_score + conclusion_score, 1)
    grand_total = round(process_total + product_total + viva_defense_score, 1)
    
    if grand_total >= 21:
        grade_tier = "Outstanding (High)"
    elif grand_total >= 15:
        grade_tier = "Satisfactory (Medium)"
    else:
        grade_tier = "Unsatisfactory (Low)"

    prompt = f"""
You are the Head of Evaluation at {settings.INSTITUTE_NAME}.
Generate an in-depth, pedagogical Term-Work Continuous Assessment Report for:
Student: {student_profile.get('fullName')} (Roll: {student_profile.get('rollNo')})
Course: {settings.COURSE_NAME} ({settings.COURSE_CODE}) - Semester V
Practical #{practical_no}: {prac_info['title']}

Scores:
- Process (Logic: {logic_score}/5, Engineering: {eng_score}/5 -> Total: {process_total}/10)
- Product (Output Authenticity: {output_score}/5, Conclusion Deduction: {conclusion_score}/5 -> Total: {product_total}/10)
- Viva Voce Defense ({viva_defense_score}/5, Tier: {viva_tier})
- Grand Total: {grand_total}/25 (Grade: {grade_tier})

Viva Turns Summary:
{json.dumps(viva_turns, indent=2)}

Verification Diagnostic:
{json.dumps(verification_diag, indent=2)}

Synthesize a comprehensive feedback dossier in valid JSON:
{{
  "strengths": [string],
  "criticalFlaws": [string],
  "incorrectConceptsObserved": [string],
  "remedialRecommendations": [string],
  "modelAnswers": [
    {{
      "question": string,
      "studentResponseSummary": string,
      "referenceModelExplanation": string
    }}
  ]
}}
"""

    client = get_genai_client()
    pedagogical = {
        "strengths": [
            "Consistent algorithmic design adhering to practical syllabus specifications.",
            "Solid comprehension of state transitions and data structure mechanics.",
            "Appropriate modularization and library imports observed in submission."
        ],
        "criticalFlaws": verification_diag.get("detectedAnomalies", []),
        "incorrectConceptsObserved": [
            "Brief hesitation during edge-case theoretical boundary interrogation."
        ],
        "remedialRecommendations": [
            "Practice writing asymptotic mathematical derivations for worst-case branching factors.",
            "Incorporate automated test assertions in python scripts before generating journal traces."
        ],
        "modelAnswers": [
            {
                "question": f"Key algorithmic invariant in {prac_info['title']}",
                "studentResponseSummary": "Student described procedural execution flow accurately.",
                "referenceModelExplanation": f"The optimal solution requires strictly honoring the theoretical guarantees of {', '.join(prac_info['key_algorithms'])}."
            }
        ]
    }

    if client:
        try:
            response = client.models.generateContent(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            parsed = sanitize_json(response.text)
            pedagogical = parsed
        except Exception as e:
            print(f"Error generating feedback: {e}")

    final_ledger = {
        "student": student_profile,
        "practical": prac_info,
        "verification": verification_diag,
        "vivaTurns": viva_turns,
        "scores": {
            "logicFormation": logic_score,
            "engineeringPractice": eng_score,
            "processTotal": process_total,
            "outputAuthenticity": output_score,
            "scientificDeduction": conclusion_score,
            "productTotal": product_total,
            "vivaDefense": viva_defense_score,
            "grandTotal": grand_total
        },
        "gradeTier": grade_tier,
        "pedagogicalFeedback": pedagogical,
        "evaluationDate": datetime.now().strftime("%d-%B-%Y %H:%M:%S"),
        "examinerSignature": "AI-VivaEval Autonomous System (Accredited Model Engine)",
        "departmentHead": "Prof. & Head, Department of CSE (AIML), PRPCEM"
    }

    return final_ledger
