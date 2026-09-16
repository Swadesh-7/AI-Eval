import React from 'react';
import { VerificationDiagnostic, PracticalDefinition, StudentProfile } from '../types';
import { ShieldCheck, AlertTriangle, CheckCircle2, Mic, ArrowRight, BookOpen, Layers, Award } from 'lucide-react';

interface VerificationModalProps {
  diagnostic: VerificationDiagnostic;
  practical: PracticalDefinition;
  student: StudentProfile;
  onProceedToViva: () => void;
  onBackToEdit: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  diagnostic,
  practical,
  student,
  onProceedToViva,
  onBackToEdit,
}) => {
  const processTotal = diagnostic.logicFormationScore + diagnostic.engineeringPracticeScore;
  const productTotal = diagnostic.outputAuthenticityScore + diagnostic.scientificDeductionScore;
  const preVivaTotal = processTotal + productTotal;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 ${
              diagnostic.isConsistent ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400' : 'bg-amber-600/20 border border-amber-500/40 text-amber-400'
            }`}>
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
                Stage 2: Pre-Examination Verification Complete
              </span>
              <h2 className="text-2xl font-bold text-white">Diagnostic & Submission Dossier</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Candidate: <strong className="text-white">{student.fullName}</strong> ({student.rollNo}) • Practical #{practical.id}: {practical.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">Pre-Viva Continuous Score</span>
              <span className="text-xl font-bold text-sky-400">{preVivaTotal} <span className="text-xs text-slate-500 font-normal">/ 20</span></span>
            </div>
          </div>
        </div>

        {/* 20-Marks Pre-Score Breakdown Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 1. Process Related Skills (10 M) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                1. Process-Related Skills (10 Marks)
              </span>
              <span className="text-sm font-bold text-white bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                {processTotal} / 10
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Logic Formation & Algorithmic Design:</span>
                <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {diagnostic.logicFormationScore} / 5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-2 border-l border-slate-700">
                Adherence to state space invariants, algorithmic design, search trees, and syntax clarity.
              </p>

              <div className="flex justify-between items-center text-slate-300 pt-1">
                <span>Engineering Practice & Quality:</span>
                <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {diagnostic.engineeringPracticeScore} / 5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-2 border-l border-slate-700">
                Modular structure, function parameters, and appropriate library usage.
              </p>
            </div>
          </div>

          {/* 2. Product Related Skills (10 M) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                2. Product-Related Skills (10 Marks)
              </span>
              <span className="text-sm font-bold text-white bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                {productTotal} / 10
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Result Verification & Output Authenticity:</span>
                <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {diagnostic.outputAuthenticityScore} / 5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-2 border-l border-slate-700">
                Terminal log trace corresponds precisely to code state transitions without fabrication.
              </p>

              <div className="flex justify-between items-center text-slate-300 pt-1">
                <span>Scientific Deduction & Conclusion:</span>
                <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {diagnostic.scientificDeductionScore} / 5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-2 border-l border-slate-700">
                Rigorous technical deduction of complexity, optimality, and bounds.
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Anomalies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Submission Strengths
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {diagnostic.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Flagged Anomalies & Verification Status
            </h4>
            {diagnostic.detectedAnomalies.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-300">
                {diagnostic.detectedAnomalies.map((ano, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">⚠️</span>
                    <span>{ano}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-300">
                Zero integrity anomalies detected. Source code logic corresponds logically to the terminal trace.
              </p>
            )}
          </div>
        </div>

        {/* Diagnostic Dossier & Probing Angles */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Diagnostic Dossier
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {diagnostic.diagnosticDossier}
            </p>
          </div>

          {diagnostic.probingAnglesForViva && diagnostic.probingAnglesForViva.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <h5 className="text-xs font-semibold text-slate-300 mb-2">
                Formulated Viva Probing Strategy (5-Turn Battery):
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {diagnostic.probingAnglesForViva.map((angle, i) => (
                  <div key={i} className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                    <span className="font-semibold text-sky-300">Probe {i + 1}:</span> {angle}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onBackToEdit}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            ← Modify Submitted Code/Output
          </button>

          <button
            type="button"
            onClick={onProceedToViva}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-600 hover:opacity-90 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Mic className="w-4 h-4 text-sky-200" />
            <span>Enter Spoken Viva Voce Chamber</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
