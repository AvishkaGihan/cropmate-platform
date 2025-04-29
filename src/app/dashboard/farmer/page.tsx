import { getFarmerStats } from "@/lib/actions/user.actions";
import { getRecentOrders } from "@/lib/actions/order.actions";
import { getRecentCrops } from "@/lib/actions/crop.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, ShoppingCart, DollarSign, Truck, Crop } from "lucide-react";
import OrderStatusBadge from "@/components/orders/status-badge";
import CropStatusBadge from "@/components/crops/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FarmerDashboardPage() {
  const [stats, orders, crops] = await Promise.all([
    getFarmerStats(),
    getRecentOrders(),
    getRecentCrops(),
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

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCrops}</div>
            <p className="text-xs text-muted-foreground">
              {stats.cropsChange}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ordersChange}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              {stats.revenueChange}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              {stats.deliveriesChange}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button asChild variant="outline">
            <Link href="/dashboard/farmer/orders">View All</Link>
          </Button>
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
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p>{order.buyer.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Crop</p>
                      <p>{order.crop.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p>${order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Crops */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Crops</CardTitle>
          <Button asChild variant="outline">
            <Link href="/dashboard/farmer/crops">Manage Crops</Link>
          </Button>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {crops.map((crop) => (
                <div key={crop.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        href={`/crops/${crop.id}`}
                        className="font-medium hover:underline"
                      >
                        {crop.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {crop.availableQuantity} {crop.unit} available
                      </p>
                    </div>
                    <CropStatusBadge
                      available={crop.availableQuantity}
                      unit={crop.unit}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p>
                        ${crop.pricePerUnit}/{crop.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Harvest</p>
                      <p>{new Date(crop.harvestDate).toLocaleDateString()}</p>
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
