import { DataTable } from "@/components/DataTable";
import { ExploreType, columns } from "@/constants/columns/explore";

const explore: ExploreType[] = [
  {
    id: 1,
    name: "Rozetka",
    tokens: [
      { amount: "2", symbol: "SOL" },
      { amount: "999", symbol: "LOL" },
    ],
    periods: [1, 3],
  },
  {
    id: 2,
    name: "Youtube",
    tokens: [
      { amount: "0.2", symbol: "SOLA" },
      { amount: "999", symbol: "LOL" },
    ],
    periods: [1, 3, 12],
  },
  {
    id: 3,
    name: "Apple Music",
    tokens: [{ amount: "33", symbol: "LOL" }],
    periods: [1, 3, 6, 9, 12],
  },
];

export const Explore = () => {
  return (
    <div className="flex flex-col gap-4 h-full text-primary">
      <DataTable
        columns={columns}
        data={explore}
        className="bg-card rounded-2xl"
      />
    </div>
  );
};
