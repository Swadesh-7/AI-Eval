import React, { useState, useEffect, useRef } from 'react';
import { PracticalDefinition, StudentProfile, VerificationDiagnostic, VivaTurn } from '../types';
import { WebSpeechController } from '../services/speechService';
import { executeVivaTurnApi, finalizeVivaApi } from '../services/api';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Send,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Radio,
  FileCheck,
  Award
} from 'lucide-react';

interface VivaChamberProps {
  student: StudentProfile;
  practical: PracticalDefinition;
  verification: VerificationDiagnostic;
  initialQuestion: {
    turnNumber: number;
    phaseTitle: string;
    questionTheme: string;
    examinerQuestion: string;
    expectedKeyConcepts?: string[];
  };
  sourceCode: string;
  executionOutput: string;
  onVivaComplete: (ledger: any) => void;
}

export const VivaChamber: React.FC<VivaChamberProps> = ({
  student,
  practical,
  verification,
  initialQuestion,
  sourceCode,
  executionOutput,
  onVivaComplete,
}) => {
  const [currentTurnNumber, setCurrentTurnNumber] = useState(1);
  const [phaseTitle, setPhaseTitle] = useState(initialQuestion.phaseTitle);
  const [questionTheme, setQuestionTheme] = useState(initialQuestion.questionTheme);
  const [examinerQuestion, setExaminerQuestion] = useState(initialQuestion.examinerQuestion);
  const [expectedKeyConcepts, setExpectedKeyConcepts] = useState<string[]>(initialQuestion.expectedKeyConcepts || []);

  const [studentTranscript, setStudentTranscript] = useState('');
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isEvaluatingTurn, setIsEvaluatingTurn] = useState(false);
  const [silencePromptVisible, setSilencePromptVisible] = useState(false);
  const [audioFeedbackError, setAudioFeedbackError] = useState<string | null>(null);

  const [vivaTurnsHistory, setVivaTurnsHistory] = useState<VivaTurn[]>([]);
  const [latestTurnFeedback, setLatestTurnFeedback] = useState<any | null>(null);

  const speechRef = useRef<WebSpeechController | null>(null);
  const isMountedRef = useRef(true);

  // Initialize Speech Controller
  useEffect(() => {
    isMountedRef.current = true;

    const controller = new WebSpeechController({
      onTranscriptUpdate: (transcript, _isFinal) => {
        if (!isMountedRef.current) return;
        setStudentTranscript(transcript);
        setSilencePromptVisible(false);
      },
      onExaminerSpeakingStart: () => {
        if (!isMountedRef.current) return;
        setIsExaminerSpeaking(true);
        setIsListening(false);
      },
      onExaminerSpeakingEnd: () => {
        if (!isMountedRef.current) return;
        setIsExaminerSpeaking(false);
        // Automatically start listening after question is read
        controller.startListening('');
      },
      onSilencePromptTriggered: () => {
        if (!isMountedRef.current) return;
        setSilencePromptVisible(true);
      },
      onStatusChange: (status) => {
        if (!isMountedRef.current) return;
        setIsListening(status === 'listening');
        setIsExaminerSpeaking(status === 'speaking');
      },
      onError: (msg) => {
        if (!isMountedRef.current) return;
        setAudioFeedbackError(msg);
      }
    });

    speechRef.current = controller;

    // Speak the opening question automatically
    controller.speakText(initialQuestion.examinerQuestion);

    return () => {
      isMountedRef.current = false;
      controller.cleanup();
    };
  }, [initialQuestion]);

  const handleSpeakQuestionAgain = () => {
    if (speechRef.current) {
      speechRef.current.speakText(examinerQuestion);
    }
  };

  const handleToggleMic = () => {
    if (!speechRef.current) return;
    if (isListening) {
      speechRef.current.stopListening();
      setIsListening(false);
    } else {
      speechRef.current.startListening(studentTranscript);
      setIsListening(true);
      setSilencePromptVisible(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (speechRef.current) {
      speechRef.current.stopListening();
    }
    setSilencePromptVisible(false);

    const answerToSubmit = studentTranscript.trim();
    if (!answerToSubmit) {
      alert('Please speak or type your answer before submitting.');
      return;
    }

    setIsEvaluatingTurn(true);
    try {
      const response = await executeVivaTurnApi({
        turnNumber: currentTurnNumber,
        practicalNo: practical.id,
        studentName: student.fullName,
        sourceCode,
        executionOutput,
        dossier: verification.diagnosticDossier,
        examinerQuestion,
        studentSpokenAnswer: answerToSubmit,
        previousTurns: vivaTurnsHistory,
      });

      const evaluation = response.turnEvaluation;

      const completedTurnRecord: VivaTurn = {
        turnNumber: currentTurnNumber,
        phaseTitle,
        questionTheme,
        examinerQuestion,
        studentAnswer: answerToSubmit,
        accuracyScore: evaluation.accuracyScore ?? 4.0,
        conceptualClarity: evaluation.conceptualClarity ?? 'High',
        keywordsDetected: evaluation.keywordsDetected ?? [],
        discrepanciesFlagged: evaluation.discrepanciesFlagged ?? [],
        examinerCritique: evaluation.examinerCritique ?? 'Answer evaluated.',
        timestamp: new Date().toLocaleTimeString(),
      };

      const updatedHistory = [...vivaTurnsHistory, completedTurnRecord];
      setVivaTurnsHistory(updatedHistory);
      setLatestTurnFeedback(evaluation);

      // Check if finished (5 turns completed)
      if (response.isCompleted || currentTurnNumber >= 5) {
        // Finalize entire Viva
        const finalLedger = await finalizeVivaApi({
          studentProfile: student,
          practicalNo: practical.id,
          verificationDiagnostic: verification,
          vivaTurns: updatedHistory,
        });

        // Announce conclusion
        if (speechRef.current) {
          await speechRef.current.speakText(
            `Viva Voce defense complete. Generating official continuous assessment ledger.`
          );
        }

        onVivaComplete(finalLedger);
      } else if (response.nextQuestion) {
        const nxt = response.nextQuestion;
        setCurrentTurnNumber(nxt.turnNumber);
        setPhaseTitle(nxt.phaseTitle);
        setQuestionTheme(nxt.questionTheme);
        setExaminerQuestion(nxt.examinerQuestion);
        setExpectedKeyConcepts(nxt.expectedKeyConcepts || []);
        setStudentTranscript('');

        // Speak the new question
        if (speechRef.current) {
          speechRef.current.speakText(nxt.examinerQuestion);
        }
      }
    } catch (err: any) {
      console.error('Turn submission error:', err);
      alert(`Error evaluating answer: ${err.message || 'Please try again'}`);
    } finally {
      setIsEvaluatingTurn(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Chamber Header & Turn Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                <Radio className="w-3 h-3 text-rose-400" />
                Live Spoken Defense
              </span>
              <span className="text-xs text-slate-400">
                Turn {currentTurnNumber} of 5
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Autonomous Viva Voce Chamber
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Candidate: <span className="text-white font-medium">{student.fullName}</span> ({student.rollNo}) • Practical #{practical.id}: {practical.title}
            </p>
          </div>

          {/* 5-Turn Battery Pills */}
          <div className="flex items-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((num) => {
              const isPast = num < currentTurnNumber;
              const isCurrent = num === currentTurnNumber;
              return (
                <div
                  key={num}
                  className={`flex flex-col items-center justify-center w-10 h-11 rounded-lg border text-xs transition-all ${
                    isCurrent
                      ? 'bg-sky-600 border-sky-400 text-white font-bold shadow-lg shadow-sky-600/30 ring-2 ring-sky-500/40'
                      : isPast
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold">T{num}</span>
                  <span className="text-xs">
                    {isPast ? '✓' : num}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* State Indicator Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Examiner State */}
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
            isExaminerSpeaking
              ? 'bg-sky-950/40 border-sky-500 text-sky-200 shadow-md shadow-sky-500/10'
              : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isExaminerSpeaking ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[10px] uppercase tracking-wider font-semibold">Examiner Voice</span>
              <span className="text-xs font-medium text-white truncate block">
                {isExaminerSpeaking ? 'Speaking Question Aloud...' : 'Awaiting Student Defense'}
              </span>
            </div>
          </div>

          {/* Student Listening State */}
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
            isListening
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10'
              : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isListening ? 'bg-emerald-600 text-white pulse-recording' : 'bg-slate-800 text-slate-400'
            }`}>
              <Mic className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[10px] uppercase tracking-wider font-semibold">Microphone VAD</span>
              <span className="text-xs font-medium text-white truncate block">
                {isListening ? 'Active Listening (Capturing Speech)...' : 'Microphone Muted'}
              </span>
            </div>
          </div>

          {/* Silence Detector State */}
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
            silencePromptVisible
              ? 'bg-amber-950/40 border-amber-500 text-amber-200 animate-pulse'
              : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              silencePromptVisible ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[10px] uppercase tracking-wider font-semibold">Silence Detector (2.5s)</span>
              <span className="text-xs font-medium text-white truncate block">
                {silencePromptVisible ? 'Pause Detected: Completion Check' : 'Nominal Speech Cadence'}
              </span>
            </div>
          </div>
        </div>

        {/* Examiner Question Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
            <div>
              <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                {phaseTitle}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Theme: {questionTheme}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSpeakQuestionAgain}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                title="Re-read question using SpeechSynthesis"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Re-listen Question
              </button>
            </div>
          </div>

          {/* Question Text */}
          <p className="text-lg text-slate-100 font-medium leading-relaxed">
            "{examinerQuestion}"
          </p>

          {/* Expected Key Concepts Pill Tagging */}
          {expectedKeyConcepts && expectedKeyConcepts.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-900">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-sky-400" />
                Key Domain Invariants:
              </span>
              {expectedKeyConcepts.map((kw, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Audio Waveform Animation (When Examiner is Speaking) */}
          {isExaminerSpeaking && (
            <div className="absolute top-4 right-4 flex items-center gap-1 h-6">
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
            </div>
          )}
        </div>

        {/* Silence Detection Prompt Banner */}
        {silencePromptVisible && (
          <div className="bg-amber-950/50 border border-amber-500/50 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs text-amber-200">
                <p className="font-semibold text-amber-300">Silence Detected (&gt;2.5 seconds)</p>
                <p>Examiner prompt: <em>"Is that all you wanted to say? Have you completed your defense?"</em></p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSubmitAnswer}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                Yes, Lock & Submit
              </button>
              <button
                type="button"
                onClick={() => {
                  setSilencePromptVisible(false);
                  if (speechRef.current) speechRef.current.startListening(studentTranscript);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
              >
                Continue Speaking
              </button>
            </div>
          </div>
        )}

        {/* Student Voice Defense Input Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Student Verbal Defense (Real-time Speech-to-Text)
              </span>
              {isListening && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 animate-pulse">
                  MIC ACTIVE
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMic}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
                  isListening
                    ? 'bg-rose-950 border-rose-700 text-rose-300 hover:bg-rose-900'
                    : 'bg-emerald-950 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Mute Mic</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Start Speaking</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStudentTranscript('')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
                title="Clear transcript"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={studentTranscript}
              onChange={(e) => setStudentTranscript(e.target.value)}
              rows={5}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 leading-relaxed font-sans shadow-inner"
              placeholder="Speak your answer aloud into your microphone... Or type directly if in a noisy lab."
            />
            {isListening && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Listening live...</span>
              </div>
            )}
          </div>

          {audioFeedbackError && (
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {audioFeedbackError}
            </p>
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400">
              <span>{studentTranscript.split(/\s+/).filter(Boolean).length} words recorded</span>
              <span className="mx-2">•</span>
              <span>Manual text editing is fully supported</span>
            </div>

            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={isEvaluatingTurn || !studentTranscript.trim()}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isEvaluatingTurn ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Verbal Defense...</span>
                </>
              ) : (
                <>
                  <span>Lock & Submit Defense</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Latest Turn Feedback Box */}
      {latestTurnFeedback && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-fadeIn space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Examiner Assessment for Turn {currentTurnNumber - 1}
            </span>
            <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
              Score: {latestTurnFeedback.accuracyScore} / 5.0
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-sky-300">Critique:</strong> {latestTurnFeedback.examinerCritique}
          </p>
          {latestTurnFeedback.discrepanciesFlagged && latestTurnFeedback.discrepanciesFlagged.length > 0 && (
            <div className="p-2 rounded bg-amber-950/40 border border-amber-900 text-[11px] text-amber-300">
              <strong>Flagged Discrepancy:</strong> {latestTurnFeedback.discrepanciesFlagged.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Viva History Drawer */}
      {vivaTurnsHistory.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Viva Voce Transcript Log ({vivaTurnsHistory.length} turns completed)
          </h4>

          <div className="space-y-3">
            {vivaTurnsHistory.map((turn, i) => (
              <div key={i} className="bg-slate-900/70 border border-slate-800/80 rounded-lg p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-sky-300">{turn.phaseTitle}</span>
                  <span className="text-emerald-400 font-medium">Defense Score: {turn.accuracyScore} / 5</span>
                </div>
                <p className="text-slate-300"><strong className="text-slate-200">Q:</strong> "{turn.examinerQuestion}"</p>
                <p className="text-slate-400"><strong className="text-slate-300">A:</strong> "{turn.studentAnswer}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
