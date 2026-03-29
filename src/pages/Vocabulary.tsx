export default function Vocabulary() {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Vocabulary moved into Topics
      </h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Open the Topics page to browse words by section, search them, filter by
        IELTS module and level, and save them directly from the same screen.
      </p>
      <a
        href="/topics"
        className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Open Topics
      </a>
    </div>
  );
}
