import OrderForm from "@/components/crops/order-form";
import { getCropById } from "@/lib/actions/crop.actions";
import Image from "next/image";
import { CalendarDays, Package, DollarSign, MapPin } from "lucide-react";

export default async function CropDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const crop = await getCropById(id);

  return (
    <div className="container mx-auto min-h-screen py-12 px-4">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          {/* Crop Image with enhanced styling */}
          <div className="relative h-[400px] w-full rounded-xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={crop.imageUrl || "/crop-placeholder.jpg"}
              alt={crop.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium dark:bg-primary/30">
                Fresh Produce
              </div>
            </div>
          </div>

          {/* Crop Name and Farmer with enhanced styling */}
          <h1 className="text-4xl font-bold text-foreground">{crop.name}</h1>
          <div className="flex items-center mt-3 space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center dark:bg-primary/30">
              <MapPin size={16} className="text-primary" />
            </div>
            <p className="text-muted-foreground">
              Listed by{" "}
              <span className="font-medium text-primary">
                {crop.farmer.name}
              </span>
            </p>
          </div>

          {/* Crop Description and Details with enhanced styling */}
          <div className="mt-8 space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-2xl font-semibold text-card-foreground flex items-center">
                <span className="mr-2">Description</span>
                <div className="h-px flex-grow bg-border ml-2" />
              </h2>
              <p className="mt-3 text-card-foreground/80 leading-relaxed">
                {crop.description || "No description provided"}
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-2xl font-semibold text-card-foreground flex items-center mb-4">
                <span className="mr-2">Details</span>
                <div className="h-px flex-grow bg-border ml-2" />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Price */}
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 dark:bg-primary/30">
                    <DollarSign size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Price
                    </p>
                    <p className="text-lg font-semibold text-card-foreground">
                      ${crop.pricePerUnit}/{crop.unit}
                    </p>
                  </div>
                </div>

                {/* Available Quantity */}
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 dark:bg-blue-900/30">
                    <Package
                      size={20}
                      className="text-blue-700 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Available
                    </p>
                    <p className="text-lg font-semibold text-card-foreground">
                      {crop.availableQuantity} {crop.unit}
                    </p>
                  </div>
                </div>

                {/* Harvest Date */}
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 dark:bg-amber-900/30">
                    <CalendarDays
                      size={20}
                      className="text-amber-700 dark:text-amber-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Harvested
                    </p>
                    <p className="text-lg font-semibold text-card-foreground">
                      {new Date(crop.harvestDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:sticky md:top-6 h-fit">
          {crop.farmer.bankDetails ? (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="bg-primary/10 p-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  Order This Crop
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Fill in your details below to place an order
                </p>
              </div>
              <div className="p-6">
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
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-8 bg-amber-50 border border-amber-200 shadow-sm dark:bg-amber-950/20 dark:border-amber-900/50">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4">
                <Package
                  size={24}
                  className="text-amber-800 dark:text-amber-400"
                />
              </div>
              <h3 className="font-semibold text-xl text-amber-800 dark:text-amber-400 text-center">
                Not Available for Purchase
              </h3>
              <p className="text-amber-700 dark:text-amber-300 text-center mt-3">
                This crop cannot be ordered because the farmer has not provided
                payment details yet.
              </p>
              <div className="mt-6 pt-6 border-t border-amber-200 dark:border-amber-900/50">
                <p className="text-amber-700 dark:text-amber-300 text-sm text-center">
                  Please check back later or browse other available crops.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
