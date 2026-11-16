"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { Logo } from "./logo";
import { useProgress } from "./providers";

const links = [
  { href: "/", label: "الرئيسية", icon: Sparkles },
  { href: "/lessons", label: "الدروس", icon: BookOpen },
  { href: "/formulas", label: "القوانين", icon: Target },
  { href: "/chat", label: "المساعد الذكي", icon: BrainCircuit },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, ready, logout } = useProgress();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState(pathname);

  if (pathname !== activePath) {
    setActivePath(pathname);
    setMobileOpen(false);
    setMenuOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = user?.name?.trim().charAt(0).toUpperCase() ?? "T";

  return (
    <header className="site-header no-print">
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                data-active={isActive(link.href)}
              >
                {link.label}
                {link.href === "/chat" && (
                  <span className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-mint" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {!ready ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-ink/5" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-line bg-white/80 py-1.5 pe-3 ps-1.5 text-sm font-bold text-ink transition hover:border-brand/30 hover:bg-white"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-extrabold text-white">
                  {initials}
                </span>
                <span className="max-w-[9rem] truncate">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-ink-soft" />
              </button>
              {menuOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    aria-label="إغلاق القائمة"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    className="animate-pop absolute end-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-[0_24px_60px_-24px_rgba(16,24,40,0.35)]"
                    role="menu"
                  >
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-extrabold text-ink">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-ink-soft">{user.email}</p>
                    </div>
                    <Link
                      href="/progress"
                      role="menuitem"
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-brand-soft hover:text-brand-deep"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      تقدّمي الدراسي
                    </Link>
                    <Link
                      href="/chat"
                      role="menuitem"
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-brand-soft hover:text-brand-deep"
                    >
                      <BrainCircuit className="h-4 w-4" />
                      المساعد الذكي
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => void logout()}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">
                دخول
              </Link>
              <Link href="/register" className="btn-primary btn-sm">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white/70 text-ink lg:hidden"
          aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-[#fbf9f4] lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-ink-soft transition hover:bg-white hover:text-ink"
                  data-active={isActive(link.href)}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-line pt-3">
              {user ? (
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href="/progress"
                    className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-ink"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs text-white">
                      {initials}
                    </span>
                    {user.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="btn-ghost btn-sm text-red-600"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="btn-secondary btn-sm flex-1">
                    دخول
                  </Link>
                  <Link href="/register" className="btn-primary btn-sm flex-1">
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
