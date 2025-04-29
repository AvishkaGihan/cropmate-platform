import { cn } from "@/lib/utils";

interface CropStatusBadgeProps {
  available: number;
  unit: string;
  className?: string;
}

export default function CropStatusBadge({
  available,
  unit,
  className,
}: CropStatusBadgeProps) {
  const status = available > 10 ? "high" : available > 0 ? "low" : "out";

  const statusMap = {
    high: {
      label: "In Stock",
      color: "bg-green-100 text-green-800",
    },
    low: {
      label: "Low Stock",
      color: "bg-yellow-100 text-yellow-800",
    },
    out: {
      label: "Out of Stock",
      color: "bg-red-100 text-red-800",
    },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusMap[status].color,
        className
      )}
    >
      {statusMap[status].label}
    </span>
  );
}
