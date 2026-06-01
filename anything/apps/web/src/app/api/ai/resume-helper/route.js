import { inflateSync, inflateRawSync } from "node:zlib";

// Force dynamic rendering — never cache AI responses at the edge
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const MAX_DESC = 5000;
const MAX_RESUME = 8000;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

// ─────────────────────────────────────────────────────────────────────────────
// NLP helpers — keyword extraction & scoring
// ─────────────────────────────────────────────────────────────────────────────

/**
 * STOPWORDS — closed-class function words that carry zero semantic weight.
 * These are removed before any analysis.
 */
const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "not",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "we",
  "our",
  "you",
  "your",
  "they",
  "their",
  "as",
  "if",
  "when",
  "where",
  "which",
  "who",
  "how",
  "all",
  "some",
  "more",
  "about",
  "than",
  "then",
  "so",
  "while",
  "both",
  "each",
  "such",
  "no",
  "nor",
  "also",
  "into",
  "up",
  "out",
  "make",
  "able",
  "based",
  "across",
  "via",
  "per",
  "any",
  "other",
  "new",
  "within",
  "plus",
]);

/**
 * FILLER_WORDS — open-class words that appear in virtually every job description
 * and convey zero ATS signal.  Any word landing here is dropped before scoring.
 *
 * Philosophy: would a recruiter highlight this word as a required skill or tool?
 * If the answer is "no", it goes here.
 */
const FILLER_WORDS = new Set([
  // ── Explicitly requested additions ───────────────────────────────────────
  "duties",
  "information",
  "functions",
  "intended",
  "only",
  "additional",
  "below",
  "capable",
  "perform",
  "performing",
  "tasks",
  "task",
  "work",
  "working",
  "using",
  "used",
  "use",

  // ── Job posting structural scaffolding ────────────────────────────────────
  "description",
  "overview",
  "summary",
  "detail",
  "details",
  "list",
  "example",
  "examples",
  "case",
  "cases",
  "instance",
  "instances",
  "situation",
  "situations",
  "condition",
  "conditions",
  "matter",
  "matters",
  "issue",
  "issues",
  "aspect",
  "aspects",
  "factor",
  "factors",
  "feature",
  "features",
  "element",
  "elements",
  "component",
  "components",
  "item",
  "items",
  "point",
  "points",
  "section",
  "sections",
  "part",
  "parts",
  "step",
  "steps",
  "stage",
  "stages",
  "phase",
  "phases",
  "include",
  "includes",
  "including",
  "please",
  "note",
  "however",
  "therefore",
  "thus",
  "hence",
  "although",
  "though",
  "because",
  "since",
  "unless",
  "until",
  "whereas",
  "whether",

  // ── Generic role & HR nouns ───────────────────────────────────────────────
  "role",
  "roles",
  "job",
  "jobs",
  "position",
  "positions",
  "career",
  "careers",
  "employee",
  "employees",
  "staff",
  "manager",
  "supervisor",
  "director",
  "coordinator",
  "specialist",
  "associate",
  "representative",
  "assistant",
  "analyst",
  "officer",
  "lead",
  "senior",
  "junior",
  "entry",
  "hire",
  "hiring",
  "candidate",
  "applicant",
  "candidates",
  "applicants",
  "interview",
  "onboarding",
  "training",
  "orientation",
  "handbook",
  "team",
  "teams",
  "company",
  "organization",
  "organisation",
  "business",
  "department",
  "division",
  "group",
  "unit",
  "stakeholder",
  "stakeholders",
  "member",
  "members",
  "colleague",
  "colleagues",
  "peer",
  "peers",
  "employer",
  "employees",

  // ── Generic responsibility / duty verbs ───────────────────────────────────
  "responsibility",
  "responsibilities",
  "requirements",
  "requirement",
  "ensure",
  "ensures",
  "ensuring",
  "support",
  "supports",
  "supporting",
  "assist",
  "assists",
  "assisting",
  "maintain",
  "maintains",
  "maintaining",
  "provide",
  "provides",
  "providing",
  "manage",
  "manages",
  "managing",
  "lead",
  "leads",
  "leading",
  "drive",
  "drives",
  "driving",
  "build",
  "builds",
  "building",
  "create",
  "creates",
  "creating",
  "develop",
  "develops",
  "developing",
  "deliver",
  "delivers",
  "delivering",
  "implement",
  "implements",
  "implementing",
  "execute",
  "executes",
  "executing",
  "define",
  "defines",
  "defining",
  "identify",
  "identifies",
  "identifying",
  "analyze",
  "analyzes",
  "analyse",
  "analyses",
  "review",
  "reviews",
  "reviewing",
  "improve",
  "improves",
  "improving",
  "enhance",
  "enhances",
  "enhancing",
  "leverage",
  "leverages",
  "leveraging",
  "utilize",
  "utilizes",
  "utilizing",
  "partner",
  "champion",
  "foster",
  "contribute",
  "contributes",
  "contributing",
  "collaborate",
  "collaborates",
  "collaborating",
  "communicate",
  "communicates",
  "communicating",
  "coordinate",
  "coordinates",
  "coordinating",
  "oversee",
  "oversees",
  "overseeing",
  "establish",
  "establishes",
  "establishing",
  "evaluate",
  "evaluates",
  "evaluating",
  "monitor",
  "monitors",
  "monitoring",
  "track",
  "tracks",
  "tracking",
  "report",
  "reports",
  "reporting",
  "present",
  "presents",
  "presenting",
  "handle",
  "handles",
  "handling",
  "conduct",
  "conducts",
  "conducting",
  "perform",
  "performs",
  "carry",
  "keep",
  "keeping",
  "meet",
  "meets",
  "meeting",
  "follow",
  "follows",
  "following",
  "update",
  "updates",
  "updating",
  "prepare",
  "prepares",
  "preparing",
  "complete",
  "completes",
  "completing",
  "submit",
  "submits",
  "submitting",
  "check",
  "checks",
  "checking",
  "contact",
  "contacts",
  "contacting",
  "schedule",
  "schedules",
  "scheduling",
  "send",
  "sends",
  "sending",
  "receive",
  "receives",
  "receiving",
  "obtain",
  "obtains",
  "obtaining",
  "share",
  "shares",
  "sharing",
  "answer",
  "answers",
  "answering",
  "respond",
  "responds",
  "responding",
  "address",
  "addresses",
  "addressing",
  "resolve",
  "resolves",
  "resolving",
  "research",
  "researches",
  "researching",
  "gather",
  "gathers",
  "gathering",
  "collect",
  "collects",
  "collecting",
  "enter",
  "enters",
  "entering",
  "record",
  "records",
  "recording",
  "store",
  "stores",
  "storing",
  "process",
  "processes",
  "processing",
  "help",
  "helps",
  "helping",
  "make",
  "makes",
  "making",
  "take",
  "takes",
  "taking",

  // ── Ability / skill descriptors ───────────────────────────────────────────
  "ability",
  "abilities",
  "skill",
  "skills",
  "knowledge",
  "understanding",
  "familiarity",
  "comfortable",
  "proficient",
  "proficiency",
  "competency",
  "competencies",
  "expertise",
  "expert",
  "capability",
  "capacity",
  "potential",
  "aptitude",
  "talent",

  // ── Vague positive adjectives ─────────────────────────────────────────────
  "professional",
  "strong",
  "excellent",
  "outstanding",
  "exceptional",
  "superior",
  "good",
  "great",
  "solid",
  "proven",
  "demonstrated",
  "demonstrable",
  "effective",
  "efficient",
  "creative",
  "innovative",
  "strategic",
  "passionate",
  "motivated",
  "driven",
  "focused",
  "organized",
  "organised",
  "proactive",
  "collaborative",
  "independent",
  "flexible",
  "adaptable",
  "reliable",
  "trustworthy",
  "diligent",
  "accurate",
  "fast",
  "quick",
  "detail",
  "oriented",

  // ── Soft-skill labels ─────────────────────────────────────────────────────
  "written",
  "verbal",
  "communication",
  "communications",
  "interpersonal",
  "problem",
  "solving",
  "thinking",
  "mindset",
  "attitude",
  "ethic",
  "initiative",
  "ownership",
  "accountability",
  "attention",
  "commitment",
  "dedication",
  "enthusiasm",
  "willingness",
  "desire",
  "self",
  "starter",
  "learner",
  "thinker",

  // ── Output / product nouns too generic to be keywords ────────────────────
  "product",
  "service",
  "services",
  "project",
  "projects",
  "initiative",
  "initiatives",
  "program",
  "programs",
  "workflow",
  "workflows",
  "solution",
  "solutions",
  "system",
  "systems",
  "platform",
  "platforms",
  "tools",
  "tool",
  "framework",
  "frameworks",
  "environment",
  "environments",
  "applications",
  "application",
  "demonstrates",
  "demonstrate",
  "development",
  "accountable",
  "frequently",
  "purpose",
  "client",
  "clients",
  "help",

  // ── Strategy / method nouns ───────────────────────────────────────────────
  "strategy",
  "strategies",
  "approach",
  "approaches",
  "method",
  "methods",
  "practice",
  "practices",
  "best",
  "standard",
  "standards",
  "guidelines",
  "policy",
  "policies",
  "procedure",
  "procedures",
  "process",
  "processes",

  // ── Scope / size / level words ────────────────────────────────────────────
  "level",
  "levels",
  "area",
  "areas",
  "field",
  "type",
  "types",
  "kind",
  "form",
  "scope",
  "scale",
  "range",
  "variety",
  "high",
  "low",
  "large",
  "small",
  "complex",
  "simple",
  "key",
  "important",
  "critical",
  "essential",
  "core",
  "primary",
  "secondary",
  "main",
  "major",
  "existing",
  "current",
  "latest",
  "modern",
  "advanced",
  "basic",
  "internal",
  "external",
  "global",
  "local",
  "cross",
  "functional",
  "various",
  "multiple",
  "related",
  "relevant",
  "general",
  "specific",

  // ── Time / frequency words ────────────────────────────────────────────────
  "year",
  "years",
  "month",
  "months",
  "week",
  "weeks",
  "day",
  "days",
  "hour",
  "hours",
  "full",
  "part",
  "time",
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "annually",
  "hourly",
  "occasionally",
  "regularly",
  "promptly",
  "timely",
  "deadline",
  "deadlines",
  "timeline",
  "timelines",
  "priority",
  "priorities",
  "urgent",
  "urgently",

  // ── Work-mode / location modifiers ───────────────────────────────────────
  "remote",
  "office",
  "hybrid",
  "onsite",
  "distributed",
  "async",
  "asynchronous",
  "location",
  "locations",
  "site",
  "sites",
  "floor",
  "building",
  "facility",
  "facilities",
  "headquarters",
  "branch",
  "branches",
  "region",
  "regions",

  // ── HR / recruiting scaffolding ───────────────────────────────────────────
  "required",
  "preferred",
  "ideal",
  "bonus",
  "nice",
  "added",
  "advantage",
  "benefit",
  "benefits",
  "salary",
  "compensation",
  "wage",
  "wages",
  "pay",
  "paid",
  "vacation",
  "leave",
  "holiday",
  "equity",
  "looking",
  "seeking",
  "candidate",
  "experience",
  "company",
  "position",
  "work",
  "job",
  "role",
  "need",
  "needs",
  "want",
  "must",
  "well",
  "also",
  "have",
  "will",
  "new",
  "using",
  "use",
  "used",
  "make",
  "able",
  "based",
  "including",
  "within",
  "across",
  "via",
  "per",
  "any",
  "other",
  "plus",
  "various",
  "multiple",
  "related",
  "relevant",
  "general",
  "specific",
  "both",
  "each",
  "such",

  // ── Explicitly weak standalone words (no ATS signal on their own) ─────────
  "electronic",
  "internet",
  "equipment",
  "supplies",
  "general",
  "hardcopy",
  "scanner",
  "printer",
  "copier",
  "clerical",
  "filing",
  "faxing",
  "typing",
  "phones",
  "incoming",
  "outgoing",
  "miscellaneous",
]);

const HEADING_PATTERNS = [
  /^requirements?[\s:]*$/i,
  /^qualifications?[\s:]*$/i,
  /^responsibilities[\s:]*$/i,
  /^what you.ll (do|bring|need|have)[\s:]*$/i,
  /^what we.re looking for[\s:]*$/i,
  /^(tech(nical)?|required?|must.have)[\s\w]*skills?[\s:]*$/i,
  /^(tools?|tech(nologies)?|stack)[\s:&]*$/i,
  /^(nice.to.have|bonus|preferred)[\s:]*$/i,
  /^you (have|bring|are|will)[\s:]*$/i,
  /^about (the|this) role[\s:]*$/i,
  /^(core|key|essential|required)\s+(competencies|skills|qualifications)[\s:]*$/i,
  /^(minimum|preferred)\s+(qualifications?|requirements?)[\s:]*$/i,
];

const TOP_KEYWORDS_LIMIT = 15;

// ─────────────────────────────────────────────────────────────────────────────
// Synonym dictionary — canonical term → array of semantically equivalent phrases
// Used to count a keyword as "matched" even when the resume uses different wording.
// ─────────────────────────────────────────────────────────────────────────────
const SYNONYM_MAP = new Map([
  // Medical / clinical
  [
    "emr",
    [
      "electronic medical records",
      "electronic health record",
      "ehr",
      "medical records software",
      "medical records system",
    ],
  ],
  [
    "ehr",
    [
      "electronic health records",
      "electronic medical record",
      "emr",
      "medical records software",
    ],
  ],
  [
    "hipaa",
    [
      "data privacy",
      "privacy standards",
      "health information privacy",
      "data compliance",
      "hipaa compliance",
      "phi",
    ],
  ],
  [
    "icd",
    [
      "diagnosis codes",
      "medical coding",
      "icd-10",
      "icd-9",
      "icd codes",
      "diagnostic codes",
    ],
  ],
  [
    "cpt",
    ["procedure codes", "billing codes", "medical coding", "procedural codes"],
  ],
  [
    "medical billing",
    [
      "claims processing",
      "revenue cycle",
      "insurance billing",
      "claims submission",
      "billing cycle",
    ],
  ],
  [
    "prior authorization",
    [
      "prior auth",
      "insurance authorization",
      "pre-authorization",
      "auth requests",
    ],
  ],
  [
    "scheduling",
    [
      "appointment setting",
      "calendar management",
      "appointment scheduling",
      "booking appointments",
    ],
  ],
  [
    "documentation",
    [
      "record keeping",
      "charting",
      "clinical notes",
      "medical notes",
      "clinical documentation",
      "patient records",
    ],
  ],
  [
    "insurance",
    [
      "health insurance",
      "medical insurance",
      "insurance verification",
      "payer",
    ],
  ],

  // Data / admin
  [
    "transcribe",
    [
      "data entry",
      "input data",
      "transcription",
      "keying data",
      "key in data",
      "entering data",
    ],
  ],
  [
    "data entry",
    [
      "transcription",
      "transcribing",
      "input data",
      "keying data",
      "typing data",
      "entering records",
    ],
  ],
  [
    "inbox",
    [
      "email management",
      "email correspondence",
      "shared inbox",
      "incoming mail",
      "correspondence management",
    ],
  ],

  // Remote work
  [
    "remote",
    [
      "work from home",
      "wfh",
      "distributed team",
      "virtual team",
      "telecommute",
      "fully remote",
    ],
  ],
  [
    "remote work",
    ["work from home", "wfh", "distributed", "virtual", "telecommute"],
  ],
  [
    "async",
    ["asynchronous", "asynchronous communication", "async communication"],
  ],

  // CRM / tools
  [
    "salesforce",
    ["crm system", "crm", "customer relationship management", "crm platform"],
  ],
  [
    "crm",
    [
      "salesforce",
      "customer relationship management",
      "hubspot",
      "crm system",
      "crm platform",
    ],
  ],
  [
    "excel",
    [
      "spreadsheet",
      "microsoft excel",
      "google sheets",
      "ms excel",
      "spreadsheets",
    ],
  ],
  [
    "microsoft office",
    [
      "ms office",
      "office suite",
      "word and excel",
      "microsoft word",
      "ms office suite",
    ],
  ],

  // Business / general
  [
    "customer service",
    [
      "client relations",
      "patient relations",
      "client service",
      "customer support",
      "client support",
    ],
  ],
  [
    "billing",
    [
      "invoicing",
      "accounts receivable",
      "invoice processing",
      "claims",
      "medical billing",
    ],
  ],
]);

/**
 * Lightweight morphological stem — strips common inflectional suffixes.
 * NOT a full Porter stemmer: designed to be fast and low-false-positive.
 * "transcribing" → "transcrib", "records" → "record", "processing" → "process"
 */
function stemLight(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length < 5) return w;
  if (w.endsWith("inging")) return w.slice(0, -6);
  if (w.endsWith("tions")) return w.slice(0, -5);
  if (w.endsWith("tion")) return w.slice(0, -4);
  if (w.endsWith("ings")) return w.slice(0, -4);
  if (w.endsWith("ing")) return w.slice(0, -3);
  if (w.endsWith("ers")) return w.slice(0, -3);
  if (w.endsWith("er")) return w.slice(0, -2);
  if (w.endsWith("ed")) return w.slice(0, -2);
  if (w.endsWith("ly")) return w.slice(0, -2);
  if (w.endsWith("s") && w.length > 5) return w.slice(0, -1);
  return w;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function extractPhrases(text) {
  const words = tokenize(text);
  const unigrams = [...new Set(words)];
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++)
    bigrams.push(words[i] + " " + words[i + 1]);
  return { unigrams, bigrams: [...new Set(bigrams)] };
}

/**
 * Extract high-signal ATS keywords — preferring multi-word phrases over bare words.
 *
 * Priority (highest → lowest score):
 *   1. Job-title terms                           (+6)
 *   2. Capitalized sequences + lowercase tail    (+5 phrase / +3 bare acronym)
 *      e.g. "HIPAA compliance", "EMR systems", "Salesforce CRM"
 *   3. Bigrams from skill sections where ≥1 word has signal  (+3 both signal / +1 one)
 *      e.g. "revenue cycle", "claims processing", "shared inbox"
 *
 * Returns at most `limit` entries preserving original display casing.
 */
function extractTopKeywords(
  jobDescription,
  jobTitle,
  limit = TOP_KEYWORDS_LIMIT,
) {
  // ── Step 1: Isolate skill-section lines ───────────────────────────────────
  const lines = jobDescription.split(/\n/);
  const sectionLines = [];
  let sectionLinesLeft = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    const isHeading =
      HEADING_PATTERNS.some((p) => p.test(trimmed)) ||
      (trimmed.length < 60 &&
        /^[A-Z]/.test(trimmed) &&
        /requirement|qualification|responsibilit|skill|must.have|technical|tools?|competenc/i.test(
          trimmed,
        ));
    if (isHeading) sectionLinesLeft = 25;
    if (sectionLinesLeft > 0) {
      sectionLinesLeft--;
      sectionLines.push(line);
    }
  }
  // Fall back to full JD when no headings fire
  const sectionText =
    sectionLines.length > 5 ? sectionLines.join(" ") : jobDescription;

  // ── Step 2: Phrase map: lowercase_key → { score, display } ───────────────
  const phraseMap = new Map();
  function addPhrase(display, score) {
    const key = display.toLowerCase().trim();
    if (!key || key.length < 3) return;
    const existing = phraseMap.get(key);
    if (existing) {
      existing.score += score;
    } else {
      phraseMap.set(key, { score, display: display.trim() });
    }
  }

  // ── Step 3: Capitalized sequences from full JD ────────────────────────────
  // Matches ALLCAPS acronyms (HIPAA, EMR, CRM) and TitleCase names (Salesforce).
  // Appends up to 2 lowercase words when they add meaning → "HIPAA compliance".
  // Regex uses character classes only (no backtick/template issues).
  const capSeqRe =
    /\b([A-Z][A-Za-z0-9+#.]{1,}|[A-Z]{2,}[0-9]*)(\s+[a-z][a-z]{2,}(?:\s+[a-z][a-z]{2,})?)?/g;
  let cm;
  while ((cm = capSeqRe.exec(jobDescription)) !== null) {
    const cap = cm[1];
    const capL = cap.toLowerCase();
    if (STOPWORDS.has(capL) || FILLER_WORDS.has(capL) || cap.length < 2)
      continue;
    const tail = (cm[2] || "").trim();
    const cleanTail = tail
      .split(/\s+/)
      .filter((w) => !FILLER_WORDS.has(w) && !STOPWORDS.has(w) && w.length > 2)
      .join(" ");
    const phrase = cleanTail ? cap + " " + cleanTail : cap;
    addPhrase(phrase, cleanTail ? 5 : 3);
  }

  // ── Step 4: Bigrams from skill sections ───────────────────────────────────
  // Lighter filter: STOPWORDS only, so "processing" survives for "claims processing".
  const rawSectionTokens = tokenize(sectionText); // tokenize already strips STOPWORDS
  for (let i = 0; i < rawSectionTokens.length - 1; i++) {
    const w1 = rawSectionTokens[i];
    const w2 = rawSectionTokens[i + 1];
    if (w1.length < 3 || w2.length < 3) continue;
    const w1Signal = !FILLER_WORDS.has(w1);
    const w2Signal = !FILLER_WORDS.has(w2);
    // Require at least one non-filler word so pure filler bigrams are excluded
    if (!w1Signal && !w2Signal) continue;
    addPhrase(w1 + " " + w2, w1Signal && w2Signal ? 3 : 1);
  }

  // ── Step 5: Collect job-title stems → exclusion set ──────────────────────
  // Title words like "Case", "Entry", "Specialist" from "Case Entry Specialist"
  // are NOT meaningful ATS keywords — exclude them from the scoring pool entirely.
  const titleExclusionStems = new Set(
    tokenize(jobTitle)
      .filter((w) => w.length > 2)
      .map(stemLight),
  );

  // ── Step 6: Rank, remove covered sub-phrases, return top `limit` ──────────
  const ranked = [...phraseMap.values()].sort((a, b) => b.score - a.score);
  const selected = [];
  for (const entry of ranked) {
    if (selected.length >= limit) break;
    const keyL = entry.display.toLowerCase();

    // Drop if entry is purely composed of job-title words
    const entryWordStems = keyL.split(/\s+/).map(stemLight);
    const isPurelyTitleTerm =
      entryWordStems.length <= 2 &&
      entryWordStems.every((s) => titleExclusionStems.has(s));
    if (isPurelyTitleTerm) continue;

    // Drop if a higher-ranked phrase already contains this text as a sub-phrase
    const covered = selected.some(
      (s) =>
        s.display.toLowerCase().includes(keyL) && s.display !== entry.display,
    );
    if (!covered) selected.push(entry);
  }
  return selected.map((e) => e.display);
}

/**
 * Intelligent keyword matching — returns { matched, matchType, matchedVia }.
 *
 * Matching tiers (tried in order, stops at first hit):
 *  1. exact       — phrase appears verbatim in resume (token-set or substring)
 *  2. partial     — stem of keyword root matches a resume word stem
 *                   "transcribe" ↔ "transcribing", "record" ↔ "records"
 *  3. synonym     — SYNONYM_MAP entry found as substring in resume
 *  4. substring   — acronym/short word contained inside a longer resume token
 *                   "EMR" inside "EMRs", "HIPAA" inside "HIPAA-compliant"
 *
 * @param {string}   phrase        — keyword or phrase from JD
 * @param {Set}      resumeWordSet — Set of lowercased tokens from resume
 * @param {string}   resumeLower   — full resume text, lowercased + punct-stripped
 * @param {Map}      resumeStemMap — Map<stem → original word> for resume tokens
 * @returns {{ matched: boolean, matchType: string|null, matchedVia: string|null }}
 */
function keywordMatchInResume(
  phrase,
  resumeWordSet,
  resumeLower,
  resumeStemMap,
) {
  const phraseLower = phrase.toLowerCase().trim();
  const phraseWords = phraseLower.split(/\s+/);

  // ── Tier 1: Exact match ───────────────────────────────────────────────────
  if (phraseWords.length === 1) {
    if (resumeWordSet.has(phraseWords[0])) {
      return { matched: true, matchType: "exact", matchedVia: phraseWords[0] };
    }
  } else {
    if (resumeLower.includes(phraseLower)) {
      return { matched: true, matchType: "exact", matchedVia: phraseLower };
    }
  }

  // ── Tier 2: Stem / partial match ─────────────────────────────────────────
  if (phraseWords.length === 1) {
    const kStem = stemLight(phraseWords[0]);
    if (kStem.length >= 4 && resumeStemMap.has(kStem)) {
      return {
        matched: true,
        matchType: "partial",
        matchedVia: resumeStemMap.get(kStem) + " (≈ " + phraseWords[0] + ")",
      };
    }
  } else {
    // Multi-word: require all significant words to appear (via stems)
    const sigStems = phraseWords
      .filter((w) => !STOPWORDS.has(w) && w.length > 2)
      .map(stemLight);
    if (sigStems.length > 0 && sigStems.every((s) => resumeStemMap.has(s))) {
      const matchedWords = sigStems.map((s) => resumeStemMap.get(s)).join(" ");
      return {
        matched: true,
        matchType: "partial",
        matchedVia: matchedWords + " (≈ " + phraseLower + ")",
      };
    }
  }

  // ── Tier 3: Synonym match ─────────────────────────────────────────────────
  const synonyms = SYNONYM_MAP.get(phraseLower) || [];
  for (const syn of synonyms) {
    if (resumeLower.includes(syn)) {
      return {
        matched: true,
        matchType: "synonym",
        matchedVia: '"' + syn + '"',
      };
    }
    // Stem-match single-word synonyms
    if (!syn.includes(" ")) {
      const synStem = stemLight(syn);
      if (synStem.length >= 4 && resumeStemMap.has(synStem)) {
        return {
          matched: true,
          matchType: "synonym",
          matchedVia: resumeStemMap.get(synStem) + ' (≈ synonym "' + syn + '")',
        };
      }
    }
  }
  // Also check if the resume phrase matches any value in SYNONYM_MAP whose canonical
  // key equals the keyword — e.g. resume has "electronic medical records" → matches "emr"
  for (const [canonical, syns] of SYNONYM_MAP) {
    if (canonical === phraseLower) continue; // already checked above
    if (
      syns.includes(phraseLower) ||
      syns.some((s) => phraseLower.startsWith(s) || s.startsWith(phraseLower))
    )
      continue;
    // check if canonical matches keyword and any syn is in resume
    if (canonical === phraseLower) {
      for (const s of syns) {
        if (resumeLower.includes(s)) {
          return {
            matched: true,
            matchType: "synonym",
            matchedVia: '"' + s + '"',
          };
        }
      }
    }
  }

  // ── Tier 4: Substring containment for acronyms/short tokens ─────────────
  // "EMR" inside "EMRs", "HIPAA" inside "HIPAA-compliant"
  if (phraseWords.length === 1 && phraseWords[0].length >= 3) {
    const kw = phraseWords[0];
    for (const rw of resumeWordSet) {
      if (rw.length > kw.length && rw.startsWith(kw)) {
        return { matched: true, matchType: "substring", matchedVia: rw };
      }
    }
  }

  return { matched: false, matchType: null, matchedVia: null };
}

/**
 * baseScore = (matchedCount / totalScoringKeywords) × 100
 * bonus     = min(bigramScore × 2, 10)
 * finalScore = clamp(round(base + bonus), 5, 100)
 */
function computeScore(matchedCount, totalScoringKeywords, bigramScore) {
  const total = totalScoringKeywords || 1;
  const baseScore = (matchedCount / total) * 100;
  const bonus = Math.min((bigramScore || 0) * 2, 10);
  let finalScore = Math.round(baseScore + bonus);
  if (finalScore > 100) finalScore = 100;
  if (finalScore < 5) finalScore = 5;
  return {
    finalScore,
    baseScore: Math.round(baseScore),
    bonus: Math.round(bonus),
  };
}

function keywordFallback(jobTitle, jobDescription, resume) {
  const resumeWordSet = new Set(tokenize(resume));
  const resumeLower = resume.toLowerCase().replace(/[^a-z0-9\s+#]/g, " ");

  // Build stem → first-seen-original-word map for fuzzy matching
  const resumeStemMap = new Map();
  for (const w of resumeWordSet) {
    const s = stemLight(w);
    if (!resumeStemMap.has(s)) resumeStemMap.set(s, w);
  }

  const allFiltered = [
    ...new Set(
      tokenize(jobDescription).filter(
        (w) => w.length > 3 && !FILLER_WORDS.has(w) && !/^\d+$/.test(w),
      ),
    ),
  ];

  const topKeywords = extractTopKeywords(
    jobDescription,
    jobTitle,
    TOP_KEYWORDS_LIMIT,
  );

  // Rich match results: { keyword, matched, matchType, matchedVia }
  const matchResults = topKeywords.map((p) => {
    const r = keywordMatchInResume(
      p,
      resumeWordSet,
      resumeLower,
      resumeStemMap,
    );
    return { keyword: p, ...r };
  });

  const matchedKeywords = matchResults.filter((r) => r.matched);
  const missingKeywords = matchResults
    .filter((r) => !r.matched)
    .map((r) => r.keyword);
  const matchedKeywordCount = matchedKeywords.length;
  const missingKeywordCount = missingKeywords.length;

  const jdPhrases = extractPhrases(jobDescription);
  const matchedBigrams = jdPhrases.bigrams.filter((bg) =>
    resumeLower.includes(bg),
  );
  const bigramScore =
    jdPhrases.bigrams.length > 0
      ? (matchedBigrams.length / jdPhrases.bigrams.length) * 100
      : 0;

  const { finalScore, baseScore, bonus } = computeScore(
    matchedKeywordCount,
    topKeywords.length,
    bigramScore,
  );

  const displayMissing = missingKeywords.slice(0, 10);
  const topJD = topKeywords.filter((w) => w.length > 4).slice(0, 4);

  return {
    matchScore: finalScore,
    missingKeywords: displayMissing,
    improvedSummary:
      `Results-driven professional with proven remote-work experience seeking a ${jobTitle} role. ` +
      `Skilled in ${topJD.slice(0, 2).join(", ")} with a track record of delivering high-impact outcomes ` +
      `across distributed teams. Committed to async-first collaboration and continuous improvement.`,
    improvedBulletPoints: [
      `Delivered measurable results in ${topJD[0] || "core responsibilities"}, increasing team efficiency by identifying and resolving process gaps`,
      `Collaborated asynchronously with cross-functional global teams using Slack, Notion, and Zoom to ensure seamless remote delivery`,
      `Led end-to-end projects in a fully remote environment, maintaining on-time delivery and scope adherence across time zones`,
      `Applied ${topJD.slice(0, 2).join(" and ")} expertise to drive data-informed decisions and measurable business outcomes`,
      `Mentored junior team members and documented workflows to support remote knowledge sharing and onboarding`,
    ],
    recommendations: [
      `Add these missing keywords to your resume: ${displayMissing.slice(0, 6).join(", ") || "review the JD for key terms"}`,
      `Open with a strong professional summary specifically tailored to the ${jobTitle} role`,
      `Quantify every achievement — use numbers, percentages, or timeframes wherever possible`,
      `Highlight remote-specific skills: async communication, self-management, digital collaboration tools`,
      `Add a dedicated Skills section listing all tools and technologies mentioned in the job description`,
    ],
    // _debug intentionally omitted from client responses
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF text extraction — pure Node.js, buffer-aware (no external packages)
// ─────────────────────────────────────────────────────────────────────────────

/** Find needle Buffer in haystack Buffer from position start. Returns -1 if not found. */
function bufIndexOf(haystack, needle, start = 0) {
  const nl = needle.length;
  const limit = haystack.length - nl;
  outer: for (let i = start; i <= limit; i++) {
    for (let j = 0; j < nl; j++) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

/** Try zlib inflate, then raw deflate, then return raw data unchanged. */
function tryDecompress(data) {
  try {
    return inflateSync(data);
  } catch (_) {}
  try {
    return inflateRawSync(data);
  } catch (_) {}
  return data;
}

/**
 * Decode a PDF literal string (already stripped of outer parens).
 * Handles UTF-16BE (BOM 0xFE FF), octal escapes, and standard backslash escapes.
 */
function decodePdfString(raw) {
  // UTF-16 BE BOM
  if (
    raw.length >= 2 &&
    raw.charCodeAt(0) === 0xfe &&
    raw.charCodeAt(1) === 0xff
  ) {
    let out = "";
    for (let i = 2; i + 1 < raw.length; i += 2) {
      const cp = (raw.charCodeAt(i) << 8) | raw.charCodeAt(i + 1);
      if (cp === 0x20 || (cp >= 0x21 && cp <= 0x7e) || cp > 0xa0) {
        try {
          out += String.fromCodePoint(cp);
        } catch (_) {}
      } else if (cp === 0x09 || cp === 0x0a || cp === 0x0d) {
        out += " ";
      }
    }
    return out;
  }

  // Latin-1 with PDF escape handling
  let out = "";
  let i = 0;
  while (i < raw.length) {
    const c = raw[i];
    if (c === "\\") {
      const n = raw[i + 1] || "";
      if (n === "n") {
        out += " ";
        i += 2;
      } else if (n === "r") {
        out += " ";
        i += 2;
      } else if (n === "t") {
        out += "\t";
        i += 2;
      } else if (n === "(" || n === ")" || n === "\\") {
        out += n;
        i += 2;
      } else if (n >= "0" && n <= "7") {
        let oct = n;
        i += 2;
        if (i < raw.length && raw[i] >= "0" && raw[i] <= "7") oct += raw[i++];
        if (i < raw.length && raw[i] >= "0" && raw[i] <= "7") oct += raw[i++];
        out += String.fromCharCode(parseInt(oct, 8));
      } else {
        i += 2;
      }
    } else {
      const code = raw.charCodeAt(i);
      if (code >= 0x20 && code <= 0x7e) out += c;
      else if (code > 0xa0)
        out += c; // extended latin-1
      else if (code === 0x09 || code === 0x0a || code === 0x0d) out += " ";
      i++;
    }
  }
  return out;
}

/**
 * Extract printable strings from a PDF content stream.
 * Finds BT…ET blocks then scans balanced parenthesised literal strings inside them.
 */
function extractFromContentStream(content) {
  const texts = [];
  let pos = 0;

  while (pos < content.length) {
    // ── Find BT keyword ──────────────────────────────────────────────────
    const bt = content.indexOf("BT", pos);
    if (bt === -1) break;

    // Must be a standalone token (not inside a word like "OBTAIN")
    const prevBT = bt > 0 ? content[bt - 1] : " ";
    const nextBT = bt + 2 < content.length ? content[bt + 2] : " ";
    if (/[A-Za-z0-9*']/.test(prevBT) || /[A-Za-z0-9*']/.test(nextBT)) {
      pos = bt + 2;
      continue;
    }

    // ── Find matching ET keyword ─────────────────────────────────────────
    let et = content.indexOf("ET", bt + 2);
    while (et !== -1) {
      const p = et > 0 ? content[et - 1] : " ";
      const n = et + 2 < content.length ? content[et + 2] : " ";
      if (!/[A-Za-z0-9*']/.test(p) && !/[A-Za-z0-9*']/.test(n)) break;
      et = content.indexOf("ET", et + 2);
    }
    if (et === -1) {
      pos = bt + 2;
      break;
    }

    const block = content.slice(bt + 2, et);
    pos = et + 2;

    // ── Extract balanced parenthesised strings from block ────────────────
    let i = 0;
    while (i < block.length) {
      if (block[i] !== "(") {
        i++;
        continue;
      }
      i++; // skip opening paren

      let depth = 1;
      let raw = "";
      while (i < block.length && depth > 0) {
        const ch = block[i];
        if (ch === "\\") {
          raw += ch;
          if (i + 1 < block.length) raw += block[i + 1];
          i += 2;
        } else if (ch === "(") {
          depth++;
          raw += ch;
          i++;
        } else if (ch === ")") {
          depth--;
          if (depth > 0) raw += ch;
          i++;
        } else {
          raw += ch;
          i++;
        }
      }

      const decoded = decodePdfString(raw);
      const clean = decoded.replace(/[\x00-\x1F\x7F]/g, " ").trim();
      if (clean.length > 0 && /[A-Za-z0-9]/.test(clean)) {
        texts.push(clean);
      }
    }
  }

  return texts;
}

/**
 * Extract all text from a PDF Buffer.
 * Strategy:
 *   1. Walk every stream…endstream block using buffer byte scanning (not string regex).
 *   2. Decompress each stream (FlateDecode via zlib, then raw deflate, then raw).
 *   3. Decode BT…ET blocks → parenthesised literal strings → decoded text.
 *   4. If the primary path yields too little text, fall back to raw ASCII letter-run scanning.
 */
function pdfExtractText(buffer) {
  const STREAM_MARKER = Buffer.from("stream");
  const ENDSTREAM_MARKER = Buffer.from("endstream");

  const allTexts = [];
  let pos = 0;
  let streamsFound = 0;
  let streamsDecoded = 0;
  let streamsWithText = 0;

  while (pos < buffer.length) {
    // ── Locate 'stream' keyword ──────────────────────────────────────────
    const streamPos = bufIndexOf(buffer, STREAM_MARKER, pos);
    if (streamPos === -1) break;

    // The byte immediately after 'stream' must be CR or LF (PDF spec §7.3.8.1)
    const afterKeyword = streamPos + 6;
    if (afterKeyword < buffer.length) {
      const b = buffer[afterKeyword];
      if (b !== 0x0a && b !== 0x0d) {
        pos = streamPos + 6;
        continue;
      }
    }

    // Skip the line ending (CR, LF, or CRLF)
    let dataStart = afterKeyword;
    if (dataStart < buffer.length && buffer[dataStart] === 0x0d) dataStart++;
    if (dataStart < buffer.length && buffer[dataStart] === 0x0a) dataStart++;

    // ── Locate 'endstream' ───────────────────────────────────────────────
    const endPos = bufIndexOf(buffer, ENDSTREAM_MARKER, dataStart);
    if (endPos === -1) break;

    streamsFound++;

    // Trim trailing whitespace from stream content
    let dataEnd = endPos;
    while (
      dataEnd > dataStart &&
      (buffer[dataEnd - 1] === 0x0a ||
        buffer[dataEnd - 1] === 0x0d ||
        buffer[dataEnd - 1] === 0x20)
    ) {
      dataEnd--;
    }

    if (dataEnd > dataStart) {
      const rawStream = buffer.slice(dataStart, dataEnd);
      const decompressed = tryDecompress(rawStream);
      streamsDecoded++;

      const content = decompressed.toString("latin1");
      const texts = extractFromContentStream(content);

      if (texts.length > 0) {
        streamsWithText++;
        allTexts.push(...texts);
      }
    }

    pos = endPos + 9; // advance past 'endstream'
  }

  // ── Primary result ───────────────────────────────────────────────────────
  const primary = allTexts.join(" ").replace(/\s+/g, " ").trim();
  if (primary.length >= 80) return primary;

  // ── Fallback: scan raw buffer for ASCII letter-run sequences ─────────────
  // Catches uncompressed PDFs and partially-decoded content
  const raw = buffer.toString("latin1");
  const runs = [];
  let cur = "";
  for (let i = 0; i < raw.length; i++) {
    const cp = raw.charCodeAt(i);
    if (cp >= 0x21 && cp <= 0x7e) {
      cur += raw[i];
    } else {
      if (cur.length >= 5 && /[A-Za-z]{3,}/.test(cur)) runs.push(cur);
      cur = "";
    }
  }
  if (cur.length >= 5 && /[A-Za-z]{3,}/.test(cur)) runs.push(cur);

  const fallback = runs.join(" ").replace(/\s+/g, " ").trim();
  if (fallback.length >= 200) return fallback;

  throw new Error(
    `No readable text found — scanned ${streamsFound} streams, decoded ${streamsDecoded}, ` +
      `found text in ${streamsWithText}. PDF may be image-based, scanned, or encrypted.`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCX text extraction — minimal ZIP + inflateRawSync (no external packages)
// ─────────────────────────────────────────────────────────────────────────────

function docxExtractText(buffer) {
  const EOCD_SIG = 0x06054b50;
  const CD_SIG = 0x02014b50;
  const LFH_SIG = 0x04034b50;

  let eocdPos = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === EOCD_SIG) {
      eocdPos = i;
      break;
    }
  }
  if (eocdPos === -1)
    throw new Error("Not a valid ZIP/DOCX (EOCD record not found)");

  const cdOffset = buffer.readUInt32LE(eocdPos + 16);
  const cdEntries = buffer.readUInt16LE(eocdPos + 8);

  let offset = cdOffset;
  for (let i = 0; i < cdEntries; i++) {
    if (buffer.readUInt32LE(offset) !== CD_SIG) break;

    const compression = buffer.readUInt16LE(offset + 10);
    const compSize = buffer.readUInt32LE(offset + 20);
    const nameLen = buffer.readUInt16LE(offset + 28);
    const extraLen = buffer.readUInt16LE(offset + 30);
    const commentLen = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const fileName = buffer
      .slice(offset + 46, offset + 46 + nameLen)
      .toString("utf8");

    if (fileName === "word/document.xml") {
      if (buffer.readUInt32LE(localOffset) !== LFH_SIG)
        throw new Error("Corrupt local file header in DOCX");

      const lfhNameLen = buffer.readUInt16LE(localOffset + 26);
      const lfhExtraLen = buffer.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + lfhNameLen + lfhExtraLen;

      let data = buffer.slice(dataStart, dataStart + compSize);
      if (compression === 8) data = inflateRawSync(data);

      const xml = data.toString("utf8");
      const parts = [];
      const wtRe = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
      let m;
      while ((m = wtRe.exec(xml)) !== null) {
        const s = m[1].trim();
        if (s) parts.push(s);
      }

      if (!parts.length)
        throw new Error(
          "word/document.xml has no <w:t> nodes — document may be empty",
        );

      return parts.join(" ").replace(/\s+/g, " ").trim();
    }

    offset += 46 + nameLen + extraLen + commentLen;
  }

  throw new Error(
    "word/document.xml not found inside DOCX — file may be corrupted",
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// extractTextFromBuffer — dispatcher with full debug output
// ─────────────────────────────────────────────────────────────────────────────

async function extractTextFromBuffer(buffer, filename) {
  const lower = (filename || "unknown").toLowerCase();
  const ext = lower.split(".").pop();

  if (ext === "pdf") {
    try {
      const text = pdfExtractText(buffer);
      if (!text || text.length < 20)
        throw new Error(
          `Extracted text too short (${text?.length ?? 0} chars) — PDF may be image-based`,
        );
      return {
        text,
        error: null,
        extractionDebug: {
          fileType: "pdf",
          extractedCharCount: text.length,
          extractionStatus: "success",
        },
      };
    } catch (e) {
      const msg = e?.message || "Unknown PDF extraction error";
      console.error("[resume-helper] PDF extraction failed:", msg);
      return {
        text: null,
        error: `PDF could not be parsed: ${msg}. Please paste your resume text instead.`,
        extractionDebug: {
          fileType: "pdf",
          extractedCharCount: 0,
          extractionStatus: "failed",
          extractionError: msg,
        },
      };
    }
  }

  if (ext === "docx" || ext === "doc") {
    try {
      const text = docxExtractText(buffer);
      if (!text || text.length < 20)
        throw new Error(
          `Extracted text too short (${text?.length ?? 0} chars)`,
        );
      return {
        text,
        error: null,
        extractionDebug: {
          fileType: ext,
          extractedCharCount: text.length,
          extractionStatus: "success",
        },
      };
    } catch (e) {
      const msg = e?.message || "Unknown DOCX extraction error";
      console.error("[resume-helper] DOCX extraction failed:", msg);
      return {
        text: null,
        error: `DOCX could not be parsed: ${msg}. Please paste your resume text instead.`,
        extractionDebug: {
          fileType: ext,
          extractedCharCount: 0,
          extractionStatus: "failed",
          extractionError: msg,
        },
      };
    }
  }

  return {
    text: null,
    error: `Unsupported file type ".${ext}". Upload a PDF or DOCX, or paste your resume text.`,
    extractionDebug: {
      fileType: ext,
      extractedCharCount: 0,
      extractionStatus: "unsupported_type",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request) {
  const hasOpenAIKey = !!(process.env.OPENAI_API_KEY || "").trim();

  let uploadMode = "paste";
  let uploadFileName = null;
  let uploadFileSize = null;
  let extractionDebug = null;

  try {
    let jobTitle, jobDescription, resume;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      jobTitle = (formData.get("jobTitle") || "").trim();
      jobDescription = (formData.get("jobDescription") || "").trim();
      const file = formData.get("resumeFile");

      if (file && file.size > 0) {
        uploadMode = "file";
        uploadFileName = file.name;
        uploadFileSize = file.size;

        if (file.size > MAX_FILE_BYTES) {
          return Response.json(
            {
              error: "File too large. Maximum size is 5 MB.",
              _uploadDebug: {
                fileReceived: true,
                fileName: file.name,
                fileSize: file.size,
              },
            },
            { status: 400 },
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await extractTextFromBuffer(buffer, file.name);
        extractionDebug = result.extractionDebug;

        if (result.error) {
          return Response.json(
            {
              error: result.error,
              _uploadDebug: {
                fileReceived: true,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type || file.name.split(".").pop(),
                ...result.extractionDebug,
              },
            },
            { status: 422 },
          );
        }

        resume = result.text;
      } else {
        uploadMode = "paste";
        resume = (formData.get("resume") || "").trim();
      }
    } else {
      const body = await request.json();
      jobTitle = (body.jobTitle || "").trim();
      jobDescription = (body.jobDescription || "").trim();
      resume = (body.resume || "").trim();
    }

    // ── Validate ────────────────────────────────────────────────────────────
    if (!jobTitle || jobTitle.length < 3)
      return Response.json(
        { error: "Job title must be at least 3 characters." },
        { status: 400 },
      );
    if (!jobDescription || jobDescription.length < 50)
      return Response.json(
        { error: "Job description must be at least 50 characters." },
        { status: 400 },
      );
    if (!resume || resume.length < 100)
      return Response.json(
        { error: "Resume must be at least 100 characters." },
        { status: 400 },
      );

    const jd = jobDescription.slice(0, MAX_DESC);
    const res = resume.slice(0, MAX_RESUME);

    const uploadFields = {
      uploadMode,
      ...(uploadFileName ? { fileName: uploadFileName } : {}),
      ...(uploadFileSize ? { fileSize: uploadFileSize } : {}),
      ...(extractionDebug || {}),
    };

    // ── No API key → keyword fallback ───────────────────────────────────────
    if (!hasOpenAIKey) {
      const result = keywordFallback(jobTitle, jd, res);
      return Response.json(result, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    }

    // ── OpenAI path ─────────────────────────────────────────────────────────
    const model = (process.env.OPENAI_MODEL || "gpt-4o-mini").trim();
    console.log(
      `[resume-helper] model=${model} uploadMode=${uploadMode} resumeChars=${res.length}`,
    );

    // Written-number to integer (handles "seventy", "seventy-two", etc.)
    const WORD_TO_NUM = {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      thirteen: 13,
      fourteen: 14,
      fifteen: 15,
      sixteen: 16,
      seventeen: 17,
      eighteen: 18,
      nineteen: 19,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50,
      sixty: 60,
      seventy: 70,
      eighty: 80,
      ninety: 90,
      hundred: 100,
    };

    function wordToInt(val) {
      if (typeof val === "number") return Math.round(val);
      const s = String(val)
        .trim()
        .toLowerCase()
        .replace(/[^a-z\s-]/g, "");
      if (WORD_TO_NUM[s] !== undefined) return WORD_TO_NUM[s];
      const parts = s.split(/[\s-]+/);
      if (
        parts.length === 2 &&
        WORD_TO_NUM[parts[0]] !== undefined &&
        WORD_TO_NUM[parts[1]] !== undefined
      ) {
        return WORD_TO_NUM[parts[0]] + WORD_TO_NUM[parts[1]];
      }
      const n = parseInt(val, 10);
      return isNaN(n) ? null : n;
    }

    // Robust JSON extractor.
    // Handles: bare JSON, markdown-fenced JSON, prose + JSON, written-number
    // matchScore values, and trailing commas before ] or }.
    // Fence patterns are built via String.fromCharCode(96) to avoid literal
    // backtick characters in source that confuse some tooling.
    function safeExtractJSON(raw) {
      if (!raw || !raw.trim()) {
        return { result: null, status: "empty_response", preview: "" };
      }

      const preview = raw.slice(0, 200);
      let text = raw.trim();

      // Strip leading/trailing markdown code fences
      const tick3 = String.fromCharCode(96).repeat(3);
      const fenceStart = new RegExp("^" + tick3 + "(?:json)?\\s*", "i");
      const fenceEnd = new RegExp("\\s*" + tick3 + "\\s*$", "i");
      text = text.replace(fenceStart, "").replace(fenceEnd, "").trim();

      // Find the outermost JSON object
      const braceStart = text.indexOf("{");
      const braceEnd = text.lastIndexOf("}");
      if (braceStart === -1 || braceEnd === -1 || braceEnd <= braceStart) {
        return { result: null, status: "no_json_object_found", preview };
      }

      let jsonStr = text.slice(braceStart, braceEnd + 1);

      // Pre-coerce any written-number matchScore before JSON.parse
      jsonStr = jsonStr.replace(
        /"matchScore"\s*:\s*"?([a-zA-Z][a-zA-Z\s-]*)"?/g,
        (_, word) => {
          const n = wordToInt(word.trim());
          return '"matchScore": ' + (n !== null ? n : 0);
        },
      );

      // Attempt 1: parse as-is
      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (_e1) {
        // Attempt 2: strip trailing commas before } or ]
        const cleaned = jsonStr.replace(/,\s*([}\]])/g, "$1");
        try {
          parsed = JSON.parse(cleaned);
        } catch (e2) {
          return {
            result: null,
            status: "parse_failed: " + e2.message,
            preview,
          };
        }
      }

      // Coerce matchScore if it still came through as a string
      if (
        parsed.matchScore !== undefined &&
        typeof parsed.matchScore !== "number"
      ) {
        const coerced = wordToInt(parsed.matchScore);
        parsed.matchScore = coerced !== null ? coerced : null;
      }

      if (typeof parsed.matchScore !== "number" || isNaN(parsed.matchScore)) {
        return { result: null, status: "matchScore_not_a_number", preview };
      }

      return { result: parsed, status: "ok", preview };
    }

    const prompt = `You are an expert resume coach specialising in remote work.
Analyse the resume against the job description below and respond with ONLY a valid JSON object.

Rules:
- Output ONLY raw JSON. No markdown, no code fences, no prose before or after.
- matchScore MUST be a plain integer between 0 and 100. Do NOT write numbers as words.
- Be honest: missing most key skills scores below 40. Near-perfect match scores 85-95.

Job Title: ${jobTitle}

Job Description:
${jd}

Resume:
${res}

Required JSON shape (all fields required, no extras):
{
  "matchScore": <integer 0-100>,
  "missingKeywords": [<up to 12 keywords/phrases from the JD missing from the resume>],
  "improvedSummary": "<2-3 sentence ATS-optimised professional summary for this exact role>",
  "improvedBulletPoints": [<5-6 improved resume bullets, action-verb led, quantified where possible>],
  "recommendations": [<exactly 5 specific, actionable improvements for this exact role>]
}`;

    let aiResult = null;
    let openaiError = null;
    let openaiRawPreview = "";
    let jsonParseStatus = "not_attempted";
    let parsedSuccessfully = false;

    try {
      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are an expert resume analyst. Return ONLY valid JSON — no markdown, no code fences, no prose before or after. matchScore must always be a plain integer between 0 and 100.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 1600,
          // JSON mode: forces the model to return a valid JSON object.
          // Supported on gpt-4o, gpt-4o-mini, gpt-3.5-turbo-1106+.
          response_format: { type: "json_object" },
        }),
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        openaiError = `HTTP ${aiRes.status}: ${errText.slice(0, 300)}`;
        jsonParseStatus = "openai_http_error";
        console.error("[resume-helper] OpenAI error:", openaiError);
      } else {
        const aiData = await aiRes.json();
        const content = aiData.choices?.[0]?.message?.content ?? "";
        openaiRawPreview = content.slice(0, 200);

        // Log raw output before any parsing — useful for diagnosing future issues
        console.log("[resume-helper] RAW OPENAI:", content.slice(0, 500));

        if (!content.trim()) {
          openaiError = "OpenAI returned an empty response.";
          jsonParseStatus = "empty_response";
        } else {
          const { result, status } = safeExtractJSON(content);
          jsonParseStatus = status;
          if (result) {
            aiResult = result;
            parsedSuccessfully = true;
          } else {
            openaiError =
              "JSON extraction failed [" +
              status +
              "]. Raw preview: " +
              openaiRawPreview;
            console.error("[resume-helper] parse error:", openaiError);
          }
        }
      }
    } catch (fetchErr) {
      openaiError = "Network error: " + fetchErr.message;
      jsonParseStatus = "network_error";
      console.error("[resume-helper] fetch failed:", fetchErr);
    }

    if (!aiResult) {
      const fbResult = keywordFallback(jobTitle, jd, res);
      return Response.json(fbResult, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    }

    // ── OpenAI succeeded ────────────────────────────────────────────────────
    if (typeof aiResult.matchScore === "number") {
      aiResult.matchScore = Math.max(
        0,
        Math.min(100, Math.round(aiResult.matchScore)),
      );
    }

    // Strip internal debug fields before sending to client
    const { _debug: _stripped, ...cleanResult } = aiResult;

    return Response.json(cleanResult, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    console.error("[resume-helper] Unhandled error:", error);
    return Response.json(
      { error: "Analysis failed. Please try again." },
      {
        status: 500,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      },
    );
  }
}
