import { NextResponse } from "next/server";
import {
  createSessionToken,
  hashPassword,
  isValidEmail,
  normalizeEmail,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth";
import { createUser, findUserByEmail, publicUser } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";

  if (name.length < 2 || name.length > 40) {
    return NextResponse.json(
      { error: "الاسم يجب أن يكون بين حرفين و40 حرفًا." },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "أدخل بريدًا إلكترونيًّا صحيحًا." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل." },
      { status: 400 },
    );
  }
  if (findUserByEmail(email)) {
    return NextResponse.json(
      { error: "يوجد حساب مسجل بهذا البريد الإلكتروني." },
      { status: 409 },
    );
  }

  const user = createUser({
    name,
    email,
    passwordHash: await hashPassword(password),
  });
  const token = await createSessionToken(user);

  const response = NextResponse.json({ user: publicUser(user) }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
