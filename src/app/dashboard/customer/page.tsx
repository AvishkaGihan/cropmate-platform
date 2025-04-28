import OrderStatusBadge from "@/components/orders/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomerOrders } from "@/lib/actions/order.actions";
import Link from "next/link";

export default async function CustomerDashboardPage() {
  const orders = await getCustomerOrders({ take: 3 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <Button asChild>
          <Link href="/crops">Browse Crops</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You have no orders yet</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/crops">Start shopping</Link>
              </Button>
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
                <Link href="/dashboard/customer/orders">View all orders</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
