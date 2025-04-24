"use server";

import db from "@/lib/db";
import { Prisma } from "@/app/generated/prisma";
import { CropSearchParams } from "@/types";

export async function getCrops(searchParams: CropSearchParams) {
  try {
    const { q, category, minPrice, maxPrice, location } = searchParams;

    const where: Prisma.CropWhereInput = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.pricePerUnit = {};
      if (minPrice) {
        where.pricePerUnit.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.pricePerUnit.lte = parseFloat(maxPrice);
      }
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    const crops = await db.crop.findMany({
      where,
      include: {
        farmer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return crops;
  } catch (error) {
    console.error("Failed to fetch crops:", error);
    throw new Error("Failed to fetch crops");
  }
}
