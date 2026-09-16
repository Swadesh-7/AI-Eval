/**
 * frontend/js/app.js - State management, viva turn runner, submission handler, and report view
 */

import { verifySubmission, startViva, submitVivaTurn, finalizeViva } from './api.js';
import { AudioEngine } from './audio.js';

let currentStep = 1;
let studentData = {};
let verificationData = null;
let currentTurn = 1;
let vivaHistory = [];
let currentQuestionObj = null;
let audioEngine = null;

document.addEventListener('DOMContentLoaded', () => {
  audioEngine = new AudioEngine({
    onTranscript: (text) => {
      const transcriptEl = document.getElementById('live-transcript');
      if (transcriptEl) transcriptEl.value = text;
    },
    onSpeakingStart: () => {
      const statusEl = document.getElementById('examiner-status');
      if (statusEl) statusEl.innerText = 'Examiner Speaking...';
      const waveEl = document.getElementById('audio-waveform');
      if (waveEl) waveEl.style.display = 'flex';
    },
    onSpeakingEnd: () => {
      const statusEl = document.getElementById('examiner-status');
      if (statusEl) statusEl.innerText = 'Listening to Student...';
      const waveEl = document.getElementById('audio-waveform');
      if (waveEl) waveEl.style.display = 'none';
      // Automatically begin listening once examiner finishes speaking
      audioEngine.startListening();
    },
    onSilencePrompt: () => {
      const promptBanner = document.getElementById('silence-prompt-banner');
      if (promptBanner) promptBanner.classList.remove('hidden');
      audioEngine.speak('Is that all you wanted to say?');
    }
  });

  window.audioEngine = audioEngine;
});
