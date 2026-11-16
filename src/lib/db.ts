import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { curriculum } from "@/content";

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  accent TEXT NOT NULL,
  level TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  formulas TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  summary TEXT NOT NULL,
  duration INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  UNIQUE(chapter_id, slug)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TEXT NOT NULL,
  PRIMARY KEY (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON lessons(chapter_id, order_index);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
`;

function databaseFile() {
  const configured = process.env.DATABASE_PATH;
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.join(/* turbopackIgnore: true */ process.cwd(), configured);
  }
  return path.join(process.cwd(), ".data", "tutorly.db");
}

function seed(db: DatabaseSync) {
  const hash = createHash("sha256")
    .update(JSON.stringify(curriculum))
    .digest("hex");

  // Serialize seeding across build workers / server processes. Only one
  // process performs the write; the rest wait and then see the new hash.
  db.exec("BEGIN IMMEDIATE");
  try {
    const previous = db
      .prepare("SELECT value FROM meta WHERE key = 'content_hash'")
      .get() as { value: string } | undefined;

    if (previous?.value === hash) {
      db.exec("COMMIT");
      return;
    }

    const upsertChapter = db.prepare(`
      INSERT INTO chapters (id, slug, title, title_fr, tagline, description, icon, accent, level, order_index, formulas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        slug = excluded.slug,
        title = excluded.title,
        title_fr = excluded.title_fr,
        tagline = excluded.tagline,
        description = excluded.description,
        icon = excluded.icon,
        accent = excluded.accent,
        level = excluded.level,
        order_index = excluded.order_index,
        formulas = excluded.formulas
    `);

    const upsertLesson = db.prepare(`
      INSERT INTO lessons (id, chapter_id, slug, title, title_fr, summary, duration, difficulty, order_index, content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        chapter_id = excluded.chapter_id,
        slug = excluded.slug,
        title = excluded.title,
        title_fr = excluded.title_fr,
        summary = excluded.summary,
        duration = excluded.duration,
        difficulty = excluded.difficulty,
        order_index = excluded.order_index,
        content = excluded.content
    `);

    curriculum.forEach((chapter, chapterIndex) => {
      upsertChapter.run(
        chapter.slug,
        chapter.slug,
        chapter.title,
        chapter.titleFr,
        chapter.tagline,
        chapter.description,
        chapter.icon,
        chapter.accent,
        chapter.level,
        chapterIndex,
        JSON.stringify(chapter.formulas),
      );

      chapter.lessons.forEach((lesson, lessonIndex) => {
        upsertLesson.run(
          `${chapter.slug}--${lesson.slug}`,
          chapter.slug,
          lesson.slug,
          lesson.title,
          lesson.titleFr,
          lesson.summary,
          lesson.duration,
          lesson.difficulty,
          lessonIndex,
          lesson.content,
        );
      });
    });

    const chapterIds = curriculum.map((chapter) => chapter.slug);
    const lessonIds = curriculum.flatMap((chapter) =>
      chapter.lessons.map((lesson) => `${chapter.slug}--${lesson.slug}`),
    );

    const deleteChapters = db.prepare(
      `DELETE FROM chapters WHERE id NOT IN (${chapterIds.map(() => "?").join(",")})`,
    );
    deleteChapters.run(...chapterIds);

    const deleteLessons = db.prepare(
      `DELETE FROM lessons WHERE id NOT IN (${lessonIds.map(() => "?").join(",")})`,
    );
    deleteLessons.run(...lessonIds);

    db.prepare(
      "INSERT INTO meta (key, value) VALUES ('content_hash', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    ).run(hash);

    db.exec("COMMIT");
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      // Transaction may already have been rolled back by SQLite.
    }
    throw error;
  }
}

function createDatabase() {
  const file = databaseFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA busy_timeout = 10000;");
  db.exec(SCHEMA);
  seed(db);
  return db;
}

const globalForDb = globalThis as unknown as {
  __tutorlyDb?: DatabaseSync;
};

export const db = globalForDb.__tutorlyDb ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__tutorlyDb = db;
}
