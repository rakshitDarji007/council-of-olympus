import { useState, useRef, useCallback, useEffect } from 'react';
import { uploadSpeechToText } from '../services/api.js';

export function useSpeechRecognition({
  onTranscript = null,
  onSpeechEnd = null,
} = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const onTranscriptRef = useRef(onTranscript);
  const onSpeechEndRef = useRef(onSpeechEnd);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    onSpeechEndRef.current = onSpeechEnd;
  }, [onSpeechEnd]);

  const startRecording = useCallback(() => {
    setError(null);

    // 1. Prefer native browser SpeechRecognition for instant live transcription
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (onTranscriptRef.current && text) {
            onTranscriptRef.current(text);
          }
        };

        recognition.onerror = (e) => {
          console.warn('SpeechRecognition error:', e.error);
          if (e.error === 'not-allowed') {
            setError('Microphone permission denied.');
          }
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (onSpeechEndRef.current) {
            onSpeechEndRef.current();
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.warn('Could not start native SpeechRecognition, trying MediaRecorder', err);
      }
    }

    // 2. Fallback to MediaRecorder & backend ElevenLabs STT
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          audioChunksRef.current = [];

          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
          };

          recorder.onstop = async () => {
            setIsRecording(false);
            const audioBlob = new Blob(audioChunksRef.current, {
              type: recorder.mimeType || 'audio/webm',
            });
            stream.getTracks().forEach((track) => track.stop());

            try {
              const res = await uploadSpeechToText(audioBlob);
              if (res.text && onTranscriptRef.current) {
                onTranscriptRef.current(res.text);
              }
              if (res.text && onSpeechEndRef.current) {
                onSpeechEndRef.current(res.text);
              }
            } catch (err) {
              console.error('STT upload error', err);
            }
          };

          mediaRecorderRef.current = recorder;
          recorder.start();
          setIsRecording(true);
        })
        .catch((err) => {
          setError('Microphone access denied or unavailable.');
          setIsRecording(false);
        });
    } else {
      setError('Speech recording is not supported in this browser.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
  };
}
