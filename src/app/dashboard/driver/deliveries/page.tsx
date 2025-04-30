import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDriverDeliveries } from "@/lib/actions/delivery.actions";
import { Card, CardContent } from "@/components/ui/card";

export default async function DriverDeliveriesPage() {
  const deliveries = await getDriverDeliveries({});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Deliveries</h1>
        <Button asChild>
          <Link href="/dashboard/driver/deliveries/available">
            Available Deliveries
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={deliveries} />
        </CardContent>
      </Card>
    </div>
  );
}
