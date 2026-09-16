import React, { useState, useEffect } from 'react';
import { StudentProfile, PracticalDefinition, VerificationDiagnostic, AssessmentLedger } from './types';
import { Header } from './components/Header';
import { SubmissionForm } from './components/SubmissionForm';
import { VerificationModal } from './components/VerificationModal';
import { VivaChamber } from './components/VivaChamber';
import { AssessmentReport } from './components/AssessmentReport';
import { verifySubmissionApi, startVivaApi } from './services/api';
import { AlertCircle, X } from 'lucide-react';

type AppStage = 'submission' | 'verification' | 'viva' | 'report';

export default function App() {
  const [currentStage, setCurrentStage] = useState<AppStage>('submission');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isStartingViva, setIsStartingViva] = useState(false);
  const [systemNotice, setSystemNotice] = useState<string | null>(null);

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [practical, setPractical] = useState<PracticalDefinition | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string>('');
  const [submittedOutput, setSubmittedOutput] = useState<string>('');
  const [submittedConclusion, setSubmittedConclusion] = useState<string>('');

  const [verificationResult, setVerificationResult] = useState<VerificationDiagnostic | null>(null);
  const [initialVivaQuestion, setInitialVivaQuestion] = useState<any | null>(null);
  const [finalLedger, setFinalLedger] = useState<AssessmentLedger | null>(null);

  // Check health and API key status on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .catch((err) => console.log('Backend health status:', err));
  }, []);

  // Step 1 -> Step 2: Handle Submission Verification
  const handleVerifySubmission = async (data: {
    student: StudentProfile;
    practical: PracticalDefinition;
    code: string;
    output: string;
    conclusion: string;
  }) => {
    setSystemNotice(null);
    setStudent(data.student);
    setPractical(data.practical);
    setSubmittedCode(data.code);
    setSubmittedOutput(data.output);
    setSubmittedConclusion(data.conclusion);

    setIsVerifying(true);
    try {
      const diagnostic = await verifySubmissionApi({
        fullName: data.student.fullName,
        rollNo: data.student.rollNo,
        department: data.student.department,
        institute: data.student.institute,
        academicYear: data.student.academicYear,
        semester: data.student.semester,
        practicalNo: data.practical.id,
        sourceCode: data.code,
        executionOutput: data.output,
        writtenConclusion: data.conclusion,
      });

      setVerificationResult(diagnostic);
      setCurrentStage('verification');
    } catch (err: any) {
      console.error('Submission verification notice:', err);
      setSystemNotice(err.message || 'Verification encountered an issue. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 2 -> Step 3: Launch Spoken Viva Chamber
  const handleProceedToViva = async () => {
    if (!student || !practical || !verificationResult) return;

    setSystemNotice(null);
    setIsStartingViva(true);
    try {
      const startRes = await startVivaApi({
        studentProfile: student,
        practicalNo: practical.id,
        sourceCode: submittedCode,
        executionOutput: submittedOutput,
        diagnosticDossier: verificationResult.diagnosticDossier,
      });

      setInitialVivaQuestion(startRes);
      setCurrentStage('viva');
    } catch (err: any) {
      console.error('Viva start error:', err);
      setSystemNotice(err.message || 'Failed to initialize spoken viva chamber.');
    } finally {
      setIsStartingViva(false);
    }
  };

  // Step 3 -> Step 4: Viva Complete
  const handleVivaComplete = (ledger: AssessmentLedger) => {
    setFinalLedger(ledger);
    setCurrentStage('report');
  };

  // Reset to Step 1
  const handleRestart = () => {
    setCurrentStage('submission');
    setVerificationResult(null);
    setInitialVivaQuestion(null);
    setFinalLedger(null);
    setSystemNotice(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Header currentStage={currentStage} />

      {/* Non-blocking Global System Notice Banner */}
      {systemNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full animate-fadeIn">
          <div className="bg-amber-950/80 border border-amber-500/60 rounded-xl p-3.5 flex items-center justify-between gap-3 text-amber-200 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{systemNotice}</span>
            </div>
            <button
              onClick={() => setSystemNotice(null)}
              className="text-amber-400 hover:text-white p-1 rounded transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stage 1: Submission */}
        {currentStage === 'submission' && (
          <SubmissionForm onVerify={handleVerifySubmission} isVerifying={isVerifying} />
        )}

        {/* Stage 2: Verification Analysis Modal / View */}
        {currentStage === 'verification' && verificationResult && practical && student && (
          <VerificationModal
            diagnostic={verificationResult}
            practical={practical}
            student={student}
            onProceedToViva={handleProceedToViva}
            onBackToEdit={() => setCurrentStage('submission')}
          />
        )}

        {/* Stage 3: Spoken Viva Voce Chamber */}
        {currentStage === 'viva' && student && practical && verificationResult && initialVivaQuestion && (
          <VivaChamber
            student={student}
            practical={practical}
            verification={verificationResult}
            initialQuestion={initialVivaQuestion}
            sourceCode={submittedCode}
            executionOutput={submittedOutput}
            onVivaComplete={handleVivaComplete}
          />
        )}

        {/* Stage 4: Official Assessment Ledger */}
        {currentStage === 'report' && finalLedger && (
          <AssessmentReport ledger={finalLedger} onRestart={handleRestart} />
        )}
      </main>

      <footer className="no-print border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>
          AI-VivaEval: Automated Professor Replacement & Viva Voce Examination System
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          P. R. Pote Patil College of Engineering & Management, Amravati (Autonomous) • Dept. of CSE (AIML)
        </p>
      </footer>
    </div>
  );
}
