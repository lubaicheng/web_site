import { prisma } from "@/lib/prisma";
import Carousel from "@/components/Carousel";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  let leftCount = 3;
  let rightCount = 7;
  let carouselInterval = 4;
  // siteLogo reserved

  let carouselImages: { imageUrl: string }[] = [];
  let leftNews: {
    slug: string;
    titleZh: string;
    titleEn: string;
    coverImage: string;
    publishedAt: Date;
  }[] = [];
  let rightNews: {
    slug: string;
    titleZh: string;
    titleEn: string;
    publishedAt: Date;
  }[] = [];
  let copyright = "Copyright © 2026 Prof. Jin's Research Group";

  try {
    const config = await prisma.siteConfig.findFirst();
    if (config) {
      leftCount = config.homeLeftNewsCount || 3;
      rightCount = config.homeRightNewsCount || 7;
      carouselInterval = config.carouselInterval || 4;
      copyright = locale === "zh" && config.copyrightZh
        ? config.copyrightZh
        : config.copyrightEn || copyright;
    }

    carouselImages = await prisma.carouselImage.findMany({
      orderBy: { order: "asc" },
      select: { imageUrl: true },
    });

    const totalNeeded = leftCount + rightCount;
    const allNews = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
      take: totalNeeded,
      select: {
        slug: true,
        titleZh: true,
        titleEn: true,
        coverImage: true,
        publishedAt: true,
      },
    });

    leftNews = allNews.slice(0, leftCount);
    rightNews = allNews.slice(leftCount, leftCount + rightCount);
  } catch {
    // Database may be empty
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ===== 轮播 ===== */}
      <Carousel images={carouselImages} interval={carouselInterval} />

      {/* ===== 新闻 ===== */}
      <section className="mt-12 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("latestNews")}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left */}
          <div className="space-y-6">
            {leftNews.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group block"
              >
                <div className="flex gap-4">
                  {item.coverImage && (
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.coverImage}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {locale === "zh" && item.titleZh
                        ? item.titleZh
                        : item.titleEn || item.titleZh}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(item.publishedAt).toLocaleDateString(
                        locale === "zh" ? "zh-CN" : "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="space-y-3">
            {rightNews.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                  {locale === "zh" && item.titleZh
                    ? item.titleZh
                    : item.titleEn || item.titleZh}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {new Date(item.publishedAt).toLocaleDateString(
                    locale === "zh" ? "zh-CN" : "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  )}
                </span>
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/news"
                className="inline-block text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {t("readMore")} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
