import { CalendarClock, LucideDollarSign, Users } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/DataTable";
import { InfoCard } from "@/components/InfoCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { MySubscription, columns } from "@/constants/columns";

const payments: MySubscription[] = [
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

export const Consumer = () => {
  const [date, setDate] = useState<Date[] | undefined>([new Date()]);
  const balance = 133;
  const lockedTokens = 100;
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
        <Card className="flex flex-col gap-4 p-4 shadow border rounded-lg bg-white">
          <h2 className="text-lg font-semibold">Balance</h2>
          <div className="">
            <p className="text-gray-700">
              <strong>Balance on Contract:</strong> {balance} SOL
            </p>
            <p className="text-gray-700">
              <strong>Locked Tokens:</strong> {lockedTokens} tokens
            </p>
          </div>
          <div className="flex justify-between flex-1 items-end">
            <Button>Deposit</Button>
            <Button variant="destructive">Withdraw</Button>
          </div>
        </Card>
      </div>
      <div className=" rounded-[0.5rem] border bg-card shadow h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">
            My subscriptions
          </h3>
        </div>
        <DataTable columns={columns} data={payments} />
      </div>
    </div>
  );
};
