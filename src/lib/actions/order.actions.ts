"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadImage } from "../cloudinary";
import { CreateOrderParams } from "@/types";

export async function createOrder({
  cropId,
  quantity,
  deliveryAddress,
  paymentProof,
}: CreateOrderParams) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const crop = await db.crop.findUnique({
    where: { id: cropId },
    select: { pricePerUnit: true },
  });

  if (!crop) {
    throw new Error("Crop not found");
  }

  const totalPrice = quantity * crop.pricePerUnit;

  let paymentProofUrl = null;
  try {
    const result = await uploadImage(paymentProof);
    paymentProofUrl = (result as { secure_url: string }).secure_url;
  } catch (error) {
    throw new Error("Failed to upload payment proof");
  }

  const order = await db.order.create({
    data: {
      quantity,
      totalPrice,
      deliveryAddress,
      paymentProof: paymentProofUrl,
      status: "PENDING_PAYMENT",
      buyerId: session.user.id,
      cropId: cropId,
    },
  });

  revalidatePath("/dashboard/orders");
  return order;
}

export async function getCustomerOrders({ take }: { take?: number }) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return await db.order.findMany({
    where: { buyerId: session.user.id },
    include: { crop: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}
