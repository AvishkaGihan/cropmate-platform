"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { confirmPayment, rejectPayment } from "@/lib/actions/order.actions";
import { toast } from "sonner";

interface PaymentProofModalProps {
  orderId: string;
  paymentProof: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentProofModal({
  orderId,
  paymentProof,
  open,
  onOpenChange,
}: PaymentProofModalProps) {
  const router = useRouter();

  const handleConfirm = async () => {
    try {
      await confirmPayment(orderId);
      toast.success("Payment confirmed", {
        description: "Order status updated to Payment Received",
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to confirm payment", {
        description: "An error occurred while confirming the payment",
      });
    }
    onOpenChange(false);
  };

  const handleReject = async () => {
    try {
      await rejectPayment(orderId);
      toast.error("Payment rejected", {
        description: "Order status set back to Pending Payment",
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to reject payment", {
        description: "An error occurred while rejecting the payment",
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">
            Payment Proof Review
          </DialogTitle>
          <DialogDescription>
            Please verify the payment proof image before confirming or rejecting
            the payment.
          </DialogDescription>
        </DialogHeader>
        <div className="relative h-[450px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <Image
            src={paymentProof}
            alt="Payment proof"
            fill
            className="object-contain bg-gray-50"
            quality={100}
          />
        </div>
        <div className="flex justify-end gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6"
          >
            Close
          </Button>
          <Button variant="destructive" onClick={handleReject} className="px-6">
            Reject Payment
          </Button>
          <Button onClick={handleConfirm} className="px-6">
            Confirm Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
