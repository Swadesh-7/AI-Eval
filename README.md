# AI-VivaEval: Automated Professor Replacement & Viva Examination System
**P. R. Pote Patil College of Engineering & Management, Amravati**  
*Department of Computer Science & Engineering (Artificial Intelligence & Machine Learning)*  
**Course:** Artificial Intelligence Laboratory (`ML509PCC17`) — Semester V (AY 2026-2027)

---

## Overview

**AI-VivaEval** is an autonomous academic viva voce examination and continuous assessment system designed to evaluate undergraduate engineering laboratory coursework against official institutional rubrics (25 Marks total: 10 Process + 10 Product + 5 Viva Voce).

### Key Architectural Capabilities:
1. **Static & Semantic Submission Verification:**
   - Evaluates submitted source code against the official practical syllabus (Practicals 1 to 10).
   - Cross-checks terminal execution logs and traces against code logic to detect trace fabrication (e.g. mismatched graph nodes or outputs copied from other practicals).
   - Validates technical depth of written conclusions (complexity, optimality, convergence).
2. **Adaptive Spoken Viva Voce Chamber:**
   - Native Web Speech API STT (`webkitSpeechRecognition` / `SpeechRecognition`) and TTS (`window.speechSynthesis`).
   - 5-Turn Conversational State Machine:
     - **Turn 1:** Code Defense & Authenticity Check (execution walkthrough)
     - **Turn 2:** Line/Parameter & State Transition Discrepancy Probe
     - **Turn 3:** Core Algorithmic & Theoretical Foundations (admissibility, invariants)
     - **Turn 4:** Edge Cases, Loops & Failure Modes
     - **Turn 5:** Synthesis & Real-World Scalability
   - Voice Activity Detection (VAD) / 2.5-second silence prompt: *"Is that all you wanted to say?"*
   - Manual override buttons and live transcript editor for noisy engineering lab rooms.
3. **Official Continuous Assessment Ledger (25 Marks):**
   - Itemized scorecard: Process (Logic /5, Engineering /5), Product (Output /5, Deduction /5), Viva Voce (/5).
   - Granular pedagogical critique, strengths, identified misconceptions, and reference model explanations.
   - Printable departmental term-work certificate.

---

## Local Setup & Quickstart

### Option 1: Full-Stack React + Express (Active AI Studio Container)
```bash
npm run dev
```
Runs at `http://localhost:3000`.

### Option 2: Python FastAPI Backend
```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Export Gemini API Key
export GEMINI_API_KEY="your-gemini-api-key-here"

# 4. Start Uvicorn Server
uvicorn backend.main:app --reload --port 8000
```
Open `http://localhost:8000` in your browser.

---

## Free Cloud Deployment

### 1. Hugging Face Spaces (Docker SDK)
1. Create a new Space on [Hugging Face](https://huggingface.co/spaces).
2. Select **Docker** as the SDK.
3. Push this repository to the Space Git remote.
4. Add your `GEMINI_API_KEY` under **Settings > Variables and Secrets**.
5. The application boots with HTTPS automatically, enabling full Web Speech API microphone permissions.

### 2. Render.com (Web Service)
1. Connect this GitHub repository to Render.
2. Choose **Docker Environment**.
3. Add Environment Variable: `GEMINI_API_KEY`.
4. Deploy!
