import { useMemo, useState } from "react";
import { BookOpenText, FileText, Layers3 } from "lucide-react";
import {
  countWords,
  libraryGuides,
  totalLibraryWords,
} from "@/data/library";

export default function Library() {
  const [activeGuideId, setActiveGuideId] = useState(libraryGuides[0].id);

  const activeGuide = useMemo(
    () =>
      libraryGuides.find((guide) => guide.id === activeGuideId) ??
      libraryGuides[0],
    [activeGuideId],
  );

  const activeGuideWordCount = useMemo(
    () =>
      activeGuide.sections.reduce(
        (total, section) =>
          total +
          countWords(section.heading) +
          section.paragraphs.reduce(
            (sectionTotal, paragraph) => sectionTotal + countWords(paragraph),
            0,
          ),
        0,
      ),
    [activeGuide],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              <BookOpenText className="h-3.5 w-3.5" />
              Study Library
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              10,000+ words of IELTS reading material inside the app
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              This library gives learners long-form topic guides they can mine
              for vocabulary, essay ideas, speaking angles, and ready-made
              argument structures. Each guide is written to feel like real study
              material rather than placeholder text.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                Total Words
              </p>
              <p className="mt-2 text-2xl font-bold">
                {totalLibraryWords.toLocaleString()}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-5 py-4 text-slate-900">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Guides
              </p>
              <p className="mt-2 text-2xl font-bold">{libraryGuides.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-5 py-4 text-slate-900">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Active Guide
              </p>
              <p className="mt-2 text-2xl font-bold">
                {activeGuideWordCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          {libraryGuides.map((guide) => {
            const guideWordCount = guide.sections.reduce(
              (total, section) =>
                total +
                countWords(section.heading) +
                section.paragraphs.reduce(
                  (sectionTotal, paragraph) =>
                    sectionTotal + countWords(paragraph),
                  0,
                ),
              0,
            );

            const active = guide.id === activeGuide.id;

            return (
              <button
                key={guide.id}
                type="button"
                onClick={() => setActiveGuideId(guide.id)}
                className={`w-full rounded-[1.75rem] border p-5 text-left transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                    active ? "text-white/65" : "text-slate-500"
                  }`}
                >
                  {guide.topic}
                </p>
                <h2 className="mt-3 text-lg font-semibold leading-6">
                  {guide.title}
                </h2>
                <p
                  className={`mt-3 text-sm leading-6 ${
                    active ? "text-white/75" : "text-slate-600"
                  }`}
                >
                  {guide.description}
                </p>
                <div
                  className={`mt-4 flex items-center gap-4 text-xs font-medium ${
                    active ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Layers3 className="h-3.5 w-3.5" />
                    {guide.sections.length} sections
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    {guideWordCount.toLocaleString()} words
                  </span>
                </div>
              </button>
            );
          })}
        </aside>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="border-b border-slate-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {activeGuide.topic}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {activeGuide.title}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              {activeGuide.description}
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {activeGuide.sections.map((section) => (
              <article
                key={section.heading}
                className="rounded-[1.75rem] bg-slate-50 p-6"
              >
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                  {section.heading}
                </h3>
                <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.heading}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
