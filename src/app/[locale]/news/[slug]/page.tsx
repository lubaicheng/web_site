import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "news" });

  let item: {
    titleZh: string;
    titleEn: string;
    contentZh: string;
    contentEn: string;
    coverImage: string;
    publishedAt: Date;
  } | null = null;

  try {
    item = await prisma.news.findUnique({
      where: { slug },
      select: {
        titleZh: true,
        titleEn: true,
        contentZh: true,
        contentEn: true,
        coverImage: true,
        publishedAt: true,
      },
    });
  } catch {
    // DB error
  }

  if (!item) {
    notFound();
  }

  const title =
    locale === "zh" && item.titleZh
      ? item.titleZh
      : item.titleEn || item.titleZh;
  const content =
    locale === "zh" && item.contentZh
      ? item.contentZh
      : item.contentEn || item.contentZh;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/news"
        className="text-sm text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        ← {t("back")}
      </Link>

      <article>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {new Date(item.publishedAt).toLocaleDateString(
            locale === "zh" ? "zh-CN" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </p>

        {item.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={item.coverImage}
              alt={title}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  );
}
