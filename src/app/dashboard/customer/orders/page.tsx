import { DataTable } from "@/components/ui/data-table";
import { getCustomerOrders } from "@/lib/actions/order.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { Package } from "lucide-react";

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders({});

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage your crop orders
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {orders.length}
            </p>
          </div>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 dark:bg-gray-900">
          <CardTitle className="text-xl dark:text-gray-100">
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={orders}
            searchKey="crop.name"
            filters={[
              {
                id: "status",
                title: "Status",
                options: [
                  { label: "Pending Payment", value: "PENDING_PAYMENT" },
                  { label: "Payment Received", value: "PAYMENT_RECEIVED" },
                  { label: "Ready for Delivery", value: "READY_FOR_DELIVERY" },
                  { label: "In Transit", value: "IN_TRANSIT" },
                  { label: "Delivered", value: "DELIVERED" },
                  { label: "Cancelled", value: "CANCELLED" },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
