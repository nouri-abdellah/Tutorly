import Link from "next/link";
import { ArrowLeft, BookOpen, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-xl shadow-brand/20">
        <Compass className="h-9 w-9" />
      </span>
      <p
        className="mt-6 text-[4rem] font-extrabold leading-none text-ink/10"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        404
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink">
        هذه الصفحة ليست في المنهاج.
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-7 text-ink-soft">
        ربما الرابط قديم أو الدرس غير موجود. عُد إلى قائمة الدروس واختر محورك.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/lessons" className="btn-primary">
          <BookOpen className="h-4 w-4" />
          تصفح الدروس
        </Link>
        <Link href="/" className="btn-secondary">
          الرئيسية
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
