import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  getIntakeQuestion,
  generateDebate,
  generateVerdict,
  callGodBluff,
  serverLogs,
  logEvent,
} from './gemini.js';
import {
  textToSpeech,
  speechToText,
  CHARACTER_VOICES,
} from './elevenlabs.js';
import { DEMO_DILEMMA, ALTERNATE_DEMO_DILEMMAS } from './demoData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Request logging middleware
app.use((req, res, next) => {
  if (req.path !== '/api/logs' && req.path !== '/api/health') {
    logEvent('INFO', 'HTTP', `${req.method} ${req.path}`);
  }
  next();
});

/**
 * Health & Configuration Check
 */
app.get('/api/health', (req, res) => {
  const cacheDir = path.resolve(__dirname, '..', process.env.AUDIO_CACHE_DIR || '.cache/audio');
  let cachedFilesCount = 0;
  if (fs.existsSync(cacheDir)) {
    cachedFilesCount = fs.readdirSync(cacheDir).filter((f) => f.endsWith('.mp3')).length;
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY),
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    },
    elevenlabs: {
      configured: Boolean(process.env.ELEVENLABS_API_KEY),
      model: process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2_5',
      voices: CHARACTER_VOICES,
    },
    cache: {
      cachedAudioFiles: cachedFilesCount,
    },
    version: '1.0.0-hackuta2026',
  });
});

/**
 * Real-time Server Logs Endpoint
 */
app.get('/api/logs', (req, res) => {
  res.json({ logs: serverLogs });
});

/**
 * Canned Demo Dilemma & Alternates
 */
app.get('/api/demo', (req, res) => {
  logEvent('INFO', 'DEMO', 'Delivered pre-computed demo dilemma package');
  res.json({
    demo: DEMO_DILEMMA,
    alternates: ALTERNATE_DEMO_DILEMMAS,
  });
});

/**
 * INTAKE: Oracle Follow-up Questions
 */
app.post('/api/intake', async (req, res) => {
  try {
    const { dilemma, conversation = [], customApiKey } = req.body;
    if (!dilemma || typeof dilemma !== 'string') {
      return res.status(400).json({ error: 'dilemma string is required' });
    }

    const result = await getIntakeQuestion({
      dilemma,
      conversation,
      customApiKey,
    });

    res.json(result);
  } catch (err) {
    logEvent('ERROR', 'INTAKE', `Intake handler error: ${err.message}`);
    res.status(500).json({
      error: 'Failed to process intake',
      details: err.message,
      ready: true,
      next_question: null,
    });
  }
});

/**
 * DEBATE: Three-Gods Olympian Debate Turns
 */
app.post('/api/debate', async (req, res) => {
  try {
    const {
      dilemma,
      answers = [],
      interjection = null,
      debateSoFar = [],
      customApiKey,
    } = req.body;

    if (!dilemma) {
      return res.status(400).json({ error: 'dilemma is required' });
    }

    const debateResult = await generateDebate({
      dilemma,
      answers,
      interjection,
      debateSoFar,
      customApiKey,
    });

    res.json(debateResult);
  } catch (err) {
    logEvent('ERROR', 'DEBATE', `Debate handler error: ${err.message}`);
    // Safe graceful degradation
    res.json({
      turns: DEMO_DILEMMA.turns,
      debate_dynamic: 'Athena, Poseidon, and Hermes dispute the mortal course.',
      fallback: true,
    });
  }
});

/**
 * VERDICT: Odysseus Final Synthesis & Action Steps
 */
app.post('/api/verdict', async (req, res) => {
  try {
    const {
      dilemma,
      answers = [],
      turns = [],
      interjections = [],
      customApiKey,
    } = req.body;

    if (!dilemma) {
      return res.status(400).json({ error: 'dilemma is required' });
    }

    const verdictResult = await generateVerdict({
      dilemma,
      answers,
      turns,
      interjections,
      customApiKey,
    });

    res.json(verdictResult);
  } catch (err) {
    logEvent('ERROR', 'VERDICT', `Verdict handler error: ${err.message}`);
    res.json(DEMO_DILEMMA.verdict);
  }
});

/**
 * BLUFF: Challenge God's Argument
 */
app.post('/api/bluff', async (req, res) => {
  try {
    const { speaker, stance, argument, dilemma, customApiKey } = req.body;
    const rebuttal = await callGodBluff({
      speaker: speaker || 'poseidon',
      stance,
      argument,
      dilemma,
      customApiKey,
    });
    res.json(rebuttal);
  } catch (err) {
    logEvent('ERROR', 'BLUFF', `Bluff handler error: ${err.message}`);
    res.json({
      speaker: req.body.speaker || 'poseidon',
      text: 'You may test my patience, mortal, but you cannot outrun the squall.',
      stance: 'against',
    });
  }
});

/**
 * TTS: Voice Synthesis with Audio Stream or Cache
 */
app.post('/api/tts', async (req, res) => {
  try {
    const { speaker, text, customVoiceId, customApiKey } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const ttsResult = await textToSpeech({
      speaker: speaker || 'hermes',
      text,
      customVoiceId,
      customApiKey,
    });

    if (ttsResult.fallback || !ttsResult.audioBuffer) {
      return res.json({
        fallback: true,
        reason: ttsResult.reason || 'NO_AUDIO_BUFFER',
        speaker: ttsResult.speaker,
        text: ttsResult.text,
      });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': ttsResult.audioBuffer.length,
      'X-Audio-Cached': String(ttsResult.cached),
      'X-Audio-Hash': ttsResult.hash,
    });

    res.send(ttsResult.audioBuffer);
  } catch (err) {
    logEvent('ERROR', 'TTS', `TTS route error: ${err.message}`);
    res.json({
      fallback: true,
      reason: err.message,
      speaker: req.body.speaker || 'hermes',
      text: req.body.text || '',
    });
  }
});

/**
 * STT: Speech to Text Upload
 */
app.post('/api/stt', async (req, res) => {
  try {
    const { audioBase64, mimeType, customApiKey } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 required' });
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const result = await speechToText({
      audioBuffer,
      mimeType: mimeType || 'audio/webm',
      customApiKey,
    });

    res.json(result);
  } catch (err) {
    logEvent('ERROR', 'STT', `STT route error: ${err.message}`);
    res.json({ text: '', fallback: true });
  }
});

/**
 * Session Settings / Key Update
 */
app.post('/api/settings', (req, res) => {
  const { geminiApiKey, elevenLabsApiKey } = req.body;
  if (geminiApiKey) process.env.GEMINI_API_KEY = geminiApiKey.trim();
  if (elevenLabsApiKey) process.env.ELEVENLABS_API_KEY = elevenLabsApiKey.trim();

  logEvent('INFO', 'SETTINGS', 'Updated runtime API keys');
  res.json({
    success: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY),
  });
});

// Serve frontend in production build if present
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    // If request starts with /api, pass to 404 handler, otherwise serve index.html
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logEvent('SUCCESS', 'SERVER', `Council of Olympus API listening on http://localhost:${PORT}`);
    console.log(`⚡ Council of Olympus running on http://localhost:${PORT}`);
  });
}

export default app;
