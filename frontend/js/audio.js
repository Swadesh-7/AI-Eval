/**
 * frontend/js/audio.js - Web Speech API engine (TTS + STT + VAD Silence Detection)
 */

export class AudioEngine {
  constructor(options = {}) {
    this.options = Object.assign({
      onTranscript: () => {},
      onSpeakingStart: () => {},
      onSpeakingEnd: () => {},
      onSilencePrompt: () => {},
      onError: () => {},
      silenceTimeout: 2600, // 2.5s pause detector
      lang: 'en-IN'
    }, options);

    this.recognition = null;
    this.isListening = false;
    this.silenceTimer = null;
    this.accumulatedTranscript = '';
    
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not available in this browser environment.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.options.lang;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        this.accumulatedTranscript += final;
      }

      const current = (this.accumulatedTranscript + ' ' + interim).trim();
      this.options.onTranscript(current, Boolean(final));
      this.resetSilenceTimer();
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }
      console.warn('Audio recognition error:', event.error);
      this.options.onError(event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch (e) {
          // Ignored
        }
      }
    };
  }

  speak(text) {
    return new Promise((resolve) => {
      this.stopListening();
      this.clearSilenceTimer();

      if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) || voices[0];
      if (preferred) utterance.voice = preferred;

      this.options.onSpeakingStart();

      utterance.onend = () => {
        this.options.onSpeakingEnd();
        resolve();
      };

      utterance.onerror = () => {
        this.options.onSpeakingEnd();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  startListening(initialText = '') {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    this.accumulatedTranscript = initialText;
    this.isListening = true;

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        // May already be started
      }
    }
    this.resetSilenceTimer();
  }

  stopListening() {
    this.isListening = false;
    this.clearSilenceTimer();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
    }
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.options.onSpeakingEnd();
  }

  resetSilenceTimer() {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(() => {
      if (this.isListening && this.accumulatedTranscript.trim().length > 10) {
        this.options.onSilencePrompt();
      }
    }, this.options.silenceTimeout);
  }

  clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }
}
