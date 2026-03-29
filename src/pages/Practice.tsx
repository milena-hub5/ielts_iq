import { Button } from "@/components/ui/button";
import { getSavedWords, saveQuizResult } from "@/lib/api";
import { modules, words, type WordItem } from "@/data/words";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Languages,
  LibraryBig,
  MessageSquareQuote,
  PencilRuler,
  RotateCcw,
  XCircle,
} from "lucide-react";

type SavedWord = {
  id: number;
  word: string;
  meaning: string;
  level: string;
  status: "learning" | "difficult" | "learned";
};

type PracticeMode = "saved" | "ielts" | "grammar" | "general";

type PracticeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

type PracticeModeCard = {
  id: PracticeMode;
  title: string;
  description: string;
  icon: typeof LibraryBig;
};

const practiceModes: PracticeModeCard[] = [
  {
    id: "saved",
    title: "Saved Words",
    description: "Practice the vocabulary you personally saved.",
    icon: LibraryBig,
  },
  {
    id: "ielts",
    title: "IELTS Mixed",
    description: "A broader IELTS set with topic and module awareness.",
    icon: MessageSquareQuote,
  },
  {
    id: "grammar",
    title: "Grammar",
    description: "Sentence correction, article use, and tense choices.",
    icon: PencilRuler,
  },
  {
    id: "general",
    title: "General English",
    description: "Everyday English usage, collocations, and meaning.",
    icon: Languages,
  },
];

const grammarQuestions: PracticeQuestion[] = [
  {
    id: "grammar-1",
    prompt: 'Choose the correct sentence.',
    options: [
      "She go to university every day.",
      "She goes to university every day.",
      "She going to university every day.",
      "She gone to university every day.",
    ],
    correct: 1,
    explanation: "Use third-person singular in the present simple: she goes.",
  },
  {
    id: "grammar-2",
    prompt: 'Fill the gap: "If people exercised more, they ___ healthier."',
    options: ["are", "were", "will be", "have been"],
    correct: 1,
    explanation: "This is the second conditional: If + past simple, would + base verb. 'Were' fits the clause.",
  },
  {
    id: "grammar-3",
    prompt: 'Choose the best article: "She gave me ___ useful piece of advice."',
    options: ["a", "an", "the", "no article"],
    correct: 0,
    explanation: "We say 'a useful piece' because 'useful' starts with a consonant sound /j/.",
  },
  {
    id: "grammar-4",
    prompt: 'Which sentence is the most natural for IELTS writing?',
    options: [
      "There have many reasons for this problem.",
      "There are many reasons for this problem.",
      "There is many reasons for this problem.",
      "There be many reasons for this problem.",
    ],
    correct: 1,
    explanation: "Use 'there are' with a plural noun: reasons.",
  },
  {
    id: "grammar-5",
    prompt: 'Complete the sentence: "By the time we arrived, the lecture ___."',
    options: ["starts", "has started", "had started", "starting"],
    correct: 2,
    explanation: "Past perfect is used for an earlier action before another point in the past.",
  },
  {
    id: "grammar-6",
    prompt: 'Choose the correct connector: "Many students feel stressed, ___ they still try to perform well."',
    options: ["because", "although", "so", "unless"],
    correct: 1,
    explanation: "'Although' shows contrast between stress and effort.",
  },
  {
    id: "grammar-7",
    prompt: 'Which option is grammatically correct?',
    options: [
      "He suggested to study harder.",
      "He suggested studying harder.",
      "He suggested study harder.",
      "He suggested that studying harder.",
    ],
    correct: 1,
    explanation: "After 'suggest', a gerund is natural here: suggested studying.",
  },
  {
    id: "grammar-8",
    prompt: 'Choose the best form: "The number of cars in cities ___ increasing."',
    options: ["is", "are", "have", "be"],
    correct: 0,
    explanation: "'The number' is singular, so it takes 'is'.",
  },
];

const generalEnglishQuestions: PracticeQuestion[] = [
  {
    id: "general-1",
    prompt: 'Choose the closest meaning of "reliable".',
    options: ["funny", "trustworthy", "expensive", "ordinary"],
    correct: 1,
    explanation: "'Reliable' means trustworthy or dependable.",
  },
  {
    id: "general-2",
    prompt: 'Complete the collocation: "make a ___".',
    options: ["decision", "homework", "noiseing", "knowledge"],
    correct: 0,
    explanation: "The natural collocation is 'make a decision'.",
  },
  {
    id: "general-3",
    prompt: 'Which sentence sounds most natural?',
    options: [
      "I am interested about learning languages.",
      "I am interested in learning languages.",
      "I am interested on learning languages.",
      "I am interested for learning languages.",
    ],
    correct: 1,
    explanation: "We say 'interested in'.",
  },
  {
    id: "general-4",
    prompt: 'Choose the best response: "How often do you revise vocabulary?"',
    options: [
      "Quite regularly, usually in the evening.",
      "Because vocabulary is important.",
      "At the library is quiet.",
      "Yes, I can revise vocabulary.",
    ],
    correct: 0,
    explanation: "The question asks about frequency, so a time-based answer fits best.",
  },
  {
    id: "general-5",
    prompt: 'Which word best completes the sentence: "This app is easy to ___."',
    options: ["use", "used", "using", "uses"],
    correct: 0,
    explanation: "After 'easy to', use the base verb: easy to use.",
  },
  {
    id: "general-6",
    prompt: 'Choose the opposite of "increase".',
    options: ["expand", "reduce", "develop", "improve"],
    correct: 1,
    explanation: "The opposite of 'increase' is 'reduce' or 'decrease'.",
  },
  {
    id: "general-7",
    prompt: 'Choose the best paraphrase: "I’m short of time."',
    options: [
      "I have plenty of time.",
      "I do not have much time.",
      "Time is very long.",
      "I like spending time.",
    ],
    correct: 1,
    explanation: "'Short of time' means not having much time available.",
  },
  {
    id: "general-8",
    prompt: 'Which phrase is the most natural?',
    options: [
      "strong rain",
      "heavy rain",
      "hard rainly",
      "big rain",
    ],
    correct: 1,
    explanation: "The natural collocation is 'heavy rain'.",
  },
];

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildWordQuestions = (
  sourceWords: WordItem[],
  personalized: boolean,
): PracticeQuestion[] => {
  const picked = shuffle(sourceWords).slice(0, 8);

  return picked.map((word, index) => {
    if (index % 3 === 0) {
      const distractors = shuffle(
        sourceWords
          .filter((item) => item.word !== word.word && item.topic === word.topic)
          .map((item) => item.word),
      ).slice(0, 3);
      const options = shuffle([word.word, ...distractors]);
      return {
        id: `${word.id}-meaning`,
        prompt: `Which word matches this meaning: "${word.meaning}"?`,
        options,
        correct: options.indexOf(word.word),
        explanation: personalized
          ? "This came from your saved list, so it is worth mastering actively."
          : "This is a vocabulary check from the shared IELTS bank.",
      };
    }

    if (index % 3 === 1) {
      const distractors = shuffle(
        sourceWords
          .filter((item) => item.word !== word.word && item.topic === word.topic)
          .map((item) => item.meaning),
      ).slice(0, 3);
      const options = shuffle([word.meaning, ...distractors]);
      return {
        id: `${word.id}-definition`,
        prompt: `Choose the best meaning for "${word.word}".`,
        options,
        correct: options.indexOf(word.meaning),
        explanation: `Example: ${word.example}`,
      };
    }

    const options = shuffle([...modules]);
    return {
      id: `${word.id}-module`,
      prompt: `Which IELTS module is this word currently tagged for: "${word.word}"?`,
      options,
      correct: options.indexOf(word.module),
      explanation: `This word is currently tagged as especially useful for ${word.module.toLowerCase()}.`,
    };
  });
};

const Practice = () => {
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [mode, setMode] = useState<PracticeMode>("saved");
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [savedResult, setSavedResult] = useState(false);

  const loadQuestions = async (nextMode: PracticeMode) => {
    setLoading(true);

    try {
      const saved = await getSavedWords();
      setSavedWords(saved);

      const personalizedWords = saved
        .map((savedWord) => words.find((item) => item.word === savedWord.word))
        .filter(Boolean) as WordItem[];

      if (nextMode === "grammar") {
        setQuestions(shuffle(grammarQuestions).slice(0, 8));
      } else if (nextMode === "general") {
        setQuestions(shuffle(generalEnglishQuestions).slice(0, 8));
      } else if (nextMode === "saved") {
        const source = personalizedWords.length >= 4 ? personalizedWords : words;
        setQuestions(buildWordQuestions(source, personalizedWords.length >= 4));
      } else {
        setQuestions(buildWordQuestions(words, false));
      }
    } catch (error) {
      console.error("Failed to load practice data:", error);

      if (nextMode === "grammar") {
        setQuestions(shuffle(grammarQuestions).slice(0, 8));
      } else if (nextMode === "general") {
        setQuestions(shuffle(generalEnglishQuestions).slice(0, 8));
      } else {
        setQuestions(buildWordQuestions(words, false));
      }
    } finally {
      setCurrent(0);
      setSelected(null);
      setAnswered(false);
      setScore(0);
      setSavedResult(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(mode);
  }, []);

  const finished = current >= questions.length && questions.length > 0;
  const q = !finished ? questions[current] : null;
  const isLast = current === questions.length - 1;

  useEffect(() => {
    if (finished && !savedResult) {
      saveQuizResult(score, questions.length)
        .then(() => setSavedResult(true))
        .catch((error) => {
          console.error("Failed to save quiz result:", error);
        });
    }
  }, [finished, questions.length, savedResult, score]);

  const handleSelect = (idx: number) => {
    if (answered || !q) return;
    setSelected(idx);
    setAnswered(true);

    if (idx === q.correct) {
      setScore((value) => value + 1);
    }
  };

  const handleNext = () => {
    setCurrent((value) => value + 1);
    setSelected(null);
    setAnswered(false);
  };

  const handleRestart = () => {
    loadQuestions(mode);
  };

  const sourceLabel = useMemo(() => {
    if (mode === "saved") {
      return savedWords.length >= 4
        ? "This set uses your saved words first."
        : "You have too few saved words, so this mode falls back to the wider IELTS bank.";
    }
    if (mode === "grammar") {
      return "This set checks grammar patterns that help both general English and IELTS writing.";
    }
    if (mode === "general") {
      return "This set trains everyday English usage, collocations, and natural phrasing.";
    }
    return "This set mixes shared IELTS vocabulary and module-focused review.";
  }, [mode, savedWords.length]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Practice
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{sourceLabel}</p>
        {mode === "saved" && savedWords.length < 4 && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            You need a few more saved words before this mode becomes truly personal.
            <Link
              to="/topics"
              className="ml-2 font-medium text-slate-900 underline underline-offset-4"
            >
              Add words in Topics
            </Link>
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {practiceModes.map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMode(item.id);
                  loadQuestions(item.id);
                }}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-white"
                }`}
              >
                <div
                  className={`inline-flex rounded-xl p-2 ${
                    active ? "bg-white/10" : "bg-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-3 font-semibold">{item.title}</p>
                <p className={`mt-2 text-sm leading-6 ${active ? "text-white/75" : "text-slate-500"}`}>
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading practice set...</div>
      ) : finished ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">
            Quiz Complete
          </h2>
          <p className="mb-4 text-slate-500">
            You scored{" "}
            <span className="font-bold text-slate-900">
              {score}/{questions.length}
            </span>
          </p>
          <p className="mb-6 text-sm text-slate-400">
            {savedResult
              ? "Your result has been saved and will appear on the dashboard."
              : "Saving result..."}
          </p>

          <Button onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" />
            Try Another Set
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Question {current + 1} of {questions.length}
            </span>
            <span className="text-xs font-semibold text-slate-900">
              Score: {score}
            </span>
          </div>

          <h2 className="mb-6 text-lg font-semibold leading-7 text-slate-900">
            {q?.prompt}
          </h2>

          <div className="mb-6 space-y-3">
            {q?.options.map((opt, idx) => {
              let style = "border-slate-200 bg-white hover:bg-slate-50";

              if (answered) {
                if (idx === q.correct) {
                  style = "border-emerald-400 bg-emerald-50";
                } else if (idx === selected) {
                  style = "border-red-400 bg-red-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${style}`}
                >
                  <span>{opt}</span>

                  {answered && idx === q.correct && (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  )}

                  {answered && idx === selected && idx !== q.correct && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {answered && q && (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {q.explanation}
            </div>
          )}

          {answered && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={isLast ? () => setCurrent(questions.length) : handleNext}
              >
                {isLast ? "See Results" : "Next Question"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Practice;
