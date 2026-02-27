"use client";

import { useMemo, useState } from "react";
import type { LinkedInData, DateRange } from "@/lib/types";
import { computeStats } from "@/lib/compute-stats";
import { formatNumber } from "@/lib/format";
import DateRangeSelector from "./DateRangeSelector";
import EngagementChart from "./EngagementChart";
import FollowerChart from "./FollowerChart";
import TopPosts from "./TopPosts";
import TopDays from "./TopDays";
import DayOfWeekChart from "./DayOfWeekChart";
import StatCard from "@/components/ui/StatCard";

interface DashboardProps {
  data: LinkedInData;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
      {children}
    </h2>
  );
}

function getDateCutoff(range: DateRange): string {
  const now = new Date();
  switch (range) {
    case "week":
      now.setDate(now.getDate() - 7);
      break;
    case "month":
      now.setMonth(now.getMonth() - 1);
      break;
    case "3months":
      now.setMonth(now.getMonth() - 3);
      break;
    case "year":
      now.setFullYear(now.getFullYear() - 1);
      break;
  }
  return now.toISOString().slice(0, 10);
}

/** Determine which date range toggles are meaningful given the actual data span */
function getAvailableRanges(dataDays: number): DateRange[] {
  const ranges: DateRange[] = [];
  if (dataDays >= 1) ranges.push("week");
  if (dataDays > 10) ranges.push("month");
  if (dataDays > 35) ranges.push("3months");
  if (dataDays > 100) ranges.push("year");
  return ranges;
}

/** Pick the best default range for the data span */
function getBestDefault(dataDays: number): DateRange {
  if (dataDays > 10) return "month";
  return "week";
}

export default function Dashboard({ data }: DashboardProps) {
  // Compute the actual data span
  const { dataDays, availableRanges, bestDefault } = useMemo(() => {
    const dates = data.dailyEngagement.map((d) => d.date).sort();
    const start = dates[0] || "";
    const end = dates[dates.length - 1] || "";
    const days =
      dates.length > 1
        ? Math.round(
            (new Date(end + "T00:00:00").getTime() -
              new Date(start + "T00:00:00").getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : dates.length;
    const available = getAvailableRanges(days);
    return {
      dataDays: days,
      availableRanges: available,
      bestDefault: getBestDefault(days),
    };
  }, [data]);

  const [dateRange, setDateRange] = useState<DateRange>(bestDefault);

  const { filteredData, filteredStats, postDateMap, topPostRanks } = useMemo(() => {
    const cutoff = getDateCutoff(dateRange);

    const filteredEngagement = data.dailyEngagement.filter(
      (d) => d.date >= cutoff
    );
    const filteredFollowers = data.dailyFollowers.filter(
      (d) => d.date >= cutoff
    );
    const filteredPosts = data.topPosts.filter(
      (p) => p.publishDate >= cutoff
    );

    const filtered: LinkedInData = {
      ...data,
      dailyEngagement: filteredEngagement,
      dailyFollowers: filteredFollowers,
      topPosts: filteredPosts,
      overall: {
        ...data.overall,
        totalImpressions: filteredEngagement.reduce(
          (s, d) => s + d.impressions,
          0
        ),
      },
    };

    const stats = computeStats(filtered);

    // Build date → postUrl map for clickable chart dots
    const dateMap = new Map<string, string>();
    for (const post of filteredPosts) {
      dateMap.set(post.publishDate, post.url);
    }

    // Top 3 posts by impressions → date → { rank, impressions, url }
    const topPostRanks = new Map<
      string,
      { rank: number; impressions: number; url: string }
    >();
    const sorted = [...filteredPosts]
      .filter((p) => p.impressions > 0)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 3);
    sorted.forEach((p, i) => {
      topPostRanks.set(p.publishDate, {
        rank: i,
        impressions: p.impressions,
        url: p.url,
      });
    });

    return {
      filteredData: filtered,
      filteredStats: stats,
      postDateMap: dateMap,
      topPostRanks,
    };
  }, [data, dateRange]);

  return (
    <div className="animate-fade-in-up space-y-8">
      <DateRangeSelector
        value={dateRange}
        onChange={setDateRange}
        availableRanges={availableRanges}
        dataDays={dataDays}
      />

      {/* ── Impressions & Engagements ── */}
      <section className="space-y-3">
        <SectionLabel>Impressions &amp; Engagements</SectionLabel>
        <EngagementChart
          data={filteredData.dailyEngagement}
          cumulativeData={filteredStats.cumulativeEngagement}
          postDateMap={postDateMap}
          topPostRanks={topPostRanks}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Avg post impressions"
            value={formatNumber(filteredStats.avgPostImpressions)}
          />
          <StatCard
            label="Avg post engagements"
            value={formatNumber(filteredStats.avgPostEngagements)}
            tooltip="Reactions, comments, shares, link clicks, and more"
          />
          <StatCard
            label="Median post impressions"
            value={formatNumber(filteredStats.medianPostImpressions)}
          />
          <StatCard
            label="Median post engagements"
            value={formatNumber(filteredStats.medianPostEngagements)}
            tooltip="Reactions, comments, shares, link clicks, and more"
          />
          <StatCard
            label="Avg daily impressions"
            value={formatNumber(filteredStats.avgDailyImpressions)}
          />
        </div>
        <TopDays
          title="Best Days — Impressions"
          days={filteredStats.topDays.impressions}
        />
      </section>

      {/* ── Followers ── */}
      <section className="space-y-3">
        <SectionLabel>Followers</SectionLabel>
        <FollowerChart
          data={filteredStats.cumulativeFollowers}
          dailyData={filteredStats.dailyNewFollowers}
          postDateMap={postDateMap}
          topPostRanks={topPostRanks}
        />
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Follower growth / day"
            value={`+${filteredStats.followerGrowthRate.toFixed(1)}`}
          />
          <StatCard
            label="Posts / week"
            value={filteredStats.postsPerWeek.toFixed(1)}
          />
        </div>
        <TopDays
          title="Best Days — Follower Growth"
          days={filteredStats.topDays.followers}
        />
      </section>

      {/* ── Performance by Day of Week ── */}
      <section className="space-y-3">
        <SectionLabel>Performance by Day of Week</SectionLabel>
        <DayOfWeekChart data={filteredStats.dayOfWeekBreakdown} />
      </section>

      {/* ── Top 50 Posts ── */}
      <TopPosts posts={filteredData.topPosts} />
    </div>
  );
}
