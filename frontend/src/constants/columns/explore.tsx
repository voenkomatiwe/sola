import { ColumnDef } from "@tanstack/react-table";

import { formatTokenAmount } from "@/utils";

import { tokens } from "./tokens";

export type ProvidersType = {
  id: string;
  authority: string;
  subscriptionPeriod: string;
  mint: string;
  subPrice: string;
  updatedAt: number;
  version: string;
  name: string;
  url: string;
};

export type GroupedProviders = Record<string, ProvidersType[]>;

export const columns: ColumnDef<ProvidersType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell({ row }) {
      return <div className="max-w-28 truncate">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "url",
    header: "Url",
    cell({ row }) {
      return (
        <a
          href={row.original.url}
          target="_blank"
          className="block max-w-28 truncate"
        >
          {row.original.url}
        </a>
      );
    },
  },
  {
    accessorKey: "tokens",
    header: "Tokens (payment for one month)",
    cell: ({ row }) => {
      const { symbol, logoURI, decimals } = tokens[row.original.mint];
      const amount = row.original.subPrice;

      return (
        <div>
          <p key={symbol} className="flex gap-2">
            {formatTokenAmount(amount, decimals).toString()}
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
];
