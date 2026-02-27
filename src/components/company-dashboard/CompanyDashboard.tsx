"use client";

import { useMemo, useState } from "react";
import type { CompanyData, DateRange } from "@/lib/types";
import { computeCompanyStats } from "@/lib/compute-company-stats";
import { formatNumber } from "@/lib/format";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import CompanyImpressionsChart from "./CompanyImpressionsChart";
import EngagementBreakdownChart from "./EngagementBreakdownChart";
import EngagementPieChart from "./EngagementPieChart";
import AuthorTable from "./AuthorTable";
import ContentTypeCards from "./ContentTypeCards";
import CompanyDayOfWeekChart from "./CompanyDayOfWeekChart";
import CompanyPostsTable from "./CompanyPostsTable";
import TopDays from "@/components/dashboard/TopDays";
import StatCard from "@/components/ui/StatCard";

interface Props {
  data: CompanyData;
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
    case "custom":
      return "";
  }
  return now.toISOString().slice(0, 10);
}

function getAvailableRanges(dataDays: number): DateRange[] {
  const ranges: DateRange[] = [];
  if (dataDays >= 1) ranges.push("week");
  if (dataDays > 10) ranges.push("month");
  if (dataDays > 35) ranges.push("3months");
  if (dataDays > 100) ranges.push("year");
  return ranges;
}

function getBestDefault(dataDays: number): DateRange {
  if (dataDays > 100) return "3months";
  if (dataDays > 10) return "month";
  return "week";
}

export default function CompanyDashboard({ data }: Props) {
  const { dataDays, availableRanges, bestDefault, dataStartDate, dataEndDate } =
    useMemo(() => {
      const dates = data.dailyMetrics.map((d) => d.date).sort();
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
      return {
        dataDays: days,
        availableRanges: getAvailableRanges(days),
        bestDefault: getBestDefault(days),
        dataStartDate: start,
        dataEndDate: end,
      };
    }, [data]);

  const [dateRange, setDateRange] = useState<DateRange>(bestDefault);
  const [customStart, setCustomStart] = useState(dataStartDate);
  const [customEnd, setCustomEnd] = useState(dataEndDate);

  const handleCustomChange = (start: string, end: string) => {
    setCustomStart(start);
    setCustomEnd(end);
  };

  const { filteredData, stats } = useMemo(() => {
    let cutoffStart: string;
    let cutoffEnd: string;

    if (dateRange === "custom") {
      cutoffStart = customStart;
      cutoffEnd = customEnd;
    } else {
      cutoffStart = getDateCutoff(dateRange);
      cutoffEnd = "9999-12-31";
    }

    const filteredMetrics = data.dailyMetrics.filter(
      (d) => d.date >= cutoffStart && d.date <= cutoffEnd
    );
    const filteredPosts = data.posts.filter(
      (p) => p.createdDate >= cutoffStart && p.createdDate <= cutoffEnd
    );

    const filtered: CompanyData = {
      dailyMetrics: filteredMetrics,
      posts: filteredPosts,
    };

    return {
      filteredData: filtered,
      stats: computeCompanyStats(filtered),
    };
  }, [data, dateRange, customStart, customEnd]);

  return (
    <div className="animate-fade-in-up space-y-8">
      <DateRangeSelector
        value={dateRange}
        onChange={setDateRange}
        availableRanges={availableRanges}
        dataDays={dataDays}
        customStart={customStart}
        customEnd={customEnd}
        onCustomChange={handleCustomChange}
        dataStartDate={dataStartDate}
        dataEndDate={dataEndDate}
      />

      {/* ── Impressions ── */}
      <section className="space-y-3">
        <SectionLabel>Impressions</SectionLabel>
        <CompanyImpressionsChart
          data={filteredData.dailyMetrics}
          cumulativeData={stats.cumulativeMetrics}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Total impressions"
            value={formatNumber(stats.totalImpressions)}
          />
          <StatCard
            label="Organic impressions"
            value={formatNumber(stats.totalImpressionsOrganic)}
          />
          <StatCard
            label="Avg daily impressions"
            value={formatNumber(stats.avgDailyImpressions)}
          />
          <StatCard
            label="Avg post impressions"
            value={formatNumber(stats.avgPostImpressions)}
          />
          <StatCard
            label="Unique impr. ratio"
            value={`${(stats.uniqueImpressionRatio * 100).toFixed(1)}%`}
            tooltip="Unique impressions / Total impressions — shows how many unique people see your content"
          />
        </div>
        <TopDays
          title="Best Days — Impressions"
          days={stats.topDays.impressions}
        />
      </section>

      {/* ── Engagement ── */}
      <section className="space-y-3">
        <SectionLabel>Engagement</SectionLabel>
        <EngagementBreakdownChart data={filteredData.dailyMetrics} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Total clicks"
            value={formatNumber(stats.totalClicks)}
          />
          <StatCard
            label="Total reactions"
            value={formatNumber(stats.totalReactions)}
          />
          <StatCard
            label="Total comments"
            value={formatNumber(stats.totalComments)}
          />
          <StatCard
            label="Total reposts"
            value={formatNumber(stats.totalReposts)}
          />
          <StatCard
            label="Avg engagement rate"
            value={`${(stats.avgEngagementRate * 100).toFixed(2)}%`}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <EngagementPieChart breakdown={stats.engagementBreakdown} />
          <TopDays
            title="Best Days — Clicks"
            days={stats.topDays.clicks}
          />
        </div>
      </section>

      {/* ── Author Performance ── */}
      {stats.authorStats.length > 1 && (
        <section className="space-y-3">
          <SectionLabel>Author Performance</SectionLabel>
          <AuthorTable authors={stats.authorStats} />
        </section>
      )}

      {/* ── Content Type ── */}
      {stats.contentTypeStats.length > 1 && (
        <section className="space-y-3">
          <SectionLabel>Content Type</SectionLabel>
          <ContentTypeCards stats={stats.contentTypeStats} />
        </section>
      )}

      {/* ── Day of Week ── */}
      <section className="space-y-3">
        <SectionLabel>Performance by Day of Week</SectionLabel>
        <CompanyDayOfWeekChart data={stats.dayOfWeekBreakdown} />
      </section>

      {/* ── Posts Table ── */}
      <CompanyPostsTable posts={filteredData.posts} />
    </div>
  );
}
