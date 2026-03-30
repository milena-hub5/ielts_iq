export type LevelId = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ModuleId =
  | "Speaking"
  | "Writing"
  | "Reading"
  | "Listening"
  | "General";
export type TopicId =
  | "education"
  | "technology"
  | "environment"
  | "health"
  | "crime"
  | "work";

export type WordItem = {
  id: number;
  word: string;
  meaning: string;
  level: LevelId;
  module: ModuleId;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb";
  topic: TopicId;
  example: string;
  collocations: string[];
  synonyms: string[];
};

type TopicSeed = {
  label: string;
  focus: string;
  nounAnchors: string[];
  nounFacets: string[];
  actionStems: string[];
  actionObjects: string[];
  qualityStems: string[];
  qualityTargets: string[];
  synonymBank: string[];
  collocationBank: string[];
};

export const levels: LevelId[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const modules: ModuleId[] = [
  "Speaking",
  "Writing",
  "Reading",
  "Listening",
  "General",
];

const nounModifiers = [
  "academic",
  "active",
  "adaptive",
  "advanced",
  "applied",
  "balanced",
  "careful",
  "clear",
  "collaborative",
  "community",
  "comprehensive",
  "consistent",
  "contextual",
  "creative",
  "critical",
  "daily",
  "data-led",
  "digital",
  "direct",
  "effective",
  "evidence-based",
  "flexible",
  "focused",
  "future-ready",
  "global",
  "guided",
  "healthy",
  "high-value",
  "inclusive",
  "independent",
  "innovative",
  "intensive",
  "interactive",
  "long-term",
  "measured",
  "modern",
  "multilevel",
  "practical",
  "predictable",
  "professional",
  "progressive",
  "public",
  "quality",
  "reliable",
  "responsive",
  "safe",
  "scalable",
  "shared",
  "skilled",
  "smart",
  "specialised",
  "stable",
  "strategic",
  "structured",
  "supportive",
  "sustainable",
  "systematic",
  "targeted",
  "timely",
  "trusted",
  "useful",
  "wide-ranging",
  "workable",
  "world-class",
];

const adverbStarters = [
  "actively",
  "accurately",
  "boldly",
  "carefully",
  "clearly",
  "confidently",
  "consistently",
  "constructively",
  "directly",
  "effectively",
  "efficiently",
  "ethically",
  "flexibly",
  "frequently",
  "gradually",
  "independently",
  "intentionally",
  "openly",
  "patiently",
  "positively",
  "practically",
  "proactively",
  "professionally",
  "quickly",
  "realistically",
  "regularly",
  "responsibly",
  "securely",
  "strategically",
  "thoroughly",
];

const levelDescriptors: Record<LevelId, string> = {
  A1: "very basic",
  A2: "basic",
  B1: "intermediate",
  B2: "upper-intermediate",
  C1: "advanced",
  C2: "mastery-level",
};

const topicSeeds: Record<TopicId, TopicSeed> = {
  education: {
    label: "Education",
    focus: "learning, teaching, and academic development",
    nounAnchors: [
      "classroom",
      "curriculum",
      "student",
      "teacher",
      "campus",
      "lesson",
      "exam",
      "research",
      "scholarship",
      "library",
    ],
    nounFacets: [
      "planning",
      "support",
      "development",
      "assessment",
      "strategy",
      "access",
    ],
    actionStems: [
      "analyse",
      "build",
      "clarify",
      "coach",
      "compare",
      "design",
      "evaluate",
      "expand",
      "guide",
      "improve",
      "organise",
      "practise",
      "review",
      "strengthen",
      "track",
    ],
    actionObjects: [
      "study habits",
      "academic progress",
      "class participation",
    ],
    qualityStems: [
      "accessible",
      "adaptable",
      "collaborative",
      "engaging",
      "inclusive",
      "independent",
      "reflective",
      "structured",
      "supportive",
      "well-paced",
    ],
    qualityTargets: [
      "instruction",
      "feedback",
      "learning environment",
      "study routine",
    ],
    synonymBank: [
      "learning",
      "instruction",
      "study",
      "training",
      "teaching",
      "education",
    ],
    collocationBank: [
      "goal",
      "plan",
      "routine",
      "system",
      "method",
      "practice",
    ],
  },
  technology: {
    label: "Technology",
    focus: "digital tools, automation, and modern innovation",
    nounAnchors: [
      "device",
      "platform",
      "software",
      "system",
      "network",
      "screen",
      "robot",
      "data",
      "signal",
      "interface",
    ],
    nounFacets: [
      "security",
      "design",
      "control",
      "integration",
      "support",
      "workflow",
    ],
    actionStems: [
      "automate",
      "connect",
      "decode",
      "detect",
      "develop",
      "improve",
      "install",
      "manage",
      "measure",
      "monitor",
      "process",
      "protect",
      "scale",
      "streamline",
      "upgrade",
    ],
    actionObjects: [
      "user tasks",
      "digital workflows",
      "system performance",
    ],
    qualityStems: [
      "automated",
      "cloud-based",
      "data-driven",
      "efficient",
      "innovative",
      "responsive",
      "scalable",
      "secure",
      "smart",
      "user-friendly",
    ],
    qualityTargets: [
      "solution",
      "toolset",
      "digital process",
      "service model",
    ],
    synonymBank: [
      "innovation",
      "platform",
      "system",
      "tool",
      "technology",
      "software",
    ],
    collocationBank: [
      "rollout",
      "feature",
      "update",
      "strategy",
      "support",
      "framework",
    ],
  },
  environment: {
    label: "Environment",
    focus: "climate action, sustainability, and ecological protection",
    nounAnchors: [
      "climate",
      "energy",
      "forest",
      "recycling",
      "river",
      "ocean",
      "wildlife",
      "transport",
      "waste",
      "carbon",
    ],
    nounFacets: [
      "management",
      "policy",
      "protection",
      "planning",
      "reduction",
      "transition",
    ],
    actionStems: [
      "clean",
      "conserve",
      "cut",
      "design",
      "improve",
      "limit",
      "manage",
      "measure",
      "protect",
      "reduce",
      "restore",
      "reuse",
      "shift",
      "track",
      "transform",
    ],
    actionObjects: [
      "resource use",
      "public emissions",
      "green habits",
    ],
    qualityStems: [
      "carbon-light",
      "cleaner",
      "eco-aware",
      "efficient",
      "green",
      "low-waste",
      "renewable",
      "resilient",
      "sustainable",
      "well-regulated",
    ],
    qualityTargets: [
      "lifestyle",
      "energy system",
      "transport plan",
      "public policy",
    ],
    synonymBank: [
      "nature",
      "climate",
      "ecology",
      "sustainability",
      "conservation",
      "environment",
    ],
    collocationBank: [
      "plan",
      "measure",
      "target",
      "outcome",
      "policy",
      "effort",
    ],
  },
  health: {
    label: "Health",
    focus: "wellbeing, prevention, and medical support",
    nounAnchors: [
      "diet",
      "exercise",
      "healthcare",
      "hospital",
      "patient",
      "stress",
      "fitness",
      "sleep",
      "therapy",
      "wellbeing",
    ],
    nounFacets: [
      "guidance",
      "routine",
      "management",
      "support",
      "screening",
      "prevention",
    ],
    actionStems: [
      "balance",
      "check",
      "deliver",
      "detect",
      "encourage",
      "improve",
      "maintain",
      "monitor",
      "prevent",
      "reduce",
      "restore",
      "strengthen",
      "support",
      "treat",
      "understand",
    ],
    actionObjects: [
      "daily wellbeing",
      "public health",
      "healthy habits",
    ],
    qualityStems: [
      "balanced",
      "care-based",
      "evidence-led",
      "fit",
      "healthy",
      "preventive",
      "resilient",
      "restorative",
      "safe",
      "well-supported",
    ],
    qualityTargets: [
      "routine",
      "care plan",
      "support system",
      "health service",
    ],
    synonymBank: [
      "wellness",
      "fitness",
      "care",
      "health",
      "recovery",
      "prevention",
    ],
    collocationBank: [
      "routine",
      "plan",
      "support",
      "check",
      "programme",
      "goal",
    ],
  },
  crime: {
    label: "Crime",
    focus: "law, justice, prevention, and public safety",
    nounAnchors: [
      "court",
      "crime",
      "evidence",
      "justice",
      "offender",
      "penalty",
      "police",
      "prison",
      "safety",
      "witness",
    ],
    nounFacets: [
      "control",
      "investigation",
      "prevention",
      "response",
      "reform",
      "support",
    ],
    actionStems: [
      "address",
      "arrest",
      "clarify",
      "collect",
      "deter",
      "enforce",
      "investigate",
      "monitor",
      "prevent",
      "protect",
      "reduce",
      "report",
      "review",
      "sentence",
      "supervise",
    ],
    actionObjects: [
      "public risk",
      "repeat offending",
      "community safety",
    ],
    qualityStems: [
      "accountable",
      "clear",
      "evidence-led",
      "fair",
      "lawful",
      "protective",
      "proportionate",
      "responsive",
      "safe",
      "well-policed",
    ],
    qualityTargets: [
      "justice system",
      "public response",
      "safety strategy",
      "legal process",
    ],
    synonymBank: [
      "justice",
      "law",
      "safety",
      "security",
      "order",
      "protection",
    ],
    collocationBank: [
      "measure",
      "response",
      "policy",
      "system",
      "practice",
      "review",
    ],
  },
  work: {
    label: "Work",
    focus: "careers, productivity, employment, and workplace growth",
    nounAnchors: [
      "career",
      "company",
      "office",
      "salary",
      "skill",
      "staff",
      "team",
      "training",
      "workflow",
      "workplace",
    ],
    nounFacets: [
      "development",
      "planning",
      "progress",
      "support",
      "strategy",
      "transition",
    ],
    actionStems: [
      "adapt",
      "build",
      "coordinate",
      "deliver",
      "develop",
      "improve",
      "lead",
      "manage",
      "measure",
      "motivate",
      "recruit",
      "retain",
      "review",
      "schedule",
      "upskill",
    ],
    actionObjects: [
      "career growth",
      "team output",
      "workplace change",
    ],
    qualityStems: [
      "adaptable",
      "efficient",
      "flexible",
      "goal-led",
      "motivated",
      "productive",
      "reliable",
      "skilled",
      "supportive",
      "well-managed",
    ],
    qualityTargets: [
      "team culture",
      "career path",
      "work routine",
      "business model",
    ],
    synonymBank: [
      "career",
      "employment",
      "labour",
      "profession",
      "work",
      "productivity",
    ],
    collocationBank: [
      "plan",
      "growth",
      "target",
      "system",
      "support",
      "review",
    ],
  },
};

const combine = (left: string[], right: string[], joiner = " ") =>
  left.flatMap((first) => right.map((second) => `${first}${joiner}${second}`));

const levelFor = (index: number) => levels[index % levels.length];
const moduleFor = (index: number) =>
  modules[Math.floor(index / levels.length) % modules.length];

const createMeaning = (
  seed: TopicSeed,
  level: LevelId,
  module: ModuleId,
  partOfSpeech: WordItem["partOfSpeech"],
) =>
  `${levelDescriptors[level]} ${partOfSpeech} vocabulary for IELTS ${module.toLowerCase()} about ${seed.focus}.`;

const createExample = (
  seed: TopicSeed,
  word: string,
  module: ModuleId,
) =>
  module === "Writing"
    ? `In a writing task about ${seed.label.toLowerCase()}, the essay described ${word} as an important idea.`
    : module === "Speaking"
    ? `In a speaking answer about ${seed.label.toLowerCase()}, the candidate explained how ${word} can affect daily life.`
    : module === "Reading"
    ? `A reading passage about ${seed.label.toLowerCase()} used the term ${word} to develop the main point.`
    : module === "Listening"
    ? `In a listening exercise, the speaker mentioned ${word} while discussing ${seed.focus}.`
    : `Learners often meet ${word} when discussing ${seed.focus} in IELTS.`;

const createCollocations = (
  word: string,
  seed: TopicSeed,
  index: number,
) => [
  `${word} ${seed.collocationBank[index % seed.collocationBank.length]}`,
  `${seed.label.toLowerCase()} ${seed.collocationBank[(index + 2) % seed.collocationBank.length]}`,
];

const createSynonyms = (seed: TopicSeed, index: number) => [
  seed.synonymBank[index % seed.synonymBank.length],
  seed.synonymBank[(index + 3) % seed.synonymBank.length],
];

const buildTopicWords = (topic: TopicId, seed: TopicSeed, offset: number) => {
  const nounPhrases = combine(seed.nounAnchors, seed.nounFacets);
  const baseVerbPhrases = combine(seed.actionStems, seed.actionObjects);
  const adjectivePhrases = combine(seed.qualityStems, seed.qualityTargets);
  const extendedVerbPhrases = baseVerbPhrases.flatMap((phrase) =>
    nounPhrases.slice(0, 40).map((noun) => `${phrase} for ${noun}`),
  );
  const extendedAdjectivePhrases = adjectivePhrases.flatMap((phrase) =>
    nounPhrases.slice(0, 40).map((noun) => `${phrase} for ${noun}`),
  );
  const modifiedNounPhrases = nounModifiers.flatMap((modifier) =>
    nounPhrases.map((noun) => `${modifier} ${noun}`),
  );
  const adverbPhrases = adverbStarters.flatMap((adverb) =>
    baseVerbPhrases.map((verb) => `${adverb} ${verb}`),
  );
  const pathwayNounPhrases = nounModifiers.slice(0, 22).flatMap((modifier) =>
    nounPhrases.map((noun) => `${modifier} ${noun} pathway`),
  );
  const advancedAdjectivePhrases = nounModifiers
    .slice(0, 24)
    .flatMap((modifier) =>
      adjectivePhrases.map((phrase) => `${modifier} ${phrase}`),
    );
  const processVerbPhrases = baseVerbPhrases.flatMap((verb) =>
    adjectivePhrases.map((phrase) => `${verb} through ${phrase}`),
  );
  const adverbExtendedVerbPhrases = adverbStarters.flatMap((adverb) =>
    extendedVerbPhrases
      .slice(0, 120)
      .map((verb) => `${adverb} ${verb}`),
  );
  const precisionVerbPhrases = adverbStarters
    .slice(0, 3)
    .flatMap((adverb) =>
      baseVerbPhrases.map((verb) => `${adverb} ${verb} in practice`),
    );
  const reviewNounPhrases = seed.nounAnchors.flatMap((anchor) =>
    seed.actionStems
      .slice(0, 12)
      .map((action) => `${anchor} ${action} review`),
  );

  const groups: Array<{
    items: string[];
    partOfSpeech: WordItem["partOfSpeech"];
  }> = [
    { items: nounPhrases, partOfSpeech: "noun" },
    { items: modifiedNounPhrases, partOfSpeech: "noun" },
    { items: pathwayNounPhrases, partOfSpeech: "noun" },
    { items: reviewNounPhrases, partOfSpeech: "noun" },
    { items: baseVerbPhrases, partOfSpeech: "verb" },
    { items: extendedVerbPhrases, partOfSpeech: "verb" },
    { items: processVerbPhrases, partOfSpeech: "verb" },
    { items: adverbExtendedVerbPhrases, partOfSpeech: "verb" },
    { items: precisionVerbPhrases, partOfSpeech: "verb" },
    { items: adjectivePhrases, partOfSpeech: "adjective" },
    { items: extendedAdjectivePhrases, partOfSpeech: "adjective" },
    { items: advancedAdjectivePhrases, partOfSpeech: "adjective" },
    { items: adverbPhrases, partOfSpeech: "adverb" },
  ];

  let localIndex = 0;

  return groups.flatMap((group) =>
    group.items.map((word) => {
      const globalIndex = offset + localIndex;
      const level = levelFor(globalIndex);
      const module = moduleFor(globalIndex);
      const item: WordItem = {
        id: globalIndex + 1,
        word,
        meaning: createMeaning(seed, level, module, group.partOfSpeech),
        level,
        module,
        partOfSpeech: group.partOfSpeech,
        topic,
        example: createExample(seed, word, module),
        collocations: createCollocations(word, seed, globalIndex),
        synonyms: createSynonyms(seed, globalIndex),
      };

      localIndex += 1;
      return item;
    }),
  );
};

let offset = 0;

export const words: WordItem[] = (Object.entries(topicSeeds) as Array<
  [TopicId, TopicSeed]
>).flatMap(([topic, seed]) => {
  const topicWords = buildTopicWords(topic, seed, offset);
  offset += topicWords.length;
  return topicWords;
});

export const totalWords = words.length;
