import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function TeamDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "teams" });

  let member: {
    nameZh: string;
    nameEn: string;
    titleZh: string;
    titleEn: string;
    photo: string;
    email: string;
    office: string;
    phone: string;
    bioZh: string;
    bioEn: string;
  } | null = null;

  let sections: {
    title: string;
    content: string;
    order: number;
  }[] = [];

  try {
    const full = await prisma.teamMember.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: "asc" },
          select: { title: true, content: true, order: true },
        },
      },
    });

    if (full) {
      member = {
        nameZh: full.nameZh,
        nameEn: full.nameEn,
        titleZh: full.titleZh,
        titleEn: full.titleEn,
        photo: full.photo,
        email: full.email,
        office: full.office,
        phone: full.phone,
        bioZh: full.bioZh,
        bioEn: full.bioEn,
      };
      sections = full.sections;
    }
  } catch {
    // DB error
  }

  if (!member) {
    notFound();
  }

  const name =
    locale === "zh" && member.nameZh
      ? member.nameZh
      : member.nameEn || member.nameZh;
  const title =
    locale === "zh" && member.titleZh
      ? member.titleZh
      : member.titleEn || member.titleZh;
  const bio =
    locale === "zh" && member.bioZh
      ? member.bioZh
      : member.bioEn || member.bioZh;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 面包屑 */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/teams" className="text-blue-600 hover:underline">
          {t("title")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{name}</span>
      </nav>

      {/* 头部：照片 + 信息 */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-md">
            {member.photo ? (
              <img
                src={member.photo}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">
                👤
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
          <p className="text-lg text-blue-700 mb-4">{title}</p>
          {member.email && (
            <p className="text-sm mb-1">
              <span className="text-gray-500">Email：</span>
              <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">{member.email}</a>
            </p>
          )}
          {member.office && (
            <p className="text-sm mb-1">
              <span className="text-gray-500">办公室：</span>
              <span className="text-gray-700">{member.office}</span>
            </p>
          )}
          {member.phone && (
            <p className="text-sm mb-1">
              <span className="text-gray-500">电话：</span>
              <span className="text-gray-700">{member.phone}</span>
            </p>
          )}
          {bio && (
            <div className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              <p>{bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* 子模块列表 */}
      <div className="border-t border-gray-200 pt-8 space-y-10">
        {sections.length === 0 ? (
          <p className="text-gray-400">暂无详细介绍</p>
        ) : (
          sections.map((sec, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {sec.title}
              </h2>
              <div
                className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sec.content }}
              />
            </section>
          ))
        )}
      </div>
    </div>
  );
}
