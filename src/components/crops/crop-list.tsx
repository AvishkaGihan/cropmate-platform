import { Crop } from "@/app/generated/prisma";
import { getCrops } from "@/lib/actions/crop.actions";
import Link from "next/link";
import { Card } from "../ui/card";
import Image from "next/image";
import { CropSearchParams } from "@/types";
import { Badge } from "../ui/badge";

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
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-green-100 dark:border-green-900/30 h-full flex flex-col">
        <div className="relative h-52 w-full">
          <Image
            src={crop.imageUrl || "/crop-placeholder.jpg"}
            alt={crop.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <Badge className="bg-green-600 hover:bg-green-700">
              {crop.category}
            </Badge>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg mb-1">{crop.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
            {crop.description || "Fresh produce from local farmers"}
          </p>

          <div className="pt-3 border-t flex justify-between items-center">
            <span className="font-bold text-green-700 dark:text-green-500 text-lg">
              ${crop.pricePerUnit}/{crop.unit}
            </span>
            <span className="text-sm bg-green-50 dark:bg-green-900/20 py-1 px-2 rounded">
              {crop.availableQuantity} {crop.unit} available
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
