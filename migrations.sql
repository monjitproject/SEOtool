-- ==========================================
-- SuiteRank SEO Caching & Historical Schema
-- Relational Database Migrations (PostgreSQL)
-- ==========================================

-- 1. Table for base queries
CREATE TABLE IF NOT EXISTS keywords (
    id VARCHAR(100) PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    country VARCHAR(10) DEFAULT 'US',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uniq_keyword_country UNIQUE (keyword, country)
);

-- 2. General metadata and metrics for keywords
CREATE TABLE IF NOT EXISTS keyword_metrics (
    keyword_id VARCHAR(100) PRIMARY KEY REFERENCES keywords(id) ON DELETE CASCADE,
    search_volume VARCHAR(50) NOT NULL,
    search_volume_val INT NOT NULL,
    global_volume VARCHAR(50) NOT NULL,
    global_volume_val INT NOT NULL,
    cpc NUMERIC(10,2) DEFAULT 0.00,
    competition NUMERIC(3,2) DEFAULT 0.00,
    difficulty INT NOT NULL CHECK (difficulty BETWEEN 0 AND 100),
    kd_label VARCHAR(50) NOT NULL,
    kd_description TEXT,
    intent TEXT[], -- PostgreSQL Array representing keyword intent e.g. ARRAY['Informational']
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Monthly trends history (12 items)
CREATE TABLE IF NOT EXISTS keyword_trends (
    keyword_id VARCHAR(100) REFERENCES keywords(id) ON DELETE CASCADE,
    month_index INT NOT NULL CHECK (month_index BETWEEN 0 AND 11),
    volume INT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (keyword_id, month_index)
);

-- 4. Organic SERP ranking entries
CREATE TABLE IF NOT EXISTS serp_results (
    id VARCHAR(100) PRIMARY KEY,
    keyword_id VARCHAR(100) REFERENCES keywords(id) ON DELETE CASCADE,
    position INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    url TEXT NOT NULL,
    domain VARCHAR(255) NOT NULL,
    has_image BOOLEAN DEFAULT FALSE,
    is_video_carousel BOOLEAN DEFAULT FALSE,
    video_count INT DEFAULT 0,
    is_short_videos BOOLEAN DEFAULT FALSE,
    short_video_count INT DEFAULT 0,
    authority_score INT DEFAULT 0,
    ref_domains VARCHAR(50) DEFAULT '0',
    backlinks VARCHAR(50) DEFAULT '0',
    traffic VARCHAR(50) DEFAULT '0',
    keywords_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SERP components tracked (snippet, search, answers)
CREATE TABLE IF NOT EXISTS serp_features (
    keyword_id VARCHAR(100) REFERENCES keywords(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    detected BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (keyword_id, feature_name)
);

-- 6. Overall user search footprints
CREATE TABLE IF NOT EXISTS search_history (
    id VARCHAR(100) PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    country VARCHAR(10) NOT NULL,
    device VARCHAR(20) NOT NULL,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_keywords_text ON keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_serp_results_keyword ON serp_results(keyword_id);
CREATE INDEX IF NOT EXISTS idx_search_history_time ON search_history(searched_at DESC);
