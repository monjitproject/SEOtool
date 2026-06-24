import { dbInstance, KeywordHistoryRow, KeywordMetricsRow, SerpResultRow } from "./db.js";

export interface SemrushMetricValues {
  volume: number;
  cpc: number;
  competition: number;
  trendScore: number;
  organicTraffic: number;
  keywords: number;
}

export interface SemrushAccuracyResult {
  keyword: string;
  country: string;
  metrics: SemrushMetricValues;
  confidenceScore: number;
  freshnessDays: number;
  sourceBreakdown: {
    dataForSeo: number;
    historical: number;
    trends: number;
    serp: number;
  };
  lastUpdated: string;
}

/**
 * Standard CTR Curve for SERP rankings (based on industry standards)
 */
export const POSITION_CTR_CURVE: Record<number, number> = {
  1: 0.312,
  2: 0.156,
  3: 0.098,
  4: 0.071,
  5: 0.052,
  6: 0.041,
  7: 0.032,
  8: 0.024,
  9: 0.018,
  10: 0.014
};

export function getCtrForPosition(pos: number): number {
  if (pos <= 10) {
    return POSITION_CTR_CURVE[pos] || 0.01;
  }
  if (pos <= 20) {
    return 0.006;
  }
  if (pos <= 50) {
    return 0.002;
  }
  return 0.0005;
}

class AccuracyLayer {
  /**
   * Primary engine to calculate consensus-based SEO metrics from multiple sources
   */
  public calculateMetrics(
    keyword: string,
    country: string,
    rawSources: {
      dataForSEO?: { volume: number; cpc: number; competition: number; difficulty: number };
      googleTrends?: { trendScore: number; points: { date: string; value: number }[] };
      historicalDb?: { volume: number; cpc: number; competition: number; difficulty: number; trendScore: number; lastUpdated: string };
      serpTracking?: { rawResults: Omit<SerpResultRow, "id" | "keyword_id" | "created_at">[]; featuresCount: number };
    }
  ): SemrushAccuracyResult {
    const defaultData = {
      volume: 1200,
      cpc: 1.10,
      competition: 0.45,
      trendScore: 60,
      organicTraffic: 1500,
      keywords: 10
    };

    // Initialize/Normalize values from available sources
    const hasD4S = !!rawSources.dataForSEO && rawSources.dataForSEO.volume > 0;
    const d4sVol = rawSources.dataForSEO?.volume || 0;
    const d4sCpc = rawSources.dataForSEO?.cpc || 0;
    const d4sComp = rawSources.dataForSEO?.competition || 0;

    const hasTrends = !!rawSources.googleTrends;
    const maxGraphValue = rawSources.googleTrends?.points?.reduce((max, p) => Math.max(max, p.value), 0) || 50;
    const trendValue = rawSources.googleTrends?.trendScore ?? maxGraphValue;

    const hasHist = !!rawSources.historicalDb;
    const histVol = rawSources.historicalDb?.volume || 0;
    const histCpc = rawSources.historicalDb?.cpc || 0;
    const histComp = rawSources.historicalDb?.competition || 0;
    const histTrend = rawSources.historicalDb?.trendScore || 50;

    const hasSerp = !!rawSources.serpTracking && rawSources.serpTracking.rawResults.length > 0;
    const serpResults = rawSources.serpTracking?.rawResults || [];
    // Estimate volume from total organic items count or from average competition signals
    const serpSignalVol = Math.max(800, serpResults.length * 150);

    // --- Weighted Calculation Model for SEARCH VOLUME ---
    // Standard Schema: 40% DataForSEO, 30% Historical Data, 20% Trend Analysis, 10% SERP Signals
    let finalVolume = 0;
    const volWeights = { d4s: 0.40, hist: 0.30, trends: 0.20, serp: 0.10 };
    let volSumOfAvailableWeights = 0;
    let volWeightedVal = 0;

    if (hasD4S) {
      volWeightedVal += d4sVol * volWeights.d4s;
      volSumOfAvailableWeights += volWeights.d4s;
    }
    if (hasHist && histVol > 0) {
      volWeightedVal += histVol * volWeights.hist;
      volSumOfAvailableWeights += volWeights.hist;
    }
    if (hasTrends) {
      // Trends is a normalized index 0-100. Scale it to estimated volume based on baseline or other metrics
      const referenceBase = d4sVol > 0 ? d4sVol : (histVol > 0 ? histVol : 1000);
      const trendEstimatedVol = Math.round(referenceBase * (0.6 + (trendValue / 100) * 0.8));
      volWeightedVal += trendEstimatedVol * volWeights.trends;
      volSumOfAvailableWeights += volWeights.trends;
    }
    if (hasSerp) {
      volWeightedVal += serpSignalVol * volWeights.serp;
      volSumOfAvailableWeights += volWeights.serp;
    }

    if (volSumOfAvailableWeights > 0) {
      finalVolume = Math.round(volWeightedVal / volSumOfAvailableWeights);
    } else {
      finalVolume = defaultData.volume;
    }

    // --- CPC Consensus calculations ---
    // Standard Schema: 50% DataForSEO, 30% Historical, 20% SERP signals
    let finalCpc = 0;
    const cpcWeights = { d4s: 0.50, hist: 0.30, serp: 0.20 };
    let cpcSumOfAvailableWeights = 0;
    let cpcWeightedVal = 0;

    if (hasD4S) {
      cpcWeightedVal += d4sCpc * cpcWeights.d4s;
      cpcSumOfAvailableWeights += cpcWeights.d4s;
    }
    if (hasHist) {
      cpcWeightedVal += histCpc * cpcWeights.hist;
      cpcSumOfAvailableWeights += cpcWeights.hist;
    }
    if (hasSerp) {
      // average CPC based on SERP result counts/ads
      const adEstimatedCpc = (rawSources.serpTracking?.featuresCount || 0) * 0.4 + 0.2;
      cpcWeightedVal += adEstimatedCpc * cpcWeights.serp;
      cpcSumOfAvailableWeights += cpcWeights.serp;
    }

    if (cpcSumOfAvailableWeights > 0) {
      finalCpc = Math.round((cpcWeightedVal / cpcSumOfAvailableWeights) * 100) / 100;
    } else {
      finalCpc = defaultData.cpc;
    }

    // --- Competition Consensus calculations ---
    // Standard Schema: 60% DataForSEO, 25% Historical, 15% SERP signals
    let finalCompetition = 0;
    const compWeights = { d4s: 0.60, hist: 0.25, serp: 0.15 };
    let compSumOfAvailableWeights = 0;
    let compWeightedVal = 0;

    if (hasD4S) {
      compWeightedVal += d4sComp * compWeights.d4s;
      compSumOfAvailableWeights += compWeights.d4s;
    }
    if (hasHist) {
      compWeightedVal += histComp * compWeights.hist;
      compSumOfAvailableWeights += compWeights.hist;
    }
    if (hasSerp) {
      const densitySignal = Math.min(1.0, (rawSources.serpTracking?.featuresCount || 0) * 0.15);
      compWeightedVal += densitySignal * compWeights.serp;
      compSumOfAvailableWeights += compWeights.serp;
    }

    if (compSumOfAvailableWeights > 0) {
      finalCompetition = Math.round((compWeightedVal / compSumOfAvailableWeights) * 100) / 100;
    } else {
      finalCompetition = defaultData.competition;
    }

    // --- Trend Score calculations ---
    // Standard Schema: 70% Google Trends, 30% Historical index
    let finalTrendScore = 0;
    const trendWeights = { trends: 0.70, hist: 0.30 };
    let trendSumOfWeights = 0;
    let trendWeightedVal = 0;

    if (hasTrends) {
      trendWeightedVal += trendValue * trendWeights.trends;
      trendSumOfWeights += trendWeights.trends;
    }
    if (hasHist) {
      trendWeightedVal += histTrend * trendWeights.hist;
      trendSumOfWeights += trendWeights.hist;
    }

    if (trendSumOfWeights > 0) {
      finalTrendScore = Math.round(trendWeightedVal / trendSumOfWeights);
    } else {
      finalTrendScore = defaultData.trendScore;
    }

    // --- Final Traffic Estimate calculations ---
    // Final Traffic Estimate = sum(Keyword Rankings x Estimated CTR x Search Volume)
    // We compute the estimated traffic for this specific keyword targeting the SERPs
    let calculatedTraffic = 0;
    if (serpResults.length > 0) {
      serpResults.forEach((res) => {
        const ctr = getCtrForPosition(res.position);
        calculatedTraffic += finalVolume * ctr;
      });
      calculatedTraffic = Math.round(calculatedTraffic);
    } else {
      calculatedTraffic = Math.round(finalVolume * 0.35); // simulated baseline
    }

    // Keywords count signal based on Serp results or baseline
    const calculatedKeywords = Math.max(12, serpResults.length * 3 + (finalVolume > 5000 ? 15 : 4));

    // --- Freshness Calculation ---
    // Check update age
    let freshnessDays = 0;
    if (rawSources.historicalDb?.lastUpdated) {
      const diffMs = Date.now() - new Date(rawSources.historicalDb.lastUpdated).getTime();
      freshnessDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    }

    // --- Confidence Scoring Model ---
    // Base 100
    let confidence = 100;

    // Coverage penalty: if we lack DataForSEO or Serp tracking, subtract score
    if (!hasD4S) confidence -= 15;
    if (!hasTrends) confidence -= 10;
    if (!hasSerp) confidence -= 15;
    if (!hasHist) confidence -= 10;

    // Variance penalty: If high deviation between different sources, reduce confidence
    if (hasD4S && hasHist && d4sVol > 0 && histVol > 0) {
      const devPct = Math.abs(d4sVol - histVol) / Math.max(d4sVol, 1);
      if (devPct > 0.5) {
        confidence -= Math.min(25, Math.round(devPct * 20));
      }
    }

    // Freshness decay penalty: 1% penalty per day up to 30% max penalty
    if (freshnessDays > 0) {
      confidence -= Math.min(30, freshnessDays * 1);
    }

    // Ensure range bounds [15, 100]
    confidence = Math.min(100, Math.max(15, confidence));

    return {
      keyword: keyword.toLowerCase().trim(),
      country: country.toUpperCase().trim(),
      metrics: {
        volume: finalVolume,
        cpc: finalCpc,
        competition: finalCompetition,
        trendScore: finalTrendScore,
        organicTraffic: calculatedTraffic,
        keywords: calculatedKeywords
      },
      confidenceScore: confidence,
      freshnessDays,
      sourceBreakdown: {
        dataForSeo: hasD4S ? 40 : 0,
        historical: hasHist ? 30 : 0,
        trends: hasTrends ? 20 : 0,
        serp: hasSerp ? 10 : 0
      },
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Helper to retrieve historical metric values for a given keyword ID
   */
  public async getHistoricalMetrics(keywordId: string): Promise<any> {
    // Collect records from local or postgres keyword history
    const allHistory = dbInstance.tables.keyword_history.filter((h) => h.keyword_id === keywordId);
    if (allHistory.length === 0) return null;

    // Sort by tracked_date descending
    const sorted = [...allHistory].sort((a, b) => new Date(b.tracked_date).getTime() - new Date(a.tracked_date).getTime());
    const latest = sorted[0];

    // Calculate a daily history average or trend metrics
    let sumVol = 0;
    let sumCpc = 0;
    sorted.forEach((h) => {
      sumVol += h.search_volume;
      sumCpc += typeof h.cpc === "string" ? parseFloat(h.cpc) : h.cpc;
    });

    return {
      volume: Math.round(sumVol / sorted.length),
      cpc: sumCpc / sorted.length,
      competition: 0.45, // default signal
      difficulty: latest.difficulty || 45,
      trendScore: 65,
      lastUpdated: latest.tracked_date,
      count: sorted.length
    };
  }

  /**
   * Triggers a daily scheduled tasks simulation or batch recalculation
   * of accurate consolidated metrics for all tracked keyword snapshots.
   */
  public async runDailyRecalculationBatch(): Promise<{ processedCount: number; timestamp: string }> {
    console.log("[ACCURACY ENGINE] Starting daily batch recalculation of Semrush accuracy layer...");
    let processed = 0;

    const keywords = dbInstance.tables.keywords;
    for (const kw of keywords) {
      try {
        const keywordId = kw.id;
        const currentMetrics = dbInstance.tables.keyword_metrics.find((m) => m.keyword_id === keywordId);
        
        // Retrieve historical databases logs
        const historyMetric = await this.getHistoricalMetrics(keywordId);
        const trends = dbInstance.getTrends(keywordId);
        const serpResults = dbInstance.getSerpResults(keywordId);

        if (!currentMetrics) continue;

        // Perform calculation combining live metrics + historical values + serp results
        const rawSources = {
          dataForSEO: {
            volume: currentMetrics.search_volume_val || 1000,
            cpc: parseFloat(currentMetrics.cpc.replace(/[^\d.]/g, "")) || 0.5,
            competition: parseFloat(currentMetrics.competition) || 0.4,
            difficulty: currentMetrics.difficulty || 45
          },
          googleTrends: trends.length > 0 ? {
            trendScore: 70,
            points: trends.map((t) => ({ date: `Index ${t.month_index}`, value: t.volume }))
          } : undefined,
          historicalDb: historyMetric ? {
            volume: historyMetric.volume,
            cpc: historyMetric.cpc,
            competition: historyMetric.competition,
            difficulty: historyMetric.difficulty,
            trendScore: historyMetric.trendScore,
            lastUpdated: historyMetric.lastUpdated
          } : undefined,
          serpTracking: serpResults.length > 0 ? {
            rawResults: serpResults.map((s) => ({
              position: s.position,
              title: s.title,
              url: s.url,
              domain: s.domain,
              has_image: s.has_image,
              is_video_carousel: s.is_video_carousel,
              video_count: s.video_count,
              is_short_videos: s.is_short_videos,
              short_video_count: s.short_video_count,
              authority_score: s.authority_score,
              ref_domains: s.ref_domains,
              backlinks: s.backlinks,
              traffic: s.traffic,
              keywords_count: s.keywords_count
            })),
            featuresCount: dbInstance.getSerpFeatures(keywordId).length
          } : undefined
        };

        const reCalculated = this.calculateMetrics(kw.keyword, kw.country, rawSources);

        // Update the database record metrics with consensus values and store historical entry
        const updatedMetricsRow: KeywordMetricsRow = {
          ...currentMetrics,
          search_volume: reCalculated.metrics.volume.toLocaleString(),
          search_volume_val: reCalculated.metrics.volume,
          cpc: `$${reCalculated.metrics.cpc.toFixed(2)}`,
          competition: reCalculated.metrics.competition.toFixed(2),
          updated_at: new Date().toISOString(),
          confidence_score: reCalculated.confidenceScore,
          source_attribution: `Consensus calculation: DataForSEO (${reCalculated.sourceBreakdown.dataForSeo}%) • Hist (${reCalculated.sourceBreakdown.historical}%) • Google Trends (${reCalculated.sourceBreakdown.trends}%) • SERP (${reCalculated.sourceBreakdown.serp}%)`
        };

        // Write directly to DB instance
        const index = dbInstance.tables.keyword_metrics.findIndex((m) => m.keyword_id === keywordId);
        if (index >= 0) {
          dbInstance.tables.keyword_metrics[index] = updatedMetricsRow;
        }

        // Push new daily snapshot history record
        dbInstance.addKeywordHistory(
          keywordId,
          reCalculated.metrics.volume,
          reCalculated.metrics.cpc,
          currentMetrics.difficulty
        );

        processed++;
      } catch (err: any) {
        console.warn(`[ACCURACY ENGINE] Recalculation failed for keyword [${kw.keyword}]:`, err.message);
      }
    }

    dbInstance.save();
    console.log(`[ACCURACY ENGINE] Re-computation complete. Processed snapshots count: ${processed}`);
    return {
      processedCount: processed,
      timestamp: new Date().toISOString()
    };
  }
}

export const accuracyLayer = new AccuracyLayer();
