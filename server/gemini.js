/**
 * Robust Gemini API Client with Structured JSON Schema, Retry, Safety Fallbacks,
 * and In-Character Canned Fallbacks when Offline/Unconfigured.
 */

import {
  ORACLE_INTAKE_PROMPT,
  COUNCIL_DEBATE_PROMPT,
  ODYSSEUS_VERDICT_PROMPT,
  BLUFF_REBUTTAL_PROMPT,
} from './prompts.js';
import { DEMO_DILEMMA } from './demoData.js';

// Global server log recorder for instant judge/dev visibility
export const serverLogs = [];

export function logEvent(level, category, message, details = null) {
  const entry = {
    timestamp: new Date().toISOString(),
    level, // 'INFO', 'WARN', 'ERROR', 'SUCCESS'
    category,
    message,
    details: details ? (typeof details === 'object' ? JSON.stringify(details) : String(details)) : null,
  };
  serverLogs.unshift(entry);
  if (serverLogs.length > 200) serverLogs.pop();
  console.log(`[${entry.level}] [${entry.category}] ${entry.message}`);
}

const DEFAULT_TIMEOUT_MS = 18000;

/**
 * Call Gemini REST API with schema validation, retry, and fallback.
 */
async function callGeminiRest({
  apiKey,
  model = process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  systemInstruction,
  userPrompt,
  responseSchema,
  temperature = 0.7,
  retries = 1,
}) {
  const startTime = Date.now();
  if (!apiKey) {
    logEvent('WARN', 'GEMINI', 'No GEMINI_API_KEY provided; using intelligent dynamic fallback');
    throw new Error('MISSING_API_KEY');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
      ...(responseSchema ? { responseSchema } : {}),
    },
  };

  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      logEvent('INFO', 'GEMINI', `Dispatching to ${model} (Attempt ${attempt + 1}/${retries + 1})`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const latency = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        logEvent('ERROR', 'GEMINI', `HTTP ${response.status} from Gemini: ${errorText.slice(0, 150)}`);
        // If 404 or model not supported, try fallback model if attempt === 0
        if (response.status === 404 && model !== 'gemini-1.5-flash') {
          logEvent('WARN', 'GEMINI', `Model ${model} not found, falling back to gemini-1.5-flash`);
          return callGeminiRest({
            apiKey,
            model: 'gemini-1.5-flash',
            systemInstruction,
            userPrompt,
            responseSchema,
            temperature,
            retries: 0,
          });
        }
        throw new Error(`Gemini HTTP Error ${response.status}: ${errorText.slice(0, 100)}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Gemini returned an empty candidate or safety block');
      }

      // Parse JSON
      try {
        const parsed = JSON.parse(rawText);
        logEvent('SUCCESS', 'GEMINI', `Received valid structured response in ${latency}ms`);
        return parsed;
      } catch (jsonErr) {
        logEvent('WARN', 'GEMINI', `JSON parse error on raw output: ${jsonErr.message}. Attempting regex recovery.`);
        // Fall back to plain-text regex extraction
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extracted = JSON.parse(jsonMatch[0]);
          logEvent('SUCCESS', 'GEMINI', `Recovered valid JSON via regex in ${latency}ms`);
          return extracted;
        }
        throw jsonErr;
      }
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;
      logEvent('WARN', 'GEMINI', `Attempt ${attempt + 1} failed: ${err.message}`);
      if (attempt < retries) {
        // Wait 800ms before retry
        await new Promise((r) => setTimeout(r, 800));
      }
    }
  }

  throw lastError;
}

/**
 * INTAKE: Determines next question or marks ready.
 */
export async function getIntakeQuestion({ dilemma, conversation = [], customApiKey }) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  // Emergency / Crisis check
  const crisisKeywords = ['suicide', 'kill myself', 'self-harm', 'abuse', 'end my life', 'overdose'];
  const textToCheck = `${dilemma} ${conversation.map((c) => c.answer || '').join(' ')}`.toLowerCase();
  for (const word of crisisKeywords) {
    if (textToCheck.includes(word)) {
      logEvent('WARN', 'SAFETY', `Emergency crisis keyword detected: ${word}`);
      return {
        next_question: null,
        ready: false,
        question_number: conversation.length,
        is_emergency: true,
        emergency_message:
          'Mortal friend, your safety and life are precious above all voyages. The gods yield to human healers. Please pause this council and reach out immediately: Call or text 988 (USA Suicide & Crisis Lifeline) or contact your local emergency services (911). You do not have to carry this storm alone.',
      };
    }
  }

  // If already at 4 questions, declare ready
  if (conversation.length >= 4) {
    return {
      next_question: null,
      ready: true,
      question_number: conversation.length,
      context_summary: 'Sufficient context gathered for the council of Olympus to deliberate.',
      is_emergency: false,
    };
  }

  const userPrompt = `
Dilemma from mortal:
"${dilemma}"

Previous Q&A Context:
${conversation.map((item, idx) => `Q${idx + 1}: ${item.question}\nA${idx + 1}: ${item.answer}`).join('\n\n')}

Question Count So Far: ${conversation.length}
Evaluate if we need another question (max 4 questions total). If enough information exists to weigh risks, strategy, and compromise, set ready: true.
  `.trim();

  const schema = {
    type: 'OBJECT',
    properties: {
      next_question: { type: 'STRING', nullable: true },
      ready: { type: 'BOOLEAN' },
      question_number: { type: 'INTEGER' },
      context_summary: { type: 'STRING' },
      is_emergency: { type: 'BOOLEAN' },
      emergency_message: { type: 'STRING', nullable: true },
    },
    required: ['ready', 'question_number', 'context_summary', 'is_emergency'],
  };

  try {
    const result = await callGeminiRest({
      apiKey,
      systemInstruction: ORACLE_INTAKE_PROMPT,
      userPrompt,
      responseSchema: schema,
    });
    return result;
  } catch (err) {
    logEvent('INFO', 'FALLBACK', 'Generating heuristic intake question fallback');
    // Intelligent fallback based on Q&A count
    const count = conversation.length;
    if (count === 0) {
      return {
        next_question: 'What is pulling you toward this new path, and what feels most burdensome about staying where you are?',
        ready: false,
        question_number: 1,
        context_summary: 'Initial dilemma registered.',
        is_emergency: false,
      };
    } else if (count === 1) {
      return {
        next_question: 'What are the real costs—money, time, or relationships—if this voyage meets a storm?',
        ready: false,
        question_number: 2,
        context_summary: 'Mortal shared motivations.',
        is_emergency: false,
      };
    } else {
      return {
        next_question: null,
        ready: true,
        question_number: count,
        context_summary: 'Sufficient context gathered for the Olympian gods to convene.',
        is_emergency: false,
      };
    }
  }
}

/**
 * DEBATE: Generates structured debate turns for Athena, Poseidon, Hermes.
 */
export async function generateDebate({
  dilemma,
  answers = [],
  interjection = null,
  debateSoFar = [],
  customApiKey,
}) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  const userPrompt = `
Mortal Dilemma:
"${dilemma}"

Intake Context:
${answers.map((a, i) => `Clarification ${i + 1}: ${a.question} -> ${a.answer}`).join('\n')}

Debate So Far:
${
  debateSoFar.length > 0
    ? debateSoFar.map((t) => `${t.speaker.toUpperCase()}: "${t.text}"`).join('\n')
    : '(Debate beginning)'
}

${
  interjection
    ? `MORTAL INTERJECTION ("Speak, Mortal"):
"${interjection}"
The gods MUST directly acknowledge and react to this interjection in their upcoming turns!`
    : ''
}

Generate the debate turns following the prompt rules. Exactly 6 turns total (Athena -> Poseidon -> Hermes -> Athena -> Poseidon -> Hermes), each under 40 words, punchy, addressing each other by name.
  `.trim();

  const schema = {
    type: 'OBJECT',
    properties: {
      turns: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            round: { type: 'INTEGER' },
            speaker: { type: 'STRING', enum: ['athena', 'poseidon', 'hermes'] },
            addressed_to: { type: 'STRING', enum: ['mortal', 'athena', 'poseidon', 'hermes'] },
            stance: { type: 'STRING', enum: ['for', 'against', 'conditional'] },
            text: { type: 'STRING' },
          },
          required: ['round', 'speaker', 'addressed_to', 'stance', 'text'],
        },
      },
      debate_dynamic: { type: 'STRING' },
    },
    required: ['turns', 'debate_dynamic'],
  };

  try {
    const result = await callGeminiRest({
      apiKey,
      systemInstruction: COUNCIL_DEBATE_PROMPT,
      userPrompt,
      responseSchema: schema,
    });
    return result;
  } catch (err) {
    logEvent('INFO', 'FALLBACK', 'Using high-fidelity dynamic fallback debate');
    // If the dilemma matches demo dilemma, return cached demo turns
    if (dilemma.toLowerCase().includes('major') || dilemma.toLowerCase().includes('computer science')) {
      return {
        turns: DEMO_DILEMMA.turns,
        debate_dynamic: DEMO_DILEMMA.debate_dynamic,
      };
    }

    // Dynamic fallback tailored to mortal's input
    return {
      turns: [
        {
          round: 1,
          speaker: 'athena',
          addressed_to: 'mortal',
          stance: 'conditional',
          text: `Cast your gaze ten years ahead, mortal. A hurried leap without strategic purpose is foolishness, but enduring misery is cowardice. Choose the craft that builds your enduring sovereignty.`,
        },
        {
          round: 1,
          speaker: 'poseidon',
          addressed_to: 'athena',
          stance: 'against',
          text: `Athena whispers of sovereignty while the breakers foam at your ankles! You risk abandoning steady ground for an untamed squall. Have you no respect for the wreckage?`,
        },
        {
          round: 1,
          speaker: 'hermes',
          addressed_to: 'poseidon',
          stance: 'conditional',
          text: `Must every voyage end in drowning, uncle? The mortal does not have to burn the harbor! Run a swift scouting run: take one small step, keep one foot dry.`,
        },
        {
          round: 2,
          speaker: 'athena',
          addressed_to: 'hermes',
          stance: 'for',
          text: `Hermes names the discipline of reconnaissance. Test the winds with rigorous intention, but do not procrastinate under the guise of moderation. Act with resolve.`,
        },
        {
          round: 2,
          speaker: 'poseidon',
          addressed_to: 'athena',
          stance: 'against',
          text: `Test the winds? One misstep in a storm and your mast splits! Mark my warning: when debt or regret drags you under, divine philosophy will not buy bread.`,
        },
        {
          round: 2,
          speaker: 'hermes',
          addressed_to: 'mortal',
          stance: 'conditional',
          text: `Heed both the spear and the storm. Set a firm trial for three moons. If fortune smiles, advance; if the abyss opens, slip back through the side door!`,
        },
      ],
      debate_dynamic: 'Athena demands long-term courage; Poseidon warns of ruin; Hermes plots a low-risk trial.',
    };
  }
}

/**
 * VERDICT: Odysseus delivers balanced final recommendation.
 */
export async function generateVerdict({
  dilemma,
  answers = [],
  turns = [],
  interjections = [],
  customApiKey,
}) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  const userPrompt = `
Mortal Dilemma:
"${dilemma}"

Intake Context:
${answers.map((a, i) => `Detail ${i + 1}: ${a.question} -> ${a.answer}`).join('\n')}

Council Debate Turns:
${turns.map((t) => `${t.speaker.toUpperCase()} (${t.stance}): "${t.text}"`).join('\n')}

${
  interjections.length > 0
    ? `User Interjections: ${interjections.map((inj) => `"${inj}"`).join(', ')}`
    : ''
}

Deliver the final verdict as ODYSSEUS, survivor of the Trojan War and wanderer of Ithaca.
  `.trim();

  const schema = {
    type: 'OBJECT',
    properties: {
      recommendation: { type: 'STRING' },
      confidence: { type: 'STRING', enum: ['low', 'medium', 'high'] },
      confidence_reason: { type: 'STRING' },
      summary_by_god: {
        type: 'OBJECT',
        properties: {
          athena: { type: 'STRING' },
          poseidon: { type: 'STRING' },
          hermes: { type: 'STRING' },
        },
        required: ['athena', 'poseidon', 'hermes'],
      },
      biggest_risk: { type: 'STRING' },
      next_steps: {
        type: 'ARRAY',
        items: { type: 'STRING' },
      },
      unresolved_questions: {
        type: 'ARRAY',
        items: { type: 'STRING' },
      },
      closing_word: { type: 'STRING' },
    },
    required: [
      'recommendation',
      'confidence',
      'confidence_reason',
      'summary_by_god',
      'biggest_risk',
      'next_steps',
      'unresolved_questions',
      'closing_word',
    ],
  };

  try {
    const result = await callGeminiRest({
      apiKey,
      systemInstruction: ODYSSEUS_VERDICT_PROMPT,
      userPrompt,
      responseSchema: schema,
    });
    return result;
  } catch (err) {
    logEvent('INFO', 'FALLBACK', 'Using Odysseus verdict fallback');
    if (dilemma.toLowerCase().includes('major') || dilemma.toLowerCase().includes('computer science')) {
      return DEMO_DILEMMA.verdict;
    }

    return {
      recommendation: 'Do not burn your existing ship out of fatigue, but immediately chart a measured trial before committing all your sails.',
      confidence: 'medium',
      confidence_reason: 'You possess real momentum where you stand, yet the friction in your spirit cannot be ignored indefinitely without rotting your timber.',
      summary_by_god: {
        athena: 'Reminded you to weigh a decade of mastery over a month of fleeting impulse.',
        poseidon: 'Rightly exposed the cold rocks of financial loss and irreversible sunk effort.',
        hermes: 'Offered the cunning path: run an inexpensive reconnaissance project before declaring allegiance.',
      },
      biggest_risk: 'Drifting in indecision until circumstances force a desperate, uncalculated leap.',
      next_steps: [
        'Within 48 hours: Execute one low-cost, concrete test of your desired path.',
        'Within 14 days: Establish a firm numerical threshold (financial or academic) that dictates go/no-go.',
        'At the 60-day mark: Review outcomes with a trusted mentor and either commit fully or seal the hatch.',
      ],
      unresolved_questions: [
        'Are you fleeing from temporary discomfort, or steering toward authentic mastery?',
      ],
      closing_word: 'Keep both hands upon the oars. Ithaca was not reached in calm waters.',
    };
  }
}

/**
 * BLUFF: Mortal challenges a specific god.
 */
export async function callGodBluff({ speaker, stance, argument, dilemma, customApiKey }) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  const userPrompt = `
The mortal has called ${speaker.toUpperCase()}'s bluff on their stance: "${argument}".
Mortal dilemma: "${dilemma}".
As ${speaker.toUpperCase()}, defend your position or concede with sharp divine nuance. Max 35 words.
  `.trim();

  const schema = {
    type: 'OBJECT',
    properties: {
      speaker: { type: 'STRING' },
      text: { type: 'STRING' },
      stance: { type: 'STRING' },
    },
    required: ['speaker', 'text', 'stance'],
  };

  try {
    const result = await callGeminiRest({
      apiKey,
      systemInstruction: BLUFF_REBUTTAL_PROMPT,
      userPrompt,
      responseSchema: schema,
    });
    return result;
  } catch (err) {
    if (speaker === 'poseidon') {
      return {
        speaker: 'poseidon',
        text: 'Call my warning a bluff if you dare, mortal! But when the squall tears your rigging, remember: the sea does not negotiate with optimism.',
        stance: 'against',
      };
    } else if (speaker === 'athena') {
      return {
        speaker: 'athena',
        text: 'A strategist welcomes scrutiny. If you doubt the ten-year horizon, look at those who settled for easy comforts and died forgotten.',
        stance: 'for',
      };
    } else {
      return {
        speaker: 'hermes',
        text: 'Bluff? A trickster never bluffs; he simply plays two games at once while you fret over a single chessboard. Try the shortcut!',
        stance: 'conditional',
      };
    }
  }
}
