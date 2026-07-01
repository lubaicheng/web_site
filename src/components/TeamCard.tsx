type TeamMember = {
  slug: string;
  nameZh: string;
  nameEn: string;
  titleZh: string;
  titleEn: string;
  photo: string;
  email: string;
  group: string;
};

export default function TeamCard({
  member,
  locale,
}: {
  member: TeamMember;
  locale: string;
}) {
  const name =
    locale === "zh" && member.nameZh
      ? member.nameZh
      : member.nameEn || member.nameZh;
  const title =
    locale === "zh" && member.titleZh
      ? member.titleZh
      : member.titleEn || member.titleZh;

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* 头像 */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
            👤
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="p-4 text-center">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        {title && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{title}</p>
        )}
        {member.email && (
          <p className="text-xs text-gray-400 mt-1 truncate">{member.email}</p>
        )}
      </div>
    </div>
  );
}
