import type { Metadata } from "next";
import { getChapterBySlug, getCurriculum, getLessonById } from "@/lib/curriculum";
import { ChatShell, type ChatContext } from "@/components/chat-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المساعد الذكي",
  description:
    "اسأل مساعد Tutorly عن أي درس أو تمرين في رياضيات البكالوريا، واحصل على شرح مبسط خطوة بخطوة بالعربية.",
};

type PageProps = {
  searchParams: Promise<{ lesson?: string | string[]; chapter?: string | string[] }>;
};

export default async function ChatPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lessonParam =
    typeof params.lesson === "string" ? params.lesson : undefined;
  const chapterParam =
    typeof params.chapter === "string" ? params.chapter : undefined;

  const lesson = lessonParam ? getLessonById(lessonParam) : null;
  const chapter = !lesson && chapterParam
    ? getChapterBySlug(chapterParam)
    : null;

  let initialContext: ChatContext | null = null;
  if (lesson) {
    initialContext = {
      title: lesson.title,
      chapterTitle: lesson.chapter.title,
      chapterSlug: lesson.chapter.slug,
      accent: lesson.chapter.accent,
      icon: lesson.chapter.icon,
      lessonId: lesson.id,
    };
  } else if (chapter) {
    initialContext = {
      title: `مراجعة محور ${chapter.title}`,
      chapterTitle: chapter.title,
      chapterSlug: chapter.slug,
      accent: chapter.accent,
      icon: chapter.icon,
    };
  }

  const chapterOptions = getCurriculum().map((item) => ({
    slug: item.slug,
    title: item.title,
    accent: item.accent,
    icon: item.icon,
  }));

  return (
    <ChatShell
      initialContext={initialContext}
      chapterOptions={chapterOptions}
    />
  );
}
