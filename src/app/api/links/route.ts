import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeUrl } from "@/lib/utils";

export async function GET() {
  try {
    const links = await prisma.friendlyLink.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await prisma.friendlyLink.count();
    const link = await prisma.friendlyLink.create({
      data: {
        imageUrl: body.imageUrl || "",
        url: normalizeUrl(body.url) || "",
        name: body.name || "",
        order: body.order ?? count,
      },
    });
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const link = await prisma.friendlyLink.update({
      where: { id },
      data: {
        imageUrl: data.imageUrl,
        url: normalizeUrl(data.url),
        name: data.name,
        order: data.order,
      },
    });
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.friendlyLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
