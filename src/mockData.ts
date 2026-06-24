/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KeywordRecord, BacklinkRecord, SiteAuditMetrics, PositionTrackItem, DomainOverviewData } from "./types";

// Generates dynamic keywords database based on query term
export function generateKeywordsForQuery(query: string): KeywordRecord[] {
  const normQuery = (query || "seo").trim().toLowerCase();
  
  if (normQuery === "free fire") {
    // Exact matching Semrush data for "free fire"
    const freeFireKeywords: KeywordRecord[] = [
      {
        id: "ff-1",
        keyword: "free fire",
        volume: 2240000,
        kd: 86,
        intent: "Transactional", // We will customize rendering in view to show I & T as in the image
        cpc: 0.01,
        competition: 0.01,
        trend: [2240000, 2200000, 2180000, 2240000, 2210000, 2240000, 2200000, 2180000, 2240000, 2210000, 2240000, 2240000],
        serpFeatures: ["Sitelinks", "Videos", "Images"],
        results: 50610000,
        updatedDate: "1 month"
      },
      {
        id: "ff-2",
        keyword: "free fire max",
        volume: 1830000,
        kd: 90,
        intent: "Navigational", // Purple N in image
        cpc: 0.01,
        competition: 0.01,
        trend: [1830000, 1800000, 1810000, 1830000, 1820000, 1830000, 1800000, 1810000, 1830000, 1820000, 1830000, 1830000],
        serpFeatures: ["Sitelinks"],
        results: 4120000,
        updatedDate: "1 month"
      },
      {
        id: "ff-3",
        keyword: "free fire game",
        volume: 1000000,
        kd: 90,
        intent: "Informational", // Blue I
        cpc: 0.02,
        competition: 0.1,
        trend: [1000000, 980000, 950000, 1000000, 970000, 1000000, 980000, 950000, 1000000, 970000, 1000000, 1000000],
        serpFeatures: ["Sitelinks", "People Also Ask"],
        results: 2310000,
        updatedDate: "4 weeks"
      },
      {
        id: "ff-4",
        keyword: "free fire name",
        volume: 823000,
        kd: 63,
        intent: "Informational", // Blue I
        cpc: 0.00,
        competition: 0.01,
        trend: [823000, 800000, 790000, 823000, 810000, 823000, 800000, 790000, 823000, 810000, 823000, 823000],
        serpFeatures: ["Sitelinks"],
        results: 1250000,
        updatedDate: "1 month"
      },
      {
        id: "ff-5",
        keyword: "free fire nickname",
        volume: 823000,
        kd: 66,
        intent: "Transactional", // Displayed as I and T in image
        cpc: 0.00,
        competition: 0.02,
        trend: [823000, 810000, 820000, 823000, 815000, 823000, 810000, 820000, 823000, 815000, 823000, 823000],
        serpFeatures: ["Sitelinks", "Images"],
        results: 1610000,
        updatedDate: "1 month"
      },
      {
        id: "ff-6",
        keyword: "garena free fire max redeem codes",
        volume: 450000,
        kd: 66,
        intent: "Informational", // Blue I in image
        cpc: 0.01,
        competition: 0.01,
        trend: [450000, 430000, 440500, 450000, 440000, 450000, 430000, 440500, 450000, 440000, 450000, 450000],
        serpFeatures: ["Sitelinks", "Google News"],
        results: 910000,
        updatedDate: "1 month"
      },
      {
        id: "ff-7",
        keyword: "free fire india",
        volume: 368000,
        kd: 72,
        intent: "Transactional", // Displays as I and T in image
        cpc: 0.01,
        competition: 0.01,
        trend: [368000, 350000, 360000, 368000, 355000, 368000, 350000, 360000, 368000, 355000, 368000, 368000],
        serpFeatures: ["Sitelinks", "Videos"],
        results: 3200000,
        updatedDate: "1 month"
      },
      {
        id: "ff-8",
        keyword: "free fire download",
        volume: 301000,
        kd: 74,
        intent: "Informational", // Blue I
        cpc: 0.01,
        competition: 0.01,
        trend: [301000, 290000, 295000, 301000, 298000, 301000, 290000, 295000, 301000, 298000, 301000, 301000],
        serpFeatures: ["Sitelinks"],
        results: 860000,
        updatedDate: "1 month"
      },
      {
        id: "ff-9",
        keyword: "free fire free fire",
        volume: 301000,
        kd: 91,
        intent: "Navigational", // Purple N
        cpc: 0.28,
        competition: 0.01,
        trend: [301000, 280000, 301000, 301000, 290000, 301000, 280000, 301000, 301000, 290000, 301000, 301000],
        serpFeatures: ["Sitelinks"],
        results: 980000,
        updatedDate: "1 month"
      },
      {
        id: "ff-10",
        keyword: "free fire name style",
        volume: 301000,
        kd: 62,
        intent: "Informational", // Blue I
        cpc: 0.00,
        competition: 0.01,
        trend: [301000, 295000, 299000, 301000, 300000, 301000, 295000, 299000, 301000, 300000, 301000, 301000],
        serpFeatures: ["Sitelinks", "Images"],
        results: 1100000,
        updatedDate: "1 month"
      },
      {
        id: "ff-11",
        keyword: "free fire redeem code today",
        volume: 246000,
        kd: 70,
        intent: "Transactional",
        cpc: 0.05,
        competition: 0.02,
        trend: [246000, 240000, 246000, 246000, 246000, 246000, 220000, 246000, 246000, 246000, 246000, 246000],
        serpFeatures: ["Sitelinks", "People Also Ask"],
        results: 420000,
        updatedDate: "1 month"
      },
      {
        id: "ff-12",
        keyword: "garena free fire",
        volume: 246000,
        kd: 88,
        intent: "Navigational",
        cpc: 0.01,
        competition: 0.01,
        trend: [246000, 240000, 246000, 246000, 246000, 246000, 220000, 246000, 246000, 246000, 246000, 246000],
        serpFeatures: ["Sitelinks"],
        results: 6200000,
        updatedDate: "1 month"
      },
      {
        id: "ff-13",
        keyword: "free fire reward",
        volume: 201000,
        kd: 69,
        intent: "Transactional",
        cpc: 0.02,
        competition: 0.01,
        trend: [201000, 190000, 201000, 201000, 201000, 201000, 180000, 201000, 201000, 201000, 201000, 201000],
        serpFeatures: ["Sitelinks"],
        results: 510000,
        updatedDate: "1 month"
      },
      {
        id: "ff-14",
        keyword: "free fire online play",
        volume: 165000,
        kd: 75,
        intent: "Informational",
        cpc: 0.01,
        competition: 0.01,
        trend: [165000, 160000, 165000, 165000, 165000, 165000, 150000, 165000, 165000, 165000, 165000, 165000],
        serpFeatures: ["Sitelinks"],
        results: 990000,
        updatedDate: "4 weeks"
      },
      {
        id: "ff-15",
        keyword: "free fire mod apk",
        volume: 135005,
        kd: 78,
        intent: "Navigational",
        cpc: 0.01,
        competition: 0.01,
        trend: [135000, 130000, 135010, 135010, 135010, 135010, 120000, 135010, 135010, 135010, 135010, 135010],
        serpFeatures: ["Sitelinks"],
        results: 852000,
        updatedDate: "4 weeks"
      }
    ];
    return freeFireKeywords;
  }

  const seedKeywords = [
    { suffix: "guide for beginners", volMultiplier: 2.2, kdAdd: -10, cpcRate: 1.2, intent: "Informational" as const },
    { suffix: "agency cost comparison", volMultiplier: 0.8, kdAdd: 15, cpcRate: 12.5, intent: "Commercial" as const },
    { suffix: "best tools in 2026", volMultiplier: 1.5, kdAdd: 5, cpcRate: 4.8, intent: "Commercial" as const },
    { suffix: "professional services near me", volMultiplier: 1.1, kdAdd: -5, cpcRate: 8.5, intent: "Transactional" as const },
    { suffix: "software free trials", volMultiplier: 1.9, kdAdd: 12, cpcRate: 6.2, intent: "Commercial" as const },
    { suffix: "best coupon codes", volMultiplier: 3.5, kdAdd: -12, cpcRate: 2.5, intent: "Transactional" as const },
    { suffix: "optimization checklist download", volMultiplier: 1.3, kdAdd: -2, cpcRate: 3.5, intent: "Informational" as const },
    { suffix: "tutorial for enterprise", volMultiplier: 0.5, kdAdd: 22, cpcRate: 15.0, intent: "Commercial" as const },
    { suffix: "how to rank faster", volMultiplier: 4.0, kdAdd: 25, cpcRate: 5.5, intent: "Informational" as const },
    { suffix: "login portal sign in", volMultiplier: 1.2, kdAdd: -15, cpcRate: 0.5, intent: "Navigational" as const },
    { suffix: "calculator and builder", volMultiplier: 1.7, kdAdd: -8, cpcRate: 1.5, intent: "Informational" as const },
    { suffix: "latest reviews trends", volMultiplier: 1.4, kdAdd: 8, cpcRate: 3.2, intent: "Commercial" as const },
    { suffix: "how to build backlinks", volMultiplier: 2.5, kdAdd: 18, cpcRate: 7.5, intent: "Informational" as const },
    { suffix: "authority scores checkers", volMultiplier: 1.0, kdAdd: 2, cpcRate: 4.0, intent: "Commercial" as const },
    { suffix: "pricing discount tier", volMultiplier: 0.7, kdAdd: 11, cpcRate: 9.8, intent: "Transactional" as const },
  ];

  return seedKeywords.map((seed, idx) => {
    // Generate organic sounding volumes and metric indicators
    const baseVolume = 1200 + Math.floor(Math.sin(idx * 7) * 800);
    const volume = Math.floor(baseVolume * seed.volMultiplier);
    const kd = Math.min(99, Math.max(5, Math.floor(55 + (idx * 3.5) + seed.kdAdd)));
    const cpc = parseFloat(seed.cpcRate.toFixed(2));
    const competition = parseFloat((0.2 + (kd / 150) + (idx % 3) * 0.1).toFixed(2));
    
    // Trend coordinates (12 months coordinates)
    const trend = Array.from({ length: 12 }, (_, mIdx) => {
      const base = volume * (0.8 + Math.sin(mIdx + idx) * 0.25);
      return Math.floor(base);
    });

    const serpFeatures = ["Sitelinks"];
    if (kd > 40) serpFeatures.push("People Also Ask");
    if (volume > 2000) serpFeatures.push("Images");
    if (cpc > 5) serpFeatures.push("AdWords");

    return {
      id: `${normQuery}-kw-${idx}`,
      keyword: `${normQuery} ${seed.suffix}`,
      volume,
      kd,
      intent: seed.intent,
      cpc,
      competition,
      trend,
      serpFeatures,
      results: Math.floor(8400000 + (volume * 15000)),
      updatedDate: "Jun 20, 2026",
    };
  });
}

// Generates dynamic domains database based on query input
export function generateDomainOverview(domain: string): DomainOverviewData {
  const normDom = (domain || "example.com").trim().replace(/https?:\/\//, "").split("/")[0].toLowerCase() || "example.com";
  
  // Create deterministic figures based on domain string character weighting
  const charSum = Array.from(normDom).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const authorityScore = Math.max(12, Math.min(98, Math.floor((charSum % 70) + 25)));
  
  const organicTraffic = (charSum * 2400) + 150000;
  const organicKeywords = Math.floor(organicTraffic / 7);
  const paidTraffic = Math.floor(organicTraffic * 0.18);
  const paidKeywords = Math.floor(organicKeywords * 0.08);
  const backlinksCount = Math.floor(organicTraffic * 6.5);
  const referringDomains = Math.floor(backlinksCount / 8.5);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const trafficGrowthTrend = months.map((month, idx) => ({
    date: month,
    traffic: Math.floor(organicTraffic * (0.85 + (idx * 0.04) + Math.sin(idx) * 0.05)),
  }));

  const keywordGrowthTrend = months.map((month, idx) => ({
    date: month,
    keywords: Math.floor(organicKeywords * (0.9 + (idx * 0.03) + Math.cos(idx) * 0.03)),
  }));

  const backlinkGrowthTrend = months.map((month, idx) => ({
    date: month,
    backlinks: Math.floor(backlinksCount * (0.8 + (idx * 0.05) + Math.sin(idx * 2) * 0.04)),
  }));

  // Dynamic competing list generator
  let competitorSeeds = ["rankboost.org", "marketreach.net", "organicflow.co", "seoshield.com", "weboffice.io"];
  if (normDom.includes("shoe")) {
    competitorSeeds = ["zappos.com", "nike.com", "adidas.com", "footlocker.com", "pumastore.co"];
  } else if (normDom.includes("tech") || normDom.includes("ai")) {
    competitorSeeds = ["techcrunch.com", "venturebeat.com", "wired.com", "thenextweb.com", "slashdot.org"];
  } else if (normDom.includes("news") || normDom.includes("times")) {
    competitorSeeds = ["cnn.com", "nytimes.com", "bbc.co.uk", "reuters.com", "theguardian.com"];
  }

  const topCompetitors = competitorSeeds.map((comp, idx) => {
    const commonKeywords = Math.floor(organicKeywords * (0.15 + idx * 0.08));
    return {
      domain: comp,
      commonKeywords,
      totalKeywords: Math.floor(organicKeywords * (0.6 + idx * 0.2)),
      traffic: Math.floor(organicTraffic * (0.5 + idx * 0.3)),
    };
  });

  const keywordList = [
    { text: "best solutions overview", multiplier: 0.12, pos: 2 },
    { text: "reviews & alternative tools", multiplier: 0.09, pos: 1 },
    { text: "expert installation walkthrough", multiplier: 0.06, pos: 5 },
    { text: "discount registration promo", multiplier: 0.05, pos: 3 },
    { text: "integrations comparison details", multiplier: 0.04, pos: 8 },
  ];

  const topKeywords = keywordList.map((kw, idx) => ({
    keyword: `${normDom} ${kw.text}`,
    volume: Math.floor(organicTraffic * kw.multiplier * 0.7),
    position: kw.pos,
    trafficPct: parseFloat((kw.multiplier * 100).toFixed(1)),
  }));

  const topPages = [
    { url: `https://www.${normDom}/`, traffic: Math.floor(organicTraffic * 0.45), keywordsCount: Math.floor(organicKeywords * 0.3), adsCount: 12 },
    { url: `https://www.${normDom}/pricing`, traffic: Math.floor(organicTraffic * 0.2), keywordsCount: Math.floor(organicKeywords * 0.1), adsCount: 4 },
    { url: `https://www.${normDom}/blog`, traffic: Math.floor(organicTraffic * 0.15), keywordsCount: Math.floor(organicKeywords * 0.25), adsCount: 0 },
    { url: `https://www.${normDom}/features`, traffic: Math.floor(organicTraffic * 0.1), keywordsCount: Math.floor(organicKeywords * 0.15), adsCount: 2 },
    { url: `https://www.${normDom}/about-us`, traffic: Math.floor(organicTraffic * 0.05), keywordsCount: Math.floor(organicKeywords * 0.05), adsCount: 0 },
  ];

  return {
    domain: normDom,
    authorityScore,
    organicTraffic,
    organicKeywords,
    paidTraffic,
    paidKeywords,
    backlinksCount,
    referringDomains,
    trafficGrowthTrend,
    keywordGrowthTrend,
    backlinkGrowthTrend,
    topKeywords,
    topPages,
    topCompetitors,
  };
}

// Generates dynamic backlinks database based on target
export function generateBacklinks(domain: string): BacklinkRecord[] {
  const normDom = (domain || "target.com").trim().toLowerCase();
  
  const backlinksSeeds = [
    { url: "medium.com/seo-trends", anchor: `Check out ${normDom} performance review`, type: "Text" as const, authority: 88, nofollow: false },
    { url: "github.com/developer-resources", anchor: `${normDom} utility integration`, type: "Text" as const, authority: 95, nofollow: true },
    { url: "techcrunch.com/startups-funding", anchor: `${normDom} enterprise listing`, type: "Redirect" as const, authority: 91, nofollow: false },
    { url: "wikipedia.org/wiki/List_of_search_engines", anchor: "Reference Site: " + normDom, type: "Text" as const, authority: 99, nofollow: false },
    { url: "forbes.com/business-advice", anchor: `${normDom} SaaS startup feature`, type: "Text" as const, authority: 93, nofollow: false },
    { url: "pinterest.com/pin/21831823912", anchor: "Product Image Source", type: "Image" as const, authority: 74, nofollow: true },
    { url: "reddit.com/r/seo/comments/123", anchor: "recommendation link here", type: "Text" as const, authority: 68, nofollow: true },
    { url: "nytimes.com/technology-insights", anchor: `${normDom} software systems`, type: "Text" as const, authority: 96, nofollow: false },
    { url: "dev.to/seo-builder-tips", anchor: "complete technical framework", type: "Text" as const, authority: 79, nofollow: false },
    { url: "blogspot.com/2026/05/website", anchor: `read more at ${normDom}`, type: "Text" as const, authority: 55, nofollow: true },
  ];

  return backlinksSeeds.map((seed, idx) => ({
    id: `backlink-${idx}`,
    sourceUrl: `https://www.${seed.url}`,
    anchorText: seed.anchor,
    targetUrl: `https://www.${normDom}/blog/best-features`,
    linkType: seed.type,
    authority: seed.authority,
    isNofollow: seed.nofollow,
    isNew: idx < 3,
    isLost: idx === 6,
    firstSeen: "2026-03-" + (10 + idx),
  }));
}

// Generates Site Audit parameters
export function generateSiteAuditMetrics(domain: string): SiteAuditMetrics {
  const normDom = (domain || "target.com").trim().toLowerCase();
  const charSum = Array.from(normDom).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const healthScore = Math.max(62, Math.min(99, Math.floor((charSum % 25) + 74)));
  const crawledPages = Math.floor(180 + (charSum % 350));
  
  const errorsCount = Math.floor(3 + (charSum % 14));
  const warningsCount = Math.floor(12 + (charSum % 28));
  const noticesCount = Math.floor(25 + (charSum % 60));

  const checks = [
    { name: "Broken link check", description: "Detects internal or external hyperlinks returning 404 response codes.", category: "Error" as const, count: Math.floor(charSum % 3), status: (charSum % 3 === 0) ? ("passed" as const) : ("failed" as const) },
    { name: "Missing primary heading (H1)", description: "Checks if templates contain exactly one single H1 tag representing page topic.", category: "Error" as const, count: Math.floor(charSum % 2), status: (charSum % 2 === 0) ? ("passed" as const) : ("failed" as const) },
    { name: "Missing Meta SEO Titles", description: "Validates existence of document headings inside document tags.", category: "Error" as const, count: Math.floor(charSum % 4), status: (charSum % 4 === 0) ? ("passed" as const) : ("failed" as const) },
    { name: "Duplicate Content Indexes", description: "Measures textual overlapping of key landing profiles.", category: "Warning" as const, count: Math.floor(charSum % 5), status: "failed" as const },
    { name: "Slow Load Speeds (> 2.5s)", description: "Flags pages missing benchmarks within the Core Web Vitals structure.", category: "Warning" as const, count: 8 + Math.floor(charSum % 12), status: "failed" as const },
    { name: "Sitemaps and robots.txt check", description: "Verifies standard crawler configuration files are present.", category: "Notice" as const, count: 0, status: "passed" as const },
    { name: "Page speed mobile check", description: "Checks mobile lighthouse scores for heavy styling layers.", category: "Notice" as const, count: noticesCount, status: "failed" as const },
  ];

  return {
    healthScore,
    crawledPages,
    errorsCount,
    warningsCount,
    noticesCount,
    checks,
  };
}

// Generates Tracked positions
export function generatePositionTrack(topic: string): PositionTrackItem[] {
  const seeds = [
    { kw: `${topic} software`, vol: 8500, current: 4, prev: 6 },
    { kw: `${topic} tool free download`, vol: 3200, current: 8, prev: 8 },
    { kw: `${topic} professional reviews`, vol: 1500, current: 12, prev: 15 },
    { kw: `${topic} core features`, vol: 900, current: 1, prev: 1 },
    { kw: `how to master ${topic}`, vol: 4800, current: 23, prev: 32 },
    { kw: `enterprise ${topic} setup`, vol: 450, current: 2, prev: 2 },
    { kw: `pricing for ${topic} platforms`, vol: 1900, current: 15, prev: 11 },
  ];

  return seeds.map((s, idx) => {
    const history = Array.from({ length: 7 }, (_, i) => {
      const dev = Math.round(Math.sin(idx + i) * 2);
      return Math.max(1, s.current + dev);
    });

    return {
      keyword: s.kw,
      volume: s.vol,
      currentPosition: s.current,
      previousPosition: s.prev,
      history,
      device: idx % 3 === 2 ? "mobile" : "desktop",
      location: "United States (Chicago)",
    };
  });
}
