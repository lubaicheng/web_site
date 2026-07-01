import { prisma } from "@/lib/prisma";
import TeamsClient from "./TeamsClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TeamsPage({ params }: Props) {
  const { locale } = await params;

  let members: {
    slug: string;
    nameZh: string;
    nameEn: string;
    titleZh: string;
    titleEn: string;
    photo: string;
    email: string;
    group: string;
  }[] = [];

  try {
    members = await prisma.teamMember.findMany({
      orderBy: [{ group: "asc" }, { order: "asc" }],
      select: {
        slug: true,
        nameZh: true,
        nameEn: true,
        titleZh: true,
        titleEn: true,
        photo: true,
        email: true,
        group: true,
      },
    });
  } catch {
    // No data yet
  }

  return <TeamsClient members={members} locale={locale} />;
}
