import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const areas = await prisma.researchArea.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(areas);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body.slug || slugify(body.titleEn || body.titleZh || "area");
    const area = await prisma.researchArea.create({
      data: {
        titleZh: body.titleZh || "",
        titleEn: body.titleEn || "",
        descriptionZh: body.descriptionZh || "",
        descriptionEn: body.descriptionEn || "",
        coverImage: body.coverImage || "",
        order: body.order || 0,
        slug,
      },
    });
    return NextResponse.json(area);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const area = await prisma.researchArea.update({
      where: { id },
      data: {
        titleZh: data.titleZh,
        titleEn: data.titleEn,
        descriptionZh: data.descriptionZh,
        descriptionEn: data.descriptionEn,
        coverImage: data.coverImage,
        order: data.order,
        slug: data.slug,
      },
    });
    return NextResponse.json(area);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.researchArea.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
