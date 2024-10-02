import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

const statusColors = {
  pending: "bg-yellow-200 text-yellow-800",
  processing: "bg-blue-200 text-blue-800",
  cancelled: "bg-red-200 text-red-800",
  ended: "bg-gray-200 text-gray-800",
};

export type MySubscription = {
  id: number;
  name: string;
  amount: string;
  token: string;
  startDate: string;
  endDate: string;
  status: "pending" | "processing" | "cancelled" | "ended";
};

export const columns: ColumnDef<MySubscription>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "token",
    header: "Token",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge className={statusColors[status]}>{status}</Badge>;
    },
  },
];
