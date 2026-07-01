-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "copyrightZh" TEXT NOT NULL DEFAULT '',
    "copyrightEn" TEXT NOT NULL DEFAULT '',
    "addressZh" TEXT NOT NULL DEFAULT '',
    "addressEn" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "mapImageUrl" TEXT NOT NULL DEFAULT '',
    "mapLink" TEXT NOT NULL DEFAULT '',
    "siteNameZh" TEXT NOT NULL DEFAULT '',
    "siteNameEn" TEXT NOT NULL DEFAULT 'Lab',
    "siteLogo" TEXT NOT NULL DEFAULT '',
    "homeLeftNewsCount" INTEGER NOT NULL DEFAULT 3,
    "homeRightNewsCount" INTEGER NOT NULL DEFAULT 7,
    "carouselInterval" INTEGER NOT NULL DEFAULT 4
);
INSERT INTO "new_SiteConfig" ("addressEn", "addressZh", "copyrightEn", "copyrightZh", "email", "id", "mapImageUrl", "mapLink", "phone") SELECT "addressEn", "addressZh", "copyrightEn", "copyrightZh", "email", "id", "mapImageUrl", "mapLink", "phone" FROM "SiteConfig";
DROP TABLE "SiteConfig";
ALTER TABLE "new_SiteConfig" RENAME TO "SiteConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
