import type { Metadata } from "next";
import { getCurriculumOverview } from "@/lib/curriculum";
import { LessonsExplorer } from "@/components/lessons-explorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "كل الدروس",
  description:
    "كل محاور ودروس الرياضيات للبكالوريا الجزائرية: المتتاليات، النهايات، الاشتقاق، الأسية واللوغاريتمية، التكامل، الأعداد المركبة، الهندسة، الاحتمالات وغيرها.",
};

export default function LessonsPage() {
  const { chapters, totalLessons, totalMinutes } = getCurriculumOverview();

  return (
    <LessonsExplorer
      chapters={chapters}
      totalLessons={totalLessons}
      totalMinutes={totalMinutes}
    />
  );
}
