import React from 'react';
import { AssessmentLedger } from '../types';
import { Award, Printer, RotateCcw, CheckCircle2, AlertTriangle, BookOpen, Download, ShieldCheck } from 'lucide-react';

interface AssessmentReportProps {
  ledger: AssessmentLedger;
  onRestart: () => void;
}

export const AssessmentReport: React.FC<AssessmentReportProps> = ({ ledger, onRestart }) => {
  const { student, practical, scores, pedagogicalFeedback, gradeTier, evaluationDate } = ledger;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ledger, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AI_VivaEval_Ledger_${student.rollNo}_Prac${practical.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Official Continuous Assessment Generated</h3>
            <p className="text-xs text-slate-400">25-Mark Matrix verified and finalized by Autonomous Professor Engine.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-600/20"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Institutional Ledger
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Evaluation
          </button>
        </div>
      </div>

      {/* Official Institutional Ledger (Printable Certificate) */}
      <div className="print-page bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 text-slate-100">
        {/* Certificate Institutional Header */}
        <div className="border-b-2 border-slate-700 pb-6 text-center space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-400">
            P. R. Pote Patil College of Engineering & Management, Amravati
          </p>
          <p className="text-[11px] text-slate-400">
            (An Autonomous Institute Affiliated to Sant Gadge Baba Amravati University)
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight pt-1">
            Department of Computer Science & Engineering
          </h1>
          <p className="text-xs font-semibold text-slate-300">
            Specialization: Artificial Intelligence & Machine Learning (AIML)
          </p>
          <div className="inline-block bg-sky-950/80 border border-sky-800 px-4 py-1 rounded-full text-xs font-bold text-sky-300 mt-2">
            Continuous Assessment Term-Work Ledger (25 Marks) • Course: ML509PCC17
          </div>
        </div>

        {/* Student & Practical Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <div>
            <span className="block text-slate-400 text-[10px] uppercase font-semibold">Candidate Name</span>
            <span className="font-bold text-white text-sm">{student.fullName}</span>
          </div>
          <div>
            <span className="block text-slate-400 text-[10px] uppercase font-semibold">Roll Number</span>
            <span className="font-mono font-bold text-sky-400 text-sm">{student.rollNo}</span>
          </div>
          <div>
            <span className="block text-slate-400 text-[10px] uppercase font-semibold">Academic Year / Sem</span>
            <span className="font-medium text-white">{student.academicYear} • Sem {student.semester}</span>
          </div>
          <div>
            <span className="block text-slate-400 text-[10px] uppercase font-semibold">Evaluation Date</span>
            <span className="font-medium text-slate-300">{evaluationDate}</span>
          </div>
        </div>

        {/* Practical Title */}
        <div className="bg-sky-950/20 border border-sky-900/40 rounded-xl p-4 text-xs space-y-1">
          <span className="font-semibold text-sky-400 uppercase text-[10px]">Evaluated Coursework</span>
          <h4 className="text-base font-bold text-white">Practical No. {practical.id}: {practical.title}</h4>
          <p className="text-slate-300"><span className="text-slate-400 font-medium">Aim:</span> {practical.aim}</p>
        </div>

        {/* 25-Marks Institutional Rubric Scorecard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-800 text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-300 uppercase tracking-wider font-bold">
                <th className="p-3 border border-slate-800">Assessment Dimension</th>
                <th className="p-3 border border-slate-800">Evaluation Criteria & Invariants</th>
                <th className="p-3 border border-slate-800 text-center w-24">Max Marks</th>
                <th className="p-3 border border-slate-800 text-center w-28">Marks Awarded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {/* Process Skills */}
              <tr className="bg-slate-900/50">
                <td className="p-3 border border-slate-800 font-semibold text-sky-300" rowSpan={2}>
                  1. Process-Related Skills (10 M)
                </td>
                <td className="p-3 border border-slate-800 text-slate-300">
                  <strong className="text-white">Logic Formation & Algorithmic Design:</strong> Problem formulation, state space, search tree construction, syntax clarity.
                </td>
                <td className="p-3 border border-slate-800 text-center text-slate-400">5.0</td>
                <td className="p-3 border border-slate-800 text-center font-bold text-white bg-slate-950/40">
                  {scores.logicFormation}
                </td>
              </tr>
              <tr className="bg-slate-900/50">
                <td className="p-3 border border-slate-800 text-slate-300">
                  <strong className="text-white">Engineering Practice & Quality:</strong> Modular function boundaries, appropriate standard libraries (NumPy, NetworkX), parameter handling.
                </td>
                <td className="p-3 border border-slate-800 text-center text-slate-400">5.0</td>
                <td className="p-3 border border-slate-800 text-center font-bold text-white bg-slate-950/40">
                  {scores.engineeringPractice}
                </td>
              </tr>

              {/* Product Skills */}
              <tr className="bg-slate-900/30">
                <td className="p-3 border border-slate-800 font-semibold text-amber-300" rowSpan={2}>
                  2. Product-Related Skills (10 M)
                </td>
                <td className="p-3 border border-slate-800 text-slate-300">
                  <strong className="text-white">Result Verification & Output Authenticity:</strong> Validation that terminal log trace matches algorithmic execution without fabrication.
                </td>
                <td className="p-3 border border-slate-800 text-center text-slate-400">5.0</td>
                <td className="p-3 border border-slate-800 text-center font-bold text-white bg-slate-950/40">
                  {scores.outputAuthenticity}
                </td>
              </tr>
              <tr className="bg-slate-900/30">
                <td className="p-3 border border-slate-800 text-slate-300">
                  <strong className="text-white">Scientific Deduction & Conclusion:</strong> Rigorous analytical depth detailing complexity, state bounds, and convergence.
                </td>
                <td className="p-3 border border-slate-800 text-center text-slate-400">5.0</td>
                <td className="p-3 border border-slate-800 text-center font-bold text-white bg-slate-950/40">
                  {scores.scientificDeduction}
                </td>
              </tr>

              {/* Viva Voce Defense */}
              <tr className="bg-slate-900/50">
                <td className="p-3 border border-slate-800 font-semibold text-indigo-300">
                  3. Viva Voce Defense (5 M)
                </td>
                <td className="p-3 border border-slate-800 text-slate-300">
                  <strong className="text-white">5-Turn Conversational Defense:</strong> Code defense, state transition probing, theoretical foundations, edge-case failure modes, scalability synthesis.
                </td>
                <td className="p-3 border border-slate-800 text-center text-slate-400">5.0</td>
                <td className="p-3 border border-slate-800 text-center font-bold text-white bg-slate-950/40">
                  {scores.vivaDefense}
                </td>
              </tr>

              {/* Grand Total Row */}
              <tr className="bg-slate-950 text-sm font-bold">
                <td className="p-4 border border-slate-800 text-white uppercase" colSpan={2}>
                  Grand Total Continuous Assessment Marks
                </td>
                <td className="p-4 border border-slate-800 text-center text-slate-400">25.0</td>
                <td className="p-4 border border-slate-800 text-center text-lg text-emerald-400 bg-emerald-950/40">
                  {scores.grandTotal} <span className="text-xs text-slate-400 font-normal">/ 25</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Grade Classification Tier Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 gap-4">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Continuous Assessment Performance Tier
            </span>
            <div className="text-lg font-bold text-white mt-0.5">
              Grade Tier: <span className="text-sky-400">{gradeTier}</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-right">
            <span>Process Total: <strong className="text-white">{scores.processTotal}/10</strong></span>
            <span className="mx-2">•</span>
            <span>Product Total: <strong className="text-white">{scores.productTotal}/10</strong></span>
            <span className="mx-2">•</span>
            <span>Viva Voce: <strong className="text-white">{scores.vivaDefense}/5</strong></span>
          </div>
        </div>

        {/* Pedagogical Feedback Section */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Comprehensive Pedagogical Feedback & Diagnostic Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <h4 className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Demonstrated Strengths
              </h4>
              <ul className="space-y-1 text-slate-300">
                {pedagogicalFeedback.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Flaws & Misconceptions */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <h4 className="font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Critical Gaps & Observed Misconceptions
              </h4>
              <ul className="space-y-1 text-slate-300">
                {pedagogicalFeedback.incorrectConceptsObserved?.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{m}</span>
                  </li>
                ))}
                {pedagogicalFeedback.criticalFlaws?.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 mt-0.5">!</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Remedial Recommendations */}
          {pedagogicalFeedback.remedialRecommendations && pedagogicalFeedback.remedialRecommendations.length > 0 && (
            <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40 text-xs space-y-2">
              <h4 className="font-semibold text-sky-300">Remedial Action Recommendations for Laboratory Term-Work:</h4>
              <ul className="space-y-1 text-slate-300">
                {pedagogicalFeedback.remedialRecommendations.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-400">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reference Model Explanations */}
          {pedagogicalFeedback.modelAnswers && pedagogicalFeedback.modelAnswers.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Reference Model Explanations for Questions Probed During Spoken Viva:
              </h4>
              <div className="space-y-2">
                {pedagogicalFeedback.modelAnswers.map((ma, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                    <p className="font-medium text-sky-300">Q: "{ma.question}"</p>
                    <p className="text-slate-400">Student Defense Summary: {ma.studentResponseSummary}</p>
                    <p className="text-emerald-300 font-sans mt-1">
                      <strong>Model Solution:</strong> {ma.referenceModelExplanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Official Institutional Signatures */}
        <div className="pt-10 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-2">
            <div className="h-10 flex items-end justify-center font-mono text-[11px] text-slate-400">
              [Digitally Signed by Engine]
            </div>
            <p className="font-bold text-white border-t border-slate-700 pt-1">
              AI-VivaEval Engine
            </p>
            <p className="text-[10px] text-slate-400">Autonomous Examiner</p>
          </div>

          <div className="space-y-2">
            <div className="h-10 flex items-end justify-center font-mono text-[11px] text-slate-400">
              {student.fullName}
            </div>
            <p className="font-bold text-white border-t border-slate-700 pt-1">
              Candidate Signature
            </p>
            <p className="text-[10px] text-slate-400">Roll: {student.rollNo}</p>
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <div className="h-10 flex items-end justify-center font-mono text-[11px] text-slate-400">
              Prof. & Head of Department
            </div>
            <p className="font-bold text-white border-t border-slate-700 pt-1">
              Head of Department
            </p>
            <p className="text-[10px] text-slate-400">CSE (AIML), PRPCEM</p>
          </div>
        </div>
      </div>
    </div>
  );
};
