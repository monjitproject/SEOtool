# SuiteRank SEO Tool Platform - Professional SaaS Architecture Plan

SuiteRank is a comprehensive SEO and competitor research tool platform styled and constructed similarly to Semrush and Ahrefs. Below is a full architectural layout, styling guidelines, and database blueprint, created to support scalable SaaS operations.

---

## 1. Complete Feature Specifications

### 1.1 Dashboard & Command Center
- **Traffic Overview Widget**: Display Organic Traffic, Paid Traffic, and Trends.
- **Top Competitors Quadrant**: Relative search visibility indexes.
- **Backlink Health**: Interactive authority metric display.
- **Recent Reports & Projects Lists**: Jump directly to audits or tracking campaigns.
- **System Activity Log**: Real-time auditing for operations.

### 1.2 Search & Discovery Tools
- **Keyword Research Command (Overview & Magic Tool)**: Search terms with custom country selections and intent markers (`Informational`, `Commercial`, `Transactional`).
- **Keyword Density Sidebar & Clusters**: Automatic keyword semantic grouping categories.
- **Filter Rail**: Toggles for volume groups, CPC scales, and keyword difficulties (KD%).
- **Keyword Data-Table**: Virtualized high-efficiency layout designed to support sorting, resizing, filtering, and single-click CSV exports.
- **Domain Overview & Competitor analytics**: Multi-site overlap tracker comparing traffic, keyword holdings, and referral links across up to 5 domains.

### 1.3 Audit & Active Diagnostics
- **Site Audit Visualizer**: Site crawler simulations, Health Scores, checklists for broken links, duplicate H1s, speed benchmarks, schema diagnostics, and broken image attributes.
- **Position Tracker**: Daily ranking movements, desktop/mobile toggles, and city-level targeting configurations.
- **Backlinks Analyser**: In-depth backlinks data-table showcasing anchor texts, target targets, dofollow/nofollow status, and newly gained or lost referrer metrics.

### 1.4 AI Creation & Workflow
- **AI Blog Writer**: Create long-form draft content outline + copy with selected semantic keywords.
- **Meta Engine**: Title and description generation tuned to precise character counts.
- **Custom Report Builder**: Drag-and-drop module layout to construct custom SEO audits, schedule automatic delivery, configure white-label branding, and print or export as PDF.
- **SaaS Subscriptions Management**: Metered resource credit systems, simulated checkout pipelines for Stripe and Razorpay, and direct invoice records.

---

## 2. User Flow & Navigation Map

```
[User Login / Google Auth]
         │
         ▼
[SuiteRank Master Dashboard] 
         │
         ├─► [SEO Suite]
         │     ├── Keyword Research & Keyword Magic (Volume, KD%, Intent)
         │     ├── Keyword Gap Analysis (Overlaps & Targets)
         │     └── Position Tracking (Desktop/Mobile, Visibility Index)
         │
         ├─► [Competitor Suite]
         │     ├── Domain Overview (Organic Metrics, Competitor tables)
         │     ├── Link Analytics (Backlinks, Anchor Texts, Dofollow Filter)
         │     └── Competitor Comparison (Up to 5 Domains Stacked)
         │
         ├─► [Diagnostics & Content]
         │     ├── Site Audit (Health Score, Categories, Errors lists)
         │     └── AI SEO Content Tools (Article Generator, Briefing, Metas)
         │
         └─► [SaaS Operations]
               ├── Report Builder (Drag & Drop widgets, PDF downloads)
               ├── Account & Billing (Plans, Usage Limits, Checkout Flow)
               └── Settings & Team Seats (Seats Configuration, API Workspace)
```

---

## 3. Database Architecture (PostgreSQL Blueprint)

This normalized PostgreSQL schema supports efficient relations, user workspaces, keyword lists, auditing tables, and real-time rank tracking points.

```sql
-- Create Enum Types
CREATE TYPE user_role AS ENUM ('member', 'admin', 'owner');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'business', 'enterprise');
CREATE TYPE keyword_intent AS ENUM ('informational', 'commercial', 'transactional', 'navigational');

-- Users & Subscriptions
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier subscription_tier DEFAULT 'free',
    credits_allotted INTEGER DEFAULT 100,
    credits_used INTEGER DEFAULT 0,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    renews_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization & Workspace Sharing
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'member',
    PRIMARY KEY (team_id, user_id)
);

-- Projects Management
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_domain VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword Magic Cache and Search History
CREATE TABLE base_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword VARCHAR(255) UNIQUE NOT NULL,
    volume INTEGER NOT NULL,
    difficulty INTEGER CHECK (difficulty BETWEEN 0 AND 100),
    intent keyword_intent DEFAULT 'informational',
    cpc NUMERIC(5,2),
    competition_density NUMERIC(3,2),
    serp_features TEXT[], -- e.g. ['snippet', 'people_also_ask', 'images']
    history_trend JSONB, -- Array of 12-month coordinates [Jan, Feb, ...]
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Tracking Lists
CREATE TABLE tracked_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    keyword_text VARCHAR(255) NOT NULL,
    target_country VARCHAR(10) DEFAULT 'US',
    target_device VARCHAR(10) DEFAULT 'desktop',
    current_position INTEGER,
    previous_position INTEGER,
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE position_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracked_keyword_id UUID REFERENCES tracked_keywords(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    recorded_at DATE DEFAULT CURRENT_DATE
);

-- Backlink Records Cache
CREATE TABLE backlinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_domain VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    anchor_text TEXT NOT NULL,
    target_url TEXT NOT NULL,
    is_nofollow BOOLEAN DEFAULT FALSE,
    authority_score INTEGER CHECK (authority_score BETWEEN 0 AND 100),
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Audit Campaign Checks
CREATE TABLE site_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    health_score INTEGER NOT NULL,
    pages_crawled INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    warnings_count INTEGER DEFAULT 0,
    notices_count INTEGER DEFAULT 0,
    audit_payload JSONB, -- Detailed issues log
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports Builder Templates
CREATE TABLE pdf_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    widgets_layout JSONB NOT NULL, -- Grid positions and attributes
    is_scheduled BOOLEAN DEFAULT FALSE,
    recipient_emails TEXT[],
    white_labeled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. API Architecture & REST Specifications

### Auth Endpoints
- `POST /api/auth/register` - Setup payload structures
- `POST /api/auth/login` - Handles credentials/SSO tokens
- `GET /api/auth/me` - Direct parsing of JWT scopes

### Search & Insights Proxy
- `GET /api/seo/keyword?q=<text>&country=<country>` - Fetch metrics profile
- `GET /api/seo/keyword-magic?q=<text>` - Generates 1,000 keyword lists including intent clustering
- `GET /api/seo/domain?domain=<url>` - Return traffic figures, backlinks counts, top competing domains
- `POST /api/seo/competitors/compare` - Payload containing up to 5 URLs. Computes overlapping keyword vectors.

### Active Auditing & Diagnostics
- `GET /api/audits/site-health?project_id=<id>` - Crawl statistics, detailed categorization
- `GET /api/tracker/rankings?project_id=<id>` - Daily history of tracks, coordinates
- `POST /api/backlinks/query` - Gathers backlink domains, filter options (Dofollow, Anchor Text etc.)

### AI Engine (Powered by Gemini 3.5 Flash)
- `POST /api/ai/content-brief` - Generate localized outline structure including targeted search triggers.
- `POST /api/ai/generate-article` - Compose full section outlines and markdown articles packed with selected terms.
- `POST /api/ai/optimize-meta` - Suggest CTR Title configurations and description strings within characters.

### Subscriptions & Invoicing
- `POST /api/billing/create-checkout` - Launch simulated Stripe/Razorpay forms.
- `POST /api/billing/consume-credits` - Reduce client credit quotas dynamically per request.
- `GET /api/billing/invoices` - Track paid transactions.

---

## 5. Modern SaaS Design System (Inspired by SEMrush)

### 5.1 Typography Presets
Built using the unified **Inter** font family, optimizing visual grid hierarchies.
```css
--font-sans: 'Inter', system-ui, sans-serif;
```
- **Display Giant**: `text-4xl font-bold tracking-tight text-gray-900 leading-tight` (36px)
- **Section Heading**: `text-xl font-semibold tracking-tight text-gray-900` (20px)
- **Table / Label UI**: `text-sm font-medium text-gray-700` (14px)
- **Numerical / Analytics data**: `font-mono tracking-wide text-gray-900`

### 5.2 Enterprise Palette Map
- **Primary Action (SEMrush Vermillion)**: `#ff642d` | `bg-[#ff642d]` -> For high-importance callouts, actions, main interactive state.
- **Secondary Dark**: `#111827` (Charcoal) | `bg-[#111827]` -> Dominant typography background, header borders.
- **Base Background**: `#ffffff` (White canvas).
- **Secondary Gray**: `#f3f4f6` (Soft Off-White) | `bg-[#f3f4f6]` -> For table headers, disabled buttons, and secondary panels.
- **Intent Colors**:
  - `Informational` -> Purple (`#a855f7` / `bg-purple-50`)
  - `Commercial` -> Cyan (`#06b6d4` / `bg-cyan-50`)
  - `Transactional` -> Green (`#10b981` / `bg-emerald-50`)
  - `Navigational` -> Yellow (`#f59e0b` / `bg-amber-50`)

### 5.3 Modular Layout Standards
- **Buttons**:
  - Primary: `bg-[#ff642d] hover:bg-[#e05320] text-white font-medium py-2 px-4 rounded transition-all shadow-sm shadow-[#ff642d]/10`
  - Secondary: `bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded transition-all`
- **Cards**:
  - `bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`
- **Tables**:
  - Row Hovering: `hover:bg-gray-50`
  - Headers: `bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider py-3 px-4 border-b border-gray-200`

---

## 6. Implementation Roadmap

### Phase 1: Interactive Dashboard & UI Base (Milestone 1)
- Construct Left Sidebar and Collapsible Navigation systems with dynamic active route handling.
- Build the core design system components (Table controls, Cards, standard charts, responsive grids).

### Phase 2: SEO Analytics and Search Engines (Milestone 2)
- Program high-performance mock engine that generates tailored competitor overlays, keyword trends matching URL semantics.
- Build Keyword Magic research tables with column sorting, paging, filtering, clustering, and live CSV data downloads.

### Phase 3: Crawling Simulation & Backlinks (Milestone 3)
- Deliver Site Audit health progress visualizers, category lists, action checklists.
- Activate Backlink trackers together with organic visibility dashboards.

### Phase 4: Gemini AI Tools & Interactive Reports (Milestone 4)
- Set up Express Gemini proxy endpoints to connect the workspace with the real model server-side.
- Integrate active article generation, meta optimizer toolkits.
- Complete reports builder allowing users to assemble, white-label, schedule, and trigger file printing/downloads.
- Deliver SaaS Billing usage widgets alongside animated payment modals.
