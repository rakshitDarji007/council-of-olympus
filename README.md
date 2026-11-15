# 🏛️ The Council of Olympus
### Homeric Decision Engine | HackUTA 2026

> *"Everyone has faced a crossroads they could not navigate alone. We gave it to the gods of Olympus."*

Built for **HackUTA 2026** targeting:
- 🏆 **Main Track** (Judged on *Robustness*, *Odyssey Theme*, and *Creativity*)
- ⚡ **MLH Best Use of Gemini API** (Flash Structured Output schema, strict prompt engineering, safety overrides, heuristic fallbacks)
- 🎙️ **MLH Best Use of ElevenLabs** (Distinct character voice casting, low-latency streaming models, SHA-256 disk audio caching, Speech-to-Text)

---

## 🌟 The Product & Concept

A mortal brings a real, difficult life dilemma before the Council of Olympus (e.g., *"Should I change my major from Computer Science to Philosophy?"*).

1. **The Delphic Intake**:
   - The Oracle of Delphi asks 2 to 4 empathetic, focused follow-up questions one by one (examining pull factors, financial anchors, sunk costs, and ripple effects).
   - If the user provides rich context or wishes to proceed immediately, they can enter the council chamber anytime.
   - Built-in speech-to-text mic input allows speaking questions and answers out loud.
2. **The Olympian Debate**:
   - Three gods debate across 2 rounds (~6 turns total), with snappy dialogue under 40 words per turn:
     - **ATHENA** (Wisdom & Long-term Strategy): 5-10 year mastery horizon, disciplined fate, calm and stern.
     - **POSEIDON** (Storms, Risk & Consequence): The sea god with a bitter grudge against reckless wanderers; warns of financial debt, wreckage, and loss aversion.
     - **HERMES** (Wayfinder & Trickster): The agile pragmatist who seeks low-risk experiments, loopholes, and middle paths ("audit a course, test the winds before burning the ship").
   - Each turn is a direct rebuttal referencing the previous god by name and grounded in the mortal's real facts.
3. **Mortal Interjection ("Speak, mortal")**:
   - At any time during the debate, the mortal can interject to add new constraints or challenge a specific god.
   - The remaining debate regenerates live to directly incorporate the mortal's voice!
4. **Odysseus' Verdict**:
   - Odysseus (the mortal survivor who navigated Scylla, Charybdis, and Troy) delivers the final synthesis.
   - Provides a clear recommendation, confidence level (*Low / Medium / High*) with explicit reasoning, divine consensus breakdown, the single biggest risk ("The Reef"), and 3 concrete next steps (48 hours, 2 weeks, checkpoint).

---

## 🎨 Odyssey Greek Pottery Design Brief

- **Color Palette**:
  - Deep Navy Sea: `#12233F`
  - Terracotta Charcoal Panels: `#1B1B16`
  - Odyssey Sun Orange: `#EE8A2E`
  - Parchment Cream: `#FDF4CC`
  - Aegean Teal Waves: `#1F5C66`
  - Homeric Maroon: `#9B3B33`
  - Seafoam Highlights: `#C1DDD0`
  - Delphic Flame Yellow: `#E4EC6A`
- **Illustrations**:
  - Custom SVG black-figure and red-figure pottery art for Athena, Poseidon, Hermes, Odysseus, and the Oracle.
  - Flanking classical bronze torch braziers with animated flickering flames.
  - Teal wave band with an animated Greek trireme galley with square cream sails drifting across the bottom.
  - Pixel-art clouds and 4-pointed sparkle stars (`✦`).
  - Continuous Greek Key (*Meander*) borders and torn clay tablet container aesthetics.

---

## 🛡️ Robustness & Science-Fair Judging Checklist

Judging is 3 minutes live. Reliability is paramount:
1. **Guaranteed Demo Path**: Pre-computed and cached "Demo Dilemma" button (*Change Major: CS to Philosophy*) with pre-rendered dialogue, stances, and verdict. Instant 1-click test for judges even if WiFi is disconnected!
2. **Audio Prefetching Queue**: While Turn $N$ is playing, audio for Turn $N+1$ is prefetched in the background so transitions are instantaneous with zero silence.
3. **Multi-Tier Audio Fallback**:
   - Tier 1: ElevenLabs cached audio (0ms latency, $0 cost, instant playback from local SHA-256 hash disk cache).
   - Tier 2: ElevenLabs live API (`eleven_turbo_v2_5`).
   - Tier 3: Browser Web Speech API with character-tuned pitches (Poseidon = deep 0.65x pitch, Athena = clear 1.15x pitch, Hermes = fast 1.25x pitch).
   - Tier 4: Visual typewriter subtitles without ever stalling or freezing the debate.
4. **Gemini Schema Validation & Retries**:
   - Structured JSON schema enforcement with `responseMimeType: "application/json"`.
   - Automatic retry on invalid format, followed by regex recovery, followed by contextual heuristic fallbacks.
5. **Safety Override**:
   - If a dilemma mentions crisis keywords (self-harm, abuse, medical emergency), the app immediately halts debate formatting and surfaces compassionate human support resources (988 Lifeline, 911) with a clear reflection disclaimer.
6. **Live Telemetry & Server Logs**:
   - Interactive slide-out telemetry drawer showing every API request, response, latency, token event, and cache hit.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone & Install
```bash
cd "Idea comparer"
npm install
```

### 2. Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your API keys if available:
```env
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```
*(Note: If no API keys are provided, the app runs in full offline demo/heuristic mode with zero crashes!)*

### 3. Run Automated Tests
```bash
npm test
```
Runs 11 automated test cases verifying health, intake, safety triggers, structured debate generation, Odysseus verdict schema, and audio hashing.

### 4. Start Development Server
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

Or build and serve production directly:
```bash
npm run build
node server/index.js
```
Visit `http://localhost:3001`.

---

## ⏱️ 3-Minute Science Fair Demo Script

1. **(15s) Hook**: *"Everyone has faced a decision they can't make alone. We gave it to the gods of Olympus."*
2. **(30s) Intake**: Click **"Demo Dilemma"** (or type a dilemma like *"Should I change my major?"*). Show the Oracle's clarifying questions probing cost and pull factors.
3. **(75s) Council Debate**:
   - Watch the 3 gods debate live with distinct voices.
   - Point out active god lighting up with flame aura, subtitles typing in sync.
   - Hit **"Speak, mortal"** to interject with a new constraint (*"What if I take a leave of absence for one semester first?"*). Show the gods reacting directly to the mortal.
   - Hit **"Challenge God"** to call Poseidon's bluff.
4. **(30s) Verdict**:
   - Odysseus delivers the balanced verdict with confidence rating, biggest risk ("The Reef"), and 3 concrete next steps.
   - Click **"Copy Verdict Summary"** to demonstrate clipboard export.
5. **(30s) Tech Stack**:
   - Gemini Flash model with structured JSON Schema output and crisis safety overrides.
   - ElevenLabs character voice casting, low-latency streaming, and SHA-256 audio disk caching.
   - Audio prefetch queue and graceful fallbacks.
   - Authentic Odyssey black-figure vector art, Greek key meanders, and animated trireme wave band.
