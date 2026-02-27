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
import { COLORS } from "@/lib/constants";
import { formatDateFull, makeTickFormatter, formatNumber } from "@/lib/format";
import type { CompanyDailyMetrics } from "@/lib/types";

interface Props {
  data: CompanyDailyMetrics[];
}

export default function EngagementBreakdownChart({ data }: Props) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        date: d.date,
        clicks: d.clicksTotal,
        reactions: d.reactionsTotal,
        comments: d.commentsTotal,
        reposts: d.repostsTotal,
      })),
    [data]
  );

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

  return (
    <Card title="Engagement Breakdown Over Time">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-[11px] text-[var(--muted)]">
        <p>
          <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.clicks }} />
          Clicks
        </p>
        <p>
          <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.reactions }} />
          Reactions
        </p>
        <p>
          <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.comments }} />
          Comments
        </p>
        <p>
          <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.reposts }} />
          Reposts
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              {[
                { id: "clicksFill", color: COLORS.clicks },
                { id: "reactionsFill", color: COLORS.reactions },
                { id: "commentsFill", color: COLORS.comments },
                { id: "repostsFill", color: COLORS.reposts },
              ].map((g) => (
                <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={g.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                </linearGradient>
              ))}
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
                String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
              contentStyle={{
                borderRadius: 0,
                border: `1px solid ${COLORS.border}`,
                fontSize: 12,
                fontFamily: "monospace",
                background: COLORS.surface,
              }}
            />
            <Area type="monotone" dataKey="clicks" stroke={COLORS.clicks} strokeWidth={2} fill="url(#clicksFill)" dot={false} isAnimationActive={false} stackId="eng" />
            <Area type="monotone" dataKey="reactions" stroke={COLORS.reactions} strokeWidth={2} fill="url(#reactionsFill)" dot={false} isAnimationActive={false} stackId="eng" />
            <Area type="monotone" dataKey="comments" stroke={COLORS.comments} strokeWidth={2} fill="url(#commentsFill)" dot={false} isAnimationActive={false} stackId="eng" />
            <Area type="monotone" dataKey="reposts" stroke={COLORS.reposts} strokeWidth={2} fill="url(#repostsFill)" dot={false} isAnimationActive={false} stackId="eng" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
