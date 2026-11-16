"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Sparkles } from "lucide-react";
import type { ChapterWithLessons } from "@/lib/curriculum";
import { useProgress } from "./providers";
import { ProgressRing } from "./progress-ring";
import { ChapterIcon } from "./chapter-icon";

export function HeroDashboard({
  chapters,
  totalLessons,
}: {
  chapters: ChapterWithLessons[];
  totalLessons: number;
}) {
  const { completed, isCompleted, ready } = useProgress();

  const validIds = new Set(
    chapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id)),
  );
  const done = completed.filter((id) => validIds.has(id)).length;
  const percent = totalLessons === 0 ? 0 : Math.round((done / totalLessons) * 100);

  const nextLesson =
    chapters
      .flatMap((chapter) =>
        chapter.lessons.map((lesson) => ({ chapter, lesson })),
      )
      .find(({ lesson }) => !isCompleted(lesson.id)) ?? null;

  return (
    <div className="relative mx-auto w-full max-w-[27rem] lg:mx-0">
      <div className="hero-panel animate-fade-up p-4 sm:p-5">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <Sparkles className="h-3.5 w-3.5 text-[#f5c46b]" />
                </span>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/55">
                  خطتك اليوم
                </p>
              </div>
              <p className="mt-2 text-lg font-extrabold text-white">
                خطوة صغيرة… فرق كبير
              </p>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-bold text-emerald-300">
              ● متاح الآن
            </span>
          </div>

          <div className="mt-5 flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <ProgressRing value={ready ? percent : 0} size={98} strokeWidth={8}>
              <span className="text-[1.35rem] font-extrabold text-white">
                {ready ? percent : 0}%
              </span>
              <span className="text-[0.6rem] font-semibold text-white/55">
                مكتمل
              </span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold text-white/50">
                تقدّمك الكلي
              </p>
              <p className="mt-1 text-[1.65rem] font-extrabold leading-none text-white">
                {ready ? done : "—"}
                <span className="mx-1 text-sm font-semibold text-white/35">
                  / {totalLessons}
                </span>
              </p>
              <p className="mt-1.5 text-[0.72rem] text-white/50">
                درسًا مكتملًا في المنهاج
              </p>
              <div className="mt-2 h-1 w-28 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-[#f5c46b] to-[#818cf8] transition-all duration-700"
                  style={{ width: `${ready ? percent : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3.5 rounded-2xl bg-[#fffdf8] p-4 text-ink shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[0.68rem] font-bold text-brand">
                التالي في خطتك
              </span>
              {nextLesson && (
                <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-ink-soft">
                  <Clock className="h-3 w-3" />
                  {nextLesson.lesson.duration} دقيقة
                </span>
              )}
            </div>

            {nextLesson ? (
              <>
                <div className="mt-2.5 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in srgb, ${nextLesson.chapter.accent} 13%, white)`,
                      color: nextLesson.chapter.accent,
                    }}
                  >
                    <ChapterIcon
                      name={nextLesson.chapter.icon}
                      className="h-5 w-5"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-ink">
                      {nextLesson.lesson.title}
                    </p>
                    <p className="truncate text-[0.68rem] text-ink-soft">
                      {nextLesson.chapter.title}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/lessons/${nextLesson.chapter.slug}/${nextLesson.lesson.slug}`}
                  className="mt-3 flex items-center justify-between rounded-xl bg-ink px-4 py-2.5 text-[0.8rem] font-extrabold text-white transition hover:bg-brand-deep"
                >
                  تابع الدرس الآن
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <div className="mt-3">
                <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
                  <CheckCircle2 className="h-4 w-4 text-mint" />
                  أكملت كل الدروس، عمل رائع!
                </p>
                <Link
                  href="/formulas"
                  className="mt-3 flex items-center justify-between rounded-xl bg-ink px-4 py-2.5 text-[0.8rem] font-extrabold text-white transition hover:bg-brand-deep"
                >
                  راجع ملخص القوانين
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/chat"
            className="group mt-3.5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 transition hover:border-white/25 hover:bg-white/[0.1]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5c46b] text-[#402c05]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.8rem] font-bold text-white">
                لم تفهم فكرة؟ اسأل Tutorly
              </span>
              <span className="block text-[0.66rem] text-white/45">
                شرح فوري، بالعربية، خطوة بخطوة
              </span>
            </span>
            <ArrowLeft className="h-4 w-4 shrink-0 text-white/40 transition group-hover:-translate-x-1 group-hover:text-white" />
          </Link>
        </div>
      </div>

      <div className="animate-float absolute -end-3 -top-4 z-20 hidden items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-[0.7rem] font-extrabold text-ink shadow-lg sm:flex">
        <BookOpen className="h-3.5 w-3.5 text-brand" />
        20 درسًا مشروحًا
      </div>
      <div className="animate-float-slow absolute -bottom-5 -start-3 z-20 hidden items-center gap-2 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-lg sm:flex">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint/10 text-mint">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-[0.65rem] font-semibold text-ink-soft">
            أسلوب مراجعة ذكي
          </span>
          <span className="block text-[0.72rem] font-extrabold text-ink">
            فهم، لا حفظ
          </span>
        </span>
      </div>
    </div>
  );
}
