export interface StudentProfile {
  fullName: string;
  rollNo: string;
  department: string;
  institute: string;
  academicYear: string;
  semester: string;
  courseCode: string;
  courseName: string;
  practicalNo: number;
}

export interface PracticalDefinition {
  id: number;
  title: string;
  aim: string;
  objectives: string[];
  coMapping: string;
  btLevel: number;
  poMapping: string;
  softwareRequired: string;
  coreConcepts: string[];
  keyInvariants: string[];
  benchmarkCode: string;
  benchmarkOutput: string;
  benchmarkConclusion: string;
}

export interface VerificationDiagnostic {
  isConsistent: boolean;
  syllabusMatchConfidence: number; // 0 - 100
  logicFormationScore: number; // 0 - 5
  engineeringPracticeScore: number; // 0 - 5
  outputAuthenticityScore: number; // 0 - 5
  scientificDeductionScore: number; // 0 - 5
  authenticityStatus: 'Verified' | 'Suspicious Discrepancy' | 'Mismatched / Fabricated';
  detectedAnomalies: string[];
  strengths: string[];
  diagnosticDossier: string;
  probingAnglesForViva: string[];
}

export interface VivaTurn {
  turnNumber: number;
  phaseTitle: string;
  questionTheme: string;
  examinerQuestion: string;
  studentAnswer: string;
  accuracyScore: number; // 0 - 5
  conceptualClarity: 'High' | 'Medium' | 'Low';
  keywordsDetected: string[];
  discrepanciesFlagged: string[];
  examinerCritique: string;
  timestamp: string;
}

export interface AssessmentLedger {
  student: StudentProfile;
  practical: PracticalDefinition;
  verification: VerificationDiagnostic;
  vivaTurns: VivaTurn[];
  scores: {
    // Process-Related Skills (Max 10)
    logicFormation: number; // Max 5
    engineeringPractice: number; // Max 5
    processTotal: number; // Max 10

    // Product-Related Skills (Max 10)
    outputAuthenticity: number; // Max 5
    scientificDeduction: number; // Max 5
    productTotal: number; // Max 10

    // Viva Voce Defense (Max 5)
    vivaDefense: number; // Max 5 (High: 5, Med: 3-4, Low: 0-2)

    // Grand Total (Max 25)
    grandTotal: number; // Max 25
  };
  gradeTier: 'Outstanding (High)' | 'Satisfactory (Medium)' | 'Unsatisfactory (Low)';
  pedagogicalFeedback: {
    strengths: string[];
    criticalFlaws: string[];
    incorrectConceptsObserved: string[];
    remedialRecommendations: string[];
    modelAnswers: {
      question: string;
      studentResponseSummary: string;
      referenceModelExplanation: string;
    }[];
  };
  evaluationDate: string;
  examinerSignature: string;
  departmentHead: string;
}
