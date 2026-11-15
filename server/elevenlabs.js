/**
 * ElevenLabs High-Performance TTS and STT Service with SHA-256 Audio Caching
 * and Instant Fallback for Hackathon Demos.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { logEvent } from './gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, '..', process.env.AUDIO_CACHE_DIR || '.cache/audio');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Character voice IDs
export const CHARACTER_VOICES = {
  athena: process.env.ELEVENLABS_VOICE_ATHENA || '21m00Tcm4TlvDq8ikWAM',
  poseidon: process.env.ELEVENLABS_VOICE_POSEIDON || 'VR6AewLTigWG4xSOukaG',
  hermes: process.env.ELEVENLABS_VOICE_HERMES || 'ErXwobaYiN019PkySvjV',
  odysseus: process.env.ELEVENLABS_VOICE_ODYSSEUS || 'pqHfZKP75CvOlQylNhV4',
  oracle: process.env.ELEVENLABS_VOICE_ORACLE || 'MF3mGyEYCl7XYWbV9V6O',
};

// Adaptive voice settings per persona to give human-like pacing and dynamic inflections
export const VOICE_SETTINGS_BY_CHARACTER = {
  athena: {
    stability: 0.44, // Moderate stability for clear, intellectual, and deliberate rhythm
    similarity_boost: 0.80,
    style: 0.35,
    use_speaker_boost: true,
  },
  poseidon: {
    stability: 0.28, // Low stability allows dramatic cadence shifts, gravel, and raw emotion
    similarity_boost: 0.78,
    style: 0.58, // High style for booming, textured human presence
    use_speaker_boost: true,
  },
  hermes: {
    stability: 0.32, // Low stability for fast, dynamic, agile conversational pacing
    similarity_boost: 0.75,
    style: 0.46,
    use_speaker_boost: true,
  },
  odysseus: {
    stability: 0.50, // Measured, authoritative, seasoned cadence
    similarity_boost: 0.80,
    style: 0.30,
    use_speaker_boost: true,
  },
  oracle: {
    stability: 0.46,
    similarity_boost: 0.80,
    style: 0.25,
    use_speaker_boost: true,
  },
};

/**
 * Generates deterministic cache key for (voiceId + text).
 */
export function getAudioHash(voiceId, text) {
  const normalized = `${voiceId}:${text.trim().toLowerCase()}`;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Text-to-Speech via ElevenLabs with local audio disk caching.
 */
export async function textToSpeech({
  speaker = 'hermes',
  text,
  customVoiceId = null,
  customApiKey = null,
}) {
  const apiKey = customApiKey || process.env.ELEVENLABS_API_KEY;
  const voiceId = customVoiceId || CHARACTER_VOICES[speaker.toLowerCase()] || CHARACTER_VOICES.hermes;
  const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2_5';

  if (!text || text.trim().length === 0) {
    throw new Error('Text is required for TTS');
  }

  const hash = getAudioHash(voiceId, text);
  const cachedFilePath = path.join(CACHE_DIR, `${hash}.mp3`);

  // 1. Check local disk cache
  if (fs.existsSync(cachedFilePath)) {
    logEvent('SUCCESS', 'ELEVENLABS', `Cache HIT for [${speaker}] (${hash.slice(0, 8)})`);
    const audioBuffer = fs.readFileSync(cachedFilePath);
    return {
      audioBuffer,
      contentType: 'audio/mpeg',
      cached: true,
      hash,
    };
  }

  // 2. If no API key, return fallback indicator
  if (!apiKey) {
    logEvent('INFO', 'ELEVENLABS', `No ELEVENLABS_API_KEY set; requesting client Web Speech fallback for [${speaker}]`);
    return {
      audioBuffer: null,
      fallback: true,
      reason: 'NO_API_KEY',
      speaker,
      text,
    };
  }

  // 3. Dispatch to ElevenLabs REST API
  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const startTime = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    logEvent('INFO', 'ELEVENLABS', `Calling TTS for [${speaker}] using model ${modelId}`);

    const speakerKey = speaker?.toLowerCase() || 'hermes';
    const characterVoiceSettings = VOICE_SETTINGS_BY_CHARACTER[speakerKey] || VOICE_SETTINGS_BY_CHARACTER.hermes;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: characterVoiceSettings,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const latency = Date.now() - startTime;

    if (!response.ok) {
      const errText = await response.text();
      logEvent('ERROR', 'ELEVENLABS', `TTS HTTP ${response.status}: ${errText.slice(0, 120)}`);
      return {
        audioBuffer: null,
        fallback: true,
        reason: `HTTP_${response.status}`,
        speaker,
        text,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    // Save to disk cache for future instant replay
    try {
      fs.writeFileSync(cachedFilePath, audioBuffer);
      logEvent('SUCCESS', 'ELEVENLABS', `TTS rendered & cached in ${latency}ms (${(audioBuffer.length / 1024).toFixed(1)} KB)`);
    } catch (saveErr) {
      logEvent('WARN', 'ELEVENLABS', `Failed to write cache file: ${saveErr.message}`);
    }

    return {
      audioBuffer,
      contentType: 'audio/mpeg',
      cached: false,
      hash,
    };
  } catch (err) {
    clearTimeout(timeout);
    logEvent('WARN', 'ELEVENLABS', `TTS call failed (${err.message}); smoothly falling back to client synthesis`);
    return {
      audioBuffer: null,
      fallback: true,
      reason: err.message,
      speaker,
      text,
    };
  }
}

/**
 * Speech-to-Text via ElevenLabs Scribe API or fallback transcription.
 */
export async function speechToText({ audioBuffer, mimeType = 'audio/webm', customApiKey = null }) {
  const apiKey = customApiKey || process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    logEvent('INFO', 'ELEVENLABS_STT', 'No ElevenLabs API key; relying on browser Web Speech API');
    return { text: '', fallback: true };
  }

  try {
    logEvent('INFO', 'ELEVENLABS_STT', 'Transcribing audio via ElevenLabs Speech-to-Text...');
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: mimeType });
    formData.append('file', blob, 'audio.webm');
    formData.append('model_id', 'scribe_v1');

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logEvent('WARN', 'ELEVENLABS_STT', `STT failed: ${errorText.slice(0, 100)}`);
      return { text: '', fallback: true };
    }

    const data = await response.json();
    logEvent('SUCCESS', 'ELEVENLABS_STT', `Transcribed: "${data.text?.slice(0, 60)}..."`);
    return { text: data.text || '', fallback: false };
  } catch (err) {
    logEvent('WARN', 'ELEVENLABS_STT', `STT exception: ${err.message}`);
    return { text: '', fallback: true };
  }
}
