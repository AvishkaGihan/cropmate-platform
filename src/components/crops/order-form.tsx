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
        <div className="flex items-center mb-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep("details")}
            className="text-sm pl-0"
          >
            ← Back to details
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Bank Transfer Information
          </h3>
          <div className="space-y-3 p-5 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Account Name
              </span>
              <span className="text-sm text-blue-900 dark:text-blue-300">
                {crop.farmer.bankDetails.accountName}
              </span>

              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Account Number
              </span>
              <span className="text-sm text-blue-900 dark:text-blue-300">
                {crop.farmer.bankDetails.accountNumber}
              </span>

              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Bank Name
              </span>
              <span className="text-sm text-blue-900 dark:text-blue-300">
                {crop.farmer.bankDetails.bankName}
              </span>

              {crop.farmer.bankDetails.branch && (
                <>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Branch
                  </span>
                  <span className="text-sm text-blue-900 dark:text-blue-300">
                    {crop.farmer.bankDetails.branch}
                  </span>
                </>
              )}
            </div>

            <div className="border-t border-blue-200 dark:border-blue-900/50 mt-3 pt-3 flex justify-between items-center">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Transfer Amount
              </span>
              <span className="text-lg font-bold text-blue-900 dark:text-blue-300">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="border border-border rounded-lg p-5">
              <div className="space-y-3">
                <Label htmlFor="paymentProof" className="font-medium">
                  Upload Payment Proof
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {paymentProof ? (
                    <div className="relative h-40 w-full sm:w-40 rounded-md overflow-hidden border border-border">
                      <Image
                        src={paymentProof}
                        alt="Payment proof preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full sm:w-40 rounded-md bg-muted border border-dashed border-border flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center px-2">
                        No image uploaded
                      </p>
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <Input
                      id="paymentProof"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePaymentProofChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload screenshot or scan of your bank transfer receipt
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={!paymentFile}
            >
              Place Order
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20 mb-2">
          <h3 className="font-medium text-foreground mb-1">Order Summary</h3>
          <p className="text-sm text-muted-foreground">
            Available:{" "}
            <span className="font-medium">
              {crop.availableQuantity} {crop.unit}
            </span>
          </p>
        </div>

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity ({crop.unit})</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newValue = Math.max(1, field.value - 1);
                      field.onChange(newValue);
                    }}
                    className="rounded-r-none"
                  >
                    -
                  </Button>
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
                    className="rounded-none text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newValue = Math.min(
                        crop.availableQuantity,
                        field.value + 1
                      );
                      field.onChange(newValue);
                    }}
                    className="rounded-l-none"
                  >
                    +
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
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
                <Input {...field} placeholder="Enter your delivery address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-muted/50 rounded-lg p-4 space-y-2 border border-border mt-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Price per {crop.unit}
            </span>
            <span className="text-sm font-medium">
              ${crop.pricePerUnit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <span className="text-sm font-medium">
              {quantity} {crop.unit}
            </span>
          </div>
          <div className="border-t border-border my-2 pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span className="text-primary">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" className="w-full cursor-pointer mt-2">
          Proceed to Payment
        </Button>
      </form>
    </Form>
  );
};

export default OrderForm;
