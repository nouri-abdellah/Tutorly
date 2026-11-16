import Link from "next/link";
import { ArrowLeft, BrainCircuit, Heart, Sparkles } from "lucide-react";
import { Logo } from "./logo";

const columns = [
  {
    title: "التعلّم",
    links: [
      { href: "/lessons", label: "كل الدروس" },
      { href: "/formulas", label: "ملخص القوانين" },
      { href: "/progress", label: "تقدّمي" },
    ],
  },
  {
    title: "المساعدة",
    links: [
      { href: "/chat", label: "المساعد الذكي" },
      { href: "/register", label: "إنشاء حساب" },
      { href: "/login", label: "تسجيل الدخول" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="no-print mt-20 border-t border-line bg-[#f3f0e7]/70">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-7 text-ink-soft">
              منصة جزائرية تساعد طلبة البكالوريا على فهم الرياضيات بعمق: دروس
              كاملة، قوانين ملخصة، ومساعد ذكاء اصطناعي يشرح خطوة بخطوة.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                منهاج 2026
              </span>
              <span className="chip">
                <BrainCircuit className="h-3.5 w-3.5 text-mint" />
                مدعوم بـ DeepSeek
              </span>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-extrabold text-ink">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-brand"
                    >
                      <ArrowLeft className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Tutorly. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1.5">
            صُنع بشغف لطلبة الجزائر
            <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" />
            <span className="mx-1 text-line">|</span>
            إجابات المساعد قد تحتوي أخطاء، تحقق دائمًا من دروسك.
          </p>
        </div>
      </div>
    </footer>
  );
}
