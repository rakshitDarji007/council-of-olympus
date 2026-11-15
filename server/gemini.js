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

const FALLBACK_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
];

/**
 * Call Gemini REST API with schema validation, retry, and fallback.
 */
async function callGeminiRest({
  apiKey,
  model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
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
        logEvent('ERROR', 'GEMINI', `HTTP ${response.status} from Gemini (${model}): ${errorText.slice(0, 150)}`);
        
        // If 429 quota or 404 or 503 high demand, try alternative model if available
        if ([429, 404, 503].includes(response.status)) {
          const nextModel = FALLBACK_MODELS.find((m) => m !== model);
          if (nextModel && attempt === 0) {
            logEvent('WARN', 'GEMINI', `Switching from ${model} to healthy alternative ${nextModel}`);
            return callGeminiRest({
              apiKey,
              model: nextModel,
              systemInstruction,
              userPrompt,
              responseSchema,
              temperature,
              retries: 0,
            });
          }
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
        logEvent('SUCCESS', 'GEMINI', `Received valid structured response from ${model} in ${latency}ms`);
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
        await new Promise((r) => setTimeout(r, 600));
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
          'Your safety and well-being are paramount. Please pause this session and reach out immediately: Call or text 988 (Suicide & Crisis Lifeline) or contact local emergency services (911). You do not have to carry this alone.',
      };
    }
  }

  // If already at 2 questions, declare ready to prevent dragging out intake
  if (conversation.length >= 2) {
    return {
      next_question: null,
      ready: true,
      question_number: conversation.length,
      context_summary: 'Sufficient context gathered for the Council of Olympus to deliberate.',
      is_emergency: false,
    };
  }

  const userPrompt = `
Analyze this dilemma and existing context:

User Dilemma:
"${dilemma}"

Previous Q&A Context (if any):
${conversation.map((item, idx) => `Q${idx + 1}: ${item.question}\nA${idx + 1}: ${item.answer}`).join('\n\n') || '(None yet - initial prompt analysis)'}

Question Count So Far: ${conversation.length}

CRITICAL INSTRUCTIONS:
1. Carefully analyze if the user's prompt already provides enough context to conduct a substantive three-way debate (Athena on long-term strategy, Poseidon on downside risk, Hermes on pragmatism).
   - If the dilemma already contains specific options, constraints, or trade-offs, DO NOT ask a question. Immediately set ready: true and next_question: null.
2. If and only if a crucial piece of missing information is needed to make a sound recommendation:
   - Identify the exact missing variable (e.g. runway, timeline, sunk costs, or personal priority).
   - Formulate ONE highly specific, tailored question (under 25 words) that directly references their situation.
   - Set ready: false and next_question: "<your tailored question>".
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

    // Guard against question repetition: if Gemini returned a question already asked, advance to debate
    const previousQuestions = conversation.map((c) => (c.question || '').toLowerCase().trim());
    if (result.next_question) {
      const qLower = result.next_question.toLowerCase().trim();
      const isRepeated = previousQuestions.some((pq) => pq === qLower || pq.includes(qLower) || qLower.includes(pq));
      if (isRepeated || conversation.length >= 2) {
        logEvent('INFO', 'INTAKE', 'Repetition or limit prevented; proceeding to Council debate');
        return {
          ...result,
          next_question: null,
          ready: true,
        };
      }
    }

    return result;
  } catch (err) {
    logEvent('INFO', 'FALLBACK', 'Running dynamic prompt context analyzer fallback');
    
    // Dynamic Heuristic Analyzer: Only ask if vital info is missing
    const text = dilemma.toLowerCase();
    const wordCount = dilemma.trim().split(/\s+/).length;
    const count = conversation.length;

    // Check information density
    const hasMetrics = /\d+[\$k%]?|\$|\b(years?|months?|debt|salary|equity|savings|runway|tuition|credits)\b/i.test(text);
    const mentionsTradeoff = /\b(but|versus|vs|worried|risk|scared|drained|sacrifice|give up|balance|fear|concern)\b/i.test(text);
    const mentionsOptions = /\b(or|either|between|staying|leaving|change|move|pivot)\b/i.test(text);

    // If already answered 1 question, or if prompt is clear/lifestyle choice, proceed directly to council!
    const isLifestyleOrClear = /lunch|dinner|breakfast|food|eat|restaurant|snack|buy|budget/i.test(text);
    if (count >= 1 || isLifestyleOrClear || (wordCount >= 18 && (hasMetrics || mentionsTradeoff)) || wordCount >= 25) {
      return {
        next_question: null,
        ready: true,
        question_number: count,
        context_summary: 'Sufficient context gathered for the Council to deliberate.',
        is_emergency: false,
      };
    }

    // Otherwise, generate a tailored question based on the missing domain variables:
    let tailoredQuestion = null;
    if (/major|degree|college|university|school|study|cs|computer science/i.test(text)) {
      if (!hasMetrics) {
        tailoredQuestion = "How far along in this degree are you, and what are the sunk tuition or debt costs?";
      } else {
        tailoredQuestion = "What does your day-to-day work look like if you pivot to this new focus?";
      }
    } else if (/startup|job|offer|promotion|company|boss|quit|corporate|tech/i.test(text)) {
      if (!/\b(runway|savings|salary|cash|debt)\b/i.test(text)) {
        tailoredQuestion = "What does your financial runway or salary difference look like between these two options?";
      } else {
        tailoredQuestion = "What is the primary downside risk or worst-case scenario you are worried about?";
      }
    } else if (/move|moving|city|relocate|partner|relationship|love|marriage/i.test(text)) {
      tailoredQuestion = "What career or personal sacrifices would relocating require from you?";
    } else {
      tailoredQuestion = "What is the primary downside or irreversible risk if this choice doesn't pan out?";
    }

    return {
      next_question: tailoredQuestion,
      ready: false,
      question_number: count + 1,
      context_summary: 'Analyzed dilemma context; requesting missing trade-off variable.',
      is_emergency: false,
    };
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

Generate an intense, fast-paced argument of 4 to 5 turns. The gods must interrupt, clash, and attack each other's points directly using sharp modern words. Each turn must be 1 to 2 sentences (under 25 words). Total argument duration around 35 to 45 seconds.
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
    // If dilemma is food/lifestyle or matches demo dilemma, return tailored turns
    const text = dilemma.toLowerCase();
    if (/lunch|food|restaurant|eat|dinner|meal|snack/i.test(text)) {
      return {
        turns: [
          {
            round: 1,
            speaker: 'athena',
            addressed_to: 'mortal',
            stance: 'conditional',
            text: 'If it is in your budget and fuels your focus, spending the extra money is a calculated investment in momentum.',
          },
          {
            round: 1,
            speaker: 'poseidon',
            addressed_to: 'athena',
            stance: 'against',
            text: 'Nonsense, Athena! Rationalizing lifestyle creep is how people bleed cash. Eat cheap and pocket the difference!',
          },
          {
            round: 1,
            speaker: 'hermes',
            addressed_to: 'poseidon',
            stance: 'for',
            text: 'Stop agonizing over twenty dollars, Poseidon! They are starving now, they have the money, buy the lunch!',
          },
          {
            round: 2,
            speaker: 'poseidon',
            addressed_to: 'hermes',
            stance: 'against',
            text: 'Twenty dollars today becomes six hundred a month! Do not confuse temporary hunger with a license to waste money.',
          },
        ],
        debate_dynamic: 'Athena justifies strategic energy investment; Poseidon attacks lifestyle creep; Hermes urges decisive immediate action.',
      };
    }

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
          text: 'Look five years ahead. Walking away from your core foundation destroys compounding career leverage; do not surrender to short-term burnout!',
        },
        {
          round: 1,
          speaker: 'poseidon',
          addressed_to: 'athena',
          stance: 'against',
          text: 'That is completely reckless, Athena! You are telling them to ignore debt and financial reality for an unproven fantasy!',
        },
        {
          round: 1,
          speaker: 'hermes',
          addressed_to: 'poseidon',
          stance: 'conditional',
          text: 'Calm down, Poseidon! Nobody has to burn their bridges. Take one low-risk trial this semester and test the waters first!',
        },
        {
          round: 2,
          speaker: 'athena',
          addressed_to: 'hermes',
          stance: 'for',
          text: 'Testing is smart, Hermes, but do not use compromise as an excuse to avoid hard work. Master the core first!',
        },
        {
          round: 2,
          speaker: 'poseidon',
          addressed_to: 'mortal',
          stance: 'against',
          text: 'Bottom line: protect your cash and downside first, because nobody rescues you when the bills come due!',
        },
      ],
      debate_dynamic: 'Athena demands long-term mastery; Poseidon fiercely attacks financial blindness; Hermes forces an agile middle ground.',
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
    const text = dilemma.toLowerCase();
    if (/lunch|food|restaurant|eat|dinner|meal|snack/i.test(text)) {
      return {
        recommendation: 'Go to the restaurant and enjoy your lunch. Since it is comfortably within your budget and you explicitly do not mind the expense, the boost in energy and morale far outweighs the minor cost.',
        confidence: 'high',
        confidence_reason: 'Zero downside risk: you already verified it is in your budget and your physical hunger needs immediate fuel.',
        summary_by_god: {
          athena: 'Acknowledged that quality nourishment boosts alertness and energy, provided it remains a deliberate treat.',
          poseidon: 'Reminded you to watch out for lifestyle inflation so occasional treats do not become an unconscious financial drain.',
          hermes: 'Cut through the noise: hunger is immediate, budget is clear, buy the food and move on.',
        },
        biggest_risk: 'Letting special-occasion dining become an everyday default that strains your savings over time.',
        next_steps: [
          'Go order your favorite dish without guilt or second-guessing.',
          'Take 30 minutes to truly unplug and savor the meal.',
          'Return to your afternoon tasks energized and refocused.',
        ],
        unresolved_questions: [
          'Are there other areas in life where you overthink simple, low-risk pleasures?',
        ],
        closing_word: 'Enjoy the feast. A well-fueled traveler rows with stronger arms.',
      };
    }

    if (dilemma.toLowerCase().includes('major') || dilemma.toLowerCase().includes('computer science')) {
      return DEMO_DILEMMA.verdict;
    }

    return {
      recommendation: 'Do not make an irreversible leap right now. Instead, maintain your primary footing while launching a structured, low-risk test of the alternative.',
      confidence: 'medium',
      confidence_reason: 'You possess real momentum where you stand, but the friction you feel will continue to compound unless you systematically test this new direction.',
      summary_by_god: {
        athena: 'Reminded you to optimize for multi-year leverage rather than reacting to short-term fatigue.',
        poseidon: 'Accurately identified the immediate downside of burning through savings or stability.',
        hermes: 'Designed the practical middle path: an inexpensive pilot project before declaring allegiance.',
      },
      biggest_risk: 'Drifting in indecision until external pressure forces an uncalculated reaction.',
      next_steps: [
        'Within 48 hours: Outline one low-friction, concrete experiment you can run over the next two weeks.',
        'Within 14 days: Set clear go/no-go quantitative metrics (financial runway or milestone-based).',
        'At the 60-day mark: Review the outcomes with a trusted mentor and either fully pivot or close the door.',
      ],
      unresolved_questions: [
        'Are you running away from temporary discomfort, or steering toward authentic long-term mastery?',
      ],
      closing_word: 'Keep both hands on the rudder. Steady execution beats romantic impulse.',
    };
  }
}

/**
 * BLUFF: Mortal challenges a specific god.
 */
export async function callGodBluff({ speaker, stance, argument, dilemma, customApiKey }) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  const userPrompt = `
The user has challenged ${speaker.toUpperCase()}'s argument: "${argument}".
Dilemma: "${dilemma}".
As ${speaker.toUpperCase()}, defend your position or concede with sharp nuance in concise modern English. Max 35 words.
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
        text: 'Call it caution if you want, but when your runway runs dry, enthusiasm won\'t pay the bills. Respect the downside.',
        stance: 'against',
      };
    } else if (speaker === 'athena') {
      return {
        speaker: 'athena',
        text: 'Scrutiny is part of good strategy. If you doubt the five-year view, show me how your short-term pivot compounds into long-term leverage.',
        stance: 'for',
      };
    } else {
      return {
        speaker: 'hermes',
        text: 'I am not bluffing; I am giving you an exit ramp. Why bet the entire farm when you can hedge and win either way?',
        stance: 'conditional',
      };
    }
  }
}
