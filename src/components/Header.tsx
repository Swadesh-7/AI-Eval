import React from 'react';
import { Award, GraduationCap, Mic, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentStage: 'submission' | 'verification' | 'viva' | 'report';
  hasApiKey?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentStage, hasApiKey = true }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Institution Crest and Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 border border-sky-400/30 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
                  P. R. Pote Patil College of Engg. & Mgmt. (Autonomous)
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-sky-950 text-sky-300 border border-sky-800">
                  AY 2026-27
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                AI-VivaEval
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-normal">
                  Prof. Replacement Engine
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                CSE (Artificial Intelligence & Machine Learning) • Practical Course (ML509PCC17) • 25 Marks Continuous Assessment
              </p>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-start md:self-auto bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl text-xs">
            <div className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentStage === 'submission' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400'
            }`}>
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Submission</span>
            </div>

            <span className="text-slate-600">→</span>

            <div className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentStage === 'verification' ? 'bg-amber-600 text-white font-medium' : 'text-slate-400'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. Verification</span>
            </div>

            <span className="text-slate-600">→</span>

            <div className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentStage === 'viva' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400'
            }`}>
              <Mic className="w-3.5 h-3.5" />
              <span>3. Spoken Viva</span>
            </div>

            <span className="text-slate-600">→</span>

            <div className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentStage === 'report' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400'
            }`}>
              <Award className="w-3.5 h-3.5" />
              <span>4. Assessment</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
