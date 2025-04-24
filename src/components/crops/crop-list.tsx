import { Crop } from "@/app/generated/prisma";
import { getCrops } from "@/lib/actions/crop.actions";
import Link from "next/link";
import { Card } from "../ui/card";
import Image from "next/image";
import { CropSearchParams } from "@/types";

export default async function CropList({
  searchParams,
}: {
  searchParams: Promise<CropSearchParams>;
}) {
  const params = await searchParams;
  const crops = await getCrops(params);

  if (crops.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No crops found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {crops.map((crop) => (
        <CropCard key={crop.id} crop={crop} />
      ))}
    </div>
  );
}

function CropCard({ crop }: { crop: Crop }) {
  return (
    <Link href={`/crops/${crop.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={crop.imageUrl || "/crop-placeholder.jpg"}
            alt={crop.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold">{crop.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {crop.description}
          </p>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold text-cropmate-primary">
              ${crop.pricePerUnit}/{crop.unit}
            </span>
            <span className="text-sm text-muted-foreground">
              {crop.availableQuantity} {crop.unit} available
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
