import { CalendarClock, LucideDollarSign, Users } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/DataTable";
import { InfoCard } from "@/components/InfoCard";
import { Calendar } from "@/components/ui/calendar";
import { MySubscription, columns } from "@/constants/columns";

const mySubscriptions: MySubscription[] = [
  {
    id: 1,
    name: "Rozetka",
    amount: "13 SOL",
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString(),
    status: "processing",
  },
  {
    id: 2,
    name: "Youtube",
    amount: "1 SOL",
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString(),
    status: "cancelled",
  },
  {
    id: 3,
    name: "Apple Music",
    amount: "0.99 SOL",
    startDate: new Date().toLocaleString(),
    endDate: new Date().toLocaleString(),
    status: "ended",
  },
];

export const Provider = () => {
  const [date, setDate] = useState<Date[] | undefined>([new Date()]);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard title="Total spent" icon={<LucideDollarSign />} value="10" />
        <InfoCard title="Subscriptions" icon={<Users />} value="10" />
        <InfoCard
          title="Monthly expense"
          icon={<CalendarClock />}
          value="13 SOL"
        />
        <InfoCard title="Subscriptions" icon={<Users />} value="10" />
      </div>
      <div className="flex gap-4">
        <Calendar
          mode="multiple"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
      <div className=" rounded-[0.5rem] border bg-InfoCard shadow h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">
            My subscriptions
          </h3>
        </div>
        <DataTable columns={columns} data={mySubscriptions} />
      </div>
    </div>
  );
};
