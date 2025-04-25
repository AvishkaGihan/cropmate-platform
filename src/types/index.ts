import { CropCategory } from "@/app/generated/prisma";

export type UserRole = "CUSTOMER" | "FARMER" | "DRIVER";

export interface CropSearchParams {
  q?: string;
  category?: CropCategory;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
}

export interface OrderFormProps {
  crop: {
    id: string;
    pricePerUnit: number;
    availableQuantity: number;
    unit: string;
    farmer: {
      bankDetails: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        branch?: string;
      };
    };
  };
}

export interface CreateOrderParams {
  cropId: string;
  quantity: number;
  deliveryAddress: string;
  paymentProof: File;
}
