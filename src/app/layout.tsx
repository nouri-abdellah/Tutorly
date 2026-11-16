import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const tajawal = localFont({
  src: [
    {
      path: "./fonts/tajawal-arabic-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/tajawal-arabic-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/tajawal-arabic-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/tajawal-arabic-800.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-tajawal",
  display: "swap",
});

const manrope = localFont({
  src: [
    {
      path: "./fonts/manrope-latin.woff2",
      weight: "400 800",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tutorly — رياضيات البكالوريا، أوضح مما تظن",
    template: "%s | Tutorly",
  },
  description:
    "منصة جزائرية لدراسة رياضيات البكالوريا: كل الدروس، ملخصات القوانين، ومساعد ذكاء اصطناعي يشرح لك خطوة بخطوة بالعربية.",
  keywords: [
    "بكالوريا",
    "رياضيات",
    "الجزائر",
    "دروس الرياضيات",
    "Tutorly",
    "bac math",
    "analyses",
  ],
  authors: [{ name: "Tutorly" }],
  openGraph: {
    title: "Tutorly — رياضيات البكالوريا",
    description:
      "كل دروس الرياضيات للبكالوريا، مع مساعد ذكاء اصطناعي يفهم المنهاج ويشرح لك خطوة بخطوة.",
    locale: "ar_DZ",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
