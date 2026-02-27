"use client";

import { useMemo, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "@/components/ui/Card";
import ChartModeToggle from "@/components/ui/ChartModeToggle";
import { COLORS } from "@/lib/constants";
import { formatDateFull, makeTickFormatter, formatNumber } from "@/lib/format";
import type { CompanyDailyMetrics } from "@/lib/types";

interface Props {
  data: CompanyDailyMetrics[];
  cumulativeData: Array<{ date: string; impressions: number; clicks: number; reactions: number }>;
}

export default function CompanyImpressionsChart({ data, cumulativeData }: Props) {
  const [mode, setMode] = useState<"daily" | "cumulative">("daily");

  const chartData = useMemo(() => {
    if (mode === "cumulative") {
      return cumulativeData;
    }
    return data.map((d) => ({
      date: d.date,
      organic: d.impressionsOrganic,
      total: d.impressionsTotal,
    }));
  }, [data, cumulativeData, mode]);

  const tickFormatter = useMemo(
    () => makeTickFormatter(chartData),
    [chartData]
  );

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const tickInterval = Math.max(
    1,
    Math.floor(chartData.length / (isMobile ? 4 : 8))
  );

  const isCumulative = mode === "cumulative";

  return (
    <Card title="Impressions Over Time">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <ChartModeToggle mode={mode} onChange={setMode} />
        {!isCumulative && (
          <div className="flex items-center gap-4 text-[11px] text-[var(--muted)]">
            <p>
              <span
                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS.organic }}
              />
              Organic
            </p>
            <p>
              <span
                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS.clicks }}
              />
              Total
            </p>
          </div>
        )}
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="organicFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.organic} stopOpacity={0.1} />
                <stop offset="95%" stopColor={COLORS.organic} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="totalFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.clicks} stopOpacity={0.1} />
                <stop offset="95%" stopColor={COLORS.clicks} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COLORS.gridLine} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={tickFormatter}
              tick={{ fontSize: isMobile ? 9 : 11, fill: COLORS.muted }}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 9 : 11, fill: COLORS.muted }}
              tickFormatter={(v: number) => formatNumber(v)}
              width={isMobile ? 35 : 55}
            />
            <Tooltip
              labelFormatter={(label) => formatDateFull(String(label))}
              formatter={(value, name) => [
                Number(value).toLocaleString(),
                isCumulative
                  ? "Cum. " + String(name).charAt(0).toUpperCase() + String(name).slice(1)
                  : String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
              contentStyle={{
                borderRadius: 0,
                border: `1px solid ${COLORS.border}`,
                fontSize: 12,
                fontFamily: "monospace",
                background: COLORS.surface,
              }}
            />
            {isCumulative ? (
              <>
                <Legend />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stroke={COLORS.organic}
                  strokeWidth={2}
                  fill="url(#organicFill)"
                  dot={false}
                  isAnimationActive={false}
                />
              </>
            ) : (
              <>
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.clicks}
                  strokeWidth={2}
                  fill="url(#totalFill)"
                  dot={false}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="organic"
                  stroke={COLORS.organic}
                  strokeWidth={2}
                  fill="url(#organicFill)"
                  dot={false}
                  isAnimationActive={false}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
