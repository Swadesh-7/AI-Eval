import React, { useState } from 'react';
import { PracticalDefinition, StudentProfile } from '../types';
import { PRACTICALS_DATA } from '../data/syllabus';
import { Code, Terminal, FileText, Upload, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SubmissionFormProps {
  onVerify: (data: {
    student: StudentProfile;
    practical: PracticalDefinition;
    code: string;
    output: string;
    conclusion: string;
  }) => void;
  isVerifying: boolean;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ onVerify, isVerifying }) => {
  const [selectedPracticalId, setSelectedPracticalId] = useState<number>(5); // Default to BFS/DFS
  const [fullName, setFullName] = useState('Swadesh Tayade');
  const [rollNo, setRollNo] = useState('23AIML104');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [semester, setSemester] = useState('Fifth (V)');

  const currentPractical = PRACTICALS_DATA.find((p) => p.id === selectedPracticalId) || PRACTICALS_DATA[4];

  const [code, setCode] = useState<string>(currentPractical.benchmarkCode);
  const [output, setOutput] = useState<string>(currentPractical.benchmarkOutput);
  const [conclusion, setConclusion] = useState<string>(currentPractical.benchmarkConclusion);

  const handleSelectPractical = (id: number) => {
    setSelectedPracticalId(id);
    const prac = PRACTICALS_DATA.find((p) => p.id === id);
    if (prac) {
      setCode(prac.benchmarkCode);
      setOutput(prac.benchmarkOutput);
      setConclusion(prac.benchmarkConclusion);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'code' | 'output' | 'conclusion') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (target === 'code') setCode(content);
      else if (target === 'output') setOutput(content);
      else if (target === 'conclusion') setConclusion(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !output.trim()) {
      alert('Please provide both source code and execution output before submitting.');
      return;
    }

    const student: StudentProfile = {
      fullName: fullName.trim() || 'Student',
      rollNo: rollNo.trim() || '23AIML000',
      department: 'Department of Computer Science & Engineering (Artificial Intelligence & Machine Learning)',
      institute: 'P. R. Pote Patil College of Engineering & Management, Amravati',
      academicYear,
      semester,
      courseCode: 'ML509PCC17',
      courseName: 'Artificial Intelligence',
      practicalNo: selectedPracticalId
    };

    onVerify({
      student,
      practical: currentPractical,
      code,
      output,
      conclusion
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Institutional Practical Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Department of Computer Science & Engineering (AIML)
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Laboratory Submission Portal</h2>
            <p className="text-sm text-slate-400">
              Continuous Assessment Submission for Artificial Intelligence Practical Course (ML509PCC17)
            </p>
          </div>

          {/* Quick Benchmark Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Benchmark Loaders:
            </span>
            {[
              { id: 5, label: 'Prac 5 (BFS/DFS)' },
              { id: 6, label: 'Prac 6 (A* Search)' },
              { id: 7, label: 'Prac 7 (Minimax)' },
              { id: 9, label: 'Prac 9 (Expert System)' },
              { id: 4, label: 'Prac 4 (Water Jug)' },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPractical(preset.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  selectedPracticalId === preset.id
                    ? 'bg-sky-600/30 border-sky-400 text-sky-200 font-medium'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Profile Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                placeholder="e.g. Swadesh Tayade"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">University Roll Number</label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                placeholder="e.g. 23AIML104"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Semester & Year</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Practical (1 to 10)</label>
              <select
                value={selectedPracticalId}
                onChange={(e) => handleSelectPractical(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                {PRACTICALS_DATA.map((p) => (
                  <option key={p.id} value={p.id}>
                    Practical {p.id}: {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Practical Syllabus Card Preview */}
          <div className="bg-sky-950/20 border border-sky-900/50 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-sky-300 text-sm">
                Practical No. {currentPractical.id}: {currentPractical.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="bg-sky-900/60 border border-sky-700 px-2 py-0.5 rounded text-[11px] text-sky-200">
                  BT Level: {currentPractical.btLevel}
                </span>
                <span className="bg-indigo-900/60 border border-indigo-700 px-2 py-0.5 rounded text-[11px] text-indigo-200">
                  {currentPractical.poMapping}
                </span>
              </div>
            </div>
            <p className="text-slate-300"><span className="font-semibold text-white">Aim:</span> {currentPractical.aim}</p>
            <p className="text-slate-400"><span className="font-semibold text-slate-300">Course Outcome:</span> {currentPractical.coMapping}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-slate-400 font-medium">Core Concepts:</span>
              {currentPractical.coreConcepts.map((c, i) => (
                <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Submission Triad: Code, Output, Conclusion */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Source Code */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-sky-400" />
                  1. Source Code (.py)
                </label>
                <label className="cursor-pointer text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                  <Upload className="w-3 h-3" />
                  Upload .py
                  <input
                    type="file"
                    accept=".py,.txt"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'code')}
                  />
                </label>
              </div>
              <textarea
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                className="w-full bg-slate-950 font-mono text-xs text-emerald-400 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500 leading-relaxed resize-none shadow-inner"
                placeholder="Paste complete Python code here..."
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>{code.split('\n').length} lines</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Code ready for AST analysis
                </span>
              </div>
            </div>

            {/* 2. Execution Output / Trace */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  2. Execution Output / Trace
                </label>
                <label className="cursor-pointer text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                  <Upload className="w-3 h-3" />
                  Upload Log
                  <input
                    type="file"
                    accept=".txt,.log"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'output')}
                  />
                </label>
              </div>
              <textarea
                required
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                rows={16}
                className="w-full bg-slate-950 font-mono text-xs text-amber-300 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 leading-relaxed resize-none shadow-inner"
                placeholder="Paste the terminal execution trace, state changes, and final output..."
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>{output.split('\n').length} log lines</span>
                <span className="text-amber-400">Verified for authenticity</span>
              </div>
            </div>

            {/* 3. Written Scientific Conclusion */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  3. Scientific Deduction / Conclusion
                </label>
                <span className="text-[11px] text-slate-400">Max 5 Marks in Rubric</span>
              </div>
              <textarea
                required
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                rows={16}
                className="w-full bg-slate-950 font-sans text-xs text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none shadow-inner"
                placeholder="Provide a technical deduction detailing complexity, state space optimality, convergence, and algorithmic invariants..."
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>{conclusion.split(' ').filter(Boolean).length} words</span>
                <span className="text-slate-400">Must reflect analytical depth</span>
              </div>
            </div>
          </div>

          {/* Evaluation Rubrics Summary Banner */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Official 25-Mark Continuous Assessment Rubric</p>
                <p className="text-slate-400 mt-0.5">
                  Process Skills (10 M): Logic Formation (5) + Engineering Practice (5) | Product Skills (10 M): Output Authenticity (5) + Scientific Deduction (5) | Viva Voce Defense (5 M)
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Submission Authenticity...</span>
                </>
              ) : (
                <>
                  <span>Run Pre-Examination Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
