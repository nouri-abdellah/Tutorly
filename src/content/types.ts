export type Formula = {
  label: string;
  latex: string;
};

export type LessonSeed = {
  slug: string;
  title: string;
  titleFr: string;
  summary: string;
  /** Estimated study time in minutes. */
  duration: number;
  difficulty: "أساسي" | "متوسط" | "متقدم";
  content: string;
};

export type ChapterSeed = {
  slug: string;
  title: string;
  titleFr: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  level: string;
  formulas: Formula[];
  lessons: LessonSeed[];
};
