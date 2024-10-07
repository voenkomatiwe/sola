import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { formatTokenAmount } from "@/utils";

import { tokens } from "./tokens";

export type MySubscription = {
  id: string;
  isActive: boolean;
  serviceId: string;
  lastPayment: number;
  // user: string;

  authority: string;
  subscriptionPeriod: string;
  mint: string;
  subPrice: string;
  updatedAt: number;
  name: string;
  url: string;
};

export const columns: ColumnDef<MySubscription>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell({ row }) {
      return <div className="max-w-28 truncate">{row.original.name}</div>;
    },
  },

  {
    accessorKey: "token",
    header: "Tokens (payment for one month)",
    cell: ({ row }) => {
      const { symbol, logoURI, decimals } = tokens[row.original.mint];
      return (
        <div>
          <p key={symbol} className="flex gap-2">
            {formatTokenAmount(row.original.subPrice, decimals).toString()}
            <span className="flex gap-1">
              <strong>{symbol}</strong>
              <img
                src={logoURI}
                alt={symbol}
                className="w-5 h-5 rounded-full"
              />
            </span>
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "lastPayment",
    header: "Last Payment",
    cell: ({ row }) => {
      return new Date(row.original.lastPayment * 1000).toLocaleString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <Badge className={isActive ? "bg-green-500" : "bg-red-500"}>
          {isActive ? "active" : "ended"}
        </Badge>
      );
    },
  },
];
