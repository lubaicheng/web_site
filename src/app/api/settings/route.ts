import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let config = await prisma.siteConfig.findFirst();
    if (!config) {
      config = await prisma.siteConfig.create({ data: {} });
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    let config;
    if (id) {
      config = await prisma.siteConfig.update({
        where: { id },
        data: {
          copyrightZh: data.copyrightZh,
          copyrightEn: data.copyrightEn,
          addressZh: data.addressZh,
          addressEn: data.addressEn,
          email: data.email,
          phone: data.phone,
          mapImageUrl: data.mapImageUrl,
          mapLink: data.mapLink,
          siteNameZh: data.siteNameZh,
          siteNameEn: data.siteNameEn,
          siteLogo: data.siteLogo,
          homeLeftNewsCount: data.homeLeftNewsCount ?? undefined,
          homeRightNewsCount: data.homeRightNewsCount ?? undefined,
          carouselInterval: data.carouselInterval ?? undefined,
        },
      });
    } else {
      config = await prisma.siteConfig.create({ data });
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
