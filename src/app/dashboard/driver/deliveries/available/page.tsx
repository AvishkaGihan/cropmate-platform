import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAvailableDeliveries } from "@/lib/actions/delivery.actions";
import { Card, CardContent } from "@/components/ui/card";
import { columns } from "../columns";

export default async function AvailableDeliveriesPage() {
  const deliveries = await getAvailableDeliveries();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Available Deliveries</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/driver/deliveries">My Deliveries</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={deliveries}
            searchKey="order.crop.name"
            filters={[
              {
                id: "location",
                title: "Pickup Location",
                options: Array.from(
                  new Set(deliveries.map((d) => d.order.crop.location))
                ).map((location) => ({ label: location, value: location })),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
