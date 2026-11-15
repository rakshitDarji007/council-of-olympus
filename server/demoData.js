/**
 * Fail-Proof Cached Demo Data for Hackathon Presentations
 * Guaranteed path if WiFi, Gemini API, or ElevenLabs API is down or slow.
 */

export const DEMO_DILEMMA = {
  id: "major-change",
  title: "Should I change my major from Computer Science to Philosophy & Writing?",
  dilemma: "I am a sophomore studying Computer Science. I feel drained by coding assignments and drawn toward philosophy, ethics, and creative writing. But I worry about debt, job prospects, and disappointing my parents.",
  answers: [
    {
      question: "What is pulling you toward philosophy and creative writing, and what makes computer science feel draining?",
      answer: "I love exploring human meaning, ethics of technology, and storytelling. In CS, I feel like I'm just memorizing syntax for leetcode rather than thinking deeply."
    },
    {
      question: "What are the real financial anchors—how much debt or sunk tuition are we weighing here?",
      answer: "I have about two years of credits done and 15k in student loans. My parents are helping with tuition as long as they believe I can support myself after graduation."
    },
    {
      question: "How have you tested this new waters beyond personal fascination?",
      answer: "I took one philosophy seminar and received an A, and I write for the student literary journal on weekends."
    }
  ],
  context_summary: "A second-year student torn between technical stability (CS) and intellectual passion (Philosophy/Writing), carrying $15k debt and parental expectations.",
  turns: [
    {
      round: 1,
      speaker: "athena",
      addressed_to: "mortal",
      stance: "conditional",
      text: "Look ten years ahead, mortal. Pure philosophy without technical leverage leaves your spear blunt in the coming age. Master the machine, then command its soul."
    },
    {
      round: 1,
      speaker: "poseidon",
      addressed_to: "athena",
      stance: "against",
      text: "Athena preaches lofty temples while fifteen thousand in debt already drags you into the depths! Abandon the craft now, and your parents' harbor will slam shut."
    },
    {
      round: 1,
      speaker: "hermes",
      addressed_to: "poseidon",
      stance: "conditional",
      text: "Peace, uncle of storms! Why must this mortal drown in either ocean? Keep the CS hull intact, but take philosophy as a minor or pivot into tech policy!"
    },
    {
      round: 2,
      speaker: "athena",
      addressed_to: "hermes",
      stance: "for",
      text: "Hermes speaks true cunning. The greatest minds do not flee the loom; they weave code and ethics together. A dual path yields supreme leverage."
    },
    {
      round: 2,
      speaker: "poseidon",
      addressed_to: "athena",
      stance: "against",
      text: "A dual path is twice the burden in a squall! If you drop your guard in algorithms, you will graduate shipwrecked with an empty purse."
    },
    {
      round: 2,
      speaker: "hermes",
      addressed_to: "mortal",
      stance: "conditional",
      text: "Do not throw your ship against the rocks today. Build one philosophy project that analyzes AI ethics this term. Test the wind before unfurling the main sail!"
    }
  ],
  debate_dynamic: "Athena advocates dual mastery; Poseidon warns of debt and shipwreck; Hermes uncovers an agile compromise.",
  verdict: {
    recommendation: "Do not burn your technical ship, but hoist a philosophical sail: declare a minor in philosophy or an interdisciplinary focus on tech ethics, rather than dropping CS.",
    confidence: "high",
    confidence_reason: "You are already halfway through the degree with manageable debt; abandoning CS now creates maximum friction, whereas combining them creates a rare, sought-after specialty.",
    summary_by_god: {
      athena: "Advised long-term synthesis: mastering technical fundamentals while sharpening ethical reasoning for ten-year mastery.",
      poseidon: "Rightly warned of the sudden undertow: $15,000 debt and strained family support if you abandon your vocational footing.",
      hermes: "Found the clever channel: keep the primary degree, test elective waters, and package yourself as a bridge between technology and humanity."
    },
    biggest_risk: "Becoming paralyzed in mediocre CS grades due to burnout while avoiding the hard work of building a standout portfolio.",
    next_steps: [
      "Within 48 hours: Schedule an academic advisor appointment to map a Philosophy/Ethics minor alongside your remaining CS requirements.",
      "This week: Have an honest, grounded talk with your parents showing how an interdisciplinary focus enhances rather than threatens job prospects.",
      "This semester: Complete one public writing or ethics project analyzing an emerging technology issue to validate your conviction."
    ],
    unresolved_questions: [
      "Are you truly exhausted by technology, or simply exhausted by how introductory courses are taught?"
    ],
    closing_word: "Hold the rudder firm. The sea rewards those who navigate between Scylla and Charybdis."
  }
};

export const ALTERNATE_DEMO_DILEMMAS = [
  {
    id: "startup-vs-corp",
    title: "Startup vs Big Tech Offer",
    dilemma: "I have an offer from a seed-stage AI startup with high equity and 60-hour weeks, versus a comfortable stable big tech corporate role with double the base salary.",
    summary: "High risk/high upside vs stability and mentorship."
  },
  {
    id: "relocation",
    title: "Moving Across the Country for Love",
    dilemma: "My partner got accepted to medical school in Chicago. I love my hometown and close-knit family, but our relationship is 4 years strong. Should I move?",
    summary: "Long-term relationship commitment vs roots and personal comfort zone."
  },
  {
    id: "quit-job",
    title: "Quitting Job to Build a Solopreneur App",
    dilemma: "I have 6 months of savings and a working MVP app with 200 free users. My boss just offered me a promotion, but I desperately want to work for myself.",
    summary: "Runway risk vs entrepreneurial freedom."
  }
];
