/**
 * Frontend API Service for communicating with the Council of Olympus backend.
 */

export async function getHealthStatus() {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function getLogs() {
  const res = await fetch('/api/logs');
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function getDemoData() {
  const res = await fetch('/api/demo');
  if (!res.ok) throw new Error('Failed to fetch demo data');
  return res.json();
}

export async function postIntake({ dilemma, conversation, customApiKey }) {
  const res = await fetch('/api/intake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dilemma, conversation, customApiKey }),
  });
  if (!res.ok) throw new Error(`Intake failed: ${res.statusText}`);
  return res.json();
}

export async function postDebate({
  dilemma,
  answers,
  interjection,
  debateSoFar,
  customApiKey,
}) {
  const res = await fetch('/api/debate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dilemma,
      answers,
      interjection,
      debateSoFar,
      customApiKey,
    }),
  });
  if (!res.ok) throw new Error(`Debate failed: ${res.statusText}`);
  return res.json();
}

export async function postVerdict({
  dilemma,
  answers,
  turns,
  interjections,
  customApiKey,
}) {
  const res = await fetch('/api/verdict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dilemma,
      answers,
      turns,
      interjections,
      customApiKey,
    }),
  });
  if (!res.ok) throw new Error(`Verdict failed: ${res.statusText}`);
  return res.json();
}

export async function postChallengeBluff({
  speaker,
  stance,
  argument,
  dilemma,
  customApiKey,
}) {
  const res = await fetch('/api/bluff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      speaker,
      stance,
      argument,
      dilemma,
      customApiKey,
    }),
  });
  if (!res.ok) throw new Error(`Challenge failed: ${res.statusText}`);
  return res.json();
}

export async function fetchTtsAudio({ speaker, text, customApiKey }) {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speaker, text, customApiKey }),
  });

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('audio/mpeg') || contentType.includes('audio')) {
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return { audioUrl: url, fallback: false };
  } else {
    // Received JSON fallback indicator
    const data = await res.json();
    return { audioUrl: null, fallback: true, reason: data.reason };
  }
}

export async function updateSettings(settings) {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function uploadSpeechToText(audioBlob) {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  const res = await fetch('/api/stt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64: base64, mimeType: audioBlob.type }),
  });

  if (!res.ok) return { text: '', fallback: true };
  return res.json();
}
