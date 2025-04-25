import OrderForm from "@/components/crops/order-form";
import { getCropById } from "@/lib/actions/crop.actions";
import Image from "next/image";

export default async function CropDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const crop = await getCropById(id);

  return (
    <div className="container mx-auto min-h-screen py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {/* Crop Image and Details */}
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src={crop.imageUrl || "/crop-placeholder.jpg"}
              alt={crop.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Crop Name and Farmer */}
          <h1 className="text-3xl font-bold">{crop.name}</h1>
          <p className="text-muted-foreground mt-2">
            Listed by {crop.farmer.name}
          </p>

          {/* Crop Description and Details */}
          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="mt-2">
                {crop.description || "No description provided"}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Details</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Price */}
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    ${crop.pricePerUnit}/{crop.unit}
                  </p>
                </div>

                {/* Available Quantity */}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Available Quantity
                  </p>
                  <p className="font-medium">
                    {crop.availableQuantity} {crop.unit}
                  </p>
                </div>

                {/* Harvest Date */}
                <div>
                  <p className="text-sm text-muted-foreground">Harvest Date</p>
                  <p className="font-medium">
                    {new Date(crop.harvestDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-4">
          {crop.farmer.bankDetails ? (
            <OrderForm
              crop={{
                id: crop.id,
                pricePerUnit: crop.pricePerUnit,
                availableQuantity: crop.availableQuantity,
                unit: crop.unit,
                farmer: {
                  bankDetails: crop.farmer.bankDetails,
                },
              }}
            />
          ) : (
            <div className="rounded-lg p-6 bg-amber-50 border border-amber-200">
              <h3 className="font-medium text-amber-800">
                Not Available for Purchase
              </h3>
              <p className="text-amber-700 text-sm mt-2">
                This crop cannot be ordered because the farmer has not provided
                payment details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
