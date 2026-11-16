import type { Metadata } from "next";
import { getCurriculumOverview } from "@/lib/curriculum";
import { ProgressView } from "@/components/progress-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تقدّمي",
  description: "تابع تقدّمك في دروس رياضيات البكالوريا محورًا بمحور.",
};

export default function ProgressPage() {
  const { chapters, totalLessons, totalMinutes } = getCurriculumOverview();

  return (
    <ProgressView
      chapters={chapters}
      totalLessons={totalLessons}
      totalMinutes={totalMinutes}
    />
  );
}
