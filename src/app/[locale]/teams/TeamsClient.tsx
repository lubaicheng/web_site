"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import TeamCard from "@/components/TeamCard";

const GROUPS = [
  "supervisor",
  "postdoc",
  "staff",
  "student",
  "alumni",
] as const;

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

export default function TeamsClient({
  members,
  locale,
}: {
  members: TeamMember[];
  locale: string;
}) {
  const t = useTranslations("teams");
  const [activeGroup, setActiveGroup] = useState<string>("supervisor");

  const filtered = members.filter((m) => m.group === activeGroup);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Group Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-2">
        {GROUPS.map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeGroup === group
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t(group)}
          </button>
        ))}
      </div>

      {/* Member Cards: 2 columns */}
      {filtered.length === 0 ? (
        <p className="text-gray-400">No members in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((member) => (
            <Link key={member.slug} href={`/teams/${member.slug}`}>
              <TeamCard member={member} locale={locale} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
