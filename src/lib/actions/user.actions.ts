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
