import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteSavedWord, getSavedWords, updateSavedWord } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Search, Trash2 } from "lucide-react";

type SavedWord = {
  id: number;
  word: string;
  meaning: string;
  level: string;
  status: "learning" | "difficult" | "learned";
};

const SavedWords = () => {
  const [words, setWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const data = await getSavedWords();
      setWords(data);
    } catch (error) {
      console.error("Failed to load saved words:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number) => {
    const word = words.find((w) => w.id === id);
    if (!word) return;

    const nextStatus =
      word.status === "learned"
        ? "learning"
        : word.status === "learning"
        ? "difficult"
        : "learned";

    try {
      const updated = await updateSavedWord(id, nextStatus);
      setWords((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: updated.status } : w))
      );
      toast({
        title: "Status updated",
        description: `This word is now marked as ${updated.status}.`,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Update failed",
        description: "Could not update the word status.",
      });
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteSavedWord(id);
      setWords((prev) => prev.filter((w) => w.id !== id));
      toast({
        title: "Word removed",
        description: "The word was removed from your saved list.",
      });
    } catch (error) {
      console.error("Failed to delete word:", error);
      toast({
        title: "Delete failed",
        description: "Could not remove this word right now.",
      });
    }
  };

  const filteredWords = words.filter((word) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      word.word.toLowerCase().includes(needle) ||
      word.meaning.toLowerCase().includes(needle) ||
      word.level.toLowerCase().includes(needle) ||
      word.status.toLowerCase().includes(needle)
    );
  });

  if (loading) {
    return <div className="mx-auto max-w-3xl text-slate-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Words</h1>
          <p className="mt-1 text-sm text-slate-500">
            {words.length} words saved in your account
          </p>
        </div>

        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search saved words"
            className="pl-10"
          />
        </div>
      </div>

      {filteredWords.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          {words.length === 0 ? (
            <div className="space-y-3">
              <p>No saved words yet.</p>
              <p className="text-sm text-slate-500">
                Save a few words from Topics and they will appear here for review.
              </p>
              <Link
                to="/topics"
                className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Open Topics
              </Link>
            </div>
          ) : (
            "No words match this search"
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWords.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-bold text-slate-900">{w.word}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {w.level}
                  </span>
                </div>

                <p className="text-sm text-slate-500">{w.meaning}</p>
              </div>

              <div className="ml-4 flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(w.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    w.status === "learned"
                      ? "bg-emerald-100 text-emerald-700"
                      : w.status === "difficult"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {w.status}
                </button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => remove(w.id)}
                >
                  <Trash2 className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedWords;
