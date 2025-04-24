"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams.toString());

    // Update params with form data
    formData.forEach((value, key) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    router.push(`/crops?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/crops");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <Select
          name="category"
          defaultValue={searchParams.get("category") || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="fruits">Fruits</SelectItem>
            <SelectItem value="grains">Grains</SelectItem>
            <SelectItem value="legumes">Legumes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-3">Price range</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              name="minPrice"
              type="number"
              placeholder="Min"
              defaultValue={searchParams.get("minPrice") || ""}
              className="w-full"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              name="maxPrice"
              type="number"
              placeholder="Max"
              defaultValue={searchParams.get("maxPrice") || ""}
              className="w-full"
            />
          </div>
          <Slider
            defaultValue={[0, 1000]}
            min={0}
            max={1000}
            step={10}
            minStepsBetweenThumbs={1}
            onValueChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Location</h3>
        <Input
          name="location"
          placeholder="City or region"
          defaultValue={searchParams.get("location") || ""}
        />
      </div>

      <div className="flex space-x-2 pt-2">
        <Button type="submit" className="flex-1 cursor-pointer">
          Apply filters
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          className="cursor-pointer"
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
