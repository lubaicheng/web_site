import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeUrl } from "@/lib/utils";

export async function GET() {
  try {
    const pubs = await prisma.publication.findMany({
      orderBy: [{ year: "desc" }, { id: "asc" }],
    });
    return NextResponse.json(pubs);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pub = await prisma.publication.create({
      data: {
        title: body.title || "",
        authors: body.authors || "",
        journal: body.journal || "",
        year: body.year || new Date().getFullYear(),
        doi: body.doi || "",
        link: body.link || "",
      },
    });
    return NextResponse.json(pub);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const pub = await prisma.publication.update({
      where: { id },
      data: {
        title: data.title,
        authors: data.authors,
        journal: data.journal,
        year: data.year,
        doi: data.doi,
        link: normalizeUrl(data.link),
      },
    });
    return NextResponse.json(pub);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.publication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
