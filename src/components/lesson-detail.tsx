"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Lightbulb,
  ListChecks,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { ChapterWithLessons, LessonSummary } from "@/lib/curriculum";
import { useProgress } from "./providers";
import { ChapterIcon } from "./chapter-icon";

export function CompleteLessonButton({
  lessonId,
  lessonTitle,
}: {
  lessonId: string;
  lessonTitle: string;
}) {
  const { isCompleted, toggleLesson, ready } = useProgress();
  const [justCompleted, setJustCompleted] = useState(false);
  const done = isCompleted(lessonId);

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        disabled={!ready}
        onClick={() => {
          toggleLesson(lessonId);
          if (!done) {
            setJustCompleted(true);
            window.setTimeout(() => setJustCompleted(false), 2600);
          }
        }}
        className={`inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-extrabold transition ${
          done
            ? "border border-mint/30 bg-mint/10 text-emerald-700 hover:bg-mint/15"
            : "bg-ink text-white shadow-lg shadow-ink/20 hover:bg-brand-deep"
        }`}
        aria-pressed={done}
      >
        {done ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Check className="h-5 w-5" strokeWidth={3} />
        )}
        {done ? "تم إنجاز الدرس" : `أنجزت درس «${lessonTitle}»`}
      </button>
      {justCompleted && (
        <p className="animate-pop flex items-center gap-1.5 text-[0.72rem] font-bold text-mint">
          <Trophy className="h-3.5 w-3.5" />
          أحسنت! تم حفظ تقدّمك.
        </p>
      )}
    </div>
  );
}

export function AskLessonButton({
  lessonId,
  label = "اسأل عن هذا الدرس",
}: {
  lessonId: string;
  label?: string;
}) {
  return (
    <Link href={`/chat?lesson=${lessonId}`} className="btn-secondary btn-sm">
      <Sparkles className="h-4 w-4 text-brand" />
      {label}
    </Link>
  );
}

export function LessonSidebar({
  chapter,
  currentLesson,
  nextLesson,
}: {
  chapter: ChapterWithLessons;
  currentLesson: LessonSummary;
  nextLesson: LessonSummary | null;
}) {
  const { isCompleted, ready } = useProgress();
  const done = chapter.lessons.filter((lesson) => isCompleted(lesson.id)).length;
  const percent =
    chapter.lessons.length === 0
      ? 0
      : Math.round((done / chapter.lessons.length) * 100);

  return (
    <aside className="hidden lg:block">
      <div className="surface-solid sticky top-24 overflow-hidden">
        <div className="border-b border-line/70 p-4">
          <Link
            href={`/lessons/${chapter.slug}`}
            className="flex items-center gap-2.5"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in srgb, ${chapter.accent} 13%, white)`,
                color: chapter.accent,
              }}
            >
              <ChapterIcon name={chapter.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.62rem] font-bold text-ink-soft">
                المحور الحالي
              </span>
              <span className="block truncate text-[0.82rem] font-extrabold text-ink">
                {chapter.title}
              </span>
            </span>
          </Link>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[0.65rem] font-bold text-ink-soft">
              <span>
                {ready ? `${done} من ${chapter.lessons.length}` : "\u00A0"}
              </span>
              <span>{ready ? `${percent}%` : ""}</span>
            </div>
            <div className="progress-track mt-1.5">
              <div
                className="progress-fill"
                style={{ width: `${ready ? percent : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="max-h-[44vh] overflow-y-auto p-2.5 chat-scroll">
          <p className="flex items-center gap-1.5 px-2 py-2 text-[0.62rem] font-bold uppercase tracking-wide text-ink-soft/60">
            <ListChecks className="h-3.5 w-3.5" />
            دروس المحور
          </p>
          <ul className="space-y-0.5">
            {chapter.lessons.map((lesson, index) => {
              const active = lesson.id === currentLesson.id;
              const completed = isCompleted(lesson.id);
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/lessons/${chapter.slug}/${lesson.slug}`}
                    className={`flex items-center gap-2.5 rounded-xl px-2 py-2.5 text-[0.75rem] font-semibold transition ${
                      active
                        ? "bg-brand-soft text-brand-deep"
                        : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.62rem] font-bold ${
                        completed
                          ? "border-mint bg-mint text-white"
                          : active
                            ? "border-brand/30 bg-white text-brand"
                            : "border-line bg-white text-ink-soft/60"
                      }`}
                      style={
                        completed ? undefined : { fontFamily: "var(--font-manrope)" }
                      }
                    >
                      {completed ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
                    </span>
                    <span className="min-w-0 flex-1 leading-5">{lesson.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {nextLesson && (
          <div className="border-t border-line/70 p-3">
            <Link
              href={`/lessons/${chapter.slug}/${nextLesson.slug}`}
              className="group flex items-center gap-2.5 rounded-xl bg-ink p-3 text-white transition hover:bg-brand-deep"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.6rem] font-semibold text-white/50">
                  الدرس التالي
                </span>
                <span className="block truncate text-[0.72rem] font-bold">
                  {nextLesson.title}
                </span>
              </span>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-white/60 p-3.5">
        <p className="flex items-center gap-1.5 text-[0.68rem] font-extrabold text-ink">
          <Lightbulb className="h-3.5 w-3.5 text-[#d97706]" />
          تذكير
        </p>
        <p className="mt-1.5 text-[0.7rem] leading-5 text-ink-soft">
          علقت في خطوة؟ افتح المساعد وسيأخذ سياق هذا الدرس تلقائيًّا.
        </p>
        <Link
          href={`/chat?lesson=${currentLesson.id}`}
          className="mt-2.5 flex items-center gap-1.5 text-[0.7rem] font-extrabold text-brand hover:text-brand-deep"
        >
          <Sparkles className="h-3.5 w-3.5" />
          اسأل Tutorly
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}

export function LessonMobileNav({
  chapter,
}: {
  chapter: ChapterWithLessons;
}) {
  const { isCompleted, ready } = useProgress();
  const done = chapter.lessons.filter((lesson) => isCompleted(lesson.id)).length;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/60 px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2 text-[0.72rem] font-semibold text-ink-soft">
        <Clock className="h-3.5 w-3.5" />
        {ready ? `${done} من ${chapter.lessons.length} دروس مكتملة` : "تقدمك"}
      </div>
      <Link
        href={`/lessons/${chapter.slug}`}
        className="flex items-center gap-1 text-[0.72rem] font-extrabold text-brand"
      >
        كل دروس المحور
        <ArrowLeft className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
