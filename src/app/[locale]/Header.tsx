import { prisma } from "@/lib/prisma";
import HeaderClient from "./HeaderClient";

export default async function Header({ locale }: { locale: string }) {
  let siteNameZh = "";
  let siteNameEn = "Jin's Research Group";
  let siteLogo = "";

  try {
    const config = await prisma.siteConfig.findFirst({
      select: { siteNameEn: true, siteNameZh: true, siteLogo: true },
    });
    if (config?.siteNameEn) siteNameEn = config.siteNameEn;
    if (config?.siteNameZh) siteNameZh = config.siteNameZh;
    if (config?.siteLogo) siteLogo = config.siteLogo;
  } catch {
    // fallback
  }

  const siteName = locale === "zh" && siteNameZh ? siteNameZh : siteNameEn;
  return <HeaderClient siteName={siteName} siteLogo={siteLogo} />;
}
