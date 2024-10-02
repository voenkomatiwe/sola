import { DataTable } from "@/components/DataTable";
import { MySubscription, columns } from "@/constants/columns/mySubscriptions";

const mySubscriptions: MySubscription[] = [
  {
    id: 1,
    name: "Rozetka",
    amount: "13",
    token: "SOL",
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString(),
    status: "processing",
  },
  {
    id: 2,
    name: "Youtube",
    amount: "1",
    token: "LOL",
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString(),
    status: "cancelled",
  },
  {
    id: 3,
    name: "Apple Music",
    amount: "0.99",
    token: "SOLA",
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString(),
    status: "ended",
  },
];

export const MySubscriptions = () => {
  return (
    <div className="flex flex-col gap-4 h-full text-primary">
      <DataTable
        columns={columns}
        data={mySubscriptions}
        className="bg-card rounded-2xl"
      />
    </div>
  );
};
