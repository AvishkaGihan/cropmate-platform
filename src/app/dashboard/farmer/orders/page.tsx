import { DataTable } from "@/components/ui/data-table";
import { getFarmerOrders } from "@/lib/actions/order.actions";
import { columns } from "./columns";

export default async function FarmerOrdersPage() {
  const orders = await getFarmerOrders({});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Orders</h1>
      </div>

      <DataTable columns={columns} data={orders} />
    </div>
  );
}
