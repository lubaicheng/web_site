import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: [{ group: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body.slug || slugify(body.nameEn || body.nameZh || "member");
    const member = await prisma.teamMember.create({
      data: {
        nameZh: body.nameZh || "",
        nameEn: body.nameEn || "",
        titleZh: body.titleZh || "",
        titleEn: body.titleEn || "",
        photo: body.photo || "",
        bioZh: body.bioZh || "",
        bioEn: body.bioEn || "",
        group: body.group || "student",
        order: body.order || 0,
        email: body.email || "",
        office: body.office || "",
        phone: body.phone || "",
        slug,
      },
    });
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        nameZh: data.nameZh,
        nameEn: data.nameEn,
        titleZh: data.titleZh,
        titleEn: data.titleEn,
        photo: data.photo,
        bioZh: data.bioZh,
        bioEn: data.bioEn,
        group: data.group,
        order: data.order,
        email: data.email,
        slug: data.slug,
      },
    });
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
