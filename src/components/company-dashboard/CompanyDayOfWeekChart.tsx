"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";

interface DayData {
  day: string;
  avgImpressions: number;
  avgClicks: number;
  avgReactions: number;
  avgComments: number;
}

function MiniBarChart({
  data,
  dataKey,
  color,
  label,
  tooltipLabel,
}: {
  data: DayData[];
  dataKey: string;
  color: string;
  label: string;
  tooltipLabel: string;
}) {
  return (
    <div className="border border-[var(--border-light)] bg-[var(--surface)] p-4">
      <p className="mb-2 font-mono text-[10px] font-medium text-[var(--muted)]">
        {label}
      </p>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              stroke={COLORS.gridLine}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: COLORS.muted }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: COLORS.muted }}
              tickFormatter={(v: number) => formatNumber(v)}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [
                Number(value).toLocaleString(),
                tooltipLabel,
              ]}
              contentStyle={{
                borderRadius: 0,
                border: `1px solid ${COLORS.border}`,
                fontSize: 11,
                fontFamily: "monospace",
                background: COLORS.surface,
              }}
            />
            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[0, 0, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function CompanyDayOfWeekChart({ data }: { data: DayData[] }) {
  if (data.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MiniBarChart
        data={data}
        dataKey="avgImpressions"
        color={COLORS.linkedin}
        label="Avg Impressions"
        tooltipLabel="Avg Impressions"
      />
      <MiniBarChart
        data={data}
        dataKey="avgClicks"
        color={COLORS.clicks}
        label="Avg Clicks"
        tooltipLabel="Avg Clicks"
      />
      <MiniBarChart
        data={data}
        dataKey="avgReactions"
        color={COLORS.reactions}
        label="Avg Reactions"
        tooltipLabel="Avg Reactions"
      />
      <MiniBarChart
        data={data}
        dataKey="avgComments"
        color={COLORS.comments}
        label="Avg Comments"
        tooltipLabel="Avg Comments"
      />
    </div>
  );
}
