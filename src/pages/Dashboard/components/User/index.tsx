import { Users } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/DataTable";
import { Calendar } from "@/components/ui/calendar";

import { Payment, columns } from "./columns";

const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];

const Card = ({
  title,
  icon,
  value,
}: {
  title: string;
  icon: JSX.Element;
  value: string;
}) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export const User = () => {
  const [date, setDate] = useState<Date[] | undefined>([new Date()]);
  return (
    <div className="container overflow-hidden flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Subscriptions" icon={<Users />} value="10" />
        <Card title="Subscriptions" icon={<Users />} value="10" />
        <Card title="Subscriptions" icon={<Users />} value="10" />
        <Card title="Subscriptions" icon={<Users />} value="10" />
      </div>
      <div className="flex">
        <Calendar
          mode="multiple"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">Subscriptions</h3>
        </div>
        <DataTable columns={columns} data={payments} />
      </div>
    </div>
  );
};
