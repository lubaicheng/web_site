"use client";

import { useState } from "react";

type ResearchArea = {
  slug: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  coverImage: string;
};

export default function ResearchClient({
  areas,
  locale,
}: {
  areas: ResearchArea[];
  locale: string;
}) {
  const [activeSlug, setActiveSlug] = useState<string>(
    areas.length > 0 ? areas[0].slug : ""
  );

  if (areas.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {locale === "zh" ? "研究方向" : "Research"}
        </h1>
        <p className="text-gray-400">No research areas defined yet.</p>
      </div>
    );
  }

  const activeArea = areas.find((a) => a.slug === activeSlug) || areas[0];
  const activeIdx = areas.findIndex((a) => a.slug === activeSlug);

  const title =
    locale === "zh" && activeArea.titleZh
      ? activeArea.titleZh
      : activeArea.titleEn || activeArea.titleZh;
  const description =
    locale === "zh" && activeArea.descriptionZh
      ? activeArea.descriptionZh
      : activeArea.descriptionEn || activeArea.descriptionZh;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {locale === "zh" ? "研究方向" : "Research"}
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: 编号列表导航 */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-0.5 border-l-2 border-gray-200 pl-4">
            {areas.map((area, idx) => {
              const title =
                locale === "zh" && area.titleZh
                  ? area.titleZh
                  : area.titleEn || area.titleZh;
              const isActive = area.slug === activeSlug;
              return (
                <button
                  key={area.slug}
                  onClick={() => setActiveSlug(area.slug)}
                  className={`block w-full text-left py-2 text-sm transition-colors ${
                    isActive
                      ? "text-blue-700 border-l-2 -ml-4 pl-3 border-blue-700 font-medium"
                      : "text-gray-600 hover:text-blue-700 hover:border-l-2 hover:-ml-4 hover:pl-3 hover:border-blue-700"
                  }`}
                >
                  <span className="font-medium text-blue-700 mr-2">{idx + 1}.</span>
                  {title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: 当前选中方向的详细内容 */}
        <div className="flex-1 min-w-0">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <span className="text-blue-700 mr-2">{activeIdx + 1}.</span>
              {title}
            </h2>
            {activeArea.coverImage && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={activeArea.coverImage}
                  alt={title}
                  className="w-full max-h-64 object-cover"
                />
              </div>
            )}
            <div
              className="text-gray-700 leading-relaxed text-sm lg:text-base"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
