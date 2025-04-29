import CropForm from "@/components/crops/crop-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createCrop } from "@/lib/actions/crop.actions";
import Link from "next/link";

export default function NewCropPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Crop</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/farmer/crops">Back to Crops</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <CropForm
            action={createCrop}
            successRedirect="/dashboard/farmer/crops"
          />
        </CardContent>
      </Card>
    </div>
  );
}
