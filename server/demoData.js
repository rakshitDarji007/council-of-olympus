/**
 * Fail-Proof Cached Demo Data for Hackathon Presentations
 * Natural, concise modern English with subtle Homeric touches.
 */

export const DEMO_DILEMMA = {
  id: "major-change",
  title: "Should I change my major from Computer Science to Philosophy & Writing?",
  dilemma: "I'm a sophomore studying Computer Science. I feel burned out by coding assignments and drawn toward philosophy, ethics, and creative writing. But I worry about debt, job prospects, and disappointing my parents.",
  answers: [
    {
      question: "What is pulling you toward philosophy and writing, and what makes CS feel draining?",
      answer: "I love exploring ethics, tech policy, and storytelling. In CS, I feel like I'm just memorizing syntax for leetcode rather than thinking deeply."
    },
    {
      question: "What are the real financial stakes—how much debt or sunk tuition are we weighing here?",
      answer: "I have two years completed and $15,000 in student loans. My parents cover remaining tuition as long as they believe I can support myself after college."
    },
    {
      question: "How have you tested this new path so far?",
      answer: "I took one philosophy seminar and earned an A, and I write for the student literary journal on weekends."
    }
  ],
  context_summary: "A second-year student torn between technical stability (CS) and intellectual craft (Philosophy/Writing), carrying $15k debt and parental expectations.",
  turns: [
    {
      round: 1,
      speaker: "athena",
      addressed_to: "mortal",
      stance: "conditional",
      text: "Look five years ahead. Throwing away your technical degree out of burnout destroys compounding leverage; keep your core!"
    },
    {
      round: 1,
      speaker: "poseidon",
      addressed_to: "athena",
      stance: "against",
      text: "That is pure delusion, Athena! You expect them to ignore fifteen grand in debt while chasing an untested writing dream?"
    },
    {
      round: 1,
      speaker: "hermes",
      addressed_to: "poseidon",
      stance: "conditional",
      text: "Stop panicking, Poseidon! Nobody has to drop out. Declare a philosophy minor this semester and test the waters first."
    },
    {
      round: 2,
      speaker: "athena",
      addressed_to: "hermes",
      stance: "for",
      text: "Exactly, Hermes! A dual focus creates a rare skill moat. Software engineering paired with deep ethical writing is unstoppable."
    },
    {
      round: 2,
      speaker: "poseidon",
      addressed_to: "mortal",
      stance: "against",
      text: "Just do not kid yourself about the workload. If you fail core algorithms, you lose everything. Guard your downside first!"
    }
  ],
  debate_dynamic: "Athena advises long-term technical leverage; Poseidon warns of debt and parental friction; Hermes designs an agile low-risk trial.",
  verdict: {
    recommendation: "Do not drop Computer Science. Instead, declare a formal minor in Philosophy or Tech Ethics. Complete your technical degree while building a specialized portfolio in AI ethics and writing.",
    confidence: "high",
    confidence_reason: "You are already halfway to the finish line with manageable debt. Abandoning CS now maximizes career and financial friction, whereas combining both disciplines creates a rare, defensible niche.",
    summary_by_god: {
      athena: "Advised long-term compounding: pairing technical competence with ethical reasoning rather than starting from scratch.",
      poseidon: "Rightly highlighted the immediate undertow: $15,000 in loans and the critical risk of losing parental financial backing.",
      hermes: "Identified the optimal path: retain the primary degree, test electives, and use low-cost side projects to prove traction."
    },
    biggest_risk: "Letting burnout lead to a slide in your core GPA while avoiding the discipline needed to build a standout writing portfolio.",
    next_steps: [
      "Within 48 hours: Meet with your academic advisor to map out a Philosophy or Ethics minor alongside your remaining CS credits.",
      "This week: Have an honest, structured conversation with your parents showing how combining tech and policy strengthens your career outlook.",
      "This semester: Complete one published writing piece or case study analyzing an emerging technology dilemma to validate your conviction."
    ],
    unresolved_questions: [
      "Are you genuinely exhausted by technology, or simply exhausted by the way introductory courses are taught?"
    ],
    closing_word: "Navigate between Scylla and Charybdis. Keep a steady hand on the rudder."
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
    title: "Relocating for a Relationship",
    dilemma: "My partner got accepted to medical school in Chicago. I love my hometown and close-knit family, but our relationship is 4 years strong. Should I move?",
    summary: "Long-term relationship commitment vs roots and personal comfort zone."
  },
  {
    id: "quit-job",
    title: "Leaving Full-Time Job for Indie App",
    dilemma: "I have 6 months of savings and a working MVP app with 200 free users. My boss offered a promotion, but I desperately want to work for myself.",
    summary: "Runway risk vs entrepreneurial freedom."
  }
];
