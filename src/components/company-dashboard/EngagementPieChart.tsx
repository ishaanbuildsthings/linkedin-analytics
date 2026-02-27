"use client";

import Card from "@/components/ui/Card";
import { COLORS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";

interface Props {
  breakdown: {
    clicks: number;
    reactions: number;
    comments: number;
    reposts: number;
  };
}

const items: { key: keyof Props["breakdown"]; label: string; color: string }[] = [
  { key: "clicks", label: "Clicks", color: COLORS.clicks },
  { key: "reactions", label: "Reactions", color: COLORS.reactions },
  { key: "comments", label: "Comments", color: COLORS.comments },
  { key: "reposts", label: "Reposts", color: COLORS.reposts },
];

export default function EngagementPieChart({ breakdown }: Props) {
  const total = breakdown.clicks + breakdown.reactions + breakdown.comments + breakdown.reposts;
  if (total === 0) return null;

  return (
    <Card title="Engagement Mix">
      <div className="space-y-3">
        {items.map((item) => {
          const value = breakdown[item.key];
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={item.key}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-mono text-[11px]">{item.label}</span>
                </div>
                <span className="font-mono text-[11px] text-[var(--muted)]">
                  {formatNumber(value)} ({pct.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden bg-[var(--border-light)]">
                <div
                  className="h-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
