/* ==========================================================================
   INTELLOOP — BROWSER-NATIVE VOICE INPUT MODULE (Web Speech API)
   Zero external dependencies, graceful fallback, en-IN default support
   ========================================================================== */

import { toast } from '../components/toast.js';

let activeRecognition = null;
let currentActiveButton = null;

export function initVoiceInput({ buttonEl, inputEl, lang = 'en-IN' }) {
  if (!buttonEl || !inputEl) return null;

  // Check browser support for Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const originalHtml = buttonEl.innerHTML;
  let isListening = false;
  let basePromptText = '';

  const stopListening = () => {
    if (activeRecognition) {
      try {
        activeRecognition.stop();
      } catch (e) {
        try { activeRecognition.abort(); } catch (_) {}
      }
      activeRecognition = null;
    }
    isListening = false;
    currentActiveButton = null;
    
    // Restore button appearance cleanly
    buttonEl.innerHTML = originalHtml;
    buttonEl.classList.remove(
      'text-rose-400', 'bg-rose-500/15', 'border-rose-500/40', 
      'shadow-[0_0_15px_rgba(244,63,94,0.4)]', 'scale-[1.03]'
    );
    buttonEl.title = 'Voice dictation';
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      toast.show('Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or a Web Speech compatible browser.', 'warning');
      return;
    }

    // Stop any existing session
    if (activeRecognition) {
      stopListening();
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang; // Defaults to Indian English en-IN

      basePromptText = inputEl.value ? inputEl.value.trim() : '';

      recognition.onstart = () => {
        isListening = true;
        activeRecognition = recognition;
        currentActiveButton = buttonEl;

        // Visual active listening state (preserving existing button geometry and dark theme)
        buttonEl.innerHTML = `
          <span class="material-symbols-outlined text-[16px] text-rose-400 animate-pulse">mic</span>
          <span class="text-rose-400 font-bold">Listening...</span>
        `;
        buttonEl.classList.add(
          'text-rose-400', 'bg-rose-500/15', 'border-rose-500/40', 
          'shadow-[0_0_15px_rgba(244,63,94,0.4)]', 'scale-[1.03]'
        );
        buttonEl.title = 'Click to stop voice dictation';

        toast.show('Microphone active. Speak your research objective...', 'info');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const speechChunk = (finalTranscript || interimTranscript).trim();
        if (speechChunk) {
          if (basePromptText) {
            inputEl.value = `${basePromptText} ${speechChunk}`;
          } else {
            inputEl.value = speechChunk;
          }
          // Dispatch input event so any character count/listeners react
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          toast.show('Microphone access denied. Please grant microphone permission in your browser.', 'error');
        } else if (event.error === 'no-speech') {
          toast.show('No speech detected. Please speak closer to your microphone.', 'warning');
        } else if (event.error === 'network') {
          toast.show('Speech recognition network error. Please check your internet connection.', 'error');
        } else if (event.error !== 'aborted') {
          toast.show(`Voice input notice: ${event.error}`, 'warning');
        }
        stopListening();
      };

      recognition.onend = () => {
        if (isListening) {
          stopListening();
          if (inputEl.value.trim()) {
            toast.show('Voice input transcribed successfully!', 'success');
          }
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      toast.show('Could not start microphone. Please check browser permissions.', 'error');
      stopListening();
    }
  };

  buttonEl.onclick = (e) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
      toast.show('Voice recording stopped.', 'info');
    } else {
      startListening();
    }
  };

  return {
    stop: stopListening
  };
}

// Global cleanup helper for route changes or mission starts
export function stopActiveVoiceRecognition() {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch (e) {
      try { activeRecognition.abort(); } catch (_) {}
    }
    activeRecognition = null;
  }
}

// Automatically bind window navigation cleanup
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', stopActiveVoiceRecognition);
}
