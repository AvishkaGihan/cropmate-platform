import CropForm from "@/components/crops/crop-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCropById, updateCrop } from "@/lib/actions/crop.actions";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}
const EditCropPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const crop = await getCropById(id);

  if (!crop) {
    notFound();
  }

  const defaultValues = {
    name: crop.name,
    description: crop.description ?? undefined,
    category: crop.category,
    pricePerUnit: crop.pricePerUnit,
    availableQuantity: crop.availableQuantity,
    unit: crop.unit,
    harvestDate: crop.harvestDate,
    location: crop.location,
    existingImage: crop.imageUrl ?? undefined,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Crop</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/farmer/crops">Back to Crops</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <CropForm
            action={updateCrop.bind(null, id)}
            defaultValues={defaultValues}
            successRedirect="/dashboard/farmer/crops"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCropPage;
