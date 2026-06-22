/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActiveView {
  Dashboard = "dashboard",
  // SEO
  KeywordOverview = "keyword-overview",
  KeywordResearch = "keyword-research",
  KeywordMagicTool = "keyword-magic-tool",
  KeywordGap = "keyword-gap",
  PositionTracking = "position-tracking",
  // Competitor Research
  DomainOverview = "domain-overview",
  CompetitorComparison = "competitor-comparison",
  OrganicRankings = "organic-rankings",
  TopPages = "top-pages",
  BacklinkGap = "backlink-gap",
  // Backlinks
  BacklinkAnalytics = "backlink-analytics",
  BacklinkAudit = "backlink-audit",
  // Core Audit & Tools
  SiteAudit = "site-audit",
  AiSnsTools = "ai-seo-tools",
  ReportsBuilder = "reports-builder",
  Billing = "billing",
  Settings = "settings",
  ProjectPlan = "project-plan",
  EnterpriseMonitor = "enterprise-monitor",
  // Content & AI
  TopicResearch = "topic-research",
  SeoContentTemplate = "seo-content-template",
  LinkBuilding = "link-building"
}

export type KeywordIntent = "Informational" | "Commercial" | "Transactional" | "Navigational";

export interface KeywordRecord {
  id: string;
  keyword: string;
  volume: number;
  kd: number; // 0 - 100
  intent: KeywordIntent;
  cpc: number;
  competition: number; // 0.0 - 1.0
  trend: number[]; // 12 values
  serpFeatures: string[];
  results: number; // Search results count
  updatedDate: string;
}

export interface DomainOverviewData {
  domain: string;
  authorityScore: number;
  organicTraffic: number;
  organicKeywords: number;
  paidTraffic: number;
  paidKeywords: number;
  backlinksCount: number;
  referringDomains: number;
  trafficGrowthTrend: { date: string; traffic: number }[];
  keywordGrowthTrend: { date: string; keywords: number }[];
  backlinkGrowthTrend: { date: string; backlinks: number }[];
  topKeywords: { keyword: string; volume: number; position: number; trafficPct: number }[];
  topPages: { url: string; traffic: number; keywordsCount: number; adsCount: number }[];
  topCompetitors: { domain: string; commonKeywords: number; totalKeywords: number; traffic: number }[];
}

export interface BacklinkRecord {
  id: string;
  sourceUrl: string;
  anchorText: string;
  targetUrl: string;
  linkType: "Text" | "Image" | "Redirect" | "Frame";
  authority: number; // 0-100
  isNofollow: boolean;
  isNew: boolean;
  isLost: boolean;
  firstSeen: string;
}

export interface SiteAuditMetrics {
  healthScore: number;
  crawledPages: number;
  errorsCount: number;
  warningsCount: number;
  noticesCount: number;
  checks: {
    name: string;
    description: string;
    category: "Error" | "Warning" | "Notice";
    count: number;
    status: "failed" | "passed";
  }[];
}

export interface PositionTrackItem {
  keyword: string;
  volume: number;
  currentPosition: number;
  previousPosition: number;
  history: number[]; // past 7 days
  device: "desktop" | "mobile";
  location: string;
}

export interface ReportWidget {
  id: string;
  type: "Header" | "KpiSummary" | "ChartWidget" | "TableWidget" | "TextWidget";
  title: string;
  config: {
    metricType?: "Traffic" | "Keywords" | "Backlinks" | "Audit";
    text?: string;
    subTitle?: string;
  };
}

export interface SubscriptionLimit {
  creditsAllotted: number;
  creditsUsed: number;
  projectsActive: number;
  projectsLimit: number;
  teamSeatsActive: number;
  teamSeatsLimit: number;
  reportCountActive: number;
  reportCountLimit: number;
}
