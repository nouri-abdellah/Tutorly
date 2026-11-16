import { db } from "./db";
import type { Formula } from "@/content/types";

export type Chapter = {
  id: string;
  slug: string;
  title: string;
  titleFr: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  level: string;
  order: number;
  formulas: Formula[];
};

export type LessonSummary = {
  id: string;
  chapterId: string;
  chapterSlug: string;
  slug: string;
  title: string;
  titleFr: string;
  summary: string;
  duration: number;
  difficulty: string;
  order: number;
};

export type ChapterWithLessons = Chapter & {
  lessons: LessonSummary[];
};

export type LessonDetail = LessonSummary & {
  content: string;
  chapter: Chapter;
};

type ChapterRow = {
  id: string;
  slug: string;
  title: string;
  title_fr: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  level: string;
  order_index: number;
  formulas: string;
};

type LessonRow = {
  id: string;
  chapter_id: string;
  chapter_slug: string;
  slug: string;
  title: string;
  title_fr: string;
  summary: string;
  duration: number;
  difficulty: string;
  order_index: number;
  content?: string;
};

function mapChapter(row: ChapterRow): Chapter {
  let formulas: Formula[] = [];
  try {
    formulas = JSON.parse(row.formulas) as Formula[];
  } catch {
    formulas = [];
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleFr: row.title_fr,
    tagline: row.tagline,
    description: row.description,
    icon: row.icon,
    accent: row.accent,
    level: row.level,
    order: row.order_index,
    formulas,
  };
}

function mapLesson(row: LessonRow): LessonSummary {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    chapterSlug: row.chapter_slug,
    slug: row.slug,
    title: row.title,
    titleFr: row.title_fr,
    summary: row.summary,
    duration: row.duration,
    difficulty: row.difficulty,
    order: row.order_index,
  };
}

const lessonSelect = `
  SELECT l.id, l.chapter_id, c.slug AS chapter_slug, l.slug, l.title, l.title_fr,
         l.summary, l.duration, l.difficulty, l.order_index
  FROM lessons l
  JOIN chapters c ON c.id = l.chapter_id
`;

export function getCurriculum(): ChapterWithLessons[] {
  const chapters = db
    .prepare("SELECT * FROM chapters ORDER BY order_index")
    .all() as ChapterRow[];
  const lessons = db
    .prepare(`${lessonSelect} ORDER BY c.order_index, l.order_index`)
    .all() as LessonRow[];

  const grouped = new Map<string, LessonSummary[]>();
  for (const row of lessons) {
    const list = grouped.get(row.chapter_id) ?? [];
    list.push(mapLesson(row));
    grouped.set(row.chapter_id, list);
  }

  return chapters.map((row) => ({
    ...mapChapter(row),
    lessons: grouped.get(row.id) ?? [],
  }));
}

export function getAllLessons(): LessonSummary[] {
  const rows = db
    .prepare(`${lessonSelect} ORDER BY c.order_index, l.order_index`)
    .all() as LessonRow[];
  return rows.map(mapLesson);
}

export function getChapterBySlug(slug: string): ChapterWithLessons | null {
  const row = db
    .prepare("SELECT * FROM chapters WHERE slug = ?")
    .get(slug) as ChapterRow | undefined;
  if (!row) return null;

  const lessons = db
    .prepare(`${lessonSelect} WHERE l.chapter_id = ? ORDER BY l.order_index`)
    .all(row.id) as LessonRow[];

  return {
    ...mapChapter(row),
    lessons: lessons.map(mapLesson),
  };
}

export function getLesson(
  chapterSlug: string,
  lessonSlug: string,
): LessonDetail | null {
  const row = db
    .prepare(
      `SELECT l.id, l.chapter_id, c.slug AS chapter_slug, l.slug, l.title, l.title_fr,
              l.summary, l.duration, l.difficulty, l.order_index, l.content
       FROM lessons l
       JOIN chapters c ON c.id = l.chapter_id
       WHERE c.slug = ? AND l.slug = ?`,
    )
    .get(chapterSlug, lessonSlug) as LessonRow | undefined;

  if (!row) return null;

  const chapterRow = db
    .prepare("SELECT * FROM chapters WHERE id = ?")
    .get(row.chapter_id) as ChapterRow | undefined;
  if (!chapterRow) return null;

  return {
    ...mapLesson(row),
    content: row.content ?? "",
    chapter: mapChapter(chapterRow),
  };
}

export function getLessonById(id: string): LessonDetail | null {
  const [chapterSlug, lessonSlug] = id.split("--");
  if (!chapterSlug || !lessonSlug) return null;
  return getLesson(chapterSlug, lessonSlug);
}

export function getAdjacentLessons(chapterSlug: string, lessonSlug: string) {
  const lessons = getAllLessons().filter(
    (lesson) => lesson.chapterSlug === chapterSlug,
  );
  const index = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}

export function getFormulaSheet() {
  const chapters = getCurriculum();
  return chapters
    .filter((chapter) => chapter.formulas.length > 0)
    .map((chapter) => ({
      slug: chapter.slug,
      title: chapter.title,
      titleFr: chapter.titleFr,
      accent: chapter.accent,
      icon: chapter.icon,
      formulas: chapter.formulas,
    }));
}

export function getCurriculumOverview() {
  const chapters = getCurriculum();
  return {
    chapters,
    totalLessons: chapters.reduce((total, chapter) => total + chapter.lessons.length, 0),
    totalMinutes: chapters.reduce(
      (total, chapter) =>
        total + chapter.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
      0,
    ),
    totalFormulas: chapters.reduce(
      (total, chapter) => total + chapter.formulas.length,
      0,
    ),
  };
}
