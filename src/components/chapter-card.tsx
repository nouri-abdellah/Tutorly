"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Layers } from "lucide-react";
import type { ChapterWithLessons } from "@/lib/curriculum";
import { useProgress } from "./providers";
import { ChapterIcon } from "./chapter-icon";

export function ChapterCard({
  chapter,
  index,
  compact = false,
}: {
  chapter: ChapterWithLessons;
  index: number;
  compact?: boolean;
}) {
  const { isCompleted, ready } = useProgress();
  const done = chapter.lessons.filter((lesson) => isCompleted(lesson.id)).length;
  const total = chapter.lessons.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const completed = done === total && total > 0;

  return (
    <Link
      href={`/lessons/${chapter.slug}`}
      className="surface surface-hover group relative flex flex-col overflow-hidden p-5 sm:p-6"
    >
      <span
        className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-150"
        style={{ background: chapter.accent }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6"
          style={{
            background: `color-mix(in srgb, ${chapter.accent} 13%, white)`,
            color: chapter.accent,
            border: `1px solid color-mix(in srgb, ${chapter.accent} 18%, white)`,
          }}
        >
          <ChapterIcon name={chapter.icon} className="h-6 w-6" strokeWidth={2.1} />
        </span>
        <span
          className="text-[0.78rem] font-extrabold tracking-wider text-ink/15"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-extrabold text-ink transition-colors group-hover:text-brand-deep">
            {chapter.title}
          </h3>
          {completed && <CheckCircle2 className="h-4 w-4 text-mint" />}
        </div>
        {!compact && (
          <p className="mt-1.5 text-sm leading-6 text-ink-soft">{chapter.tagline}</p>
        )}
        <p
          className="mt-1 text-right text-[0.7rem] font-medium tracking-wide text-ink-soft/60"
          style={{ fontFamily: "var(--font-manrope)" }}
          dir="ltr"
        >
          {chapter.titleFr}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between text-[0.72rem] font-semibold text-ink-soft">
        <span className="flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" />
          {total} دروس
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {chapter.lessons.reduce((sum, lesson) => sum + lesson.duration, 0)} د
        </span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/5 text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-white"
          aria-hidden="true"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="mt-3">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${ready ? percent : 0}%`,
              background: `linear-gradient(90deg, ${chapter.accent}, color-mix(in srgb, ${chapter.accent} 55%, #4f46e5))`,
            }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[0.68rem] font-semibold text-ink-soft/70">
          <span>{ready ? (done === 0 ? "لم تبدأ بعد" : `${done} من ${total} مكتمل`) : "\u00A0"}</span>
          <span>{ready ? `${percent}%` : ""}</span>
        </div>
      </div>
    </Link>
  );
}
