// ── TYPES ─────────────────────────────────────────────────────────────────────

export type ProfileTrait =
  | "Activity" | "Culture" | "Food" | "Luxury" | "Nightlife"
  | "Nature" | "Relaxation" | "Adventure" | "Shopping" | "Social";

export type ProfileVector = Record<ProfileTrait, number>;

/** Every answer carries a weight map (empty {} for root-question answers). */
export interface QuestionAnswer {
  text: string;
  weight: Partial<ProfileVector>;
  next_question: string | "END";
}

export interface QuizQuestion {
  id: string;
  cycle: number;
  is_root: boolean;
  text: string;
  answers: QuestionAnswer[];
}

/** One recorded answer including context and running scores. */
export interface AnswerRecord {
  question_id: string;
  question_text: string;
  answer_text: string;
  weights_applied: Partial<ProfileVector>;
  scores_after: ProfileVector;
}

/** Complete session snapshot — structured for easy API/database delivery. */
export interface SessionData {
  form_data: {
    destination: string;
    dateFrom: string;
    dateTo: string;
    travellers: number;
    budget: string;
    email: string;
  };
  answer_log: AnswerRecord[];
  final_profile: {
    raw_scores: ProfileVector;
    normalized_scores: ProfileVector;
    primary_trait: ProfileTrait;
    secondary_trait: ProfileTrait;
  };
}

/** Full profile including archetype string for UI display. */
export interface TravelProfile {
  raw_scores: ProfileVector;
  normalized_scores: ProfileVector;
  primary_trait: ProfileTrait;
  secondary_trait: ProfileTrait;
  archetype: string;
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

export const TRAITS: ProfileTrait[] = [
  "Activity", "Culture", "Food", "Luxury", "Nightlife",
  "Nature", "Relaxation", "Adventure", "Shopping", "Social",
];

export const INITIAL_VECTOR: ProfileVector = {
  Activity: 0, Culture: 0, Food: 0, Luxury: 0, Nightlife: 0,
  Nature: 0, Relaxation: 0, Adventure: 0, Shopping: 0, Social: 0,
};

/**
 * Each user sees exactly 12 questions: 6 cycle roots + 6 branch questions.
 * Depth 1–12 maps to the sequential position a user encounters each question.
 *
 *   Depth  1  Q1    (root,   cycle 1)
 *   Depth  2  Q1A/B/C (branch, cycle 1)
 *   Depth  3  Q2    (root,   cycle 2)
 *   Depth  4  Q2A/B/C (branch, cycle 2)
 *   …
 *   Depth 11  Q6    (root,   cycle 6)
 *   Depth 12  Q6A/B/C (branch, cycle 6)
 */
export const QUESTION_DEPTH: Record<string, number> = {
  Q1: 1,   Q1A: 2, Q1B: 2, Q1C: 2,
  Q2: 3,   Q2A: 4, Q2B: 4, Q2C: 4,
  Q3: 5,   Q3A: 6, Q3B: 6, Q3C: 6,
  Q4: 7,   Q4A: 8, Q4B: 8, Q4C: 8,
  Q5: 9,   Q5A: 10, Q5B: 10, Q5C: 10,
  Q6: 11,  Q6A: 12, Q6B: 12, Q6C: 12,
};

/** Total number of questions a single user answers. */
export const TOTAL_QUESTIONS = 12;

// ── 24 QUESTION OBJECTS ───────────────────────────────────────────────────────
//
//  Structure:
//    • 6 cycle root questions  — 3 answers each, weight: {}, navigate to a branch
//    • 18 branch questions     — 2 answers each, apply weights, navigate to next root or END
//
//  Navigation pattern per cycle:
//    Root → one of three branches → next cycle root (or END for cycle 6)
//
// ─────────────────────────────────────────────────────────────────────────────

export const QUESTIONS: Record<string, QuizQuestion> = {

  // ═══════════════════════════════════════════════════════════
  // CYCLE 1 — ENERGY STYLE
  // ═══════════════════════════════════════════════════════════

  Q1: {
    id: "Q1", cycle: 1, is_root: true,
    text: "How do you prefer to spend most days on vacation?",
    answers: [
      { text: "Moving and exploring",  weight: {}, next_question: "Q1A" },
      { text: "Balanced mix",          weight: {}, next_question: "Q1B" },
      { text: "Mostly relaxing",       weight: {}, next_question: "Q1C" },
    ],
  },

  Q1A: {
    id: "Q1A", cycle: 1, is_root: false,
    text: "Do you prefer structured activities or spontaneous exploration?",
    answers: [
      { text: "Structured",    weight: { Activity: 2, Culture: 1 }, next_question: "Q2" },
      { text: "Spontaneous",   weight: { Adventure: 2 },            next_question: "Q2" },
    ],
  },

  Q1B: {
    id: "Q1B", cycle: 1, is_root: false,
    text: "When balancing, what matters more?",
    answers: [
      { text: "Activity",    weight: { Activity: 2 },    next_question: "Q2" },
      { text: "Relaxation",  weight: { Relaxation: 2 },  next_question: "Q2" },
    ],
  },

  Q1C: {
    id: "Q1C", cycle: 1, is_root: false,
    text: "What defines relaxation for you?",
    answers: [
      { text: "Beach/pool",   weight: { Relaxation: 2, Nature: 1 },   next_question: "Q2" },
      { text: "Spa/resort",   weight: { Relaxation: 2, Luxury: 2 },   next_question: "Q2" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // CYCLE 2 — CULTURAL DEPTH
  // ═══════════════════════════════════════════════════════════

  Q2: {
    id: "Q2", cycle: 2, is_root: true,
    text: "How important is cultural immersion?",
    answers: [
      { text: "Very important",   weight: {}, next_question: "Q2A" },
      { text: "Somewhat",         weight: {}, next_question: "Q2B" },
      { text: "Not a priority",   weight: {}, next_question: "Q2C" },
    ],
  },

  Q2A: {
    id: "Q2A", cycle: 2, is_root: false,
    text: "What interests you more?",
    answers: [
      { text: "Museums/history",    weight: { Culture: 3 },              next_question: "Q3" },
      { text: "Local traditions",   weight: { Culture: 2, Social: 1 },   next_question: "Q3" },
    ],
  },

  Q2B: {
    id: "Q2B", cycle: 2, is_root: false,
    text: "Preferred cultural format?",
    answers: [
      { text: "Guided tours",      weight: { Culture: 2 },               next_question: "Q3" },
      { text: "Casual exploration", weight: { Culture: 1, Adventure: 1 }, next_question: "Q3" },
    ],
  },

  Q2C: {
    id: "Q2C", cycle: 2, is_root: false,
    text: "If minimal culture, what replaces it?",
    answers: [
      { text: "Entertainment",  weight: { Nightlife: 2 },  next_question: "Q3" },
      { text: "Nature",         weight: { Nature: 2 },     next_question: "Q3" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // CYCLE 3 — FOOD PROFILE
  // ═══════════════════════════════════════════════════════════

  Q3: {
    id: "Q3", cycle: 3, is_root: true,
    text: "How central is food to your travel experience?",
    answers: [
      { text: "Core priority",              weight: {}, next_question: "Q3A" },
      { text: "Important but not central",  weight: {}, next_question: "Q3B" },
      { text: "Just fuel",                  weight: {}, next_question: "Q3C" },
    ],
  },

  Q3A: {
    id: "Q3A", cycle: 3, is_root: false,
    text: "Which experience excites you more?",
    answers: [
      { text: "Street/local food",  weight: { Food: 3, Culture: 1 },  next_question: "Q4" },
      { text: "Fine dining",        weight: { Food: 2, Luxury: 2 },   next_question: "Q4" },
    ],
  },

  Q3B: {
    id: "Q3B", cycle: 3, is_root: false,
    text: "Food preference?",
    answers: [
      { text: "Authentic local",  weight: { Food: 2 },          next_question: "Q4" },
      { text: "Trendy/popular",   weight: { Food: 1, Social: 1 }, next_question: "Q4" },
    ],
  },

  Q3C: {
    id: "Q3C", cycle: 3, is_root: false,
    text: "If not food-focused, what excites you instead?",
    answers: [
      { text: "Activities",  weight: { Activity: 2 }, next_question: "Q4" },
      { text: "Scenery",     weight: { Nature: 2 },   next_question: "Q4" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // CYCLE 4 — COMFORT LEVEL
  // ═══════════════════════════════════════════════════════════

  Q4: {
    id: "Q4", cycle: 4, is_root: true,
    text: "What accommodation style feels right?",
    answers: [
      { text: "High-end luxury",          weight: {}, next_question: "Q4A" },
      { text: "Comfortable but practical", weight: {}, next_question: "Q4B" },
      { text: "Simple and authentic",      weight: {}, next_question: "Q4C" },
    ],
  },

  Q4A: {
    id: "Q4A", cycle: 4, is_root: false,
    text: "Luxury means?",
    answers: [
      { text: "5-star resort",    weight: { Luxury: 3, Relaxation: 1 },  next_question: "Q5" },
      { text: "Boutique design",  weight: { Luxury: 2, Culture: 1 },     next_question: "Q5" },
    ],
  },

  Q4B: {
    id: "Q4B", cycle: 4, is_root: false,
    text: "Comfort priority?",
    answers: [
      { text: "Location",   weight: { Culture: 1 },    next_question: "Q5" },
      { text: "Amenities",  weight: { Relaxation: 1 }, next_question: "Q5" },
    ],
  },

  Q4C: {
    id: "Q4C", cycle: 4, is_root: false,
    text: "Authentic means?",
    answers: [
      { text: "Local stays",  weight: { Culture: 2 }, next_question: "Q5" },
      { text: "Eco-lodge",    weight: { Nature: 2 },  next_question: "Q5" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // CYCLE 5 — SOCIAL ENERGY
  // ═══════════════════════════════════════════════════════════

  Q5: {
    id: "Q5", cycle: 5, is_root: true,
    text: "How social is your ideal trip?",
    answers: [
      { text: "Very social",        weight: {}, next_question: "Q5A" },
      { text: "Occasionally social", weight: {}, next_question: "Q5B" },
      { text: "Mostly private",      weight: {}, next_question: "Q5C" },
    ],
  },

  Q5A: {
    id: "Q5A", cycle: 5, is_root: false,
    text: "Preferred scene?",
    answers: [
      { text: "Clubs/bars",       weight: { Nightlife: 3 },              next_question: "Q6" },
      { text: "Events/festivals", weight: { Social: 2, Culture: 1 },    next_question: "Q6" },
    ],
  },

  Q5B: {
    id: "Q5B", cycle: 5, is_root: false,
    text: "Social moments usually around?",
    answers: [
      { text: "Dining",      weight: { Food: 1, Social: 1 },     next_question: "Q6" },
      { text: "Activities",  weight: { Activity: 1, Social: 1 }, next_question: "Q6" },
    ],
  },

  Q5C: {
    id: "Q5C", cycle: 5, is_root: false,
    text: "Privacy means?",
    answers: [
      { text: "Quiet nature",      weight: { Nature: 2 },     next_question: "Q6" },
      { text: "Resort isolation",  weight: { Relaxation: 2 }, next_question: "Q6" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // CYCLE 6 — ENVIRONMENT PREFERENCE
  // ═══════════════════════════════════════════════════════════

  Q6: {
    id: "Q6", cycle: 6, is_root: true,
    text: "What environment attracts you most?",
    answers: [
      { text: "Big cities",       weight: {}, next_question: "Q6A" },
      { text: "Mixed landscapes", weight: {}, next_question: "Q6B" },
      { text: "Natural settings", weight: {}, next_question: "Q6C" },
    ],
  },

  Q6A: {
    id: "Q6A", cycle: 6, is_root: false,
    text: "City focus?",
    answers: [
      { text: "Architecture/history",     weight: { Culture: 2 },              next_question: "END" },
      { text: "Modern vibe/shopping",     weight: { Shopping: 2, Nightlife: 1 }, next_question: "END" },
    ],
  },

  Q6B: {
    id: "Q6B", cycle: 6, is_root: false,
    text: "If mixed, what dominates?",
    answers: [
      { text: "Urban exploring",  weight: { Culture: 1 }, next_question: "END" },
      { text: "Outdoor scenery",  weight: { Nature: 1 },  next_question: "END" },
    ],
  },

  Q6C: {
    id: "Q6C", cycle: 6, is_root: false,
    text: "Preferred nature?",
    answers: [
      { text: "Mountains/adventure",  weight: { Nature: 2, Adventure: 2 },   next_question: "END" },
      { text: "Beach/tropical",       weight: { Nature: 2, Relaxation: 2 },  next_question: "END" },
    ],
  },
};

// ── ARCHETYPE LOOKUP (for UI display) ─────────────────────────────────────────

const ARCHETYPE_FROM_PRIMARY: Record<ProfileTrait, string> = {
  Activity:   "Active Explorer",
  Culture:    "Cultural Enthusiast",
  Food:       "Culinary Explorer",
  Luxury:     "Luxury Escapist",
  Nightlife:  "Social Traveler",
  Nature:     "Outdoor Explorer",
  Relaxation: "Pure Relaxer",
  Adventure:  "Thrill Seeker",
  Shopping:   "Style Curator",
  Social:     "Social Butterfly",
};

// ── SCORING ───────────────────────────────────────────────────────────────────

/**
 * Compute the final travel profile from accumulated raw scores.
 *
 * - raw_scores:         summed weights from all branch-question answers
 * - normalized_scores:  each value / 12  (12 = total questions answered)
 * - primary_trait:      highest raw-score dimension
 * - secondary_trait:    second-highest raw-score dimension
 * - archetype:          UI display string derived from primary_trait
 */
export function computeProfile(vec: ProfileVector): TravelProfile {
  const raw_scores: ProfileVector = { ...vec };

  const normalized_scores = {} as ProfileVector;
  for (const t of TRAITS) {
    normalized_scores[t] = Number((vec[t] / TOTAL_QUESTIONS).toFixed(3));
  }

  const sorted = [...TRAITS].sort((a, b) => raw_scores[b] - raw_scores[a]);
  const primary_trait   = sorted[0];
  const secondary_trait = sorted[1];
  const archetype       = ARCHETYPE_FROM_PRIMARY[primary_trait];

  return { raw_scores, normalized_scores, primary_trait, secondary_trait, archetype };
}
