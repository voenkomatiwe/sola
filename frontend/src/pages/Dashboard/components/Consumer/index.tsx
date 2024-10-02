import { CalendarClock, LucideDollarSign, Users } from "lucide-react";
import { useState } from "react";

import { InfoCard } from "@/components/InfoCard";
import { Calendar } from "@/components/ui/calendar";

import { Chart } from "./chart";

export const Consumer = () => {
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
      <div className="flex gap-4 justify-end">
        <Chart />
        <Calendar
          mode="multiple"
          selected={date}
          onSelect={setDate}
          className="rounded-md border h-fit"
        />
      </div>
    </div>
  );
};
