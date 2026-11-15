import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../index.js';
import { getAudioHash } from '../elevenlabs.js';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /api/health returns system status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.ok('gemini' in data);
  assert.ok('elevenlabs' in data);
  assert.ok('cache' in data);
});

test('GET /api/demo returns demo dilemma and alternatives', async () => {
  const res = await fetch(`${baseUrl}/api/demo`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.demo);
  assert.equal(data.demo.turns.length, 6);
  assert.ok(data.demo.verdict);
  assert.ok(Array.isArray(data.alternates));
});

test('POST /api/intake returns follow-up question or ready state', async () => {
  const res = await fetch(`${baseUrl}/api/intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dilemma: 'Should I change my career from medicine to visual arts?',
      conversation: [],
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok('ready' in data);
  assert.ok('question_number' in data);
});

test('POST /api/intake triggers safety override on crisis input', async () => {
  const res = await fetch(`${baseUrl}/api/intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dilemma: 'I feel completely overwhelmed and want to end my life',
      conversation: [],
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.is_emergency, true);
  assert.ok(data.emergency_message.includes('988'));
});

test('POST /api/debate returns structured turns for Athena, Poseidon, Hermes', async () => {
  const res = await fetch(`${baseUrl}/api/debate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dilemma: 'Should I change my major from Computer Science to Philosophy?',
      answers: [{ question: 'What is pulling you?', answer: 'Love for ethics' }],
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.turns));
  assert.ok(data.turns.length >= 6);
  const speakers = data.turns.map((t) => t.speaker);
  assert.ok(speakers.includes('athena'));
  assert.ok(speakers.includes('poseidon'));
  assert.ok(speakers.includes('hermes'));
});

test('POST /api/verdict returns Odysseus recommendation with confidence and steps', async () => {
  const res = await fetch(`${baseUrl}/api/verdict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dilemma: 'Should I take the startup offer?',
      answers: [],
      turns: [
        { speaker: 'athena', text: 'Build mastery.', stance: 'for' },
        { speaker: 'poseidon', text: 'Beware debt.', stance: 'against' },
      ],
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.recommendation);
  assert.ok(['low', 'medium', 'high'].includes(data.confidence));
  assert.ok(Array.isArray(data.next_steps));
  assert.ok(data.summary_by_god);
});

test('POST /api/bluff returns god defense', async () => {
  const res = await fetch(`${baseUrl}/api/bluff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      speaker: 'poseidon',
      stance: 'against',
      argument: 'You will drown in debt',
      dilemma: 'Starting an indie company',
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.speaker, 'poseidon');
  assert.ok(data.text);
});

test('POST /api/tts handles missing key gracefully with fallback flag', async () => {
  const res = await fetch(`${baseUrl}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      speaker: 'hermes',
      text: 'Take one class first before burning your ship!',
    }),
  });
  assert.equal(res.status, 200);
  // Without ELEVENLABS_API_KEY, should return fallback JSON
  const data = await res.json();
  assert.ok(data.fallback === true || res.headers.get('content-type')?.includes('audio'));
});

test('Deterministic audio hash helper works as expected', () => {
  const hash1 = getAudioHash('voice123', 'Hello world');
  const hash2 = getAudioHash('voice123', 'hello world ');
  assert.equal(hash1, hash2);
});

test('GET /api/logs returns chronological server events', async () => {
  const res = await fetch(`${baseUrl}/api/logs`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.logs));
  assert.ok(data.logs.length > 0);
});

test('GET / serves production HTML entrypoint', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes('The Council of Olympus'));
  assert.ok(html.includes('root'));
});
