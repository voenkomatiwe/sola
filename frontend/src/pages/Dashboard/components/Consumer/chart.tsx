import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Rozetka", desktop: 186 },
  { month: "Youtube", desktop: 305 },
  { month: "Apple Music", desktop: 237 },
  { month: "Discord", desktop: 73 },
  { month: "Chat GPT", desktop: 4 },
];

const chartConfig = {
  desktop: {
    label: "Money",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export const Chart = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">
          Most money is spent on subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
