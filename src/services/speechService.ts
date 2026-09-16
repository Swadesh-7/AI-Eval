/**
 * Web Speech API Engine: Speech Synthesis (TTS) + Speech Recognition (STT) + Silence Detection (VAD)
 */

export interface SpeechServiceCallbacks {
  onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
  onExaminerSpeakingStart?: () => void;
  onExaminerSpeakingEnd?: () => void;
  onSilencePromptTriggered?: () => void;
  onError?: (errorMsg: string) => void;
  onStatusChange?: (status: 'idle' | 'speaking' | 'listening' | 'prompting_silence') => void;
}

export class WebSpeechController {
  private recognition: any = null;
  private isListening: boolean = false;
  private silenceTimer: any = null;
  private callbacks: SpeechServiceCallbacks = {};
  private currentTranscript: string = "";
  private silenceDetectionEnabled: boolean = true;
  private silenceTimeoutMs: number = 2600; // 2.5s pause detector

  constructor(callbacks: SpeechServiceCallbacks = {}) {
    this.callbacks = callbacks;
    this.initSpeechRecognition();
  }

  public setCallbacks(callbacks: SpeechServiceCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  private initSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser.");
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-IN"; // English (India) standard for Indian Autonomous engineering institutions, with fallback

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStatusChange?.('listening');
      };

      this.recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPiece + " ";
          } else {
            interim += transcriptPiece;
          }
        }

        if (final) {
          this.currentTranscript += final;
        }

        const fullText = (this.currentTranscript + " " + interim).trim();
        this.callbacks.onTranscriptUpdate?.(fullText, Boolean(final));

        // Reset silence detection timer whenever student speaks
        this.resetSilenceTimer();
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === "no-speech") {
          // Normal during pauses; do not throw fatal error
          return;
        }
        if (event.error === "aborted") {
          return;
        }
        console.warn("Speech recognition error:", event.error);
        this.callbacks.onError?.(`Mic alert: ${event.error}. You may type your response.`);
      };

      this.recognition.onend = () => {
        // If we still want to be listening, restart (handling browser auto-cutoff)
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            // Ignored
          }
        } else {
          this.callbacks.onStatusChange?.('idle');
        }
      };
    } catch (e) {
      console.warn("Failed to initialize speech recognition:", e);
    }
  }

  /**
   * Speaks text using SpeechSynthesis. Mutes recognition during speaking to avoid feedback loop.
   */
  public speakText(text: string): Promise<void> {
    return new Promise((resolve) => {
      this.stopListening();
      this.clearSilenceTimer();

      if (!('speechSynthesis' in window)) {
        console.warn("SpeechSynthesis not supported.");
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Clear academic pacing
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      // Select high quality English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))
      ) || voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utterance.voice = preferred;

      this.callbacks.onExaminerSpeakingStart?.();
      this.callbacks.onStatusChange?.('speaking');

      utterance.onend = () => {
        this.callbacks.onExaminerSpeakingEnd?.();
        this.callbacks.onStatusChange?.('idle');
        resolve();
      };

      utterance.onerror = () => {
        this.callbacks.onExaminerSpeakingEnd?.();
        this.callbacks.onStatusChange?.('idle');
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Starts listening with microphone.
   */
  public startListening(initialText: string = "") {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    this.currentTranscript = initialText;
    this.isListening = true;

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (err) {
        // Recognition might already be running
      }
    }

    this.callbacks.onStatusChange?.('listening');
    this.resetSilenceTimer();
  }

  public stopListening() {
    this.isListening = false;
    this.clearSilenceTimer();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
    }
    this.callbacks.onStatusChange?.('idle');
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.callbacks.onExaminerSpeakingEnd?.();
    this.callbacks.onStatusChange?.('idle');
  }

  private resetSilenceTimer() {
    if (!this.silenceDetectionEnabled || !this.isListening) return;

    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(() => {
      if (this.isListening && this.currentTranscript.trim().length > 10) {
        this.callbacks.onSilencePromptTriggered?.();
      }
    }, this.silenceTimeoutMs);
  }

  private clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  public setSilenceDetection(enabled: boolean) {
    this.silenceDetectionEnabled = enabled;
    if (!enabled) this.clearSilenceTimer();
  }

  public cleanup() {
    this.stopListening();
    this.stopSpeaking();
    this.clearSilenceTimer();
  }
}
