"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { orderSchema } from "@/lib/schemas";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createOrder } from "@/lib/actions/order.actions";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";

import { OrderFormProps } from "@/types";
import { Label } from "../ui/label";

const OrderForm = ({ crop }: OrderFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [step, setStep] = useState<"details" | "payment">("details");
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
      deliveryAddress: session?.user?.address || "",
    },
  });

  const quantity = form.watch("quantity");
  const totalPrice = quantity * crop.pricePerUnit;

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentFile(file);
      setPaymentProof(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof orderSchema>) {
    if (!session) {
      router.push("/login?callbackUrl=/crops/" + crop.id);
      return;
    }

    if (values.quantity > crop.availableQuantity) {
      form.setError("quantity", {
        message: "Not enough quantity available",
      });
      return;
    }

    if (step === "details") {
      setStep("payment");
      return;
    }

    if (!paymentFile) {
      toast.error("Payment proof required", {
        description: "Please upload your payment proof",
      });
      return;
    }

    try {
      const order = await createOrder({
        cropId: crop.id,
        ...values,
        paymentProof: paymentFile,
      });

      toast.success("Order created successfully", {
        description: "Order created successfully",
      });

      router.push(`/orders/${order.id}`);
    } catch (error: any) {
      toast.error("Order failed", {
        description: error.message,
      });
    }
  }

  if (step === "payment") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">
            Bank Transfer Information
          </h3>
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Name</span>
              <span>{crop.farmer.bankDetails.accountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Number</span>
              <span>{crop.farmer.bankDetails.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank Name</span>
              <span>{crop.farmer.bankDetails.bankName}</span>
              {crop.farmer.bankDetails.branch && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Branch</span>
                  <span>{crop.farmer.bankDetails.branch}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between font-bold mt-4">
              <span>Amount to Transfer</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentProof">Upload Payment Proof</Label>
              <div className="flex items-center gap-4">
                {paymentProof && (
                  <div className="relative h-32 w-32 rounded-md overflow-hidden">
                    <Image
                      src={paymentProof}
                      alt="Payment proof preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <Input
                  id="paymentProof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handlePaymentProofChange}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Upload screenshot or scan of your bank transfer receipt
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("details")}
                className="flex-1 cursor-pointer"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1 cursor-pointer">
                Place Order
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity ({crop.unit})</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={crop.availableQuantity}
                  step={1}
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Price per {crop.unit}
            </span>
            <span className="text-sm">{crop.pricePerUnit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <span className="text-sm">
              {quantity} {crop.unit}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Proceed to Payment
        </Button>
      </form>
    </Form>
  );
};

export default OrderForm;
