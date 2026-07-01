import { prisma } from "@/lib/prisma";
import PublicationsClient from "./PublicationsClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PublicationsPage({ params }: Props) {
  let publications: {
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi: string;
    link: string;
  }[] = [];

  try {
    publications = await prisma.publication.findMany({
      orderBy: [{ year: "desc" }, { id: "asc" }],
      select: {
        title: true,
        authors: true,
        journal: true,
        year: true,
        doi: true,
        link: true,
      },
    });
  } catch {
    // No data yet
  }

  return <PublicationsClient publications={publications} />;
}
