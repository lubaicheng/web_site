"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    news: 0,
    teams: 0,
    publications: 0,
    research: 0,
    carousel: 0,
    links: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [news, teams, pubs, research, carousel, links] =
          await Promise.all([
            fetch("/api/news").then((r) => r.json()),
            fetch("/api/teams").then((r) => r.json()),
            fetch("/api/publications").then((r) => r.json()),
            fetch("/api/research").then((r) => r.json()),
            fetch("/api/carousel").then((r) => r.json()),
            fetch("/api/links").then((r) => r.json()),
          ]);

        setStats({
          news: Array.isArray(news) ? news.length : 0,
          teams: Array.isArray(teams) ? teams.length : 0,
          publications: Array.isArray(pubs) ? pubs.length : 0,
          research: Array.isArray(research) ? research.length : 0,
          carousel: Array.isArray(carousel) ? carousel.length : 0,
          links: Array.isArray(links) ? links.length : 0,
        });
      } catch {
        // ignore
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "新闻", count: stats.news, href: "/admin/news" },
    { label: "人员", count: stats.teams, href: "/admin/teams" },
    { label: "论文", count: stats.publications, href: "/admin/publications" },
    { label: "研究方向", count: stats.research, href: "/admin/research" },
    { label: "轮播图", count: stats.carousel, href: "/admin/carousel" },
    { label: "友情链接", count: stats.links, href: "/admin/links" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">控制台</h1>
      <p className="text-gray-500 mb-8">欢迎使用后台管理系统，您可以在这里管理网站的所有内容。</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {card.count}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
