import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

export type ExploreType = {
  id: number;
  name: string;
  tokens: Array<{ amount: string; symbol: string }>;
  periods: Array<number>;
};

export const columns: ColumnDef<ExploreType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "tokens",
    header: "Tokens",
    cell: ({ row }) => {
      const tokens = row.original.tokens;
      return (
        <div>
          {tokens.map(({ amount, symbol }) => (
            <p key={symbol}>
              {amount} <strong>{symbol}</strong>
            </p>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "periods",
    header: "Periods",
    cell: ({ row }) => {
      const periods = row.original.periods;
      return (
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <Badge>{period}</Badge>
          ))}
        </div>
      );
    },
  },
];
