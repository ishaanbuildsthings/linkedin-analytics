"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import type { CompanyPost } from "@/lib/types";
import { formatNumber } from "@/lib/format";

type SortKey = "createdDate" | "impressions" | "clicks" | "ctr" | "engagementRate";
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
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function truncate(s: string, len: number): string {
  return s.length > len ? s.slice(0, len) + "…" : s;
}

export default function CompanyPostsTable({ posts }: { posts: CompanyPost[] }) {
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
        case "createdDate":
          cmp = a.createdDate.localeCompare(b.createdDate);
          break;
        case "impressions":
          cmp = a.impressions - b.impressions;
          break;
        case "clicks":
          cmp = a.clicks - b.clicks;
          break;
        case "ctr":
          cmp = a.ctr - b.ctr;
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
      <Card title="All Posts">
        <p className="text-sm text-[var(--muted)]">No posts found in this date range.</p>
      </Card>
    );
  }

  return (
    <Card title="All Posts">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-light)]">
              <th className="w-6 pb-2" />
              <th className="pb-2 pr-2 text-left">
                <SortHeader label="Date" sortKey="createdDate" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              </th>
              <th className="pb-2 pr-2 text-left">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">Title</span>
              </th>
              <th className="hidden pb-2 pr-2 text-left sm:table-cell">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">Author</span>
              </th>
              <th className="pb-2 pr-2 text-right">
                <SortHeader label="Impr." sortKey="impressions" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="justify-end" />
              </th>
              <th className="pb-2 pr-2 text-right">
                <SortHeader label="Clicks" sortKey="clicks" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="justify-end" />
              </th>
              <th className="pb-2 pr-2 text-right">
                <SortHeader label="CTR" sortKey="ctr" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="justify-end" />
              </th>
              <th className="pb-2 text-right">
                <SortHeader label="Eng %" sortKey="engagementRate" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="justify-end" />
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((post, idx) => {
              const medalIdx = medalMap.get(post.url);
              const hasMedal = medalIdx !== undefined;
              return (
                <tr key={post.url + idx} className="border-b border-[var(--border-light)] last:border-0">
                  <td className="w-6 py-2 pr-1 text-center text-sm">
                    {hasMedal ? medals[medalIdx] : null}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2 font-mono text-[11px] text-[var(--muted)]">
                    {formatDateShort(post.createdDate)}
                  </td>
                  <td className="max-w-[200px] py-2 pr-2">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-[#0077B5] hover:underline"
                      title={post.title}
                    >
                      {post.title ? truncate(post.title, 40) : "Link"}
                    </a>
                  </td>
                  <td className="hidden whitespace-nowrap py-2 pr-2 font-mono text-[11px] text-[var(--muted)] sm:table-cell">
                    {post.postedBy.split(" ")[0]}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2 text-right font-mono text-[11px]">
                    {post.impressions > 0 ? formatNumber(post.impressions) : <span className="text-[var(--muted)]">—</span>}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2 text-right font-mono text-[11px]">
                    {post.clicks > 0 ? formatNumber(post.clicks) : <span className="text-[var(--muted)]">—</span>}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2 text-right font-mono text-[11px] text-[var(--muted)]">
                    {post.ctr > 0 ? `${(post.ctr * 100).toFixed(2)}%` : "—"}
                  </td>
                  <td className="whitespace-nowrap py-2 text-right font-mono text-[11px] text-[var(--muted)]">
                    {post.engagementRate > 0 ? `${(post.engagementRate * 100).toFixed(2)}%` : "—"}
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
          {showAll ? "Show less" : `View all ${sorted.length} posts`}
        </button>
      )}
    </Card>
  );
}
