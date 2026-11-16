import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import {
  getAdjacentLessons,
  getChapterBySlug,
  getLesson,
} from "@/lib/curriculum";
import { MathMarkdown } from "@/components/math";
import {
  AskLessonButton,
  CompleteLessonButton,
  LessonMobileNav,
  LessonSidebar,
} from "@/components/lesson-detail";
import { ReadingProgress } from "@/components/reading-progress";
import { ChapterIcon } from "@/components/chapter-icon";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ chapter: string; lesson: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { chapter, lesson } = await params;
  const detail = getLesson(chapter, lesson);
  if (!detail) return { title: "الدرس غير موجود" };
  return {
    title: `${detail.title} — ${detail.chapter.title}`,
    description: detail.summary,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { chapter: chapterSlug, lesson: lessonSlug } = await params;
  const lesson = getLesson(chapterSlug, lessonSlug);
  if (!lesson) notFound();

  const chapter = getChapterBySlug(chapterSlug);
  if (!chapter) notFound();

  const index = chapter.lessons.findIndex((item) => item.id === lesson.id);
  const { previous, next } = getAdjacentLessons(chapterSlug, lessonSlug);

  return (
    <>
      <ReadingProgress />
      <div className="container-page pt-6 pb-16">
        <nav
          className="flex flex-wrap items-center gap-1.5 text-[0.7rem] font-semibold text-ink-soft/70"
          aria-label="مسار التنقل"
        >
          <Link href="/" className="transition hover:text-brand">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/lessons" className="transition hover:text-brand">
            الدروس
          </Link>
          <span>/</span>
          <Link
            href={`/lessons/${chapter.slug}`}
            className="transition hover:text-brand"
          >
            {chapter.title}
          </Link>
          <span>/</span>
          <span className="text-ink">{lesson.title}</span>
        </nav>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <main className="min-w-0">
            <article className="surface-solid overflow-hidden">
              <header
                className="relative overflow-hidden border-b border-line/70 p-6 sm:p-8"
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, ${chapter.accent} 8%, #fffdf8), #fffdf8 60%, #fffaf0)`,
                }}
              >
                <span
                  className="pointer-events-none absolute -left-10 -top-14 h-48 w-48 rounded-full opacity-10 blur-2xl"
                  style={{ background: chapter.accent }}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/lessons/${chapter.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-bold"
                      style={{
                        background: `color-mix(in srgb, ${chapter.accent} 12%, white)`,
                        color: chapter.accent,
                      }}
                    >
                      <ChapterIcon name={chapter.icon} className="h-3 w-3" />
                      {chapter.title}
                    </Link>
                    <span className="chip !py-1 !text-[0.62rem]">
                      الدرس {index + 1} من {chapter.lessons.length}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-[0.62rem] font-bold ${
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

                  <h1 className="mt-3 text-[1.85rem] font-extrabold leading-tight text-ink sm:text-[2.35rem]">
                    {lesson.title}
                  </h1>
                  <p
                    className="mt-1.5 text-right text-[0.72rem] tracking-wide text-ink-soft/50"
                    style={{ fontFamily: "var(--font-manrope)" }}
                    dir="ltr"
                  >
                    {lesson.titleFr}
                  </p>
                  <p className="mt-3 max-w-2xl text-[0.9rem] leading-7 text-ink-soft">
                    {lesson.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-semibold text-ink-soft/80">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {lesson.duration} دقيقة
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      قراءة مستهدفة
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {chapter.level}
                    </span>
                  </div>
                </div>
              </header>

              <div className="p-5 sm:p-8 lg:p-10">
                <MathMarkdown content={lesson.content} />
              </div>

              <div className="border-t border-line/70 bg-[#fbf9f4] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-ink">
                      وصلت إلى نهاية الدرس 👏
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-ink-soft">
                      حدّده كمكتمل ليتابع Tutorly تقدّمك.
                    </p>
                  </div>
                  <CompleteLessonButton
                    lessonId={lesson.id}
                    lessonTitle={lesson.title}
                  />
                </div>
              </div>
            </article>

            <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand/15 bg-gradient-to-l from-brand-soft via-white to-[#fff8ea] p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-ink">
                    ما زال هناك شيء غير واضح؟
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-ink-soft">
                    اسأل Tutorly وسيأخذ هذا الدرس كسياق للإجابة.
                  </p>
                </div>
              </div>
              <AskLessonButton lessonId={lesson.id} label="افتح المساعد" />
            </div>

            <LessonMobileNav chapter={chapter} />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={`/lessons/${chapter.slug}/${previous.slug}`}
                  className="surface surface-hover group flex items-center gap-3 p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink-soft transition group-hover:bg-ink group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.62rem] font-bold text-ink-soft">
                      الدرس السابق
                    </span>
                    <span className="block truncate text-sm font-extrabold text-ink">
                      {previous.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/lessons/${chapter.slug}/${next.slug}`}
                  className="surface surface-hover group flex items-center justify-between gap-3 p-4 sm:text-end"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.62rem] font-bold text-ink-soft">
                      الدرس التالي
                    </span>
                    <span className="block truncate text-sm font-extrabold text-ink">
                      {next.title}
                    </span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-soft transition group-hover:bg-ink group-hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/lessons/${chapter.slug}`}
                  className="surface surface-hover group flex items-center justify-between gap-3 p-4 sm:text-end"
                >
                  <span>
                    <span className="block text-[0.62rem] font-bold text-ink-soft">
                      نهاية المحور
                    </span>
                    <span className="block text-sm font-extrabold text-ink">
                      عد إلى قائمة الدروس
                    </span>
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink-soft transition group-hover:bg-ink group-hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                </Link>
              )}
            </div>
          </main>

          <LessonSidebar
            chapter={chapter}
            currentLesson={lesson}
            nextLesson={next}
          />
        </div>
      </div>
    </>
  );
}
