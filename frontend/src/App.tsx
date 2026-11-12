import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";

import { fetchProfile, ProfileApiError } from "./lib/api";
import { supabase, supabaseConfigError } from "./lib/supabase";
import type { Profile } from "./types";

type AuthMode = "sign-in" | "sign-up";

const dateFormatter = new Intl.DateTimeFormat("ar-DZ-u-nu-latn", {
  dateStyle: "medium",
  timeStyle: "short",
});

function profileErrorMessage(error: unknown): string {
  if (error instanceof ProfileApiError) {
    if (error.code === "UNAUTHENTICATED") {
      return "انتهت الجلسة. سجّل الدخول من جديد.";
    }
    if (error.code === "PROFILE_NOT_FOUND") {
      return "لم يتم العثور على ملف الطالب الخاص بك.";
    }
    if (error.code === "DATABASE_UNAVAILABLE") {
      return "خدمة البيانات غير متاحة مؤقتًا. أعد المحاولة بعد قليل.";
    }
  }
  return "تعذّر تحميل الملف الشخصي. أعد المحاولة.";
}

function App() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    let active = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) {
        return;
      }
      if (error) {
        setFormError("تعذّر قراءة جلسة الدخول الحالية.");
      }
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) {
        return;
      }
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setProfileLoading(false);
      setProfileError(null);
      return;
    }

    let active = true;
    setProfileLoading(true);
    setProfileError(null);

    void fetchProfile()
      .then((nextProfile) => {
        if (active) {
          setProfile(nextProfile);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setProfileError(profileErrorMessage(error));
        }
      })
      .finally(() => {
        if (active) {
          setProfileLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormMessage(null);

    if (!supabase) {
      setFormError("إعدادات الاتصال غير مكتملة.");
      return;
    }

    setSubmitting(true);
    try {
      const credentials = {
        email: email.trim(),
        password,
      };

      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) {
          setFormError("تعذّر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.");
          return;
        }
        setPassword("");
      } else {
        const { data, error } = await supabase.auth.signUp(credentials);
        if (error) {
          setFormError("تعذّر إنشاء الحساب. تحقق من البيانات أو جرّب بريدًا آخر.");
          return;
        }
        setPassword("");
        if (!data.session) {
          setFormMessage(
            "تم إنشاء الحساب. تحقّق من بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول.",
          );
        }
      }
    } catch {
      setFormError("تعذّر إتمام العملية بسبب خطأ في الاتصال.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }
    setFormError(null);
    setFormMessage(null);
    await supabase.auth.signOut();
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setFormError(null);
    setFormMessage(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <section className="mx-auto w-full max-w-xl">
        <header className="mb-8 text-center">
          <p className="mb-3 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800">
            النسخة الأولى — الحساب والملف الشخصي
          </p>
          <h1 className="text-4xl font-bold tracking-tight" dir="ltr">
            Tutorly
          </h1>
          <p className="mt-3 text-slate-600">
            مساحة حسابك في Tutorly لشهادة البكالوريا، شعبة العلوم التجريبية.
          </p>
        </header>

        {supabaseConfigError ? (
          <div
            className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900"
            role="alert"
          >
            <p className="font-semibold">تعذّر تشغيل المصادقة</p>
            <p className="mt-2 leading-7">{supabaseConfigError}</p>
          </div>
        ) : authLoading ? (
          <p className="text-center text-slate-600" aria-live="polite">
            جارٍ تحميل الجلسة…
          </p>
        ) : session ? (
          <section
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            aria-labelledby="profile-heading"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 id="profile-heading" className="text-2xl font-semibold">
                  ملفك الشخصي
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  أنت مسجّل الدخول بهذا الحساب.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              >
                تسجيل الخروج
              </button>
            </div>

            {session.user.email ? (
              <p className="mt-4 text-sm text-slate-600">
                البريد الإلكتروني:{" "}
                <span dir="ltr" className="font-medium text-slate-800">
                  {session.user.email}
                </span>
              </p>
            ) : null}

            <div className="mt-6" aria-live="polite">
              {profileLoading ? (
                <p className="text-slate-600">جارٍ تحميل الملف الشخصي…</p>
              ) : profileError ? (
                <p className="rounded-lg bg-rose-50 p-4 text-rose-800" role="alert">
                  {profileError}
                </p>
              ) : profile ? (
                <dl className="space-y-4 rounded-xl bg-slate-50 p-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-500">معرّف الحساب</dt>
                    <dd
                      className="mt-1 break-all font-mono text-sm text-slate-800"
                      dir="ltr"
                    >
                      {profile.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">تاريخ الإنشاء</dt>
                    <dd className="mt-1 text-slate-800">
                      {dateFormatter.format(new Date(profile.created_at))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">
                      آخر تحديث للملف
                    </dt>
                    <dd className="mt-1 text-slate-800">
                      {dateFormatter.format(new Date(profile.updated_at))}
                    </dd>
                  </div>
                </dl>
              ) : null}
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-500">
              لا توجد حقول شخصية قابلة للتعديل في هذه المرحلة. يتم حفظ الملف الأساسي
              تلقائيًا عند إنشاء الحساب.
            </p>
          </section>
        ) : (
          <section
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            aria-labelledby="auth-heading"
          >
            <h2 id="auth-heading" className="text-2xl font-semibold">
              {mode === "sign-in" ? "تسجيل الدخول" : "إنشاء حساب"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              استخدم بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك.
            </p>

            <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  dir="ltr"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-left outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  كلمة المرور
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={
                    mode === "sign-in" ? "current-password" : "new-password"
                  }
                  dir="ltr"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-left outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              {formError ? (
                <p
                  className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800"
                  role="alert"
                >
                  {formError}
                </p>
              ) : null}

              {formMessage ? (
                <p
                  className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
                  role="status"
                >
                  {formMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "جارٍ التنفيذ…"
                  : mode === "sign-in"
                    ? "دخول"
                    : "إنشاء الحساب"}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-4 text-center text-sm">
              {mode === "sign-in" ? (
                <>
                  <span className="text-slate-600">ليس لديك حساب؟ </span>
                  <button
                    type="button"
                    onClick={() => switchMode("sign-up")}
                    className="font-semibold text-emerald-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                  >
                    أنشئ حسابًا
                  </button>
                </>
              ) : (
                <>
                  <span className="text-slate-600">لديك حساب بالفعل؟ </span>
                  <button
                    type="button"
                    onClick={() => switchMode("sign-in")}
                    className="font-semibold text-emerald-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                  >
                    سجّل الدخول
                  </button>
                </>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
