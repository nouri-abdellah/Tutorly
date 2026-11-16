"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  PlayCircle,
  Search,
} from "lucide-react";
import type { ChapterWithLessons } from "@/lib/curriculum";
import { useProgress } from "./providers";
import { ChapterCard } from "./chapter-card";
import { ChapterIcon } from "./chapter-icon";
import { ProgressRing } from "./progress-ring";

type FilterKey = "all" | "new" | "progress" | "done";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "كل المحاور" },
  { key: "new", label: "لم تبدأ" },
  { key: "progress", label: "قيد الإنجاز" },
  { key: "done", label: "مكتملة" },
];

export function LessonsExplorer({
  chapters,
  totalLessons,
  totalMinutes,
}: {
  chapters: ChapterWithLessons[];
  totalLessons: number;
  totalMinutes: number;
}) {
  const { completed, ready } = useProgress();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const completedSet = useMemo(() => new Set(completed), [completed]);

  const decorated = useMemo(
    () =>
      chapters.map((chapter) => {
        const done = chapter.lessons.filter((lesson) =>
          completedSet.has(lesson.id),
        ).length;
        return { chapter, done, total: chapter.lessons.length };
      }),
    [chapters, completedSet],
  );

  const doneCount = decorated.reduce((sum, item) => sum + item.done, 0);
  const percent = totalLessons === 0 ? 0 : Math.round((doneCount / totalLessons) * 100);

  const nextLesson =
    chapters
      .flatMap((chapter) =>
        chapter.lessons.map((lesson) => ({ chapter, lesson })),
      )
      .find(({ lesson }) => !completedSet.has(lesson.id)) ?? null;

  const normalizedQuery = query.trim().toLowerCase();

  const visible = decorated.filter(({ chapter, done, total }) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [chapter.title, chapter.titleFr, chapter.tagline, chapter.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery) ||
      chapter.lessons.some((lesson) =>
        [lesson.title, lesson.titleFr, lesson.summary]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      );

    const matchesFilter =
      filter === "all" ||
      (filter === "new" && done === 0) ||
      (filter === "progress" && done > 0 && done < total) ||
      (filter === "done" && done === total && total > 0);

    return matchesQuery && matchesFilter;
  });

  return (
    <div>
      <div className="container-page pt-10 lg:pt-14">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="eyebrow">
              <BookOpen className="h-3.5 w-3.5" />
              مكتبة الدروس
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-ink sm:text-[2.6rem]">
              المنهاج كاملًا، بترتيب منطقي.
            </h1>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-ink-soft">
              {chapters.length} محاور و{totalLessons} درسًا، من أول المتتاليات إلى
              المعادلات التفاضلية. اختر درسك وابدأ الفهم من حيث أنت.
            </p>
          </div>

          <div className="surface flex w-full items-center gap-4 p-4 sm:w-auto sm:min-w-[21rem]">
            <ProgressRing
              value={ready ? percent : 0}
              size={72}
              strokeWidth={7}
              color="#4f46e5"
              trackColor="rgba(16,24,40,0.08)"
            >
              <span className="text-lg font-extrabold text-ink">
                {ready ? percent : 0}%
              </span>
            </ProgressRing>
            <div className="min-w-0 flex-1">
              <p className="text-[0.7rem] font-bold text-ink-soft">تقدّمك الكلي</p>
              <p className="mt-0.5 text-base font-extrabold text-ink">
                {ready ? doneCount : 0} من {totalLessons} درسًا
              </p>
              <div className="progress-track mt-2">
                <div
                  className="progress-fill"
                  style={{ width: `${ready ? percent : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page mt-8">
        {nextLesson ? (
          <div className="relative overflow-hidden rounded-3xl border border-brand/15 bg-gradient-to-l from-brand-soft via-white to-[#fff8e8] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm"
                  style={{ color: nextLesson.chapter.accent }}
                >
                  <ChapterIcon
                    name={nextLesson.chapter.icon}
                    className="h-6 w-6"
                  />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[0.7rem] font-bold text-brand">
                    <PlayCircle className="h-3.5 w-3.5" />
                    تابع من حيث توقفت
                  </p>
                  <p className="mt-1 truncate text-base font-extrabold text-ink">
                    {nextLesson.lesson.title}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[0.72rem] text-ink-soft">
                    <span>{nextLesson.chapter.title}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {nextLesson.lesson.duration} دقيقة
                    </span>
                  </p>
                </div>
              </div>
              <Link
                href={`/lessons/${nextLesson.chapter.slug}/${nextLesson.lesson.slug}`}
                className="btn-primary btn-sm shrink-0"
              >
                افتح الدرس
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          ready && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-mint/20 bg-mint/[0.06] p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-base font-extrabold text-ink">
                    أنهيت كل الدروس، مذهل!
                  </p>
                  <p className="text-sm text-ink-soft">
                    حان وقت المراجعة السريعة للقوانين.
                  </p>
                </div>
              </div>
              <Link href="/formulas" className="btn-secondary btn-sm">
                راجع القوانين
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          )
        )}
      </div>

      <div className="container-page mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft/50" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن درس أو محور…"
            className="h-12 w-full rounded-full border border-line bg-white/85 pe-11 ps-5 text-sm font-medium text-ink placeholder:text-ink-soft/45 focus:border-brand/40 focus:outline-none focus:ring-4 focus:ring-brand/10"
            aria-label="ابحث في الدروس"
          />
        </div>

        <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
          <span className="hidden items-center gap-1 text-[0.72rem] font-bold text-ink-soft sm:flex">
            <Filter className="h-3.5 w-3.5" />
          </span>
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.75rem] font-bold transition ${
                filter === item.key
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white/70 text-ink-soft hover:border-brand/25 hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container-page mt-6 pb-16">
        {visible.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map(({ chapter }) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                index={chapters.findIndex((item) => item.id === chapter.id)}
              />
            ))}
          </div>
        ) : (
          <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <Layers className="h-6 w-6" />
            </span>
            <p className="mt-4 text-lg font-extrabold text-ink">
              لا توجد نتائج مطابقة
            </p>
            <p className="mt-1 max-w-sm text-sm text-ink-soft">
              جرّب كلمات أخرى، أو أعد ضبط الفلاتر لعرض كل المحاور.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="btn-secondary btn-sm mt-5"
            >
              إعادة الضبط
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-[0.72rem] text-ink-soft/60">
          إجمالي المحتوى: حوالي {Math.round(totalMinutes / 60)} ساعة دراسة موجهة
        </p>
      </div>
    </div>
  );
}
