"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export function AuthForm({
  mode,
  returnTo = "/",
}: {
  mode: "login" | "register";
  returnTo?: string;
}) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const switchHref = isRegister
    ? `/login${returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`
    : `/register${returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isRegister && (name.trim().length < 2 || name.trim().length > 40)) {
      setError("أدخل اسمًا بين حرفين و40 حرفًا.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("أدخل بريدًا إلكترونيًّا صحيحًا.");
      return;
    }
    if (password.length < 8) {
      setError("كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegister
              ? { name: name.trim(), email: email.trim(), password }
              : { email: email.trim(), password },
          ),
        },
      );

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setError(data?.error ?? "تعذر إتمام العملية. حاول مرة أخرى.");
        setLoading(false);
        return;
      }

      const safeTarget =
        returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
      window.location.href = safeTarget;
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مجددًا.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <span className="eyebrow">
          <ShieldCheck className="h-3.5 w-3.5" />
          {isRegister ? "حساب جديد" : "مرحبًا بعودتك"}
        </span>
        <h1 className="mt-4 text-[1.9rem] font-extrabold leading-tight text-ink sm:text-[2.2rem]">
          {isRegister ? "احفظ تقدّمك، وأكمل من حيث توقفت." : "سعيدون برجوعك."}
        </h1>
        <p className="mt-2 text-[0.9rem] leading-7 text-ink-soft">
          {isRegister
            ? "أنشئ حسابًا مجانيًا لمزامنة دروسك المكتملة عبر أجهزتك."
            : "سجّل الدخول لتجد تقدّمك محفوظًا في انتظارك."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {isRegister && (
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-[0.78rem] font-bold text-ink"
            >
              الاسم الكامل
            </label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="مثال: أمين بن علي"
                className="h-12 w-full rounded-xl border border-line bg-white ps-10 pe-4 text-sm font-medium text-ink placeholder:text-ink-soft/40 transition focus:border-brand/45 focus:outline-none focus:ring-4 focus:ring-brand/10"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[0.78rem] font-bold text-ink"
          >
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
            <input
              id="email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-line bg-white ps-10 pe-4 text-start text-sm font-medium text-ink placeholder:text-ink-soft/40 transition focus:border-brand/45 focus:outline-none focus:ring-4 focus:ring-brand/10"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[0.78rem] font-bold text-ink"
          >
            كلمة المرور
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              dir="ltr"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="8 أحرف على الأقل"
              className="h-12 w-full rounded-xl border border-line bg-white ps-10 pe-16 text-start text-sm font-medium text-ink placeholder:text-ink-soft/40 transition focus:border-brand/45 focus:outline-none focus:ring-4 focus:ring-brand/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-soft/50 transition hover:bg-ink/5 hover:text-ink"
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {isRegister && (
            <p className="mt-1.5 text-[0.68rem] text-ink-soft/60">
              استعمل 8 أحرف على الأقل، ويفضل مزيجًا من الحروف والأرقام.
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="animate-pop rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.78rem] font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full !py-3.5"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جارٍ المعالجة…
            </>
          ) : (
            <>
              {isRegister ? "إنشاء حساب مجاني" : "تسجيل الدخول"}
              <ArrowLeft className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-[0.8rem] text-ink-soft">
        {isRegister ? "لديك حساب بالفعل؟" : "ليس لديك حساب؟"}{" "}
        <Link
          href={switchHref}
          className="font-extrabold text-brand transition hover:text-brand-deep"
        >
          {isRegister ? "سجّل الدخول" : "أنشئ حسابًا مجانيًا"}
        </Link>
      </p>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-[0.68rem] text-ink-soft/55">
        <ShieldCheck className="h-3.5 w-3.5" />
        بياناتك محفوظة بأمان، ولا نطلب أي معلومات دفع.
      </div>
    </div>
  );
}
