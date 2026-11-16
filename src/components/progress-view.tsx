"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Cloud,
  Flame,
  PlayCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import type { ChapterWithLessons } from "@/lib/curriculum";
import { useProgress } from "./providers";
import { ProgressRing } from "./progress-ring";
import { ChapterIcon } from "./chapter-icon";

export function ProgressView({
  chapters,
  totalLessons,
  totalMinutes,
}: {
  chapters: ChapterWithLessons[];
  totalLessons: number;
  totalMinutes: number;
}) {
  const { completed, user, ready } = useProgress();
  const completedSet = new Set(completed);

  const rows = chapters.map((chapter) => {
    const done = chapter.lessons.filter((lesson) =>
      completedSet.has(lesson.id),
    ).length;
    return { chapter, done, total: chapter.lessons.length };
  });

  const doneCount = rows.reduce((sum, row) => sum + row.done, 0);
  const percent = totalLessons === 0 ? 0 : Math.round((doneCount / totalLessons) * 100);

  const remainingLessons = chapters
    .flatMap((chapter) =>
      chapter.lessons.map((lesson) => ({ chapter, lesson })),
    )
    .filter(({ lesson }) => !completedSet.has(lesson.id));
  const next = remainingLessons[0] ?? null;
  const remainingMinutes = remainingLessons.reduce(
    (sum, item) => sum + item.lesson.duration,
    0,
  );

  return (
    <div className="container-page pt-10 pb-16">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">
            <TrendingUp className="h-3.5 w-3.5" />
            لوحة التقدّم
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-ink sm:text-[2.5rem]">
            تقدّمك، خطوة بخطوة.
          </h1>
          <p className="mt-2 max-w-xl text-[0.95rem] leading-7 text-ink-soft">
            كل درس تنجزه يظهر هنا. تابع وتيرتك، ولا تقارن نفسك بأحد.
          </p>
        </div>
        {user ? (
          <span className="chip !border-mint/20 !bg-mint/[0.07] !text-emerald-700">
            <Cloud className="h-3.5 w-3.5" />
            محفوظ في حسابك · {user.name}
          </span>
        ) : (
          <span className="chip">
            <Cloud className="h-3.5 w-3.5" />
            محفوظ على هذا الجهاز
          </span>
        )}
      </div>

      {!user && ready && (
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand/15 bg-gradient-to-l from-brand-soft via-white to-[#fff8e8] p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
              <Cloud className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-ink">
                تقدّمك محفوظ هنا، لكن ليس على أجهزتك الأخرى.
              </p>
              <p className="mt-0.5 text-[0.75rem] text-ink-soft">
                أنشئ حسابًا مجانيًا لمزامنة الدروس المكتملة.
              </p>
            </div>
          </div>
          <Link href="/register" className="btn-primary btn-sm shrink-0">
            أنشئ حسابًا
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface flex flex-col items-center gap-5 p-6 sm:flex-row sm:p-7">
          <ProgressRing
            value={ready ? percent : 0}
            size={132}
            strokeWidth={10}
            color="#4f46e5"
            trackColor="rgba(16,24,40,0.07)"
          >
            <span className="text-[1.85rem] font-extrabold leading-none text-ink">
              {ready ? percent : 0}%
            </span>
            <span className="mt-1 text-[0.62rem] font-semibold text-ink-soft">
              من المنهاج
            </span>
          </ProgressRing>

          <div className="min-w-0 flex-1 text-center sm:text-start">
            <p className="text-[0.72rem] font-bold text-ink-soft">حصيلتك الحالية</p>
            <p className="mt-1 text-2xl font-extrabold text-ink">
              {ready ? doneCount : 0}{" "}
              <span className="text-sm font-semibold text-ink-soft">
                من {totalLessons} درسًا
              </span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/80 px-3 py-2.5">
                <p className="flex items-center justify-center gap-1 text-[0.62rem] font-semibold text-ink-soft sm:justify-start">
                  <BookOpen className="h-3 w-3" />
                  المتبقي
                </p>
                <p className="mt-0.5 text-sm font-extrabold text-ink">
                  {Math.max(0, totalLessons - doneCount)} دروس
                </p>
              </div>
              <div className="rounded-xl bg-white/80 px-3 py-2.5">
                <p className="flex items-center justify-center gap-1 text-[0.62rem] font-semibold text-ink-soft sm:justify-start">
                  <Clock className="h-3 w-3" />
                  الوقت المقدّر
                </p>
                <p className="mt-0.5 text-sm font-extrabold text-ink">
                  {Math.round(remainingMinutes / 60)} ساعات
                </p>
              </div>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.68rem] text-ink-soft/60 sm:justify-start">
              <Target className="h-3 w-3" />
              من أصل {Math.round(totalMinutes / 60)} ساعة من المحتوى
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-[#0d1224] p-6 text-white">
          <div
            className="hero-glow -end-10 -top-16 h-40 w-40 bg-brand/50"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#f5c46b]">
              <Flame className="h-3.5 w-3.5" />
              خطوتك التالية
            </p>
            {next ? (
              <>
                <p className="mt-2 text-base font-extrabold leading-6">
                  {next.lesson.title}
                </p>
                <p className="mt-1 text-[0.7rem] text-white/50">
                  {next.chapter.title} · {next.lesson.duration} دقيقة
                </p>
                <Link
                  href={`/lessons/${next.chapter.slug}/${next.lesson.slug}`}
                  className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-[0.78rem] font-extrabold text-ink transition hover:bg-[#f5c46b]"
                >
                  ابدأ الآن
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <p className="mt-2 text-base font-extrabold leading-6">
                  أنهيت كل الدروس! 🎉
                </p>
                <p className="mt-1 text-[0.7rem] leading-5 text-white/50">
                  حان وقت المراجعة السريعة. ابدأ بملخص القوانين.
                </p>
                <Link
                  href="/formulas"
                  className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-[0.78rem] font-extrabold text-ink transition hover:bg-[#f5c46b]"
                >
                  افتح القوانين
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">التقدّم حسب المحاور</h2>
          <Link
            href="/lessons"
            className="flex items-center gap-1 text-[0.72rem] font-extrabold text-brand hover:text-brand-deep"
          >
            كل الدروس
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map(({ chapter, done, total }) => {
            const chapterPercent =
              total === 0 ? 0 : Math.round((done / total) * 100);
            const chapterDone = total > 0 && done === total;
            return (
              <Link
                key={chapter.id}
                href={`/lessons/${chapter.slug}`}
                className="surface surface-hover flex items-center gap-3.5 p-4"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in srgb, ${chapter.accent} 13%, white)`,
                    color: chapter.accent,
                  }}
                >
                  <ChapterIcon name={chapter.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[0.85rem] font-extrabold text-ink">
                      {chapter.title}
                    </p>
                    {chapterDone && (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-mint" />
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="progress-track flex-1">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${ready ? chapterPercent : 0}%`,
                          background: `linear-gradient(90deg, ${chapter.accent}, color-mix(in srgb, ${chapter.accent} 50%, #4f46e5))`,
                        }}
                      />
                    </div>
                    <span className="shrink-0 text-[0.62rem] font-bold text-ink-soft/65">
                      {ready ? `${done}/${total}` : "—"}
                    </span>
                  </div>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
                  {chapterDone ? (
                    <CheckCircle2 className="h-4 w-4 text-mint" />
                  ) : done > 0 ? (
                    <PlayCircle className="h-4 w-4" />
                  ) : (
                    <ArrowLeft className="h-3.5 w-3.5" />
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-white/60 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5a623]/12 text-[#b7791f]">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink">
              {doneCount === 0
                ? "أول خطوة هي الأصعب… ابدأ بدقيقة واحدة."
                : "الاستمرارية أهم من السرعة. أنت على الطريق."}
            </p>
            <p className="mt-0.5 text-[0.75rem] text-ink-soft">
              ‏15 دقيقة مراجعة يوميًا تصنع فرقًا حقيقيًا.
            </p>
          </div>
        </div>
        <Link href={next ? `/lessons/${next.chapter.slug}/${next.lesson.slug}` : "/formulas"} className="btn-primary btn-sm shrink-0">
          {doneCount === 0 ? "ابدأ درسك الأول" : "تابع الآن"}
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
