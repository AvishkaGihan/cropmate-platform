import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import CropList from "@/components/crops/crop-list";
import Filters from "@/components/crops/filters";
import { CropSearchParams } from "@/types";

const CropsPage = async ({
  searchParams,
}: {
  searchParams: Promise<CropSearchParams>;
}) => {
  const params = await searchParams;
  const searchQuery = params?.q ?? "";

  return (
    <div className="container min-h-screen py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Available Crops</h1>
        <p className="text-muted-foreground">
          Browse through fresh produce from local farmers
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <Card className="p-4 sticky top-4">
            <Filters />
          </Card>
        </div>
        <div className="md:w-3/4">
          <div className="mb-6">
            <form className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search crops..."
                  className="pl-8"
                  defaultValue={searchQuery}
                />
              </div>
              <Button type="submit" className="cursor-pointer">
                Search
              </Button>
            </form>
          </div>

          <Suspense fallback={<div>Loading crops...</div>}>
            <CropList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CropsPage;
