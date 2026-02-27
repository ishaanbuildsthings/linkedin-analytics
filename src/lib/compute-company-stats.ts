import type { CompanyData, CompanyComputedStats, TopDay, AuthorStats } from "./types";

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function computeCompanyStats(data: CompanyData): CompanyComputedStats {
  const metrics = data.dailyMetrics;
  const posts = data.posts;
  const dayCount = metrics.length || 1;

  // Totals
  let totalImpressions = 0, totalOrganic = 0, totalSponsored = 0;
  let totalUnique = 0, totalClicks = 0, totalReactions = 0;
  let totalComments = 0, totalReposts = 0;

  for (const d of metrics) {
    totalImpressions += d.impressionsTotal;
    totalOrganic += d.impressionsOrganic;
    totalSponsored += d.impressionsSponsored;
    totalUnique += d.uniqueImpressions;
    totalClicks += d.clicksTotal;
    totalReactions += d.reactionsTotal;
    totalComments += d.commentsTotal;
    totalReposts += d.repostsTotal;
  }

  // Post stats
  const postImpressions = posts.map((p) => p.impressions).filter((n) => n > 0);
  const postCTRs = posts.map((p) => p.ctr).filter((n) => n > 0);
  const engRates = metrics.map((d) => d.engagementRateTotal).filter((n) => n > 0);

  // Author stats
  const authorMap = new Map<string, { posts: number; impressions: number; clicks: number; ctrs: number[]; engRates: number[] }>();
  for (const p of posts) {
    const name = p.postedBy || "Unknown";
    const existing = authorMap.get(name) || { posts: 0, impressions: 0, clicks: 0, ctrs: [], engRates: [] };
    existing.posts++;
    existing.impressions += p.impressions;
    existing.clicks += p.clicks;
    if (p.ctr > 0) existing.ctrs.push(p.ctr);
    if (p.engagementRate > 0) existing.engRates.push(p.engagementRate);
    authorMap.set(name, existing);
  }
  const authorStats: AuthorStats[] = Array.from(authorMap.entries())
    .map(([name, s]) => ({
      name,
      postCount: s.posts,
      totalImpressions: s.impressions,
      totalClicks: s.clicks,
      avgImpressions: Math.round(s.impressions / s.posts),
      avgCTR: s.ctrs.length > 0 ? s.ctrs.reduce((a, b) => a + b, 0) / s.ctrs.length : 0,
      avgEngagementRate: s.engRates.length > 0 ? s.engRates.reduce((a, b) => a + b, 0) / s.engRates.length : 0,
    }))
    .sort((a, b) => b.totalImpressions - a.totalImpressions);

  // Content type stats
  const typeMap = new Map<string, { count: number; impressions: number; ctrs: number[]; engRates: number[] }>();
  for (const p of posts) {
    const type = p.contentType || "Text";
    const existing = typeMap.get(type) || { count: 0, impressions: 0, ctrs: [], engRates: [] };
    existing.count++;
    existing.impressions += p.impressions;
    if (p.ctr > 0) existing.ctrs.push(p.ctr);
    if (p.engagementRate > 0) existing.engRates.push(p.engagementRate);
    typeMap.set(type, existing);
  }
  const contentTypeStats = Array.from(typeMap.entries())
    .map(([type, s]) => ({
      type,
      postCount: s.count,
      avgImpressions: Math.round(s.impressions / s.count),
      avgCTR: s.ctrs.length > 0 ? s.ctrs.reduce((a, b) => a + b, 0) / s.ctrs.length : 0,
      avgEngagementRate: s.engRates.length > 0 ? s.engRates.reduce((a, b) => a + b, 0) / s.engRates.length : 0,
    }))
    .sort((a, b) => b.avgImpressions - a.avgImpressions);

  // Cumulative metrics
  const sorted = [...metrics].sort((a, b) => a.date.localeCompare(b.date));
  let cumImpr = 0, cumClicks = 0, cumReactions = 0;
  const cumulativeMetrics = sorted.map((d) => {
    cumImpr += d.impressionsTotal;
    cumClicks += d.clicksTotal;
    cumReactions += d.reactionsTotal;
    return { date: d.date, impressions: cumImpr, clicks: cumClicks, reactions: cumReactions };
  });

  // Day of week breakdown
  const dowStats = new Map<number, { impr: number; clicks: number; reactions: number; comments: number; count: number }>();
  for (const d of metrics) {
    const dow = new Date(d.date + "T00:00:00").getDay();
    const existing = dowStats.get(dow) || { impr: 0, clicks: 0, reactions: 0, comments: 0, count: 0 };
    existing.impr += d.impressionsTotal;
    existing.clicks += d.clicksTotal;
    existing.reactions += d.reactionsTotal;
    existing.comments += d.commentsTotal;
    existing.count++;
    dowStats.set(dow, existing);
  }
  const dayOfWeekBreakdown = [0, 1, 2, 3, 4, 5, 6].map((dow) => {
    const s = dowStats.get(dow);
    const c = s?.count || 1;
    return {
      day: DAY_NAMES[dow],
      avgImpressions: Math.round((s?.impr || 0) / c),
      avgClicks: Math.round((s?.clicks || 0) / c),
      avgReactions: Math.round((s?.reactions || 0) / c),
      avgComments: Math.round((s?.comments || 0) / c),
    };
  });

  // Top days
  const topImprDays: TopDay[] = [...metrics]
    .sort((a, b) => b.impressionsTotal - a.impressionsTotal)
    .slice(0, 3)
    .map((d) => ({ date: d.date, value: d.impressionsTotal, label: "impressions" }));

  const topClickDays: TopDay[] = [...metrics]
    .sort((a, b) => b.clicksTotal - a.clicksTotal)
    .slice(0, 3)
    .map((d) => ({ date: d.date, value: d.clicksTotal, label: "clicks" }));

  const weekSpan = dayCount / 7;

  return {
    totalImpressions: totalImpressions,
    totalImpressionsOrganic: totalOrganic,
    totalImpressionsSponsored: totalSponsored,
    totalUniqueImpressions: totalUnique,
    totalClicks,
    totalReactions,
    totalComments,
    totalReposts,
    avgDailyImpressions: Math.round(totalImpressions / dayCount),
    avgDailyClicks: Math.round(totalClicks / dayCount),
    avgEngagementRate: engRates.length > 0 ? engRates.reduce((a, b) => a + b, 0) / engRates.length : 0,
    avgPostImpressions: Math.round(postImpressions.reduce((s, n) => s + n, 0) / (postImpressions.length || 1)),
    avgPostCTR: postCTRs.length > 0 ? postCTRs.reduce((a, b) => a + b, 0) / postCTRs.length : 0,
    medianPostImpressions: median(postImpressions),
    uniqueImpressionRatio: totalImpressions > 0 ? totalUnique / totalImpressions : 0,
    authorStats,
    contentTypeStats,
    cumulativeMetrics,
    engagementBreakdown: { clicks: totalClicks, reactions: totalReactions, comments: totalComments, reposts: totalReposts },
    topDays: { impressions: topImprDays, clicks: topClickDays },
    dayOfWeekBreakdown,
    postsPerWeek: weekSpan > 0 ? posts.length / weekSpan : posts.length,
  };
}
