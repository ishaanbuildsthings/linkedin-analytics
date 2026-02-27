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
} from "recharts";
import Card from "@/components/ui/Card";
import ChartModeToggle from "@/components/ui/ChartModeToggle";
import { COLORS } from "@/lib/constants";
import { formatDateFull, makeTickFormatter, formatNumber } from "@/lib/format";

interface FollowerChartProps {
  data: Array<{ date: string; followers: number }>;
  dailyData: Array<{ date: string; followers: number }>;
  postDateMap: Map<string, string>;
  topPostRanks: Map<string, { rank: number; impressions: number; url: string }>;
}

const RANK_COLORS = [COLORS.gold, COLORS.silver, COLORS.bronze];

function PostDot(props: {
  cx?: number;
  cy?: number;
  payload?: { date: string; followers: number };
  postDateMap: Map<string, string>;
  topPostRanks: Map<string, { rank: number; impressions: number; url: string }>;
}) {
  const { cx, cy, payload, postDateMap, topPostRanks } = props;
  if (!cx || !cy || !payload) return null;
  const url = postDateMap.get(payload.date);
  if (!url) return null;

  const medal = topPostRanks.get(payload.date);
  const fill = medal != null ? RANK_COLORS[medal.rank] : COLORS.red;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={medal != null ? 7 : 5}
      fill={fill}
      stroke="#fff"
      strokeWidth={2}
      style={{ cursor: "pointer" }}
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    />
  );
}

export default function FollowerChart({
  data,
  dailyData,
  postDateMap,
  topPostRanks,
}: FollowerChartProps) {
  const [mode, setMode] = useState<"daily" | "cumulative">("daily");

  const chartData = mode === "daily" ? dailyData : data;
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

  if (data.length === 0) return null;

  const isCumulative = mode === "cumulative";

  return (
    <Card title="Follower Growth">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <ChartModeToggle mode={mode} onChange={setMode} />
        {postDateMap.size > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--muted)]">
            <p>
              <span
                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS.red }}
              />
              Post published (click to view)
            </p>
            <p className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.gold }} />
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.silver }} />
              <span className="mr-0.5 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.bronze }} />
              Top 3 posts by impressions
            </p>
          </div>
        )}
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id="followerFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={COLORS.green}
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.green}
                  stopOpacity={0}
                />
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
              width={isMobile ? 35 : 50}
            />
            <Tooltip
              labelFormatter={(label) => formatDateFull(String(label))}
              formatter={(value) => [
                Number(value).toLocaleString(),
                isCumulative ? "Total Followers" : "New Followers",
              ]}
              contentStyle={{
                borderRadius: 0,
                border: `1px solid ${COLORS.border}`,
                fontSize: 12,
                fontFamily: "monospace",
                background: COLORS.surface,
              }}
            />
            <Area
              type="monotone"
              dataKey="followers"
              stroke={COLORS.green}
              strokeWidth={2}
              fill="url(#followerFill)"
              dot={(dotProps) => (
                <PostDot
                  key={dotProps.payload?.date}
                  {...dotProps}
                  postDateMap={postDateMap}
                  topPostRanks={topPostRanks}
                />
              )}
              activeDot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
