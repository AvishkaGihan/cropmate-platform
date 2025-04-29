"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cropSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, ImageIcon, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface CropFormProps {
  action: (values: FormData) => Promise<{
    errors?: Record<string, string[]> | undefined;
    message?: string;
    error?: string;
  }>;
  defaultValues?: Partial<z.infer<typeof cropSchema>> & { imageUrl?: string };
  successRedirect: string;
}

const CropForm = ({
  action,
  defaultValues,
  successRedirect,
}: CropFormProps) => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(
    defaultValues?.existingImage || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof cropSchema>>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "vegetables",
      pricePerUnit: defaultValues?.pricePerUnit || 0,
      availableQuantity: defaultValues?.availableQuantity || 0,
      unit: defaultValues?.unit || "kg",
      harvestDate: defaultValues?.harvestDate || new Date(),
      location: defaultValues?.location || "",
      existingImage: defaultValues?.existingImage || undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      form.setValue("image", file);
      form.clearErrors("image");
    }
  };

  async function onSubmit(values: z.infer<typeof cropSchema>) {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append basic form fields
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("category", values.category);
      formData.append("pricePerUnit", values.pricePerUnit.toString());
      formData.append("availableQuantity", values.availableQuantity.toString());
      formData.append("unit", values.unit);
      formData.append("harvestDate", values.harvestDate.toISOString());
      formData.append("location", values.location);

      // Handle image properly
      if (values.image instanceof File) {
        formData.append("image", values.image);
      } else if (values.existingImage) {
        formData.append("existingImage", values.existingImage);
      }

      console.log("Submitting form with data:", Object.fromEntries(formData));

      const result = await action(formData);

      if (result.errors || result.error) {
        const errorMessage = result.errors
          ? Object.values(result.errors).flat().join(", ")
          : result.message;

        toast.error("Failed to create crop", {
          description: errorMessage,
        });
        console.log("Error:", errorMessage);
        return;
      }

      toast.success("Success", {
        description: result.message || "Crop added successfully",
      });
      router.push(successRedirect);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error", {
        description: "Failed to create crop. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crop Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crop Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Tomatoes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="legumes">Legumes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="pricePerUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Unit *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2.50"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity */}
          <FormField
            control={form.control}
            name="availableQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Quantity *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="100"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unit */}
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit *</FormLabel>
                <FormControl>
                  <Input placeholder="kg, lb, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Harvest Date */}
          <FormField
            control={form.control}
            name="harvestDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Harvest Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="Farm location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your crop (variety, quality, etc.)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <FormItem>
              <FormLabel>Crop Image</FormLabel>
              <div className="flex items-center gap-4">
                {previewImage ? (
                  <div className="relative h-48 w-48 rounded-md overflow-hidden border">
                    <Image
                      src={previewImage}
                      alt="Crop preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-48 rounded-md border flex items-center justify-center bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="image"
                      className="cursor-pointer border rounded-md px-4 py-2 hover:bg-muted transition-colors"
                    >
                      Choose Image
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG up to 2MB
                    </p>
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(successRedirect)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Save Crop"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CropForm;
