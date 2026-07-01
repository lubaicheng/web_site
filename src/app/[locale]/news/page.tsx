import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });

  let news: {
    slug: string;
    titleZh: string;
    titleEn: string;
    publishedAt: Date;
  }[] = [];

  try {
    news = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
      select: { slug: true, titleZh: true, titleEn: true, publishedAt: true },
    });
  } catch {
    // No data yet
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>

      {news.length === 0 ? (
        <p className="text-gray-400">No news yet.</p>
      ) : (
        <div className="space-y-0">
          {news.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="flex justify-between items-center py-3 px-3 border-b border-gray-100 hover:bg-gray-50 rounded transition-colors group"
            >
              <span className="text-gray-800 group-hover:text-blue-600 transition-colors pr-4">
                {locale === "zh" && item.titleZh
                  ? item.titleZh
                  : item.titleEn || item.titleZh}
              </span>
              <span className="text-sm text-gray-400 flex-shrink-0 whitespace-nowrap">
                {new Date(item.publishedAt).toLocaleDateString(
                  locale === "zh" ? "zh-CN" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
