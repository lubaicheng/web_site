import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("memberId");
  if (!memberId) {
    return NextResponse.json({ error: "memberId required" }, { status: 400 });
  }
  try {
    const sections = await prisma.memberSection.findMany({
      where: { memberId: parseInt(memberId) },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await prisma.memberSection.count({
      where: { memberId: body.memberId },
    });
    const section = await prisma.memberSection.create({
      data: {
        memberId: body.memberId,
        title: body.title || "",
        content: body.content || "",
        order: body.order ?? count,
      },
    });
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const section = await prisma.memberSection.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        order: data.order,
      },
    });
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.memberSection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
