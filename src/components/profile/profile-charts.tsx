"use client";

import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type MonthDatum = { month: string; posts: number };
export type KindDatum = {
  kind: string;
  label: string;
  count: number;
  fill: string;
};

const monthConfig = {
  posts: { label: "โพสต์", color: "var(--primary)" },
} satisfies ChartConfig;

export function PostsPerMonthChart({ data }: { data: MonthDatum[] }) {
  return (
    <ChartContainer config={monthConfig} className="h-40 w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="posts" fill="var(--color-posts)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}

export function PostKindChart({ data }: { data: KindDatum[] }) {
  const config = Object.fromEntries([
    ["count", { label: "โพสต์" }],
    ...data.map((d) => [d.kind, { label: d.label, color: d.fill }]),
  ]) satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="mx-auto h-44 w-full">
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={<ChartTooltipContent hideLabel nameKey="kind" />}
        />
        <Pie
          data={data.map((d) => ({ ...d, fill: `var(--color-${d.kind})` }))}
          dataKey="count"
          nameKey="kind"
          stroke="var(--card)"
          strokeWidth={2}
        />
        <ChartLegend content={<ChartLegendContent nameKey="kind" />} />
      </PieChart>
    </ChartContainer>
  );
}
