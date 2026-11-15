import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchTtsAudio } from '../services/api.js';

/**
 * High-Performance Audio Playback Queue with Prefetching,
 * ElevenLabs Audio Cache, and Web Speech API Fallback.
 */
export function useAudioQueue({ turns = [], onAllTurnsComplete = null }) {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);

  const audioCacheRef = useRef(new Map()); // turnIndex -> audioUrl or 'FALLBACK'
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
        audioCacheRef.current.set(index, 'FALLBACK');
      }
    } catch (e) {
      audioCacheRef.current.set(index, 'FALLBACK');
    }
  }, [turns]);

  // Clean up previous audio/timers
  const stopCurrentPlayback = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Web Speech API fallback synthesizer with distinct character pitches
  const speakWithWebSpeech = useCallback((speaker, text, onEnd) => {
    if (!window.speechSynthesis || isMuted) {
      // Fallback timer if speech synth unavailable or muted
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

    // Trigger prefetch for turn N+1 immediately!
    if (currentTurnIndex + 1 < turns.length) {
      prefetchTurnAudio(currentTurnIndex + 1);
    }

    let audioUrl = audioCacheRef.current.get(currentTurnIndex);
    if (!audioUrl) {
      // Fetch current turn if not already cached
      try {
        const result = await fetchTtsAudio({
          speaker: currentTurn.speaker,
          text: currentTurn.text,
        });
        if (!result.fallback && result.audioUrl) {
          audioUrl = result.audioUrl;
          audioCacheRef.current.set(currentTurnIndex, audioUrl);
        } else {
          audioUrl = 'FALLBACK';
          audioCacheRef.current.set(currentTurnIndex, 'FALLBACK');
        }
      } catch (e) {
        audioUrl = 'FALLBACK';
        audioCacheRef.current.set(currentTurnIndex, 'FALLBACK');
      }
    }

    // If real ElevenLabs audio is available and not muted
    if (audioUrl && audioUrl !== 'FALLBACK' && !isMuted) {
      try {
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        audio.onended = () => {
          if (isPlayingRef.current) advanceTurn();
        };
        audio.onerror = () => {
          speakWithWebSpeech(currentTurn.speaker, currentTurn.text, advanceTurn);
        };
        await audio.play();
      } catch (err) {
        speakWithWebSpeech(currentTurn.speaker, currentTurn.text, advanceTurn);
      }
    } else {
      // Use Web Speech API or timer fallback
      speakWithWebSpeech(currentTurn.speaker, currentTurn.text, advanceTurn);
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

  const startPlayback = () => setIsPlaying(true);
  const pausePlayback = () => {
    setIsPlaying(false);
    stopCurrentPlayback();
  };
  const togglePlayPause = () => (isPlaying ? pausePlayback() : startPlayback());

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
