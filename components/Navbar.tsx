"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Teacher Dashboard", href: "/teacher" },
  { label: "Create Lesson", href: "/create-lesson" },
  { label: "Lesson Library", href: "/lessons" },
  { label: "Student Mode", href: "/student/catalog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOnline = useNetworkStatus();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-hidden"
              aria-label="VaaniShiksha Home"
            >
              <Image
                src="/vaanishiksha-logo-cropped.jpeg"
                alt="VaaniShiksha Logo"
                width={180}
                height={72}
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-102"
                priority
              />
              <span className="hidden sm:inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70">
                SIH26042
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-amber-100 text-amber-950 font-semibold shadow-2xs"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Header Access Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/teacher"
              className="px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-colors"
            >
              Teacher Access
            </Link>
            <Link
              href="/student/catalog"
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors"
            >
              Student Portal
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-amber-100 bg-white" id="mobile-menu">
          <div className="px-4 pt-2 pb-4 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-amber-100 text-amber-950 font-semibold"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <Link
                href="/teacher"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold text-amber-900 bg-amber-50 rounded-lg border border-amber-200"
              >
                Teacher Dashboard
              </Link>
              <Link
                href="/student/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                Student Mode
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-100 border-b border-amber-200 py-1.5 px-4 text-center shadow-xs">
          <p className="text-xs font-semibold text-amber-900">
            You are offline. Saved lessons in the Library and Student Mode are fully accessible.
          </p>
        </div>
      )}
    </header>
  );
}
