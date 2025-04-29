import OrderStatusBadge from "@/components/orders/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFarmerCrops } from "@/lib/actions/crop.actions";
import { getFarmerOrders } from "@/lib/actions/order.actions";
import Link from "next/link";

export default async function FarmerDashboardPage() {
  const [crops, orders] = await Promise.all([
    getFarmerCrops({ take: 3 }),
    getFarmerOrders({ take: 3 }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/crops">Browse Market</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/farmer/crops/new">Add New Crop</Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <Link
                          href={`/orders/${order.id}`}
                          className="font-medium hover:underline"
                        >
                          Order #{order.id.slice(0, 8)}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm">
                        {order.quantity} {order.crop.unit} of {order.crop.name}
                      </span>
                      <span className="font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <Button asChild variant="link" className="w-full">
                  <Link href="/dashboard/farmer/orders">View all orders</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Crops</CardTitle>
          </CardHeader>
          <CardContent>
            {crops.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You haven't listed any crops yet
                </p>
                <Button asChild variant="link" className="mt-2">
                  <Link href="/dashboard/farmer/crops/new">
                    Add your first crop
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {crops.map((crop) => (
                  <div key={crop.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/crops/${crop.id}`}
                        className="font-medium hover:underline"
                      >
                        {crop.name}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {crop.availableQuantity} {crop.unit} available
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm">
                        ${crop.pricePerUnit}/{crop.unit}
                      </span>
                      <span className="text-sm">
                        Harvest:{" "}
                        {new Date(crop.harvestDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                <Button asChild variant="link" className="w-full">
                  <Link href="/dashboard/farmer/crops">Manage all crops</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
