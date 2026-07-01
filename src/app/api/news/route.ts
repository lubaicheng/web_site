import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// GET /api/news - list all news
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/news - create news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body.slug || slugify(body.titleEn || body.titleZh || "untitled");
    const news = await prisma.news.create({
      data: {
        titleZh: body.titleZh || "",
        titleEn: body.titleEn || "",
        contentZh: body.contentZh || "",
        contentEn: body.contentEn || "",
        coverImage: body.coverImage || "",
        slug,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT /api/news - update news
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const news = await prisma.news.update({
      where: { id },
      data: {
        titleZh: data.titleZh,
        titleEn: data.titleEn,
        contentZh: data.contentZh,
        contentEn: data.contentEn,
        coverImage: data.coverImage,
        slug: data.slug,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/news - delete news
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
