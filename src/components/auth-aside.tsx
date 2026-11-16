import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Logo } from "./logo";

export function AuthAside() {
  return (
    <div className="hero-panel relative hidden min-h-[36rem] flex-col justify-between p-9 lg:flex">
      <div className="relative z-10">
        <Logo inverted />
      </div>

      <div className="relative z-10 my-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-bold text-[#f5c46b]">
          <Sparkles className="h-3.5 w-3.5" />
          تعلّم أذكى، لا أطول
        </span>
        <h2 className="mt-4 text-[2.1rem] font-extrabold leading-[1.35] text-white">
          مراجعتك،
          <br />
          <span className="text-[#a5b4fc]">منظمة أخيرًا.</span>
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
          كل الدروس في مكان واحد، وتقدّمك محفوظ. ركّز على الفهم، ونحن نهتم
          بالتنظيم.
        </p>

        <div className="mt-7 rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur">
          <div className="flex items-center justify-between text-[0.68rem] font-semibold text-white/50">
            <span>تقدّمك الأسبوعي</span>
            <span className="text-[#a5b4fc]">+3 دروس</span>
          </div>
          <div className="mt-3 flex items-end gap-1.5">
            {[30, 45, 38, 60, 52, 75, 90].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-md bg-gradient-to-t from-brand/40 to-[#818cf8]"
                style={{ height: `${height * 0.55}px` }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint/15 text-mint">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className="text-[0.7rem] text-white/65">
              استمر على وتيرتك — 15 دقيقة يوميًا تكفي.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-[0.68rem] text-white/40">
        <span className="h-1.5 w-1.5 rounded-full bg-mint" />
        مجاني بالكامل لطلبة البكالوريا
        <Link href="/" className="ms-auto font-bold text-white/60 hover:text-white">
          العودة للرئيسية ←
        </Link>
      </div>
    </div>
  );
}
