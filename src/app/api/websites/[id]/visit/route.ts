import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AjaxResponse } from "@/lib/utils";

const prisma = new PrismaClient();

// POST /api/websites/[id]/visit
export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const websiteId = parseInt(params.id);

    if (isNaN(websiteId)) {
      return NextResponse.json(AjaxResponse.fail("Invalid website ID"), {
        status: 400,
      });
    }

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!website) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), {
        status: 404,
      });
    }

    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: { visits: { increment: 1 } },
    });

    return NextResponse.json(
      AjaxResponse.ok({ visits: updatedWebsite.visits })
    );
  } catch (error) {
    console.error("Failed to increment visits:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to increment visits"), {
      status: 500,
    });
  }
}
