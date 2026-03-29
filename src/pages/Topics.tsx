import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Bookmark,
  Search,
  Layers3,
  GraduationCap,
  Cpu,
  Leaf,
  Heart,
  Shield,
  Briefcase,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { addSavedWord, deleteSavedWord, getSavedWords } from "@/lib/api";
import { levels, totalWords, words } from "@/data/words";

type SavedWord = {
  id: number;
  word: string;
  meaning: string;
  level: string;
  status: "learning" | "difficult" | "learned";
};

const topicMeta = [
  {
    id: "all",
    name: "All Topics",
    icon: Layers3,
    description: "See the full vocabulary list from every topic in one place.",
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    description: "Academic vocabulary for schools, universities, and learning.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "technology",
    name: "Technology",
    icon: Cpu,
    description: "Digital tools, innovation, automation, and AI language.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    id: "environment",
    name: "Environment",
    icon: Leaf,
    description: "Climate, sustainability, emissions, and conservation words.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "health",
    name: "Health",
    icon: Heart,
    description: "Wellbeing, treatment, public health, and lifestyle vocabulary.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    id: "crime",
    name: "Crime",
    icon: Shield,
    description: "Law, punishment, policing, and social prevention language.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "work",
    name: "Work",
    icon: Briefcase,
    description: "Career, labour market, workplace, and productivity vocabulary.",
    color: "bg-cyan-50 text-cyan-600",
  },
];

const moduleOptions = ["All", "Speaking", "Writing", "Reading", "Listening", "General"];
const levelOptions = ["All", ...levels];
const PAGE_SIZE = 48;

export default function Topics() {
  const [selectedTopic, setSelectedTopic] = useState(topicMeta[0].id);
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [search, setSearch] = useState("");
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [busyWord, setBusyWord] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    loadSavedWords();
  }, []);

  const loadSavedWords = async () => {
    try {
      const data = await getSavedWords();
      setSavedWords(data);
    } catch (error) {
      console.error("Failed to load saved words:", error);
    }
  };

  const resetFilters = () => {
    setSelectedModule("All");
    setSelectedLevel("All");
    setSearch("");
  };

  const filteredWords = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return words.filter((word) => {
      if (selectedTopic !== "all" && word.topic !== selectedTopic) return false;
      if (selectedModule !== "All" && word.module !== selectedModule) return false;
      if (selectedLevel !== "All" && word.level !== selectedLevel) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        word.word,
        word.meaning,
        word.example,
        word.partOfSpeech,
        word.module,
        ...word.collocations,
        ...word.synonyms,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [search, selectedLevel, selectedModule, selectedTopic]);

  const currentTopic = topicMeta.find((topic) => topic.id === selectedTopic) ?? topicMeta[0];
  const totalTopicWords =
    selectedTopic === "all"
      ? totalWords
      : words.filter((word) => word.topic === selectedTopic).length;
  const hasActiveFilters =
    selectedModule !== "All" || selectedLevel !== "All" || search.trim().length > 0;
  const visibleWords = filteredWords.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, selectedLevel, selectedModule, selectedTopic]);

  const isSaved = (word: string) => savedWords.some((saved) => saved.word === word);

  const getSavedEntry = (word: string) => savedWords.find((saved) => saved.word === word);

  const handleToggleSave = async (wordItem: {
    word: string;
    meaning: string;
    level: string;
  }) => {
    try {
      setBusyWord(wordItem.word);

      const existing = getSavedEntry(wordItem.word);

      if (existing) {
        await deleteSavedWord(existing.id);
        setSavedWords((prev) => prev.filter((item) => item.id !== existing.id));
        toast({
          title: "Word removed",
          description: `"${wordItem.word}" was removed from your saved words.`,
        });
        return;
      }

      const created = await addSavedWord({
        word: wordItem.word,
        meaning: wordItem.meaning,
        level: wordItem.level,
        status: "learning",
      });

      setSavedWords((prev) => [...prev, created]);
      toast({
        title: "Word saved",
        description: `"${wordItem.word}" was added to your saved words.`,
      });
    } catch (error) {
      console.error("Failed to toggle save:", error);
      toast({
        title: "Save failed",
        description:
          "Could not save this word yet. Make sure your profile is active and the backend is running.",
      });
    } finally {
      setBusyWord(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Topic Vocabulary
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Choose a topic and the words appear right away below. You can filter
            them by IELTS module, level, and keywords, then save the useful ones
            into your personal list.
          </p>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Current dictionary size: {totalWords.toLocaleString()} words total
          </p>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {topicMeta.map((topic) => {
          const topicWords =
            topic.id === "all"
              ? totalWords
              : words.filter((word) => word.topic === topic.id).length;
          const active = topic.id === selectedTopic;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => {
                setSelectedTopic(topic.id);
                resetFilters();
              }}
              className={`rounded-3xl border p-6 text-left shadow-sm transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                  : "border-slate-200 bg-white text-slate-900 hover:shadow-md"
              }`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                  active ? "bg-white/15 text-white" : topic.color
                }`}
              >
                <topic.icon className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-bold">{topic.name}</h2>
              <p className={`mt-2 text-sm leading-6 ${active ? "text-white/75" : "text-slate-500"}`}>
                {topic.description}
              </p>
              <p className={`mt-4 text-xs font-semibold uppercase tracking-[0.18em] ${active ? "text-white/70" : "text-slate-500"}`}>
                {topicWords} words
              </p>
            </button>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Active Topic
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {currentTopic.name}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {currentTopic.description}
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search word, meaning, example, collocation..."
                className="h-11 rounded-2xl border-slate-200 pl-10"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              IELTS Filter
            </h3>
            <div className="flex flex-wrap gap-2">
              {moduleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedModule(option)}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                    selectedModule === option
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Level Filter
            </h3>
            <div className="flex flex-wrap gap-2">
              {levelOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedLevel(option)}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                    selectedLevel === option
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {filteredWords.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {totalTopicWords}
            </span>{" "}
            matching words
            {hasActiveFilters && (
              <span>
                {" "}
                for <span className="font-medium text-slate-900">{currentTopic.name}</span>
                {selectedModule !== "All" && `, ${selectedModule}`}
                {selectedLevel !== "All" && `, ${selectedLevel}`}
                {search.trim() && `, search "${search.trim()}"`}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            {filteredWords.length} words found
          </h3>
          <p className="text-sm text-slate-500">
            Showing {visibleWords.length} now
          </p>
        </div>

        {filteredWords.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500 shadow-sm">
            No words match this topic and filter combination yet.
          </div>
        ) : (
          <>
            <div className="grid gap-4 xl:grid-cols-2">
              {visibleWords.map((word) => {
              const saved = isSaved(word.word);
              const loading = busyWord === word.word;

              return (
                <article
                  key={word.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{word.word}</h4>
                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {word.partOfSpeech}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                        {word.level}
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                        {word.module}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-700">{word.meaning}</p>
                  <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm italic leading-6 text-slate-600">
                    "{word.example}"
                  </p>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Collocations
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {word.collocations.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Synonyms
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {word.synonyms.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-9 rounded-xl px-3 ${saved ? "bg-slate-100" : ""}`}
                      onClick={() => handleToggleSave(word)}
                      disabled={loading}
                    >
                      <Bookmark className="h-4 w-4" />
                      <span className="text-xs">
                        {loading ? "..." : saved ? "Saved" : "Save"}
                      </span>
                    </Button>
                  </div>
                </article>
              );
            })}
            </div>

            {visibleCount < filteredWords.length && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  Load more words
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
