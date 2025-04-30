import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Truck, Clock, CheckCircle } from "lucide-react";
import { getDriverStats } from "@/lib/actions/user.actions";
import { getRecentDeliveries } from "@/lib/actions/delivery.actions";
import OrderStatusBadge from "@/components/orders/status-badge";

export default async function DriverDashboardPage() {
  const [stats, deliveries] = await Promise.all([
    getDriverStats(),
    getRecentDeliveries(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/driver/deliveries">View All Deliveries</Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Deliveries
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              {stats.deliveriesChange}% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Pickups
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPickups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Deliveries</CardTitle>
          <Button asChild variant="outline">
            <Link href="/dashboard/driver/deliveries">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No deliveries assigned yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Link
                        href={`/orders/${delivery.order.id}`}
                        className="font-medium hover:underline"
                      >
                        Delivery #{delivery.id.slice(0, 8)}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {new Date(delivery.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <OrderStatusBadge status={delivery.status} />
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Crop</p>
                      <p>{delivery.order.crop.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pickup Location</p>
                      <p>{delivery.order.crop.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Delivery Address</p>
                      <p>{delivery.order.deliveryAddress}</p>
                    </div>
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
