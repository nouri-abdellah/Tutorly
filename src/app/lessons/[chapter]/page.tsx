import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { getChapterBySlug, getCurriculum } from "@/lib/curriculum";
import { ChapterIcon } from "@/components/chapter-icon";
import {
  AskChapterButton,
  ChapterLessonList,
  ChapterProgressPill,
} from "@/components/chapter-detail";
import { Formula } from "@/components/math";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ chapter: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) return { title: "المحور غير موجود" };
  return {
    title: chapter.title,
    description: chapter.description,
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { chapter: slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const allChapters = getCurriculum();
  const currentIndex = allChapters.findIndex((item) => item.slug === chapter.slug);
  const previous = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  const minutes = chapter.lessons.reduce(
    (total, lesson) => total + lesson.duration,
    0,
  );
  const firstLesson = chapter.lessons[0];

  return (
    <div className="container-page pt-7 pb-16">
      <nav
        className="flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold text-ink-soft/70"
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
        <span className="text-ink">{chapter.title}</span>
      </nav>

      <section
        className="relative mt-4 overflow-hidden rounded-[2rem] border p-6 sm:p-8 lg:p-10"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${chapter.accent} 9%, #fffdf8) 0%, #fffdf8 55%, color-mix(in srgb, ${chapter.accent} 4%, #fffdf8) 100%)`,
          borderColor: `color-mix(in srgb, ${chapter.accent} 18%, white)`,
        }}
      >
        <span
          className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full opacity-10 blur-2xl"
          style={{ background: chapter.accent }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full opacity-[0.07] blur-2xl"
          style={{ background: chapter.accent }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-white shadow-sm sm:h-16 sm:w-16"
                style={{ color: chapter.accent, borderColor: `${chapter.accent}22` }}
              >
                <ChapterIcon
                  name={chapter.icon}
                  className="h-7 w-7 sm:h-8 sm:w-8"
                />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-1 text-[0.65rem] font-bold"
                    style={{
                      background: `color-mix(in srgb, ${chapter.accent} 12%, white)`,
                      color: chapter.accent,
                    }}
                  >
                    المحور {String(currentIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="chip !py-1 !text-[0.65rem]">
                    <GraduationCap className="h-3 w-3" />
                    {chapter.level}
                  </span>
                </div>
                <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-[2.5rem]">
                  {chapter.title}
                </h1>
                <p
                  className="mt-1 text-right text-[0.78rem] font-medium tracking-wide text-ink-soft/55"
                  style={{ fontFamily: "var(--font-manrope)" }}
                  dir="ltr"
                >
                  {chapter.titleFr}
                </p>
              </div>
            </div>

            <ChapterProgressPill chapter={chapter} />
          </div>

          <p className="mt-5 max-w-3xl text-[0.95rem] leading-8 text-ink-soft">
            {chapter.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.75rem] font-semibold text-ink-soft">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {chapter.lessons.length} دروس
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {minutes} دقيقة دراسة
            </span>
            <span className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              {chapter.formulas.length} قوانين أساسية
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              {chapter.tagline}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {firstLesson && (
              <Link
                href={`/lessons/${chapter.slug}/${firstLesson.slug}`}
                className="btn-primary btn-sm"
              >
                ابدأ أول درس
                <ArrowLeft className="h-4 w-4" />
              </Link>
            )}
            <AskChapterButton chapter={chapter} />
          </div>
        </div>
      </section>

      {chapter.formulas.length > 0 && (
        <section className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-extrabold text-ink">قوانين المحور في لمحة</h2>
            <span className="text-[0.68rem] text-ink-soft/60">
              راجعها قبل التمارين
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {chapter.formulas.map((formula, formulaIndex) => (
              <div
                key={`${formula.label}-${formulaIndex}`}
                className="surface flex min-h-[6rem] flex-col justify-between p-4"
              >
                <p className="text-[0.68rem] font-bold text-ink-soft">
                  {formula.label}
                </p>
                <div
                  className="mt-2 overflow-x-auto py-1 text-ink"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  <Formula latex={formula.latex} display />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-ink">دروس المحور</h2>
              <p className="mt-1 text-[0.78rem] text-ink-soft">
                اضغط على الدائرة لتحديد الدرس كمكتمل.
              </p>
            </div>
            <span className="chip">
              {chapter.lessons.length} دروس
            </span>
          </div>
          <ChapterLessonList chapter={chapter} />
        </section>

        <aside className="space-y-4">
          <div className="surface-solid sticky top-24 p-5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <Lightbulb className="h-4 w-4 text-[#d97706]" />
              نصائح قبل البدء
            </h3>
            <ul className="mt-3 space-y-3 text-[0.78rem] leading-6 text-ink-soft">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                اقرأ التعريف أولًا، ثم أعد كتابته بأسلوبك.
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                لا تنتقل إلى المثال قبل فهم المبرهنة.
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                أنجز التمرين السريع في نهاية كل درس.
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                علقت في خطوة؟ اسأل المساعد مع سياق الدرس.
              </li>
            </ul>

            <Link
              href="/chat"
              className="mt-5 flex items-center gap-3 rounded-2xl bg-[#0d1224] p-4 text-white transition hover:bg-[#161e3a]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#f5c46b]">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.78rem] font-bold">
                  شرح فوري لأي فكرة
                </span>
                <span className="block text-[0.65rem] text-white/50">
                  Tutorly متاح 24/7
                </span>
              </span>
              <ArrowLeft className="ms-auto h-4 w-4 text-white/40" />
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/lessons/${previous.slug}`}
            className="surface surface-hover group flex items-center gap-3 p-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink-soft transition group-hover:bg-ink group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[0.65rem] font-bold text-ink-soft">
                المحور السابق
              </span>
              <span className="block text-sm font-extrabold text-ink">
                {previous.title}
              </span>
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link
            href={`/lessons/${next.slug}`}
            className="surface surface-hover group flex items-center justify-between gap-3 p-4 sm:text-end"
          >
            <span>
              <span className="block text-[0.65rem] font-bold text-ink-soft">
                المحور التالي
              </span>
              <span className="block text-sm font-extrabold text-ink">
                {next.title}
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink-soft transition group-hover:bg-ink group-hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
