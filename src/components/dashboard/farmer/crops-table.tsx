"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";
import { MoreHorizontal } from "lucide-react";
import { deleteCrop } from "@/lib/actions/crop.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Crop } from "@/app/generated/prisma";

interface CropsTableProps {
  crops: Crop[];
}

const CropsTable = ({ crops }: CropsTableProps) => {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await deleteCrop(id);
      toast.success("Crop deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Error deleting crop");
    }
  };

  const columns: ColumnDef<Crop>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const crop = row.original;
        return (
          <Link
            href={`/crops/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.getValue("name")}
          </Link>
        );
      },
    },
    {
      accessorKey: "pricePerUnit",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("pricePerUnit"));
        return (
          <span>
            ${price.toFixed(2)}/{row.original.unit}
          </span>
        );
      },
    },
    {
      accessorKey: "availableQuantity",
      header: "Available",
      cell: ({ row }) => (
        <span>
          {row.getValue("availableQuantity")} {row.original.unit}
        </span>
      ),
    },
    {
      accessorKey: "harvestDate",
      header: "Harvest Date",
      cell: ({ row }) => (
        <span>
          {new Date(row.getValue("harvestDate")).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const crop = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/farmer/crops/${crop.id}/edit`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(crop.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return <DataTable columns={columns} data={crops} />;
};

export default CropsTable;
