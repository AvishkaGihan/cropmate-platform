import { DataTable } from "@/components/ui/data-table";
import { getCustomerOrders } from "@/lib/actions/order.actions";
import { Card, CardContent } from "@/components/ui/card";
import { columns } from "./columns";

export default async function CustomerOrdersPage() {
  // Fetch all customer orders (no limit)
  const orders = await getCustomerOrders({});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      <Card>
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
