import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import ResearchClient from "./ResearchClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ResearchPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "research" });

  let areas: {
    slug: string;
    titleZh: string;
    titleEn: string;
    descriptionZh: string;
    descriptionEn: string;
    coverImage: string;
  }[] = [];

  try {
    areas = await prisma.researchArea.findMany({
      orderBy: { order: "asc" },
      select: {
        slug: true,
        titleZh: true,
        titleEn: true,
        descriptionZh: true,
        descriptionEn: true,
        coverImage: true,
      },
    });
  } catch {
    // No data yet
  }

  return <ResearchClient areas={areas} locale={locale} />;
}
