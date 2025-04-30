import {
  confirmPayment,
  getOrderById,
  markAsReadyForDelivery,
  rejectPayment,
} from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import OrderStatusBadge from "@/components/orders/status-badge";
import { auth } from "@/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  // Check authorization
  const isOwner = order.buyerId === session?.user.id;
  const isFarmer = order.crop.farmerId === session?.user.id;
  const isDriver =
    session?.user.role === "DRIVER" &&
    order.delivery?.driverId === session?.user.id;

  if (!isOwner && !isFarmer && !isDriver) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Order Details Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Crop</p>
                  <p className="font-medium">
                    {order.crop.name} ({order.quantity} {order.crop.unit})
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price per unit</p>
                  <p className="font-medium">
                    ${order.crop.pricePerUnit}/{order.crop.unit}
                  </p>
                </div>
                {!isDriver && ( // Hide total amount from drivers
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Farmer</p>
                  <p className="font-medium">{order.crop.farmer.name}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery Information Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground">Delivery Address</p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>

              {order.delivery && (
                <>
                  <div>
                    <p className="text-muted-foreground">Delivery Status</p>
                    <OrderStatusBadge status={order.delivery.status} />
                  </div>
                  {order.delivery.driver && (
                    <div>
                      <p className="text-muted-foreground">Driver</p>
                      <p className="font-medium">
                        {order.delivery.driver.name}
                      </p>
                    </div>
                  )}
                  {order.delivery.pickupDate && (
                    <div>
                      <p className="text-muted-foreground">Pickup Date</p>
                      <p className="font-medium">
                        {new Date(order.delivery.pickupDate).toLocaleString()}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Payment Proof Section - Hidden from drivers */}
          {order.paymentProof && !isDriver && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Proof</h2>
              <div className="relative h-64 w-full rounded-md overflow-hidden">
                <Image
                  src={order.paymentProof}
                  alt="Payment proof"
                  fill
                  className="object-contain"
                />
              </div>
              {isFarmer && order.status === "PENDING_PAYMENT" && (
                <div className="flex gap-2 mt-4">
                  <form action={confirmPayment.bind(null, order.id)}>
                    <Button type="submit">Confirm Payment</Button>
                  </form>
                  <form action={rejectPayment.bind(null, order.id)}>
                    <Button type="submit" variant="destructive">
                      Reject Payment
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          )}

          {/* Farmer Actions */}
          {isFarmer && order.status === "PAYMENT_RECEIVED" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Prepare Order</h2>
              <p className="text-muted-foreground mb-4">
                Once prepared, mark as ready for delivery
              </p>
              <form action={markAsReadyForDelivery.bind(null, order.id)}>
                <Button type="submit" className="w-full">
                  Mark as Ready for Delivery
                </Button>
              </form>
            </Card>
          )}

          {/* Support Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-4">
              Contact our support team if you have any questions
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
