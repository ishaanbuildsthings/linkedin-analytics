"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import InfoTooltip from "@/components/ui/InfoTooltip";
import type { TopPost } from "@/lib/types";
import { formatNumber } from "@/lib/format";

interface TopPostsProps {
  posts: TopPost[];
}

type SortKey = "publishDate" | "impressions" | "engagements" | "engagementRate";
type SortDir = "asc" | "desc";

const medals = ["🥇", "🥈", "🥉"];
const DEFAULT_SHOW = 10;

function SortHeader({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = currentKey === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex w-full items-center gap-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
        active
          ? "font-semibold text-[var(--foreground)]"
          : "text-[var(--muted)] hover:text-[var(--foreground)]"
      } ${className}`}
    >
      {label}
      {active && (
        <span className="text-[9px]">{currentDir === "desc" ? "↓" : "↑"}</span>
      )}
    </button>
  );
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function TopPosts({ posts }: TopPostsProps) {
  const [sortKey, setSortKey] = useState<SortKey>("impressions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showAll, setShowAll] = useState(false);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const medalMap = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.impressions - a.impressions);
    const map = new Map<string, number>();
    sorted.slice(0, 3).forEach((p, i) => map.set(p.url, i));
    return map;
  }, [posts]);

  const sorted = useMemo(() => {
    const arr = [...posts];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "publishDate":
          cmp = a.publishDate.localeCompare(b.publishDate);
          break;
        case "impressions":
          cmp = a.impressions - b.impressions;
          break;
        case "engagements":
          cmp = a.engagements - b.engagements;
          break;
        case "engagementRate":
          cmp = a.engagementRate - b.engagementRate;
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return arr;
  }, [posts, sortKey, sortDir]);

  const visible = showAll ? sorted : sorted.slice(0, DEFAULT_SHOW);
  const hasMore = sorted.length > DEFAULT_SHOW;

  if (posts.length === 0) {
    return (
      <Card title="Top 50 Posts">
        <p className="text-sm text-[var(--muted)]">
          No posts found in this date range.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Top 50 Posts">
      <div className="overflow-x-clip">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-light)]">
              <th className="w-6 pb-2" />
              <th className="pb-2 pr-2 text-left">
                <SortHeader
                  label="Date"
                  sortKey="publishDate"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </th>
              <th className="pb-2 pr-2 text-left">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  Post
                </span>
              </th>
              <th className="pb-2 pr-2 text-right">
                <SortHeader
                  label="Impr."
                  sortKey="impressions"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                  className="justify-end"
                />
              </th>
              <th className="pb-2 pr-2 text-right">
                <div className="flex w-full items-center justify-end">
                  <SortHeader
                    label="Eng."
                    sortKey="engagements"
                    currentKey={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-auto justify-end"
                  />
                  <InfoTooltip text="Reactions, comments, shares, link clicks, and more" />
                </div>
              </th>
              <th className="pb-2 text-right">
                <SortHeader
                  label="Eng/Impr"
                  sortKey="engagementRate"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                  className="justify-end"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((post) => {
              const medalIdx = medalMap.get(post.url);
              const hasMedal = medalIdx !== undefined;
              return (
                <tr
                  key={post.url}
                  className="border-b border-[var(--border-light)] last:border-0"
                >
                  <td className="w-6 py-2 pr-1 text-center text-sm">
                    {hasMedal ? medals[medalIdx] : null}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2 font-mono text-[11px] text-[var(--muted)]">
                    {formatDateShort(post.publishDate)}
                  </td>
                  <td className="py-2 pr-2">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-[#0077B5] hover:underline"
                    >
                      Link
                    </a>
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2 text-right font-mono text-[11px]">
                    {post.impressions > 0
                      ? formatNumber(post.impressions)
                      : <span className="text-[var(--muted)]">—</span>}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2 text-right font-mono text-[11px]">
                    {formatNumber(post.engagements)}
                  </td>
                  <td className="whitespace-nowrap py-2 text-right font-mono text-[11px] text-[var(--muted)]">
                    {post.impressions > 0
                      ? `${((post.engagements / post.impressions) * 100).toFixed(1)}%`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 font-mono text-xs text-[var(--muted)] underline decoration-[var(--border-light)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
        >
          {showAll
            ? "Show less"
            : `View all ${sorted.length} posts`}
        </button>
      )}
    </Card>
  );
}
