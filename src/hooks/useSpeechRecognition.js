import { useState, useRef, useCallback } from 'react';
import { uploadSpeechToText } from '../services/api.js';

export function useSpeechRecognition({ onTranscript = null } = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = useCallback(() => {
    setError(null);

    // 1. Prefer native browser SpeechRecognition for instant live transcription
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);

        recognition.onresult = (event) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (onTranscript && text) {
            onTranscript(text);
          }
        };

        recognition.onerror = (e) => {
          console.warn('SpeechRecognition error:', e.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.warn('Could not start native SpeechRecognition, trying MediaRecorder', err);
      }
    }

    // 2. Fallback to MediaRecorder & backend ElevenLabs STT
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
              if (res.text && onTranscript) {
                onTranscript(res.text);
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
  }, [onTranscript]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
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
