import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ListChecks,
  MessageSquareQuote,
  Sparkles,
  Target,
} from "lucide-react";
import { getDashboardData, getProfileData, getSavedWords } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type DashboardData = {
  totalSaved: number;
  learned: number;
  difficult: number;
  learning: number;
  recentWords: Array<{
    id: number;
    word: string;
    meaning: string;
    level: string;
    status: "learning" | "difficult" | "learned";
  }>;
  lastQuiz: { score: number; total: number } | null;
  avgScore: number;
};

type ProfileSnapshot = {
  id: number;
  name: string;
  email: string;
  targetBand: number;
  currentLevel: string;
  stats: {
    savedWords: number;
    learned: number;
    difficult: number;
    learning: number;
  };
};

type SavedWord = {
  id: number;
  word: string;
  meaning: string;
  level: string;
  status: "learning" | "difficult" | "learned";
};

type StudyTask = {
  id: string;
  title: string;
  skill: string;
  duration: string;
  done: boolean;
  description: string;
  actionLabel: string;
  to: string;
};

type QuickRoute = {
  title: string;
  description: string;
  to: string;
  icon: typeof BookOpen;
};

export default function StudyPlan() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [profile, setProfile] = useState<ProfileSnapshot | null>(null);
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const [dashboardData, profileData, savedWordsData] = await Promise.all([
          getDashboardData(),
          getProfileData(),
          getSavedWords(),
        ]);

        setDashboard(dashboardData);
        setProfile(profileData);
        setSavedWords(savedWordsData);
      } catch (error) {
        console.error("Failed to load study plan:", error);
        toast({
          title: "Could not build study plan",
          description:
            "The page could not load your current progress. Check the backend and active profile.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, []);

  const tasks = useMemo<StudyTask[]>(() => {
    if (!dashboard || !profile) return [];

    const latestWord = dashboard.recentWords?.[0]?.word;
    const hasWeakWords = dashboard.difficult > 0;
    const hasLearningWords = dashboard.learning > 0;
    const lowQuizScore = dashboard.avgScore > 0 && dashboard.avgScore < 65;
    const noQuizYet = !dashboard.lastQuiz;
    const lowSavedCount = dashboard.totalSaved < 8;
    const higherLevel =
      profile.currentLevel.toUpperCase() === "B2" ||
      profile.currentLevel.toUpperCase() === "C1" ||
      profile.currentLevel.toUpperCase() === "C2";

    const dynamicTasks: StudyTask[] = [];

    if (lowSavedCount) {
      dynamicTasks.push({
        id: "build-bank",
        title: "Build your vocabulary bank first",
        skill: "Vocabulary",
        duration: "10 min",
        done: false,
        description:
          "You still have a small saved-word bank. Add at least five useful words from topics you care about so the rest of the app can personalize around you.",
        actionLabel: "Open Topics",
        to: "/topics",
      });
    }

    if (hasWeakWords) {
      dynamicTasks.push({
        id: "review-difficult",
        title: "Review difficult words before learning new ones",
        skill: "Vocabulary",
        duration: "12 min",
        done: false,
        description: `You currently have ${dashboard.difficult} difficult word${
          dashboard.difficult === 1 ? "" : "s"
        }. Move those back into active review and say each one aloud in a sentence.`,
        actionLabel: "Open Saved Words",
        to: "/saved",
      });
    } else if (hasLearningWords) {
      dynamicTasks.push({
        id: "promote-learning",
        title: "Push learning words toward automatic recall",
        skill: "Vocabulary",
        duration: "10 min",
        done: false,
        description: `You have ${dashboard.learning} learning word${
          dashboard.learning === 1 ? "" : "s"
        } in progress. Spend one short block repeating them before they fade.`,
        actionLabel: "Review Saved Words",
        to: "/saved",
      });
    }

    if (noQuizYet || lowQuizScore) {
      dynamicTasks.push({
        id: "practice-recovery",
        title: noQuizYet
          ? "Do your first practice set today"
          : "Raise your quiz accuracy with one focused set",
        skill: "Practice",
        duration: "15 min",
        done: false,
        description: noQuizYet
          ? "You have not recorded a quiz yet. One short set will give the dashboard something real to measure."
          : `Your average quiz score is ${dashboard.avgScore}%. One new set today will help you spot whether vocabulary or grammar needs more attention.`,
        actionLabel: "Go to Practice",
        to: "/practice",
      });
    } else {
      dynamicTasks.push({
        id: "maintain-practice",
        title: "Keep your momentum with one mixed practice set",
        skill: "Practice",
        duration: "12 min",
        done: false,
        description:
          "Your current quiz history is stable enough to maintain. One fresh mixed set is enough to keep the habit alive.",
        actionLabel: "Go to Practice",
        to: "/practice",
      });
    }

    dynamicTasks.push({
      id: "ai-coaching",
      title: higherLevel
        ? "Use AI to sharpen a writing or speaking answer"
        : "Use AI to explain one word or fix one sentence",
      skill: higherLevel ? "Writing / Speaking" : "General English",
      duration: higherLevel ? "10 min" : "8 min",
      done: false,
      description: higherLevel
        ? "At your current level, the biggest gains often come from precision. Ask the assistant to improve one paragraph or one speaking answer."
        : "At your current level, short correction loops work best. Ask the assistant to explain one word or correct one sentence.",
      actionLabel: "Ask AI Assistant",
      to: "/assistant",
    });

    if (latestWord) {
      dynamicTasks.push({
        id: "last-word",
        title: `Revisit your newest saved word: ${latestWord}`,
        skill: "Memory",
        duration: "5 min",
        done: false,
        description:
          "Your newest saved word is the easiest to forget if you only save it once. Review it again and use it in your own sentence.",
        actionLabel: "Open Saved Words",
        to: "/saved",
      });
    }

    return dynamicTasks.slice(0, 4);
  }, [dashboard, profile]);

  const quickRoutes = useMemo<QuickRoute[]>(() => {
    if (!dashboard) return [];

    return [
      {
        title: "Open Topics",
        description:
          dashboard.totalSaved < 8
            ? "You still need more saved words for deeper personalization"
            : "Add a few fresh words from a topic you care about",
        to: "/topics",
        icon: BookOpen,
      },
      {
        title: "Go to Practice",
        description:
          dashboard.avgScore < 65
            ? "Your current score suggests practice should stay high priority"
            : "Run a fresh set and keep your quiz rhythm going",
        to: "/practice",
        icon: ListChecks,
      },
      {
        title: "Ask AI Assistant",
        description:
          profile?.currentLevel.toUpperCase() === "B1" ||
          profile?.currentLevel.toUpperCase() === "A2"
            ? "Use it for word explanations and sentence fixes"
            : "Use it for writing and speaking refinement",
        to: "/assistant",
        icon: MessageSquareQuote,
      },
    ];
  }, [dashboard, profile]);

  const summary = useMemo(() => {
    if (!dashboard || !profile) return null;

    if (dashboard.totalSaved < 8) {
      return {
        title: "Your plan starts with building a word bank",
        text: "Right now the app still knows too little about your weak and strong areas, so the best first move is to save more useful vocabulary.",
        time: "35 min",
      };
    }

    if (dashboard.difficult > dashboard.learned) {
      return {
        title: "Your weakest point is word retention",
        text: "You have more difficult words than learned ones, so review should come before expansion today.",
        time: "40 min",
      };
    }

    if (dashboard.avgScore > 0 && dashboard.avgScore < 65) {
      return {
        title: "Your quiz performance needs one focused reset",
        text: "Do a deliberate practice set, then use AI to understand your mistakes instead of rushing to new material.",
        time: "45 min",
      };
    }

    return {
      title: "You are ready for a balanced study session",
      text: "Your profile is stable enough to combine review, practice, and one improvement task in the same session.",
      time: "45 min",
    };
  }, [dashboard, profile]);

  if (loading) {
    return <div className="text-slate-500">Building your study plan...</div>;
  }

  if (!dashboard || !profile || !summary) {
    return <div className="text-slate-500">Could not load your study plan.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Study Plan
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {profile.name}, this plan is built from your progress
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {summary.text}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">
              Recommended Time
            </p>
            <p className="mt-2 text-2xl font-bold">{summary.time}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Today’s personal steps
              </h2>
              <p className="text-sm text-slate-500">{summary.title}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {task.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {task.skill} • {task.duration}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {task.description}
                      </p>
                      <Link
                        to={task.to}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-900"
                      >
                        {task.actionLabel}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    {task.done ? "Done" : "Pending"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Quick Actions
            </h2>
            <div className="mt-5 space-y-3">
              {quickRoutes.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white p-2 text-slate-700 ring-1 ring-slate-200">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Why this plan
            </h2>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-amber-500" />
                <div className="space-y-2 text-sm leading-6 text-slate-600">
                  <p>
                    Saved words: <span className="font-medium text-slate-900">{dashboard.totalSaved}</span>
                  </p>
                  <p>
                    Difficult words: <span className="font-medium text-slate-900">{dashboard.difficult}</span>
                  </p>
                  <p>
                    Average quiz score: <span className="font-medium text-slate-900">{dashboard.avgScore}%</span>
                  </p>
                  <p>
                    Current level: <span className="font-medium text-slate-900">{profile.currentLevel}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Completion Rule
            </h2>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-600">
                  Finish one review task, one practice task, and one improvement
                  task. That is enough to make the session count without turning
                  it into a marathon.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
