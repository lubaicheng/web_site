"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useState } from "react";

const navItems = ["home", "news", "teams", "research", "publications", "contact"] as const;

type Props = {
  siteName: string;
  siteLogo: string;
};

export default function HeaderClient({ siteName, siteLogo }: Props) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const otherLocale = locale === "en" ? "zh" : "en";
  const switchLabel = locale === "en" ? "中" : "EN";
  const switchHref = pathname || "/";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Site Name */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-900 whitespace-nowrap">
            {siteLogo ? (
              <img src={siteLogo} alt={siteName} className="h-10 w-auto" />
            ) : (
              siteName
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const href = item === "home" ? "/" : `/${item}`;
              const isActive =
                item === "home"
                  ? pathname === "/" || pathname === ""
                  : pathname.startsWith(`/${item}`);
              return (
                <Link
                  key={item}
                  href={href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {t(item)}
                </Link>
              );
            })}
            <Link
              href={switchHref}
              locale={otherLocale}
              className="ml-2 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {switchLabel}
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            {navItems.map((item) => {
              const href = item === "home" ? "/" : `/${item}`;
              return (
                <Link
                  key={item}
                  href={href}
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item)}
                </Link>
              );
            })}
            <Link
              href={switchHref}
              locale={otherLocale}
              className="block px-3 py-2 text-sm text-blue-600 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {switchLabel === "中" ? "中文" : "English"}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
