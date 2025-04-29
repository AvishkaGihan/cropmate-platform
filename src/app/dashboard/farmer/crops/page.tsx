import CropsTable from "@/components/dashboard/farmer/crops-table";
import { Button } from "@/components/ui/button";
import { getFarmerCrops } from "@/lib/actions/crop.actions";
import Link from "next/link";

export default async function FarmerCropsPage() {
  const crops = await getFarmerCrops({});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Crops</h1>
        <Button asChild>
          <Link href="/dashboard/farmer/crops/new">Add New Crop</Link>
        </Button>
      </div>
      <CropsTable crops={crops} />
    </div>
  );
}
