import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useConsumer } from "@/hooks/store/useConsumer";

const chartConfig = {
  value: {
    label: "Money",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export const Chart = () => {
  const totalExpenses = useConsumer((store) => store.totalExpenses);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">Most Total Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={totalExpenses}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="provider"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* //TODO: add fill */}
            <Bar dataKey="value" radius={8}>
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
