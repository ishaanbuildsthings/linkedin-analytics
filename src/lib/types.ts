export interface DailyEngagement {
  date: string; // YYYY-MM-DD
  impressions: number;
  engagements: number;
}

export interface DailyFollowers {
  date: string; // YYYY-MM-DD
  newFollowers: number;
}

export interface TopPost {
  url: string;
  publishDate: string; // YYYY-MM-DD
  impressions: number;
  engagements: number;
  engagementRate: number;
}

export interface DemographicEntry {
  value: string;
  percentage: number;
}

export interface Demographics {
  jobTitles: DemographicEntry[];
  locations: DemographicEntry[];
  industries: DemographicEntry[];
  seniority: DemographicEntry[];
  companySize: DemographicEntry[];
}

export interface OverallStats {
  dateRange: string;
  totalImpressions: number;
  membersReached: number;
}

export interface LinkedInData {
  overall: OverallStats;
  dailyEngagement: DailyEngagement[];
  topPosts: TopPost[];
  totalFollowers: number;
  dailyFollowers: DailyFollowers[];
  demographics: Demographics;
}

export interface TopDay {
  date: string;
  value: number;
  label: string;
}

export interface ComputedStats {
  totalImpressions: number;
  membersReached: number;
  totalFollowers: number;
  totalEngagements: number;
  medianPostImpressions: number;
  medianPostEngagements: number;
  avgPostImpressions: number;
  avgPostEngagements: number;
  medianEngagementRate: number;
  avgDailyImpressions: number;
  followerGrowthRate: number;
  cumulativeFollowers: Array<{ date: string; followers: number }>;
  cumulativeEngagement: Array<{
    date: string;
    impressions: number;
    engagements: number;
  }>;
  dailyNewFollowers: Array<{ date: string; followers: number }>;
  postsPerWeek: number;
  bestDayOfWeek: string;
  topDays: {
    impressions: TopDay[];
    followers: TopDay[];
  };
  dayOfWeekBreakdown: Array<{
    day: string;
    avgImpressions: number;
    avgEngagements: number;
    avgNewFollowers: number;
  }>;
}

export type DateRange = "week" | "month" | "3months" | "year" | "custom";

// --- Company Page Analytics Types ---

export interface CompanyDailyMetrics {
  date: string;
  impressionsOrganic: number;
  impressionsSponsored: number;
  impressionsTotal: number;
  uniqueImpressions: number;
  clicksOrganic: number;
  clicksSponsored: number;
  clicksTotal: number;
  reactionsOrganic: number;
  reactionsSponsored: number;
  reactionsTotal: number;
  commentsOrganic: number;
  commentsSponsored: number;
  commentsTotal: number;
  repostsOrganic: number;
  repostsSponsored: number;
  repostsTotal: number;
  engagementRateOrganic: number;
  engagementRateSponsored: number;
  engagementRateTotal: number;
}

export interface CompanyPost {
  title: string;
  url: string;
  postType: string;
  campaignName: string;
  postedBy: string;
  createdDate: string;
  impressions: number;
  views: number;
  clicks: number;
  ctr: number;
  likes: number;
  comments: number;
  reposts: number;
  follows: number;
  engagementRate: number;
  contentType: string;
}

export interface CompanyData {
  dailyMetrics: CompanyDailyMetrics[];
  posts: CompanyPost[];
}

export interface AuthorStats {
  name: string;
  postCount: number;
  totalImpressions: number;
  totalClicks: number;
  avgImpressions: number;
  avgCTR: number;
  avgEngagementRate: number;
}

export interface CompanyComputedStats {
  totalImpressions: number;
  totalImpressionsOrganic: number;
  totalImpressionsSponsored: number;
  totalUniqueImpressions: number;
  totalClicks: number;
  totalReactions: number;
  totalComments: number;
  totalReposts: number;
  avgDailyImpressions: number;
  avgDailyClicks: number;
  avgEngagementRate: number;
  avgPostImpressions: number;
  avgPostCTR: number;
  medianPostImpressions: number;
  uniqueImpressionRatio: number;
  authorStats: AuthorStats[];
  contentTypeStats: Array<{
    type: string;
    postCount: number;
    avgImpressions: number;
    avgCTR: number;
    avgEngagementRate: number;
  }>;
  cumulativeMetrics: Array<{
    date: string;
    impressions: number;
    clicks: number;
    reactions: number;
  }>;
  engagementBreakdown: {
    clicks: number;
    reactions: number;
    comments: number;
    reposts: number;
  };
  topDays: {
    impressions: TopDay[];
    clicks: TopDay[];
  };
  dayOfWeekBreakdown: Array<{
    day: string;
    avgImpressions: number;
    avgClicks: number;
    avgReactions: number;
    avgComments: number;
  }>;
  postsPerWeek: number;
}

export type UploadResult =
  | { type: "creator"; data: LinkedInData }
  | { type: "company"; data: CompanyData };
