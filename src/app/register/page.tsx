import type { Metadata } from "next";
import { AuthAside } from "@/components/auth-aside";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description:
    "أنشئ حسابًا مجانيًا على Tutorly لحفظ تقدمك في دروس رياضيات البكالوريا ومزامنته عبر أجهزتك.",
};

type PageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requested =
    typeof params.returnTo === "string" ? params.returnTo : "/";
  const returnTo =
    requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-line bg-white/75 shadow-[0_30px_80px_-50px_rgba(16,24,40,0.4)] lg:grid-cols-2">
        <div className="flex items-center justify-center p-6 sm:p-10">
          <AuthForm mode="register" returnTo={returnTo} />
        </div>
        <AuthAside />
      </div>
    </div>
  );
}
