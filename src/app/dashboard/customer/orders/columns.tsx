"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import OrderStatusBadge from "@/components/orders/status-badge";
import { Order } from "@/app/generated/prisma";

export const columns: ColumnDef<
  Order & {
    crop: {
      name: string;
      unit: string;
      farmerId: string;
      farmer: { name: string };
    };
  }
>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="font-medium hover:underline"
      >
        #{row.original.id.slice(0, 8)}
      </Link>
    ),
  },
  {
    accessorKey: "crop.name",
    header: "Crop",
  },
  {
    accessorKey: "crop.farmer.name",
    header: "Farmer",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span>
        {row.original.quantity} {row.original.crop.unit}
      </span>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.totalPrice),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/orders/${order.id}`}
            className="text-blue-500 hover:underline"
          >
            View Details
          </Link>
        </div>
      );
    },
  },
];
