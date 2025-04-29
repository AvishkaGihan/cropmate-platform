"use client";

import {
  Dialog,
  DialogContent,
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
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Payment Proof Review</DialogTitle>
        </DialogHeader>
        <div className="relative h-96 w-full rounded-md overflow-hidden">
          <Image
            src={paymentProof}
            alt="Payment proof"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            Reject Payment
          </Button>
          <Button onClick={handleConfirm}>Confirm Payment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
