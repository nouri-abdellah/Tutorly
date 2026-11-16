"use client";

import Link from "next/link";
import { ArrowLeft, Check, Circle, Clock, Sparkles } from "lucide-react";
import type { ChapterWithLessons } from "@/lib/curriculum";
import { useProgress } from "./providers";

export function ChapterProgressPill({
  chapter,
}: {
  chapter: ChapterWithLessons;
}) {
  const { isCompleted, ready } = useProgress();
  const total = chapter.lessons.length;
  const done = chapter.lessons.filter((lesson) => isCompleted(lesson.id)).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="min-w-[10rem]">
      <div className="flex items-center justify-between text-[0.7rem] font-bold">
        <span className="text-ink-soft">
          {ready ? (done === 0 ? "لم تبدأ" : `${done} من ${total}`) : "\u00A0"}
        </span>
        <span className="text-ink">{ready ? `${percent}%` : ""}</span>
      </div>
      <div className="progress-track mt-2">
        <div
          className="progress-fill"
          style={{
            width: `${ready ? percent : 0}%`,
            background: `linear-gradient(90deg, ${chapter.accent}, color-mix(in srgb, ${chapter.accent} 50%, #4f46e5))`,
          }}
        />
      </div>
    </div>
  );
}

export function ChapterLessonList({
  chapter,
}: {
  chapter: ChapterWithLessons;
}) {
  const { isCompleted, toggleLesson, ready } = useProgress();

  return (
    <ol className="space-y-2.5">
      {chapter.lessons.map((lesson, index) => {
        const done = isCompleted(lesson.id);
        return (
          <li
            key={lesson.id}
            className="group flex items-start gap-3 rounded-2xl border border-line/80 bg-white/70 p-3 transition hover:border-brand/25 hover:bg-white sm:items-center sm:gap-4 sm:p-4"
          >
            <button
              type="button"
              onClick={() => toggleLesson(lesson.id)}
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[0.78rem] font-extrabold transition sm:mt-0 ${
                done
                  ? "border-mint bg-mint text-white"
                  : "border-line bg-white text-ink-soft hover:border-brand/35 hover:text-brand"
              }`}
              aria-label={
                done ? `إلغاء إكمال درس ${lesson.title}` : `إكمال درس ${lesson.title}`
              }
              aria-pressed={done}
            >
              {done ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : ready ? (
                <span style={{ fontFamily: "var(--font-manrope)" }}>{index + 1}</span>
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
            </button>

            <Link
              href={`/lessons/${chapter.slug}/${lesson.slug}`}
              className="min-w-0 flex-1 py-0.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-[0.95rem] font-extrabold ${
                    done ? "text-ink-soft line-through decoration-mint/50" : "text-ink"
                  }`}
                >
                  {lesson.title}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${
                    lesson.difficulty === "متقدم"
                      ? "bg-rose-50 text-rose-600"
                      : lesson.difficulty === "متوسط"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {lesson.difficulty}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-[0.78rem] leading-6 text-ink-soft">
                {lesson.summary}
              </p>
              <div className="mt-1.5 flex items-center gap-3 text-[0.68rem] font-semibold text-ink-soft/60">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lesson.duration} دقيقة
                </span>
                <span
                  style={{ fontFamily: "var(--font-manrope)" }}
                  className="truncate text-ink-soft/45"
                  dir="ltr"
                >
                  {lesson.titleFr}
                </span>
              </div>
            </Link>

            <Link
              href={`/lessons/${chapter.slug}/${lesson.slug}`}
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-soft transition group-hover:bg-ink group-hover:text-white sm:mt-0"
              aria-label={`افتح درس ${lesson.title}`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function AskChapterButton({ chapter }: { chapter: ChapterWithLessons }) {
  return (
    <Link
      href={`/chat?chapter=${chapter.slug}`}
      className="btn-secondary btn-sm"
    >
      <Sparkles className="h-4 w-4 text-brand" />
      اسأل عن هذا المحور
    </Link>
  );
}
