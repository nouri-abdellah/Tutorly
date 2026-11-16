import { NextResponse } from "next/server";
import {
  createSessionToken,
  normalizeEmail,
  sessionCookieOptions,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";
import { findUserByEmail, publicUser } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";

  const user = findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." },
      { status: 401 },
    );
  }

  const token = await createSessionToken(user);
  const response = NextResponse.json({ user: publicUser(user) });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
