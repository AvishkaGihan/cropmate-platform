"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { UserRole } from "@/types";
import bcrypt from "bcryptjs";

export async function loginUser({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: UserRole;
}) {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: { bankDetails: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== role) {
      throw new Error(`Please login as ${user.role}`);
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

export async function registerUser(values: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  address: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(values.password, 10);

    const userData: any = {
      name: values.name,
      email: values.email,
      password: hashedPassword,
      role: values.role,
      address: values.address,
    };

    if (values.role === "FARMER") {
      userData.bankDetails = {
        create: {
          accountName: values.accountName!,
          accountNumber: values.accountNumber!,
          bankName: values.bankName!,
        },
      };
    }

    const user = await db.user.create({
      data: userData,
      include: { bankDetails: true },
    });

    return user;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Email already in use");
    }
    throw error;
  }
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { bankDetails: true },
  });

  return user;
}

export async function getFarmerStats() {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  const [activeCrops, pendingOrders, completedOrders, deliveries] =
    await Promise.all([
      db.crop.count({
        where: {
          farmerId: session.user.id,
          availableQuantity: { gt: 0 },
        },
      }),
      db.order.count({
        where: {
          crop: { farmerId: session.user.id },
          status: { in: ["PENDING_PAYMENT", "PAYMENT_RECEIVED"] },
        },
      }),
      db.order.count({
        where: {
          crop: { farmerId: session.user.id },
          status: "DELIVERED",
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      }),
      db.delivery.count({
        where: {
          order: { crop: { farmerId: session.user.id } },
          status: { in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
        },
      }),
    ]);

  // Mock growth percentages (in a real app, calculate from previous period)
  return {
    activeCrops,
    cropsChange: Math.floor(Math.random() * 20) + 5,
    pendingOrders,
    ordersChange: Math.floor(Math.random() * 15) + 5,
    totalRevenue: completedOrders * 100, // Mock average order value
    revenueChange: Math.floor(Math.random() * 25) + 5,
    activeDeliveries: deliveries,
    deliveriesChange: Math.floor(Math.random() * 15) + 5,
  };
}
