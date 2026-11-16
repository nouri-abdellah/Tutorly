import type { ChapterSeed } from "./types";
import { sequencesChapter } from "./chapters/01-sequences";
import { limitsChapter } from "./chapters/02-limits-continuity";
import { derivativesChapter } from "./chapters/03-derivatives";
import { expLogChapter } from "./chapters/04-exp-log";
import { integralsChapter } from "./chapters/05-integrals";
import { complexChapter } from "./chapters/06-complex-numbers";
import { geometryChapter } from "./chapters/07-space-geometry";
import { probabilityChapter } from "./chapters/08-probability";
import { similarityChapter } from "./chapters/09-similarity";
import { differentialChapter } from "./chapters/10-differential-equations";

export const curriculum: ChapterSeed[] = [
  sequencesChapter,
  limitsChapter,
  derivativesChapter,
  expLogChapter,
  integralsChapter,
  complexChapter,
  geometryChapter,
  probabilityChapter,
  similarityChapter,
  differentialChapter,
];

export const curriculumStats = {
  chapters: curriculum.length,
  lessons: curriculum.reduce((total, chapter) => total + chapter.lessons.length, 0),
  formulas: curriculum.reduce((total, chapter) => total + chapter.formulas.length, 0),
  minutes: curriculum.reduce(
    (total, chapter) =>
      total + chapter.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
    0,
  ),
};

export function chapterCountLabel(count: number) {
  if (count === 1) return "محور واحد";
  if (count === 2) return "محوران";
  return `${count} محاور`;
}

export function lessonCountLabel(count: number) {
  if (count === 1) return "درس واحد";
  if (count === 2) return "درسان";
  return `${count} دروس`;
}
