import { CropCategory } from "@/app/generated/prisma";

export type UserRole = "CUSTOMER" | "FARMER" | "DRIVER";

export interface CropSearchParams {
  q?: string;
  category?: CropCategory;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
}
