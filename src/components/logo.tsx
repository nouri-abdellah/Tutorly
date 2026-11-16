import Link from "next/link";
import { Sigma } from "lucide-react";

export function Logo({
  compact = false,
  inverted = false,
}: {
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 no-underline"
      aria-label="Tutorly — الصفحة الرئيسية"
    >
      <span
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_10px_20px_-10px_rgba(79,70,229,0.8)] transition-transform duration-300 group-hover:-rotate-6"
        style={{
          background:
            "linear-gradient(140deg, #6366f1 0%, #4338ca 55%, #312e81 100%)",
        }}
      >
        <Sigma className="h-5 w-5" strokeWidth={2.4} />
        <span className="absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-[#f5a623] ring-2 ring-[#f7f5ef]" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-[1.12rem] font-extrabold tracking-tight ${
              inverted ? "text-white" : "text-ink"
            }`}
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Tutorly
          </span>
          <span
            className={`mt-1 text-[0.66rem] font-medium ${
              inverted ? "text-white/60" : "text-ink-soft"
            }`}
          >
            رياضيات البكالوريا
          </span>
        </span>
      )}
    </Link>
  );
}
