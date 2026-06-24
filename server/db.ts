import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Types for relational schema
export interface KeywordRow {
  id: string;
  keyword: string;
  language: string;
  country: string;
  created_at: string;
}

export interface KeywordMetricsRow {
  keyword_id: string;
  search_volume: string;
  search_volume_val: number;
  global_volume: string;
  global_volume_val: number;
  cpc: string;
  competition: string;
  difficulty: number;
  kd_label: string;
  kd_description: string;
  intent: string[];
  updated_at: string;
  confidence_score?: number;
  source_attribution?: string;
}

export interface KeywordTrendRow {
  keyword_id: string;
  month_index: number;
  volume: number;
  updated_at: string;
}

export interface SerpResultRow {
  id: string;
  keyword_id: string;
  position: number;
  title: string;
  url: string;
  domain: string;
  has_image: boolean;
  is_video_carousel: boolean;
  video_count?: number;
  is_short_videos?: boolean;
  short_video_count?: number;
  authority_score?: number;
  ref_domains?: string;
  backlinks?: string;
  traffic?: string;
  keywords_count?: number;
  created_at: string;
}

export interface SerpFeatureRow {
  keyword_id: string;
  feature_name: string;
  detected: boolean;
  created_at: string;
}

export interface SearchHistoryRow {
  id: string;
  keyword: string;
  country: string;
  device: string;
  searched_at: string;
}

// New Enterprise schemas requested by the user:
export interface SerpSnapshotRow {
  id: string;
  keyword_id: string;
  raw_json: string; // snapshots in JSON string
  confidence: number;
  source_attribution: string;
  created_at: string;
}

export interface RankingHistoryRow {
  id: string;
  keyword_id: string;
  domain: string;
  position: number;
  tracked_date: string;
}

export interface BacklinkHistoryRow {
  id: string;
  domain: string;
  backlinks_count: number;
  referring_domains: number;
  tracked_date: string;
}

export interface KeywordHistoryRow {
  id: string;
  keyword_id: string;
  search_volume: number;
  cpc: number;
  difficulty: number;
  tracked_date: string;
}

class Database {
  private dataDir = path.join(process.cwd(), "data");
  private dbFile = path.join(this.dataDir, "seo_database.json");
  private pgPool: any = null;
  private isPostgresActive = false;

  public tables = {
    keywords: [] as KeywordRow[],
    keyword_metrics: [] as KeywordMetricsRow[],
    keyword_trends: [] as KeywordTrendRow[],
    serp_results: [] as SerpResultRow[],
    serp_features: [] as SerpFeatureRow[],
    search_history: [] as SearchHistoryRow[],
    // Enterprise Extensions:
    serp_snapshots: [] as SerpSnapshotRow[],
    ranking_history: [] as RankingHistoryRow[],
    backlink_history: [] as BacklinkHistoryRow[],
    keyword_history: [] as KeywordHistoryRow[]
  };

  constructor() {
    this.initDatabase();
    this.initPostgres();
  }

  private initDatabase() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dbFile)) {
        const fileContent = fs.readFileSync(this.dbFile, "utf-8");
        const parsed = JSON.parse(fileContent);
        // Safely spread loaded tables and ensure array existence
        this.tables = {
          keywords: parsed.keywords || [],
          keyword_metrics: parsed.keyword_metrics || [],
          keyword_trends: parsed.keyword_trends || [],
          serp_results: parsed.serp_results || [],
          serp_features: parsed.serp_features || [],
          search_history: parsed.search_history || [],
          serp_snapshots: parsed.serp_snapshots || [],
          ranking_history: parsed.ranking_history || [],
          backlink_history: parsed.backlink_history || [],
          keyword_history: parsed.keyword_history || []
        };
        console.log("[DB] Local JSON database tables loaded successfully.");
      } else {
        this.save();
        console.log("[DB] Initial empty Local JSON DB initialized.");
      }
    } catch (error) {
      console.error("[DB] Failed to initialize local JSON database:", error);
    }
  }

  private async initPostgres() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.log("[Postgres] DATABASE_URL not set. Relational queries routed through JSON Storage Engine.");
      return;
    }

    try {
      // Lazy load 'pg' package safely
      const { default: pg } = await import("pg");
      const { Pool } = pg;
      this.pgPool = new Pool({
        connectionString: dbUrl,
        ssl: dbUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined
      });

      // Test connection
      await this.pgPool.query("SELECT NOW()");
      this.isPostgresActive = true;
      console.log("[Postgres] Connected to PostgreSQL cloud database successfully!");

      // Bootstrap enterprise-grade relational schemas
      await this.createPostgresTables();
    } catch (err: any) {
      console.log("[Postgres] Database initializing with Local JSON fallback:", err.message);
      this.isPostgresActive = false;
    }
  }

  private async createPostgresTables() {
    if (!this.pgPool) return;

    try {
      console.log("[Postgres] Synchronizing enterprise schemas & constraints...");
      
      const queries = [
        `CREATE TABLE IF NOT EXISTS keywords (
          id VARCHAR(100) PRIMARY KEY,
          keyword VARCHAR(255) NOT NULL,
          language VARCHAR(50),
          country VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS keyword_metrics (
          keyword_id VARCHAR(100) PRIMARY KEY,
          search_volume VARCHAR(100),
          search_volume_val INT,
          global_volume VARCHAR(100),
          global_volume_val INT,
          cpc VARCHAR(100),
          competition VARCHAR(100),
          difficulty INT,
          kd_label VARCHAR(100),
          kd_description TEXT,
          intent TEXT[],
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          confidence_score INT,
          source_attribution TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS keyword_trends (
          keyword_id VARCHAR(100),
          month_index INT,
          volume INT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (keyword_id, month_index)
        )`,
        `CREATE TABLE IF NOT EXISTS serp_results (
          id VARCHAR(100) PRIMARY KEY,
          keyword_id VARCHAR(100),
          position INT,
          title TEXT,
          url TEXT,
          domain VARCHAR(255),
          has_image BOOLEAN DEFAULT FALSE,
          is_video_carousel BOOLEAN DEFAULT FALSE,
          video_count INT,
          is_short_videos BOOLEAN DEFAULT FALSE,
          short_video_count INT,
          authority_score INT,
          ref_domains VARCHAR(100),
          backlinks VARCHAR(100),
          traffic VARCHAR(100),
          keywords_count INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS serp_features (
          keyword_id VARCHAR(100),
          feature_name VARCHAR(100),
          detected BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (keyword_id, feature_name)
        )`,
        `CREATE TABLE IF NOT EXISTS search_history (
          id VARCHAR(100) PRIMARY KEY,
          keyword VARCHAR(255),
          country VARCHAR(50),
          device VARCHAR(50),
          searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        // Enterprise Extension tables:
        `CREATE TABLE IF NOT EXISTS serp_snapshots (
          id VARCHAR(100) PRIMARY KEY,
          keyword_id VARCHAR(100),
          raw_json TEXT,
          confidence INT,
          source_attribution TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS ranking_history (
          id VARCHAR(100) PRIMARY KEY,
          keyword_id VARCHAR(100),
          domain VARCHAR(255),
          position INT,
          tracked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS backlink_history (
          id VARCHAR(100) PRIMARY KEY,
          domain VARCHAR(255),
          backlinks_count BIGINT,
          referring_domains INT,
          tracked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS keyword_history (
          id VARCHAR(100) PRIMARY KEY,
          keyword_id VARCHAR(100),
          search_volume INT,
          cpc NUMERIC(10,2),
          difficulty INT,
          tracked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      ];

      for (const q of queries) {
        await this.pgPool.query(q);
      }
      console.log("[Postgres] Relational tables synchronized perfectly.");
    } catch (err: any) {
      console.error("[Postgres] Table generation failed:", err.message);
    }
  }

  public save() {
    try {
      fs.writeFileSync(this.dbFile, JSON.stringify(this.tables, null, 2), "utf-8");
    } catch (error) {
      console.error("[DB] Error saving local JSON data:", error);
    }
  }

  // --- Core API Interfaces ---

  public getKeyword(keyword: string, country: string): KeywordRow | undefined {
    const cleanWord = keyword.trim().toLowerCase();
    return this.tables.keywords.find(
      (k) => k.keyword === cleanWord && k.country === country
    );
  }

  public async getKeywordAsync(keyword: string, country: string): Promise<KeywordRow | undefined> {
    const cleanWord = keyword.trim().toLowerCase();
    if (this.isPostgresActive && this.pgPool) {
      try {
        const res = await this.pgPool.query(
          "SELECT * FROM keywords WHERE LOWER(keyword) = $1 AND UPPER(country) = $2 LIMIT 1",
          [cleanWord, country.toUpperCase()]
        );
        if (res.rows.length > 0) {
          return {
            id: res.rows[0].id,
            keyword: res.rows[0].keyword,
            language: res.rows[0].language || "en",
            country: res.rows[0].country,
            created_at: new Date(res.rows[0].created_at).toISOString()
          };
        }
      } catch (err) {
        console.error("[Postgres] getKeyword failed:", err);
      }
    }
    return this.getKeyword(cleanWord, country);
  }

  public createKeyword(keyword: string, country: string, language: string = "en"): KeywordRow {
    const cleanWord = keyword.trim().toLowerCase();
    const existing = this.getKeyword(cleanWord, country);
    if (existing) return existing;

    const newKeyword: KeywordRow = {
      id: "kw_" + Math.random().toString(36).substring(2, 11),
      keyword: cleanWord,
      language,
      country: country.toUpperCase(),
      created_at: new Date().toISOString()
    };

    this.tables.keywords.push(newKeyword);
    this.save();

    if (this.isPostgresActive && this.pgPool) {
      this.pgPool.query(
        "INSERT INTO keywords (id, keyword, language, country, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
        [newKeyword.id, newKeyword.keyword, newKeyword.language, newKeyword.country, newKeyword.created_at]
      ).catch((e: any) => console.error("[Postgres] createKeyword write error:", e));
    }

    return newKeyword;
  }

  public getMetrics(keywordId: string): KeywordMetricsRow | undefined {
    return this.tables.keyword_metrics.find((m) => m.keyword_id === keywordId);
  }

  public async upsertMetrics(metrics: KeywordMetricsRow) {
    const index = this.tables.keyword_metrics.findIndex(
      (m) => m.keyword_id === metrics.keyword_id
    );
    const updatedRecord = { ...metrics, updated_at: new Date().toISOString() };
    if (index >= 0) {
      this.tables.keyword_metrics[index] = updatedRecord;
    } else {
      this.tables.keyword_metrics.push(updatedRecord);
    }
    this.save();

    // Log in Keyword history table as well to store historical keyword metrics data
    this.addKeywordHistory(metrics.keyword_id, metrics.search_volume_val, parseFloat(metrics.cpc.replace(/[^\d.]/g, "")) || 0, metrics.difficulty);

    if (this.isPostgresActive && this.pgPool) {
      try {
        await this.pgPool.query(
          `INSERT INTO keyword_metrics (keyword_id, search_volume, search_volume_val, global_volume, global_volume_val, cpc, competition, difficulty, kd_label, kd_description, intent, updated_at, confidence_score, source_attribution)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (keyword_id) DO UPDATE SET
             search_volume = EXCLUDED.search_volume,
             search_volume_val = EXCLUDED.search_volume_val,
             global_volume = EXCLUDED.global_volume,
             global_volume_val = EXCLUDED.global_volume_val,
             cpc = EXCLUDED.cpc,
             competition = EXCLUDED.competition,
             difficulty = EXCLUDED.difficulty,
             kd_label = EXCLUDED.kd_label,
             kd_description = EXCLUDED.kd_description,
             intent = EXCLUDED.intent,
             updated_at = EXCLUDED.updated_at,
             confidence_score = EXCLUDED.confidence_score,
             source_attribution = EXCLUDED.source_attribution`,
          [
            metrics.keyword_id, metrics.search_volume, metrics.search_volume_val, metrics.global_volume, metrics.global_volume_val,
            metrics.cpc, metrics.competition, metrics.difficulty, metrics.kd_label, metrics.kd_description, metrics.intent,
            updatedRecord.updated_at, metrics.confidence_score || 95, metrics.source_attribution || "Default"
          ]
        );
      } catch (err) {
        console.error("[Postgres] upsertMetrics failed:", err);
      }
    }
  }

  public getTrends(keywordId: string): KeywordTrendRow[] {
    return this.tables.keyword_trends.filter((t) => t.keyword_id === keywordId);
  }

  public setTrends(keywordId: string, trends: number[]) {
    this.tables.keyword_trends = this.tables.keyword_trends.filter(
      (t) => t.keyword_id !== keywordId
    );

    trends.forEach((vol, idx) => {
      this.tables.keyword_trends.push({
        keyword_id: keywordId,
        month_index: idx,
        volume: vol,
        updated_at: new Date().toISOString()
      });
    });
    this.save();

    if (this.isPostgresActive && this.pgPool) {
      this.pgPool.query("DELETE FROM keyword_trends WHERE keyword_id = $1", [keywordId])
        .then(() => {
          trends.forEach((vol, idx) => {
            this.pgPool.query(
              "INSERT INTO keyword_trends (keyword_id, month_index, volume, updated_at) VALUES ($1, $2, $3, $4)",
              [keywordId, idx, vol, new Date()]
            ).catch((e: any) => console.error("[Postgres] trends insertion failed:", e));
          });
        })
        .catch((e: any) => console.error("[Postgres] trends delete failed:", e));
    }
  }

  public getSerpResults(keywordId: string): SerpResultRow[] {
    return this.tables.serp_results
      .filter((s) => s.keyword_id === keywordId)
      .sort((a, b) => a.position - b.position);
  }

  public setSerpResults(keywordId: string, results: Omit<SerpResultRow, "id" | "keyword_id" | "created_at">[]) {
    this.tables.serp_results = this.tables.serp_results.filter(
      (s) => s.keyword_id !== keywordId
    );

    results.forEach((r) => {
      const generatedId = "serp_" + Math.random().toString(36).substring(2, 11);
      const rowItem = {
        ...r,
        id: generatedId,
        keyword_id: keywordId,
        created_at: new Date().toISOString()
      };
      this.tables.serp_results.push(rowItem);

      // Save to ranking history to keep tracking positions over time
      this.addRankingHistory(keywordId, r.domain, r.position);

      if (this.isPostgresActive && this.pgPool) {
        this.pgPool.query(
          `INSERT INTO serp_results (id, keyword_id, position, title, url, domain, has_image, is_video_carousel, video_count, is_short_videos, short_video_count, authority_score, ref_domains, backlinks, traffic, keywords_count, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
          [
            generatedId, keywordId, r.position, r.title, r.url, r.domain, !!r.has_image, !!r.is_video_carousel, r.video_count || 0,
            !!r.is_short_videos, r.short_video_count || 0, r.authority_score || 0, r.ref_domains || "0", r.backlinks || "0", r.traffic || "0",
            r.keywords_count || 0, new Date()
          ]
        ).catch((e: any) => console.error("[Postgres] serp record write error:", e));
      }
    });
    this.save();
  }

  public getSerpFeatures(keywordId: string): SerpFeatureRow[] {
    return this.tables.serp_features.filter((f) => f.keyword_id === keywordId);
  }

  public setSerpFeatures(keywordId: string, features: string[]) {
    this.tables.serp_features = this.tables.serp_features.filter(
      (f) => f.keyword_id !== keywordId
    );

    features.forEach((feature_name) => {
      this.tables.serp_features.push({
        keyword_id: keywordId,
        feature_name,
        detected: true,
        created_at: new Date().toISOString()
      });
    });
    this.save();

    if (this.isPostgresActive && this.pgPool) {
      this.pgPool.query("DELETE FROM serp_features WHERE keyword_id = $1", [keywordId])
        .then(() => {
          features.forEach((f) => {
            this.pgPool.query(
              "INSERT INTO serp_features (keyword_id, feature_name, detected, created_at) VALUES ($1, $2, $3, $4)",
              [keywordId, f, true, new Date()]
            ).catch((e: any) => console.error("[Postgres] serp features write error:", e));
          });
        })
        .catch((e: any) => console.error("[Postgres] serp features delete error:", e));
    }
  }

  public logSearchHistory(keyword: string, country: string, device: string) {
    const historyItem: SearchHistoryRow = {
      id: "hist_" + Math.random().toString(36).substring(2, 11),
      keyword,
      country,
      device,
      searched_at: new Date().toISOString()
    };
    this.tables.search_history.push(historyItem);
    this.save();

    if (this.isPostgresActive && this.pgPool) {
      this.pgPool.query(
        "INSERT INTO search_history (id, keyword, country, device, searched_at) VALUES ($1, $2, $3, $4, $5)",
        [historyItem.id, historyItem.keyword, historyItem.country, historyItem.device, historyItem.searched_at]
      ).catch((e: any) => console.error("[Postgres] logSearchHistory error:", e));
    }

    return historyItem;
  }

  public getSearchHistory(): SearchHistoryRow[] {
    return [...this.tables.search_history].sort(
      (a, b) => new Date(b.searched_at).getTime() - new Date(a.searched_at).getTime()
    );
  }

  // --- Enterprise Extensions: Storage operations for snapshots, histories, attributions ---

  public async setSerpSnapshot(keywordId: string, rawJsonObj: any, confidence: number = 95, attribution: string = "Consensus Matrix") {
    const rawStr = JSON.stringify(rawJsonObj);
    const snapId = "snap_" + Math.random().toString(36).substring(2, 11);
    const snapItem: SerpSnapshotRow = {
      id: snapId,
      keyword_id: keywordId,
      raw_json: rawStr,
      confidence,
      source_attribution: attribution,
      created_at: new Date().toISOString()
    };

    this.tables.serp_snapshots.push(snapItem);
    this.save();

    if (this.isPostgresActive && this.pgPool) {
      this.pgPool.query(
        "INSERT INTO serp_snapshots (id, keyword_id, raw_json, confidence, source_attribution, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
        [snapItem.id, snapItem.keyword_id, snapItem.raw_json, snapItem.confidence, snapItem.source_attribution, snapItem.created_at]
      ).catch((e: any) => console.error("[Postgres] setSerpSnapshot error:", e));
    }
  }

  public addRankingHistory(keywordId: string, domain: string, position: number) {
    const rankId = "rank_" + Math.random().toString(36).substring(2, 11);
    const rankItem: RankingHistoryRow = {
      id: rankId,
      keyword_id: keywordId,
      domain,
      position,
      tracked_date: new Date().toISOString()
    };

    this.tables.ranking_history.push(rankItem);
    this.save();

    if (this.isPostgresActive && this.pgPool) {
      this.pgPool.query(
        "INSERT INTO ranking_history (id, keyword_id, domain, position, tracked_date) VALUES ($1, $2, $3, $4, $5)",
        [rankItem.id, rankItem.keyword_id, rankItem.domain, rankItem.position, rankItem.tracked_date]
      ).catch((e: any) => console.error("[Postgres] addRankingHistory error:", e));
    }
  }

  public addBacklinkHistory(domain: string, backlinksCount: number, referringDomains: number) {
    const blId = "bl_" + Math.random().toString(36).substring(2, 11);
    const blItem: BacklinkHistoryRow = {
      id: blId,
      domain: domain.toLowerCase().trim(),
      backlinks_count: backlinksCount,
      referring_domains: referringDomains,
      tracked_date: new Date().toISOString()
    };

    // Keep unique entries or push
    this.tables.backlink_history.push(blItem);
    this.save();

    if (this.isPostgresActive && this.pgPool) {
      this.pgPool.query(
        "INSERT INTO backlink_history (id, domain, backlinks_count, referring_domains, tracked_date) VALUES ($1, $2, $3, $4, $5)",
        [blItem.id, blItem.domain, blItem.backlinks_count, blItem.referring_domains, blItem.tracked_date]
      ).catch((e: any) => console.error("[Postgres] addBacklinkHistory error:", e));
    }
  }

  public addKeywordHistory(keywordId: string, volume: number, cpc: number, difficulty: number) {
    const kwhId = "kwh_" + Math.random().toString(36).substring(2, 11);
    const kwhItem: KeywordHistoryRow = {
      id: kwhId,
      keyword_id: keywordId,
      search_volume: volume,
      cpc,
      difficulty,
      tracked_date: new Date().toISOString()
    };

    this.tables.keyword_history.push(kwhItem);
    this.save();

    if (this.isPostgresActive && this.pgPool) {
      this.pgPool.query(
        "INSERT INTO keyword_history (id, keyword_id, search_volume, cpc, difficulty, tracked_date) VALUES ($1, $2, $3, $4, $5)",
        [kwhItem.id, kwhItem.keyword_id, kwhItem.search_volume, kwhItem.cpc, kwhItem.difficulty, kwhItem.tracked_date]
      ).catch((e: any) => console.error("[Postgres] addKeywordHistory error:", e));
    }
  }
}

export const dbInstance = new Database();
