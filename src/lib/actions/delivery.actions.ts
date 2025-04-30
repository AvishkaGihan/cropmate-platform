"use server";

import { auth } from "@/auth";
import db from "@/lib/db";

export async function getRecentDeliveries({
  take = 3,
}: { take?: number } = {}) {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  return await db.delivery.findMany({
    where: { driverId: session.user.id },
    include: {
      order: {
        include: {
          crop: { select: { name: true, location: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getAvailableDeliveries() {
  const session = await auth();
  if (!session || session.user.role !== "driver") {
    throw new Error("Unauthorized");
  }

  return await db.delivery.findMany({
    where: {
      status: "PENDING",
      order: {
        status: "READY_FOR_DELIVERY",
      },
    },
    include: {
      order: {
        include: {
          crop: {
            select: {
              name: true,
              location: true,
              farmer: {
                select: {
                  name: true,
                  address: true,
                },
              },
            },
          },
          buyer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}
