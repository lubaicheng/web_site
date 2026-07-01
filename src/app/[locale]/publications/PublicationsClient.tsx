"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Publication = {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  link: string;
};

export default function PublicationsClient({
  publications,
}: {
  publications: Publication[];
}) {
  const t = useTranslations("publications");

  // Group by year, sorted descending
  const groups: { year: number; items: Publication[] }[] = [];
  const yearMap = new Map<number, Publication[]>();
  for (const pub of publications) {
    if (!yearMap.has(pub.year)) yearMap.set(pub.year, []);
    yearMap.get(pub.year)!.push(pub);
  }
  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a);
  for (const year of sortedYears) {
    groups.push({ year, items: yearMap.get(year)! });
  }

  const [activeYear, setActiveYear] = useState<number | null>(
    groups.length > 0 ? groups[0].year : null
  );
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    groups.forEach(({ year }) => {
      const el = sectionRefs.current.get(year);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveYear(year);
            }
          });
        },
        { rootMargin: "-40% 0px -40% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [groups]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>

      {groups.length === 0 ? (
        <p className="text-gray-400">No publications yet.</p>
      ) : (
        <div className="flex gap-8">
          {/* Left: Year Navigation (sticky) */}
          <div className="hidden lg:block w-24 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              {groups.map(({ year }) => (
                <button
                  key={year}
                  onClick={() => {
                    const el = sectionRefs.current.get(year);
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block w-full text-left px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    activeYear === year
                      ? "text-purple-600 bg-purple-50 border-l-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700 border-l-2 border-transparent"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Publication List */}
          <div className="flex-1 min-w-0">
            {groups.map(({ year, items }) => (
              <div
                key={year}
                ref={(el) => {
                  if (el) sectionRefs.current.set(year, el);
                }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {year}
                </h2>
                <div className="space-y-4">
                  {items.map((pub, i) => (
                    <div
                      key={i}
                      className="border-l-2 border-gray-200 pl-4 py-2"
                    >
                      <h3 className="text-base font-semibold text-gray-900">
                        {pub.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {pub.authors}
                      </p>
                      <p className="text-sm text-gray-500 italic">
                        {pub.journal}
                      </p>
                      <div className="mt-2">
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            DOI: {pub.doi}
                          </a>
                        )}
                        {pub.link && (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline ml-4"
                          >
                            Link ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Year Selector */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <select
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-md"
          value={activeYear ?? ""}
          onChange={(e) => {
            const year = Number(e.target.value);
            const el = sectionRefs.current.get(year);
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {groups.map(({ year }) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
