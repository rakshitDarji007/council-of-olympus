import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchTtsAudio } from '../services/api.js';

/**
 * Unlocks browser audio playback context on user interaction.
 */
export function unlockAudio() {
  if (typeof window === 'undefined') return;
  try {
    const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
    silent.play().catch(() => {});
  } catch (e) {}
}

/**
 * High-Performance Audio Playback Queue with Prefetching,
 * ElevenLabs Audio Cache, and Web Speech API Fallback.
 */
export function useAudioQueue({ turns = [], onAllTurnsComplete = null }) {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioCacheRef = useRef(new Map()); // turnIndex -> audioUrl string
  const currentAudioRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentTurn = turns[currentTurnIndex] || null;

  // Prefetch audio for turn at index
  const prefetchTurnAudio = useCallback(async (index) => {
    if (index >= turns.length || index < 0) return;
    if (audioCacheRef.current.has(index)) return;

    const turn = turns[index];
    if (!turn || !turn.text) return;

    try {
      const result = await fetchTtsAudio({
        speaker: turn.speaker,
        text: turn.text,
      });

      if (!result.fallback && result.audioUrl) {
        audioCacheRef.current.set(index, result.audioUrl);
      } else {
        const directUrl = `/api/tts?speaker=${encodeURIComponent(turn.speaker)}&text=${encodeURIComponent(turn.text)}`;
        audioCacheRef.current.set(index, directUrl);
      }
    } catch (e) {
      const directUrl = `/api/tts?speaker=${encodeURIComponent(turn.speaker)}&text=${encodeURIComponent(turn.text)}`;
      audioCacheRef.current.set(index, directUrl);
    }
  }, [turns]);

  // Clean up previous audio/timers
  const stopCurrentPlayback = useCallback(() => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {}
      currentAudioRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Web Speech API fallback synthesizer with distinct character pitches
  const speakWithWebSpeech = useCallback((speaker, text, onEnd) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) {
      const wordCount = (text || '').split(' ').length;
      const durationMs = Math.max(3500, wordCount * 280);
      fallbackTimerRef.current = setTimeout(onEnd, durationMs);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const normalized = speaker?.toLowerCase();
      if (normalized === 'poseidon') {
        utterance.pitch = 0.65;
        utterance.rate = 0.9;
      } else if (normalized === 'athena') {
        utterance.pitch = 1.15;
        utterance.rate = 0.98;
      } else if (normalized === 'hermes') {
        utterance.pitch = 1.25;
        utterance.rate = 1.15;
      } else {
        utterance.pitch = 0.85;
        utterance.rate = 0.95;
      }

      utterance.onend = onEnd;
      utterance.onerror = onEnd;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      const durationMs = Math.max(3500, (text || '').split(' ').length * 280);
      fallbackTimerRef.current = setTimeout(onEnd, durationMs);
    }
  }, [isMuted]);

  // Advance turn helper
  const advanceTurn = useCallback(() => {
    stopCurrentPlayback();
    if (currentTurnIndex < turns.length - 1) {
      setCurrentTurnIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      if (onAllTurnsComplete) onAllTurnsComplete();
    }
  }, [currentTurnIndex, turns.length, onAllTurnsComplete, stopCurrentPlayback]);

  // Play current turn
  const playCurrentTurn = useCallback(async () => {
    stopCurrentPlayback();
    if (!isPlayingRef.current || !currentTurn) return;

    // Trigger prefetch for turn N+1 immediately
    if (currentTurnIndex + 1 < turns.length) {
      prefetchTurnAudio(currentTurnIndex + 1);
    }

    let audioUrl = audioCacheRef.current.get(currentTurnIndex);
    if (!audioUrl) {
      try {
        const result = await fetchTtsAudio({
          speaker: currentTurn.speaker,
          text: currentTurn.text,
        });
        if (!result.fallback && result.audioUrl) {
          audioUrl = result.audioUrl;
          audioCacheRef.current.set(currentTurnIndex, audioUrl);
        } else {
          const directUrl = `/api/tts?speaker=${encodeURIComponent(currentTurn.speaker)}&text=${encodeURIComponent(currentTurn.text)}`;
          audioUrl = directUrl;
          audioCacheRef.current.set(currentTurnIndex, directUrl);
        }
      } catch (e) {
        const directUrl = `/api/tts?speaker=${encodeURIComponent(currentTurn.speaker)}&text=${encodeURIComponent(currentTurn.text)}`;
        audioUrl = directUrl;
        audioCacheRef.current.set(currentTurnIndex, audioUrl);
      }
    }

    // Play ElevenLabs audio
    if (audioUrl && !isMuted) {
      try {
        const audio = new Audio(audioUrl);
        audio.volume = 1.0;
        currentAudioRef.current = audio;

        audio.onended = () => {
          if (isPlayingRef.current) advanceTurn();
        };

        audio.onerror = (e) => {
          console.warn('[AudioQueue] Audio element error, falling back to Web Speech API', e);
          speakWithWebSpeech(currentTurn.speaker, currentTurn.text, advanceTurn);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (err) {
        console.warn('[AudioQueue] Autoplay prevented by browser:', err.message);
        // Pause and keep turn ready so user can click Play with active gesture
        setIsPlaying(false);
      }
    } else if (isMuted) {
      const wordCount = (currentTurn.text || '').split(' ').length;
      const durationMs = Math.max(3500, wordCount * 260);
      fallbackTimerRef.current = setTimeout(advanceTurn, durationMs);
    }
  }, [currentTurn, currentTurnIndex, turns.length, isMuted, prefetchTurnAudio, speakWithWebSpeech, advanceTurn, stopCurrentPlayback]);

  // Effect when currentTurnIndex or isPlaying changes
  useEffect(() => {
    if (isPlaying && turns.length > 0) {
      playCurrentTurn();
    } else {
      stopCurrentPlayback();
    }
  }, [currentTurnIndex, isPlaying, turns.length, playCurrentTurn, stopCurrentPlayback]);

  // Initial prefetch for turn 0 and 1 when turns are loaded
  useEffect(() => {
    if (turns.length > 0) {
      prefetchTurnAudio(0);
      if (turns.length > 1) prefetchTurnAudio(1);
    }
  }, [turns, prefetchTurnAudio]);

  const startPlayback = () => {
    unlockAudio();
    setIsPlaying(true);
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    stopCurrentPlayback();
  };

  const togglePlayPause = () => {
    unlockAudio();
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const skipNext = () => {
    stopCurrentPlayback();
    if (currentTurnIndex < turns.length - 1) {
      setCurrentTurnIndex((prev) => prev + 1);
    } else if (onAllTurnsComplete) {
      onAllTurnsComplete();
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next && currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      return next;
    });
  };

  const resetQueue = () => {
    stopCurrentPlayback();
    setCurrentTurnIndex(0);
    setIsPlaying(false);
    audioCacheRef.current.clear();
  };

  return {
    currentTurnIndex,
    currentTurn,
    isPlaying,
    isMuted,
    startPlayback,
    pausePlayback,
    togglePlayPause,
    skipNext,
    toggleMute,
    resetQueue,
    setCurrentTurnIndex,
  };
}
