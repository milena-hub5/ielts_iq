import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">
          Learn IELTS smarter
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/80">
          Practice vocabulary, improve speaking and writing, and track your
          progress — all in one place.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            to="/dashboard"
            className="rounded-2xl bg-white px-5 py-2 text-sm font-medium text-slate-900"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/practice"
            className="rounded-2xl border border-white/30 px-5 py-2 text-sm font-medium text-white"
          >
            Start Practice
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Topics", desc: "Open a section and see the words instantly" },
          { title: "AI Assistant", desc: "Ask questions and get feedback" },
          { title: "Practice", desc: "Test yourself with quizzes" },
          { title: "Profile", desc: "Create an account and keep your progress" },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-lg font-semibold text-slate-900">
              {item.title}
            </p>
            <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* QUICK ACTIONS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Quick start</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/topics"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Topics
          </Link>

          <Link
            to="/assistant"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium"
          >
            AI Assistant
          </Link>

          <Link
            to="/profile"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium"
          >
            Profile
          </Link>

          <Link
            to="/practice"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium"
          >
            Practice
          </Link>
        </div>
      </section>
    </div>
  );
}
