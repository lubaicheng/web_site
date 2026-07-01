import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbPath = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : `file:${path.join(process.cwd(), "dev.db")}`;

const adapter = new PrismaLibSql({ url: dbPath });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
