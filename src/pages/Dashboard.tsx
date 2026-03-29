import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  Compass,
  Globe,
  Search,
  Star,
  Target,
} from "lucide-react";
import { deleteSavedWord, getDashboardData, getProfileData } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Skill = "Vocabulary" | "Speaking" | "Writing" | "Listening";

type Task = {
  id: number;
  title: string;
  skill: Skill;
  duration: string;
  done: boolean;
};

type DashboardWord = {
  id: number;
  word: string;
  meaning: string;
  level: string;
  status: "learning" | "difficult" | "learned";
};

type DashboardData = {
  totalSaved: number;
  learned: number;
  difficult: number;
  learning: number;
  recentWords: any[];
  

  lastQuiz: { score: number; total: number } | null;
  avgScore: number;
};

type ProfileSnapshot = {
  name: string;
  email: string;
  targetBand: number;
  currentLevel: string;
};

const tasksSeed: Task[] = [
  {
    id: 1,
    title: "Review topic words: Education",
    skill: "Vocabulary",
    duration: "12 min",
    done: true,
  },
  {
    id: 2,
    title: "Speaking Part 2 practice",
    skill: "Speaking",
    duration: "15 min",
    done: false,
  },
  {
    id: 3,
    title: "Improve Task 2 intro",
    skill: "Writing",
    duration: "10 min",
    done: false,
  },
  {
    id: 4,
    title: "Listening: campus life",
    skill: "Listening",
    duration: "18 min",
    done: false,
  },
];

function SmallStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{sub}</p>
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(tasksSeed);
  const [savedWords, setSavedWords] = useState<DashboardWord[]>([]);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [profile, setProfile] = useState<ProfileSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const reload = () => loadDashboard();
    window.addEventListener("focus", reload);
    document.addEventListener("visibilitychange", reload);

    return () => {
      window.removeEventListener("focus", reload);
      document.removeEventListener("visibilitychange", reload);
    };
  }, []);

  const loadDashboard = async () => {
    try {
      const [dashboard, profileData] = await Promise.all([
        getDashboardData(),
        getProfileData(),
      ]);
      setData(dashboard);
      setSavedWords(dashboard.recentWords || []);
      setProfile(profileData);
    } catch (e) {
      console.error("Dashboard load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = tasks.filter((t) => t.done).length;

  const progress = useMemo(() => {
    if (!data || data.totalSaved === 0) return 0;
    return Math.round((data.learned / data.totalSaved) * 100);
  }, [data]);

  const filteredWords = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return savedWords;
    return savedWords.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
    );
  }, [search, savedWords]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const toggleSavedWord = async (id: number) => {
    try {
      await deleteSavedWord(id);
      setSavedWords((prev) => prev.filter((word) => word.id !== id));
      toast({
        title: "Word removed",
        description: "The word was removed from your dashboard list.",
      });
      setData((prev) => {
        if (!prev) return prev;
        const removed = prev.recentWords.find((w) => w.id === id);
        if (!removed) {
          return {
            ...prev,
            totalSaved: Math.max(0, prev.totalSaved - 1),
          };
        }

        return {
          ...prev,
          totalSaved: Math.max(0, prev.totalSaved - 1),
          learned:
            removed.status === "learned"
              ? Math.max(0, prev.learned - 1)
              : prev.learned,
          difficult:
            removed.status === "difficult"
              ? Math.max(0, prev.difficult - 1)
              : prev.difficult,
          learning:
            removed.status === "learning"
              ? Math.max(0, prev.learning - 1)
              : prev.learning,
          recentWords: prev.recentWords.filter((w) => w.id !== id),
        };
      });
    } catch (error) {
      console.error("Failed to remove saved word:", error);
      toast({
        title: "Remove failed",
        description: "Could not remove this saved word right now.",
      });
    }
  };

  const focusTitle =
    (data?.difficult || 0) > (data?.learned || 0)
      ? "Review difficult words first"
      : (data?.learning || 0) > 0
      ? "Move learning words into learned"
      : "Keep building your vocabulary bank";

  const focusText =
    (data?.difficult || 0) > (data?.learned || 0)
      ? "You have more difficult words than learned ones right now. Review the tricky ones before adding too many new terms."
      : (data?.learning || 0) > 0
      ? "Your next best move is repetition. Try revising learning words until they feel natural enough to move into learned."
      : "Nice rhythm. Save a few fresh words from Topics and keep the momentum going.";

  if (loading) {
    return <div className="text-slate-500">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="text-slate-500">Failed to load dashboard.</div>;
  }

  const isNewUser =
    data.totalSaved === 0 && data.avgScore === 0 && !data.lastQuiz;

  return (
    <div className="space-y-6">
      {isNewUser && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Start here
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Your dashboard is still empty, which is completely normal. The
                  fastest setup is: save a few words, finish one practice set,
                  then come back and let the dashboard personalize itself.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/topics"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Save first words
              </Link>
              <Link
                to="/practice"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Start practice
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {profile ? `${profile.name}'s dashboard` : "Your IELTS dashboard"}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Track your progress, review saved vocabulary, and finish today’s
              plan without drowning in tabs.
            </p>
            {profile && (
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Target className="h-4 w-4" />
                  Target band {profile.targetBand}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Globe className="h-4 w-4" />
                  Current level {profile.currentLevel}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:w-[280px]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Today’s progress</span>
              <span className="font-medium text-slate-900">{progress}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-slate-900"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              {data.learned}/{data.totalSaved} words learned
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SmallStat
          label="Words learned"
          value={String(data.learned)}
          sub="Real learned words"
        />
        <SmallStat
          label="Saved words"
          value={String(data.totalSaved)}
          sub="Ready for review"
        />
        <SmallStat
          label="Last quiz"
          value={
            data.lastQuiz
              ? `${data.lastQuiz.score}/${data.lastQuiz.total}`
              : "—"
          }
          sub="Last attempt"
        />
        <SmallStat
          label="Avg score"
          value={`${data.avgScore}%`}
          sub="All quizzes"
        />
        <SmallStat
          label="Target band"
          value={profile ? String(profile.targetBand) : "—"}
          sub={profile ? `Current level ${profile.currentLevel}` : "Profile needed"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Today’s study plan
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A clean little list. No academic jump scares.
              </p>
            </div>
            <Link
              to="/study-plan"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View full plan <ChevronRight size={15} />
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border ${
                      task.done
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                  >
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {task.skill} • {task.duration}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  {task.done ? "Done" : "Pending"}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-500">
            {completedCount} of {tasks.length} tasks completed today.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
                <Target size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Focus today
                </h2>
                <p className="text-sm text-slate-500">Main weak point</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Recommendation</p>
              <p className="mt-2 font-medium text-slate-900">{focusTitle}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {focusText}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  AI feedback
                </h2>
                <p className="text-sm text-slate-500">Last speaking session</p>
              </div>
              <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                Needs review
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Strength</p>
                <p className="mt-1 font-medium text-slate-900">
                  Clear structure and ideas
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Improve</p>
                <p className="mt-1 font-medium text-slate-900">
                  Use more precise vocabulary instead of “good” and “bad”
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Saved vocabulary
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Quick review zone for your favorite brain snacks
            </p>
          </div>

          <div className="relative w-full md:w-[280px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved words"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>
        </div>

        {filteredWords.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
            {data.totalSaved === 0 ? (
              <div className="space-y-3">
                <p>No saved words yet.</p>
                <Link
                  to="/topics"
                  className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Go save vocabulary
                </Link>
              </div>
            ) : (
              "No saved words found."
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {word.word}
                      </p>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                        {word.level}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {word.meaning}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSavedWord(word.id)}
                    className="rounded-xl bg-white p-2 text-slate-500 ring-1 ring-slate-200 hover:text-slate-900"
                  >
                    <Star size={15} fill="currentColor" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                    Review word <ChevronRight size={14} />
                  </button>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      word.status === "learned"
                        ? "bg-emerald-100 text-emerald-700"
                        : word.status === "difficult"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {word.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
