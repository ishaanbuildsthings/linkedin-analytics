import type { CompanyData, CompanyDailyMetrics, CompanyPost } from "./types";

function parseUSDate(dateStr: string): string {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function parseMetricsSheet(rows: unknown[][]): CompanyDailyMetrics[] {
  const results: CompanyDailyMetrics[] = [];
  // Row 0: description, Row 1: headers, Row 2+: data
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i] as (string | number)[];
    if (!row || !row[0]) continue;
    results.push({
      date: parseUSDate(String(row[0])),
      impressionsOrganic: Number(row[1]) || 0,
      impressionsSponsored: Number(row[2]) || 0,
      impressionsTotal: Number(row[3]) || 0,
      uniqueImpressions: Number(row[4]) || 0,
      clicksOrganic: Number(row[5]) || 0,
      clicksSponsored: Number(row[6]) || 0,
      clicksTotal: Number(row[7]) || 0,
      reactionsOrganic: Number(row[8]) || 0,
      reactionsSponsored: Number(row[9]) || 0,
      reactionsTotal: Number(row[10]) || 0,
      commentsOrganic: Number(row[11]) || 0,
      commentsSponsored: Number(row[12]) || 0,
      commentsTotal: Number(row[13]) || 0,
      repostsOrganic: Number(row[14]) || 0,
      repostsSponsored: Number(row[15]) || 0,
      repostsTotal: Number(row[16]) || 0,
      engagementRateOrganic: Number(row[17]) || 0,
      engagementRateSponsored: Number(row[18]) || 0,
      engagementRateTotal: Number(row[19]) || 0,
    });
  }
  return results;
}

function parsePostsSheet(rows: unknown[][]): CompanyPost[] {
  const posts: CompanyPost[] = [];
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i] as (string | number)[];
    if (!row || (!row[0] && !row[1])) continue;
    posts.push({
      title: String(row[0] || ""),
      url: String(row[1] || ""),
      postType: String(row[2] || ""),
      campaignName: String(row[3] || ""),
      postedBy: String(row[4] || ""),
      createdDate: parseUSDate(String(row[5] || "")),
      impressions: Number(row[9]) || 0,
      views: Number(row[10]) || 0,
      clicks: Number(row[12]) || 0,
      ctr: Number(row[13]) || 0,
      likes: Number(row[14]) || 0,
      comments: Number(row[15]) || 0,
      reposts: Number(row[16]) || 0,
      follows: Number(row[17]) || 0,
      engagementRate: Number(row[18]) || 0,
      contentType: String(row[19] || ""),
    });
  }
  return posts;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseCompanyXls(XLSX: any, buffer: ArrayBuffer): CompanyData {
  const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
  const toRows = (ws: unknown) =>
    XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];
  return {
    dailyMetrics: parseMetricsSheet(toRows(workbook.Sheets["Metrics"])),
    posts: parsePostsSheet(toRows(workbook.Sheets["All posts"])),
  };
}
