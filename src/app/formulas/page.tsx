import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, Target } from "lucide-react";
import { getFormulaSheet } from "@/lib/curriculum";
import { ChapterIcon } from "@/components/chapter-icon";
import { Formula } from "@/components/math";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ملخص القوانين",
  description:
    "كل قوانين رياضيات البكالوريا في صفحة واحدة: المتتاليات، النهايات، الاشتقاق، الأسية واللوغاريتمية، التكامل، الأعداد المركبة، الهندسة، الاحتمالات.",
};

export default function FormulasPage() {
  const sheet = getFormulaSheet();
  const total = sheet.reduce((sum, chapter) => sum + chapter.formulas.length, 0);

  return (
    <div className="container-page pt-10 pb-16">
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-l from-[#eef2ff] via-[#fffdf8] to-[#fff8e8] p-6 sm:p-9">
        <div
          className="hero-glow -start-16 -top-20 h-56 w-56 bg-brand/20"
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">
              <Target className="h-3.5 w-3.5" />
              ورقة المراجعة السريعة
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-ink sm:text-[2.5rem]">
              كل القوانين، في صفحة واحدة.
            </h1>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-ink-soft">
              {total} قانونًا أساسيًّا من {sheet.length} محاور، مرتبة وواضحة.
              راجعها قبل التمارين، أو اطبعها لمراجعتها في أي مكان.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <PrintButton />
            <Link href="/lessons" className="btn-primary btn-sm">
              <BookOpen className="h-4 w-4" />
              العودة للدروس
            </Link>
          </div>
        </div>

        <div className="hide-scrollbar relative z-10 mt-6 flex gap-2 overflow-x-auto pb-1">
          {sheet.map((chapter) => (
            <a
              key={chapter.slug}
              href={`#${chapter.slug}`}
              className="shrink-0 rounded-full border border-line bg-white/80 px-3 py-1.5 text-[0.7rem] font-bold text-ink-soft transition hover:border-brand/30 hover:text-brand"
            >
              {chapter.title}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {sheet.map((chapter) => (
          <section
            key={chapter.slug}
            id={chapter.slug}
            className="surface-solid scroll-mt-24 overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line/70 px-5 py-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in srgb, ${chapter.accent} 13%, white)`,
                    color: chapter.accent,
                  }}
                >
                  <ChapterIcon name={chapter.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-[0.95rem] font-extrabold text-ink">
                    {chapter.title}
                  </h2>
                  <p
                    className="text-[0.62rem] text-ink-soft/50"
                    style={{ fontFamily: "var(--font-manrope)" }}
                    dir="ltr"
                  >
                    {chapter.titleFr}
                  </p>
                </div>
              </div>
              <Link
                href={`/lessons/${chapter.slug}`}
                className="flex items-center gap-1 text-[0.7rem] font-extrabold text-brand transition hover:text-brand-deep"
              >
                الدرس
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-px bg-line/60 sm:grid-cols-2 xl:grid-cols-4">
              {chapter.formulas.map((formula, formulaIndex) => (
                <div
                  key={`${formula.label}-${formulaIndex}`}
                  className="flex min-h-[7rem] flex-col justify-between bg-[#fffdf8] p-4"
                >
                  <p className="text-[0.68rem] font-bold text-ink-soft">
                    {formula.label}
                  </p>
                  <div
                    className="mt-3 overflow-x-auto py-1 text-ink"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    <Formula latex={formula.latex} display />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-[#0d1224] p-6 text-white sm:flex-row sm:p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f5c46b]">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <p className="text-base font-extrabold">قانون غير واضح؟</p>
            <p className="mt-1 text-[0.8rem] text-white/55">
              اسأل Tutorly عن معنى أي قانون، ومتى تستعمله، وكيف تطبقه.
            </p>
          </div>
        </div>
        <Link
          href="/chat"
          className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition hover:bg-[#f5c46b]"
        >
          اسأل المساعد
        </Link>
      </div>
    </div>
  );
}
