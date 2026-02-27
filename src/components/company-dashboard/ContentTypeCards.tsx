import Card from "@/components/ui/Card";
import { formatNumber } from "@/lib/format";

interface ContentTypeStat {
  type: string;
  postCount: number;
  avgImpressions: number;
  avgCTR: number;
  avgEngagementRate: number;
}

export default function ContentTypeCards({ stats }: { stats: ContentTypeStat[] }) {
  if (stats.length < 2) return null;

  return (
    <Card title="Content Type Comparison">
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((s) => (
          <div
            key={s.type}
            className="border border-[var(--border-light)] bg-[var(--background)] p-4"
          >
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-wider">
              {s.type || "Text"}{" "}
              <span className="font-normal text-[var(--muted)]">
                ({s.postCount} post{s.postCount !== 1 ? "s" : ""})
              </span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] text-[var(--muted)]">Avg Impr.</p>
                <p className="font-mono text-sm font-semibold">
                  {formatNumber(s.avgImpressions)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--muted)]">Avg CTR</p>
                <p className="font-mono text-sm font-semibold">
                  {(s.avgCTR * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--muted)]">Avg Eng %</p>
                <p className="font-mono text-sm font-semibold">
                  {(s.avgEngagementRate * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
