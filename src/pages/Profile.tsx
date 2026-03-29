import { useEffect, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  BookOpen,
  Bookmark,
  Globe,
  Target,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  getActiveUserEmail,
  getProfileData,
  registerUser,
  setActiveUserEmail,
  updateProfile,
} from "@/lib/api";

type ProfileData = {
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

export default function Profile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: getActiveUserEmail(),
    targetBand: "6.5",
    currentLevel: "B1",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setError("");
      const result = await getProfileData();
      setData(result);
      setForm({
        name: result.name,
        email: result.email,
        targetBand: String(result.targetBand),
        currentLevel: result.currentLevel,
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      setData(null);
      setError("No active profile found yet. Create one below or switch by email.");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        targetBand: Number(form.targetBand),
        currentLevel: form.currentLevel.trim(),
      });
      await loadProfile();
      toast({
        title: "Profile created",
        description: "Your learner profile is now active.",
      });
    } catch (error) {
      console.error("Register failed:", error);
      setError(
        "Could not create this profile. The email may already exist, or the backend may need a restart.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    try {
      setBusy(true);
      setError("");
      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        targetBand: Number(form.targetBand),
        currentLevel: form.currentLevel.trim(),
      });
      await loadProfile();
      toast({
        title: "Profile updated",
        description: "Your account details were saved.",
      });
    } catch (error) {
      console.error("Save failed:", error);
      setError("Could not save profile changes.");
    } finally {
      setBusy(false);
    }
  };

  const handleSwitch = async () => {
    if (!form.email.trim()) {
      setError("Enter an email to switch profiles.");
      return;
    }

    setBusy(true);
    setError("");
    setActiveUserEmail(form.email.trim().toLowerCase());
    setLoading(true);
    await loadProfile();
    setBusy(false);
    toast({
      title: "Profile switched",
      description: `Active profile email: ${form.email.trim().toLowerCase()}`,
    });
  };

  if (loading) {
    return <div className="text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <User className="h-7 w-7 text-slate-700" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {data ? data.name : "Create your learner profile"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {data
                  ? data.email
                  : "Register a profile so saved words, dashboard progress, and quiz results belong to you."}
              </p>
            </div>
          </div>

          {data && (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <BadgeCheck className="h-4 w-4" />
              Active profile
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Account Setup
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          You can create a new account, edit the current one, or switch to an
          existing profile by email.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Name</p>
            <Input
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Email</p>
            <Input
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Target band</p>
            <Input
              value={form.targetBand}
              onChange={(event) => updateForm("targetBand", event.target.value)}
              placeholder="6.5"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Current level</p>
            <Input
              value={form.currentLevel}
              onChange={(event) => updateForm("currentLevel", event.target.value)}
              placeholder="B1"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={handleRegister} disabled={busy}>
            {busy ? "Working..." : "Register"}
          </Button>
          <Button onClick={handleSave} variant="secondary" disabled={busy || !data}>
            Save Profile
          </Button>
          <Button onClick={handleSwitch} variant="outline" disabled={busy}>
            Switch by Email
          </Button>
        </div>
      </section>

      {data && (
        <>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3">
                  <Target className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Target band</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {data.targetBand}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3">
                  <Globe className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Current level</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {data.currentLevel}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Learning stats
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Bookmark size={16} />
                  <span className="text-sm font-medium">Saved</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {data.stats.savedWords}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <BookOpen size={16} />
                  <span className="text-sm font-medium">Learned</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {data.stats.learned}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-amber-700">
                  <BookOpen size={16} />
                  <span className="text-sm font-medium">Learning</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {data.stats.learning}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">Difficult</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {data.stats.difficult}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
