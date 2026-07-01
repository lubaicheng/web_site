import { prisma } from "@/lib/prisma";

export default async function Footer() {
  let links: { imageUrl: string; url: string; name: string }[] = [];
  let copyright = "Copyright © 2026 Prof. Jin's Research Group";

  try {
    links = await prisma.friendlyLink.findMany({
      orderBy: { order: "asc" },
      select: { imageUrl: true, url: true, name: true },
    });
    const config = await prisma.siteConfig.findFirst();
    if (config?.copyrightEn) copyright = config.copyrightEn;
  } catch {
    // Database might not have data yet
  }

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      {/* Friendly Links */}
      {links.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                {link.imageUrl ? (
                  <img
                    src={link.imageUrl}
                    alt={link.name || "link"}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-600">{link.name}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Copyright */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-sm text-gray-500">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
