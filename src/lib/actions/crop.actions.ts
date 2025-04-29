"use server";

import db from "@/lib/db";
import { Prisma } from "@/app/generated/prisma";
import { CropSearchParams } from "@/types";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

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

export async function getCropById(id: string) {
  try {
    const crop = await db.crop.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            address: true,
            bankDetails: {
              select: {
                accountName: true,
                bankName: true,
                accountNumber: true,
              },
            },
          },
        },
      },
    });

    if (!crop) {
      notFound();
    }

    return crop;
  } catch (error) {
    console.error(`Failed to fetch crop with ID ${id}:`, error);
    throw new Error("Failed to fetch crop details");
  }
}

export async function getFarmerCrops({ take }: { take?: number }) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  return await db.crop.findMany({
    where: { farmerId: session.user.id },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function deleteCrop(id: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "FARMER") {
      throw new Error("Unauthorized");
    }

    const crop = await db.crop.findFirst({
      where: {
        id,
        farmerId: session.user.id,
      },
    });

    if (!crop) {
      throw new Error(
        "Crop not found or you don't have permission to delete it"
      );
    }

    await db.crop.delete({
      where: {
        id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete crop:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete crop"
    );
  }
}

export async function getRecentCrops({ take = 3 }: { take?: number } = {}) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  return await db.crop.findMany({
    where: { farmerId: session.user.id },
    orderBy: { createdAt: "desc" },
    take,
  });
}
