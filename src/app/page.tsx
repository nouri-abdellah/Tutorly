import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Check,
  Clock3,
  GraduationCap,
  Layers,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { getCurriculumOverview } from "@/lib/curriculum";
import { ChapterCard } from "@/components/chapter-card";
import { HeroDashboard } from "@/components/hero-dashboard";
import { Formula } from "@/components/math";

export const dynamic = "force-dynamic";

const guarantees = [
  "بدون تسجيل إلزامي",
  "كل الدروس مجانية",
  "مصمّم للهاتف",
];

const steps = [
  {
    icon: BookOpen,
    number: "01",
    title: "اختر محورك",
    description:
      "افتح الدرس الذي تدرسه في القسم، أو ابدأ من أول محور. كل شيء مرتب حسب المنهاج الرسمي.",
  },
  {
    icon: Target,
    number: "02",
    title: "افهم بالأمثلة",
    description:
      "تعريفات واضحة، مبرهنات، قوانين ملخصة، وتمارين محلولة خطوة بخطوة — دون حشو.",
  },
  {
    icon: BrainCircuit,
    number: "03",
    title: "اسأل عند الحاجة",
    description:
      "علق في فكرة؟ اسأل المساعد الذكي، وستحصل على شرح مخصص لدرسك الحالي في ثوانٍ.",
  },
];

export default function HomePage() {
  const { chapters, totalLessons, totalMinutes, totalFormulas } =
    getCurriculumOverview();

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div
          className="hero-glow -start-24 top-10 h-72 w-72 bg-brand/15"
          aria-hidden="true"
        />
        <div
          className="hero-glow start-1/2 top-40 h-60 w-60 bg-[#f5a623]/10"
          aria-hidden="true"
        />
        <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-[1.03fr_0.97fr] lg:gap-10 lg:py-20 xl:py-24">
          <div className="relative z-10">
            <span className="eyebrow animate-fade-up">
              <GraduationCap className="h-3.5 w-3.5" />
              منهاج البكالوريا الجزائرية · 2026
            </span>

            <h1
              className="animate-fade-up mt-5 text-[2.4rem] font-extrabold leading-[1.2] text-ink sm:text-[3.2rem] lg:text-[3.5rem] xl:text-[3.9rem]"
              style={{ animationDelay: "60ms" }}
            >
              الرياضيات صارت{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-l from-[#4338ca] via-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
                  أوضح
                </span>
                <svg
                  className="absolute -bottom-1 left-0 right-0 z-0 h-3 w-full text-[#f5c46b]"
                  viewBox="0 0 200 14"
                  fill="none"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 10C50 3 150 3 197 8"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </span>{" "}
              مما تظن.
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-xl text-[1.05rem] leading-8 text-ink-soft sm:text-lg sm:leading-9"
              style={{ animationDelay: "120ms" }}
            >
              كل دروس الرياضيات للبكالوريا في مكان واحد: شرح مبسّط، قوانين
              ملخصة، ومساعد ذكاء اصطناعي يشرح لك أي فكرة —{" "}
              <span className="font-bold text-ink">خطوة بخطوة، بالعربية.</span>
            </p>

            <div
              className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "180ms" }}
            >
              <Link href="/lessons" className="btn-primary">
                ابدأ التعلّم مجانًا
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link href="/chat" className="btn-secondary">
                <Sparkles className="h-4 w-4 text-brand" />
                جرّب المساعد الذكي
              </Link>
            </div>

            <div
              className="animate-fade-up mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5"
              style={{ animationDelay: "240ms" }}
            >
              {guarantees.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-ink-soft"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint/10 text-mint">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </span>
              ))}
            </div>

            <div
              className="animate-fade-up mt-6 flex items-center gap-2.5 border-t border-line/80 pt-5 text-[0.75rem] text-ink-soft/80"
              style={{ animationDelay: "300ms" }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[0.62rem] font-bold text-white">
                <GraduationCap className="h-3.5 w-3.5" />
              </span>
              مناسب لشعب: علوم تجريبية · رياضيات · تقني رياضي
            </div>
          </div>

          <div className="relative z-10 lg:pe-2">
            <HeroDashboard chapters={chapters} totalLessons={totalLessons} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page relative z-10 -mt-2 pb-4">
        <div className="surface grid grid-cols-2 divide-x divide-line/70 overflow-hidden rounded-3xl p-0 sm:grid-cols-4">
          {[
            { value: chapters.length, label: "محاور كاملة", icon: Layers },
            { value: totalLessons, label: "درسًا مشروحًا", icon: BookOpen },
            { value: totalFormulas, label: "قانونًا ملخصًا", icon: Target },
            {
              value: "24/7",
              label: "مساعد ذكي متاح",
              icon: Sparkles,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 px-4 py-6 text-center sm:py-7"
              >
                <Icon className="mb-1 h-5 w-5 text-brand" />
                <span className="text-[1.6rem] font-extrabold leading-none text-ink">
                  {stat.value}
                </span>
                <span className="text-[0.72rem] font-semibold text-ink-soft">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chapters */}
      <section className="container-page py-16 lg:py-20" id="chapters">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">
              <Layers className="h-3.5 w-3.5" />
              المنهاج كاملًا
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-[2.25rem]">
              كل محاور البكالوريا، في مكان واحد.
            </h2>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-ink-soft">
              من المتتاليات إلى المعادلات التفاضلية — دروس مرتبة، بأسلوب يفهمه
              الطالب دون وسيط.
            </p>
          </div>
          <Link
            href="/lessons"
            className="group flex shrink-0 items-center gap-2 text-sm font-extrabold text-brand transition hover:text-brand-deep"
          >
            استكشف كل الدروس
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft transition group-hover:bg-brand group-hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {chapters.map((chapter, index) => (
            <ChapterCard key={chapter.id} chapter={chapter} index={index} />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-white/60 px-5 py-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5a623]/12 text-[#b7791f]">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-ink">
                ليلة الامتحان؟ ابدأ بملخص القوانين.
              </p>
              <p className="text-xs text-ink-soft">
                {totalFormulas} قانونًا أساسيًا، منظمًا حسب المحاور.
              </p>
            </div>
          </div>
          <Link href="/formulas" className="btn-secondary btn-sm">
            افتح ملخص القوانين
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* AI section */}
      <section className="container-page pb-16 lg:pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0d1224] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
          <div
            className="hero-glow -end-20 -top-24 h-80 w-80 bg-brand/40"
            aria-hidden="true"
          />
          <div
            className="hero-glow -bottom-28 start-1/3 h-72 w-72 bg-[#f5a623]/20"
            aria-hidden="true"
          />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-bold text-[#f5c46b]">
                <Sparkles className="h-3.5 w-3.5" />
                مساعد Tutorly الذكي
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-[2.15rem]">
                مساعد يعرف المنهاج…
                <br />
                <span className="text-[#a5b4fc]">لا يجيب من فراغ.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
                مدعوم بـ DeepSeek ومُهيّأ خصيصًا لمحتوى البكالوريا الجزائرية.
                يشرح، يبسّط، ويصحح مفاهيمك — في محادثة طبيعية.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "يفهم سياق الدرس الذي تقرأه",
                  "يشرح خطوة بخطوة مع المعادلات",
                  "متاح في أي وقت، بالعربية",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-medium text-white/80"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/chat"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-ink transition hover:bg-[#f5c46b]"
              >
                اسأل Tutorly الآن
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/15 bg-white [box-shadow:0_30px_80px_-30px_rgba(0,0,0,0.7)]">
                <div className="flex items-center justify-between border-b border-line/70 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-white">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[0.78rem] font-extrabold text-ink">
                        Tutorly
                      </p>
                      <p className="flex items-center gap-1 text-[0.62rem] text-mint">
                        <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                        متصل الآن
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[0.6rem] font-bold text-brand-deep">
                    DeepSeek
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  <div className="ms-auto max-w-[85%] rounded-2xl rounded-se-sm bg-ink px-3.5 py-2.5 text-[0.8rem] font-medium leading-6 text-white">
                    ما الفرق بين المتتالية الحسابية والهندسية؟
                  </div>
                  <div className="max-w-[92%] rounded-2xl rounded-ss-sm bg-[#f7f6f1] px-3.5 py-3 text-[0.8rem] leading-6 text-ink-soft">
                    <p className="font-bold text-ink">
                      الفرق الجوهري في «طريقة الانتقال» بين الحدود:
                    </p>
                    <p className="mt-1.5">
                      <span className="font-bold text-brand-deep">الحسابية:</span>{" "}
                      نضيف نفس العدد $r$ في كل مرة.
                    </p>
                    <div className="my-1 rounded-lg bg-white px-3 py-2 text-center" dir="ltr">
                      <Formula latex="u_{n+1}=u_n+r" />
                    </div>
                    <p>
                      <span className="font-bold text-brand-deep">الهندسية:</span>{" "}
                      نضرب في نفس العدد $q$ في كل مرة.
                    </p>
                    <div className="mt-1 rounded-lg bg-white px-3 py-2 text-center" dir="ltr">
                      <Formula latex="u_{n+1}=q\times u_n" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[0.65rem] text-ink-soft/60">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
                      <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
                      <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
                    </span>
                    اكتب سؤالك هنا…
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -start-4 hidden items-center gap-2 rounded-2xl border border-white/15 bg-[#151b33] px-3.5 py-2.5 text-white shadow-xl sm:flex">
                <Zap className="h-4 w-4 text-[#f5c46b]" />
                <span className="text-[0.7rem] font-bold">إجابة في ثوانٍ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page pb-16 lg:pb-20">
        <div className="text-center">
          <span className="eyebrow">
            <Zap className="h-3.5 w-3.5" />
            بسيطة كما يجب أن تكون
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-[2.25rem]">
            ثلاث خطوات، وتبدأ الفهم.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.95rem] leading-7 text-ink-soft">
            لا تعقيد، لا اشتراكات، لا تشتت. أنت والرياضيات فقط.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="surface relative overflow-hidden p-6 pt-7"
              >
                <span
                  className="absolute -left-2 -top-5 text-[5rem] font-extrabold leading-none text-ink/[0.04]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {step.number}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-ink-soft">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <span className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-line md:block">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand/10 bg-gradient-to-l from-[#eef2ff] via-[#f7f5ef] to-[#fff8e8] px-6 py-12 text-center sm:px-12">
          <div
            className="hero-glow -start-16 -top-20 h-60 w-60 bg-brand/20"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-[2.3rem]">
              جاهز تبدأ أذكى مراجعة؟
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink-soft sm:text-base">
              كل ما تحتاجه لمادة الرياضيات، في متناول يدك. ابدأ الآن، وتقدّم
              بخطوة واضحة كل يوم.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/lessons" className="btn-primary">
                ابدأ من أول درس
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link href="/register" className="btn-secondary">
                أنشئ حسابًا لحفظ تقدّمك
              </Link>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.7rem] text-ink-soft/70">
              <Clock3 className="h-3 w-3" />
              حوالي {Math.round(totalMinutes / 60)} ساعة من المحتوى المنظم — بوتيرتك
              الخاصة
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
