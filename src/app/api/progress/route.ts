import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getCompletedLessonIds,
  mergeCompletedLessons,
  setLessonCompleted,
} from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول." }, { status: 401 });
  }
  return NextResponse.json({ completed: getCompletedLessonIds(user.id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول." }, { status: 401 });
  }

  let body: {
    lessonId?: unknown;
    completed?: unknown;
    lessonIds?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  if (Array.isArray(body.lessonIds)) {
    const lessonIds = body.lessonIds
      .filter((id): id is string => typeof id === "string")
      .slice(0, 200);
    const completed = mergeCompletedLessons(user.id, lessonIds);
    return NextResponse.json({ completed });
  }

  if (typeof body.lessonId !== "string") {
    return NextResponse.json({ error: "معرّف الدرس مطلوب." }, { status: 400 });
  }

  const updated = setLessonCompleted(
    user.id,
    body.lessonId,
    body.completed === true,
  );
  if (!updated) {
    return NextResponse.json({ error: "الدرس غير موجود." }, { status: 404 });
  }

  return NextResponse.json({ completed: getCompletedLessonIds(user.id) });
}
