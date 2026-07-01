import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  let address = "";
  let email = "";
  let phone = "";
  let mapImageUrl = "";
  let mapLink = "";

  try {
    const config = await prisma.siteConfig.findFirst();
    if (config) {
      address =
        locale === "zh" && config.addressZh
          ? config.addressZh
          : config.addressEn || "";
      email = config.email;
      phone = config.phone;
      mapImageUrl = config.mapImageUrl;
      mapLink = config.mapLink;
    }
  } catch {
    // No data yet
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          {address && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t("address")}
              </h2>
              <p className="text-gray-600">{address}</p>
            </div>
          )}

          {email && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t("email")}
              </h2>
              <a
                href={`mailto:${email}`}
                className="text-blue-600 hover:underline"
              >
                {email}
              </a>
            </div>
          )}

          {phone && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t("phone")}
              </h2>
              <p className="text-gray-600">{phone}</p>
            </div>
          )}
        </div>

        {/* Map */}
        <div>
          {mapImageUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img
                src={mapImageUrl}
                alt="Map"
                className="w-full h-auto"
              />
            </div>
          )}
          {mapLink && (
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-blue-600 hover:underline"
            >
              {t("map")} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
