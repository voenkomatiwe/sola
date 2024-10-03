import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { tokens } from "./tokens";

export type ProvidersType = {
  id: number;
  name: string;
  tokens: Array<{ amount: string; token: string }>;
  periods: Array<number>;
};

export const columns: ColumnDef<ProvidersType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "tokens",
    header: "Tokens (payment for one month)",
    cell: ({ row }) => {
      const paymentTokens = row.original.tokens;
      const array = paymentTokens.map((el) => {
        const { symbol, logoURI } = tokens[el.token];
        return { ...el, symbol, icon: logoURI };
      });
      return (
        <div>
          {array.map(({ amount, symbol, icon }) => (
            <p key={symbol} className="flex gap-2">
              {amount}
              <span className="flex gap-1">
                <strong>{symbol}</strong>
                <img src={icon} alt={symbol} className="w-5 h-5 rounded-full" />
              </span>
            </p>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "periods",
    header: "Periods (month)",
    cell: ({ row }) => {
      const periods = row.original.periods;
      const getBadgeColor = (period: number) => {
        switch (period) {
          case 1:
            return "bg-gray-200 text-gray-600";
          case 3:
            return "bg-blue-100 text-blue-600";
          case 6:
            return "bg-yellow-100 text-yellow-600";
          case 9:
            return "bg-orange-100 text-orange-600";
          case 12:
            return "bg-red-100 text-red-600";
          default:
            return "bg-gray-200 text-gray-600";
        }
      };

      return (
        <div className="flex flex-wrap gap-2">
          {periods.map((period, index) => (
            <Badge key={index} className={getBadgeColor(period)}>
              {period} month{period > 1 && "s"}
            </Badge>
          ))}
        </div>
      );
    },
  },
];
