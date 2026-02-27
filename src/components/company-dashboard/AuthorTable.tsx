"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import type { AuthorStats } from "@/lib/types";
import { formatNumber } from "@/lib/format";

type SortKey = "name" | "postCount" | "avgImpressions" | "avgCTR" | "avgEngagementRate";
type SortDir = "asc" | "desc";

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

export default function AuthorTable({ authors }: { authors: AuthorStats[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("avgImpressions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    const arr = [...authors];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "postCount":
          cmp = a.postCount - b.postCount;
          break;
        case "avgImpressions":
          cmp = a.avgImpressions - b.avgImpressions;
          break;
        case "avgCTR":
          cmp = a.avgCTR - b.avgCTR;
          break;
        case "avgEngagementRate":
          cmp = a.avgEngagementRate - b.avgEngagementRate;
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return arr;
  }, [authors, sortKey, sortDir]);

  if (authors.length === 0) return null;

  return (
    <Card title="Author Performance">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-light)]">
              <th className="pb-2 pr-4 text-left">
                <SortHeader label="Author" sortKey="name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              </th>
              <th className="pb-2 pr-4 text-right">
                <SortHeader label="Posts" sortKey="postCount" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="justify-end" />
              </th>
              <th className="pb-2 pr-4 text-right">
                <SortHeader label="Avg Impr." sortKey="avgImpressions" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="justify-end" />
              </th>
              <th className="pb-2 pr-4 text-right">
                <SortHeader label="Avg CTR" sortKey="avgCTR" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="justify-end" />
              </th>
              <th className="pb-2 text-right">
                <SortHeader label="Avg Eng %" sortKey="avgEngagementRate" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="justify-end" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((author) => (
              <tr key={author.name} className="border-b border-[var(--border-light)] last:border-0">
                <td className="py-2 pr-4 font-mono text-[11px]">{author.name}</td>
                <td className="py-2 pr-4 text-right font-mono text-[11px]">{author.postCount}</td>
                <td className="py-2 pr-4 text-right font-mono text-[11px]">{formatNumber(author.avgImpressions)}</td>
                <td className="py-2 pr-4 text-right font-mono text-[11px]">{(author.avgCTR * 100).toFixed(2)}%</td>
                <td className="py-2 text-right font-mono text-[11px]">{(author.avgEngagementRate * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
