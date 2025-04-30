import OrderStatusBadge from "@/components/orders/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getCustomerOrders } from "@/lib/actions/order.actions";
import Link from "next/link";
import { ShoppingCart, Package, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function CustomerDashboardPage() {
  const orders = await getCustomerOrders({ take: 3 });

  return (
    <div className="space-y-6">
      {/* Enhanced header with welcome message */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your recent activity.
          </p>
        </div>
        <Button asChild className="sm:self-start gap-2">
          <Link href="/crops">
            <Package className="h-4 w-4" />
            Browse Crops
          </Link>
        </Button>
      </div>

      {/* Recent Orders Card with improved styling */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Your latest purchases and their status
                </CardDescription>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/dashboard/customer/orders">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground font-medium">No orders yet</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/crops">Start shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium hover:underline text-primary"
                      >
                        Order #{order.id.slice(0, 8)}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Ordered {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="mt-3 flex justify-between items-center bg-muted/50 rounded-md p-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.crop.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.quantity} {order.crop.unit}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-primary">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
