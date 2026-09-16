import { StudentProfile, VerificationDiagnostic, VivaTurn, AssessmentLedger } from '../types';

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    if (data.error) {
      if (typeof data.error === 'string') return data.error;
      if (typeof data.error === 'object' && data.error.message) return data.error.message;
    }
    if (data.detail) return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    if (data.message) return data.message;
  } catch {
    // Ignore JSON parse errors
  }
  return fallback;
}

export async function verifySubmissionApi(payload: {
  fullName: string;
  rollNo: string;
  department: string;
  institute: string;
  academicYear: string;
  semester: string;
  practicalNo: number;
  sourceCode: string;
  executionOutput: string;
  writtenConclusion: string;
}): Promise<VerificationDiagnostic> {
  const response = await fetch('/api/verify-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMsg = await parseErrorMessage(response, 'Submission verification could not be completed.');
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function startVivaApi(payload: {
  studentProfile: StudentProfile;
  practicalNo: number;
  sourceCode: string;
  executionOutput: string;
  diagnosticDossier: string;
}) {
  const response = await fetch('/api/viva/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMsg = await parseErrorMessage(response, 'Unable to initialize viva chamber.');
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function executeVivaTurnApi(payload: {
  turnNumber: number;
  practicalNo: number;
  studentName: string;
  sourceCode: string;
  executionOutput: string;
  dossier: string;
  examinerQuestion: string;
  studentSpokenAnswer: string;
  previousTurns: any[];
}) {
  const response = await fetch('/api/viva/turn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMsg = await parseErrorMessage(response, 'Failed to evaluate viva turn response.');
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function finalizeVivaApi(payload: {
  studentProfile: StudentProfile;
  practicalNo: number;
  verificationDiagnostic: VerificationDiagnostic;
  vivaTurns: VivaTurn[];
}): Promise<AssessmentLedger> {
  const response = await fetch('/api/viva/finalize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMsg = await parseErrorMessage(response, 'Failed to compile final continuous assessment ledger.');
    throw new Error(errorMsg);
  }

  return response.json();
}
