/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  HelpCircle, 
  TrendingUp, 
  ExternalLink,
  Filter,
  CheckCircle2,
  Sparkles,
  Link2,
  FileText,
  AlertCircle,
  Clock,
  ArrowUpRight,
  RefreshCw,
  MessageSquare
} from "lucide-react";

// ==========================================
// 1. ORGANIC RANKINGS VIEW
// ==========================================
export function OrganicRankingsView() {
  const [domain, setDomain] = useState("SEOtool.com");
  const [searchTerm, setSearchTerm] = useState("");
  const [intentFilter, setIntentFilter] = useState<string>("All");

  const [rankings] = useState([
    { keyword: "buy hiking boots online", position: 2, volume: 45000, kd: 68, intent: "Transactional", trafficPct: 18.2, cpc: 2.45 },
    { keyword: "comfortable running shoes", position: 3, volume: 110000, kd: 82, intent: "Commercial", trafficPct: 12.4, cpc: 1.80 },
    { keyword: "best sneakers for flat feet", position: 1, volume: 18000, kd: 45, intent: "Commercial", trafficPct: 24.1, cpc: 1.15 },
    { keyword: "how to clean suede loafers", position: 5, volume: 8200, kd: 31, intent: "Informational", trafficPct: 4.8, cpc: 0.20 },
    { keyword: "retro canvas low tops", position: 4, volume: 22000, kd: 58, intent: "Transactional", trafficPct: 8.5, cpc: 1.65 },
    { keyword: "mens designer work boots", position: 7, volume: 15000, kd: 74, intent: "Transactional", trafficPct: 3.1, cpc: 3.10 },
    { keyword: "running on concrete pavement tips", position: 9, volume: 3900, kd: 22, intent: "Informational", trafficPct: 1.5, cpc: 0.10 }
  ]);

  const filtered = rankings.filter(r => {
    const matchesSearch = r.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIntent = intentFilter === "All" || r.intent === intentFilter;
    return matchesSearch && matchesIntent;
  });

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Organic Rankings Index</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track every organic landing term and Google keyword position ranking</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Targeting Website:</span>
          <input 
            type="text" 
            value={domain} 
            onChange={(e) => setDomain(e.target.value)}
            className="border border-gray-200 px-3 py-1 bg-white text-xs font-semibold rounded focus:ring-1 focus:ring-purple-500 outline-none w-36"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-450 uppercase font-bold">Total Ranked Keywords</div>
          <div className="text-2xl font-bold mt-1 text-[#111827]">4,280</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this month
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-450 uppercase font-bold">Estimated Monthly Traffic</div>
          <div className="text-2xl font-bold mt-1 text-[#111827]">241,500 <span className="text-xs text-gray-400 font-normal">visits</span></div>
          <div className="text-[10px] text-gray-400 mt-1">Average CTR percentage of top positions</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-455 uppercase font-bold">Estimated Traffic Cost Val</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600">$18,450 / mo</div>
          <div className="text-[10px] text-gray-400 mt-1">Equivalent PPC bidding valuation</div>
        </div>
      </div>

      {/* Control row */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <input
            type="text"
            placeholder="Filter list by ranking keyword term..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-4 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex gap-2 items-center">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium mr-1">Intent Category:</span>
          {["All", "Transactional", "Commercial", "Informational"].map(cat => (
            <button
              key={cat}
              onClick={() => setIntentFilter(cat)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-colors ${
                intentFilter === cat 
                  ? "bg-gray-900 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 text-[11px] font-bold text-gray-500 border-b border-gray-200 uppercase tracking-wider">
              <th className="p-4">Rank Index Keyword</th>
              <th className="p-4">Intent</th>
              <th className="p-4 text-center">Position</th>
              <th className="p-4 text-right">Search Vol</th>
              <th className="p-4 text-center">KD %</th>
              <th className="p-4 text-right">Est CPC</th>
              <th className="p-4 text-right">Traffic Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {filtered.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{item.keyword}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.intent === "Transactional" ? "bg-pink-100 text-pink-600 font-extrabold" :
                    item.intent === "Commercial" ? "bg-indigo-50 text-indigo-750" : "bg-blue-50 text-blue-700"
                  }`}>
                    {item.intent.slice(0, 4)}
                  </span>
                </td>
                <td className="p-4 text-center font-bold text-purple-650">#{item.position}</td>
                <td className="p-4 text-right font-mono text-gray-600">{item.volume.toLocaleString()}</td>
                <td className="p-4 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    item.kd > 70 ? "bg-rose-50 text-rose-600" :
                    item.kd > 40 ? "bg-yellow-50 text-yellow-600" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {item.kd}%
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-gray-600">${item.cpc.toFixed(2)}</td>
                <td className="p-4 text-right font-semibold font-mono text-gray-600">{item.trafficPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 2. TOP PAGES VIEW
// ==========================================
export function TopPagesView() {
  const [domain, setDomain] = useState("SEOtool.com");

  const [pages] = useState([
    { url: "/mens-work-hiking-boots", trafficPct: 35.8, keywords: 1420, traffic: 86000, value: 5200 },
    { url: "/womens-comfort-sandals", trafficPct: 24.2, keywords: 950, traffic: 58000, value: 3800 },
    { url: "/clearance-sale-sneakers", trafficPct: 18.5, keywords: 820, traffic: 44600, value: 2900 },
    { url: "/running-shoes-buying-guide", trafficPct: 10.4, keywords: 1100, traffic: 25000, value: 920 },
    { url: "/kids-athletic-footwear", trafficPct: 6.1, keywords: 340, traffic: 14700, value: 1050 }
  ]);

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Top Landing Pages Tracker</h1>
          <p className="text-xs text-gray-500 mt-0.5">Scan search performance rankings of each individual URL on a domain</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Target:</span>
          <input 
            type="text" 
            value={domain} 
            onChange={(e) => setDomain(e.target.value)}
            className="border border-gray-200 px-3 py-1 bg-white text-xs font-semibold rounded focus:ring-1 focus:ring-purple-500 outline-none w-32"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-800">TRAFFIC SHARE DISTRIBUTED BY URL PATH</span>
          <span className="text-xs text-gray-400 font-mono">Swept 5 hours ago</span>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/20 text-[11px] font-bold text-gray-500 border-b border-gray-200 uppercase tracking-wider">
              <th className="p-4">Landing Page Landing URL</th>
              <th className="p-4 text-right">Organic Monthly Visits</th>
              <th className="p-4 text-center">Traffic Share</th>
              <th className="p-4 text-right">No of Search Keywords</th>
              <th className="p-4 text-right">Est CPC Value Equivalent</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {pages.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-900 flex items-center gap-1.5">
                  <span className="text-purple-600 font-bold">/</span>
                  <span className="font-mono text-xs">{p.url}</span>
                </td>
                <td className="p-4 text-right font-mono text-gray-600 font-bold">{p.traffic.toLocaleString()}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                    <div className="w-16 bg-gray-100 h-2 rounded overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full" style={{ width: `${p.trafficPct}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{p.trafficPct}%</span>
                  </div>
                </td>
                <td className="p-4 text-right font-mono text-gray-600">{p.keywords.toLocaleString()}</td>
                <td className="p-4 text-right font-mono text-emerald-600 font-semibold">${p.value.toLocaleString()}</td>
                <td className="p-4 text-center">
                  <a 
                    href={`https://www.${domain}${p.url}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-[11px] text-purple-600 font-bold hover:underline"
                  >
                    Open Page <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 3. BACKLINK GAP VIEW
// ==========================================
export function BacklinkGapView() {
  const [domainA, setDomainA] = useState("SEOtool.com");
  const [domainB, setDomainB] = useState("semrush.com");
  const [domainC, setDomainC] = useState("ahrefs.com");

  const [opportunities] = useState([
    { sourceUrl: "https://www.runnerworld.com/gear-guides", da: 82, competitorA: false, competitorB: true, competitorC: true, monthlyTraffic: 420000 },
    { sourceUrl: "https://www.gq.com/style/shoes-review", da: 91, competitorA: false, competitorB: true, competitorC: false, monthlyTraffic: 1200000 },
    { sourceUrl: "https://www.businessinsider.com/best-boots-test", da: 89, competitorA: false, competitorB: true, competitorC: true, monthlyTraffic: 3100000 },
    { sourceUrl: "https://www.thespruce.com/closet-organization-racks", da: 79, competitorA: false, competitorB: false, competitorC: true, monthlyTraffic: 82000 },
    { sourceUrl: "https://www.runnerspace.com/forum", da: 56, competitorA: false, competitorB: true, competitorC: true, monthlyTraffic: 15400 }
  ]);

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Backlink Gap Intelligence</h1>
          <p className="text-xs text-gray-500 mt-0.5">Locate high-equity domains linking to competitors but missing from your profile</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <h3 className="text-xs font-bold text-gray-800 uppercase mb-3">Compare Side-by-Side</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Your Website Domain (Target)</label>
            <input 
              type="text" 
              value={domainA} 
              onChange={(e) => setDomainA(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 bg-[#f9fafb] text-xs font-semibold rounded focus:ring-1 focus:ring-purple-500 outline-none text-purple-650"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Competitor Domain #1</label>
            <input 
              type="text" 
              value={domainB} 
              onChange={(e) => setDomainB(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 bg-white text-xs rounded focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Competitor Domain #2</label>
            <input 
              type="text" 
              value={domainC} 
              onChange={(e) => setDomainC(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 bg-white text-xs rounded focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs">
          <span className="font-bold text-gray-800">5 BACKLINK GAP PROFILES FOUND</span>
          <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">High conversion opportunities</span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/20 text-[11px] font-bold text-gray-500 border-b border-gray-200 uppercase tracking-wider">
              <th className="p-4">Referring Sweep URL</th>
              <th className="p-4 text-center">Auth DA</th>
              <th className="p-4 text-center">{domainA} (You)</th>
              <th className="p-4 text-center">{domainB}</th>
              <th className="p-4 text-center">{domainC}</th>
              <th className="p-4 text-right">Mo. Traffic Referrals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {opportunities.map((opp, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-gray-900 font-mono text-[11px] truncate max-w-sm">
                  {opp.sourceUrl}
                </td>
                <td className="p-4 text-center">
                  <span className="bg-gray-100 text-gray-800 font-extrabold px-1.5 py-0.5 rounded text-[10px]">
                    {opp.da}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded text-[10px]">
                    Missing
                  </span>
                </td>
                <td className="p-4 text-center">
                  {opp.competitorB ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Linked</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {opp.competitorC ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Linked</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="p-4 text-right font-mono text-gray-500">
                  {opp.monthlyTraffic.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 4. TOPIC RESEARCH VIEW
// ==========================================
export function TopicResearchView() {
  const [query, setQuery] = useState("headless commerce");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([
    {
      title: "Headless Commerce Architecture",
      volume: "6,400",
      difficulty: "High (71%)",
      questions: [
        "What is headless commerce vs traditional commerce?",
        "Is Shopify headless commerce compatible?",
        "How much does it cost to implement headless commerce?"
      ],
      keywords: ["decoupled API platform", "nextjs ecommerce storefront", "graphql cart api"]
    },
    {
      title: "API-First Storefronts",
      volume: "2,100",
      difficulty: "Medium (48%)",
      questions: [
        "Which API storefront framework is fastest?",
        "How to secure endpoints in storefront API?",
        "React vs Vue for commerce web storefront"
      ],
      keywords: ["jamstack storefront", "commercelayer integration", "serverless checkout link"]
    },
    {
      title: "Omnichannel Headless CMS",
      volume: "1,200",
      difficulty: "Low (34%)",
      questions: [
        "Best headless CMS for multi-country shops?",
        "Can blog content merge into cart views?",
        "Does Contentful support cart checkout natively?"
      ],
      keywords: ["content model schema ecommerce", "strapi commerce modules", "dynamic localization cms"]
    }
  ]);

  const handleGenTopic = () => {
    setLoading(true);
    setTimeout(() => {
      setCards([
        {
          title: `Best ${query} variations`,
          volume: "4,600",
          difficulty: "Medium (52%)",
          questions: [
            `What is the best alternative for ${query}?`,
            `How to configure ${query} correctly?`,
            `Is ${query} free for enterprise uses?`
          ],
          keywords: [`${query} checklist pdf`, `${query} optimization`, `advanced semantic ${query}`]
        },
        ...cards
      ]);
      setLoading(false);
    }, 850);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">SaaS Semantic Topic Explorer</h1>
          <p className="text-xs text-gray-500 mt-0.5">Discover content cluster cards, search questions, and search terms around any subject</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search standard seed topics (e.g. cloud database, dropshipping, remote tools...)"
            className="w-full text-xs border border-gray-200 px-3 py-2.5 rounded focus:ring-1 focus:ring-purple-500 outline-none bg-[#f9fafb] text-[#111827] font-semibold"
          />
        </div>
        <button 
          onClick={handleGenTopic}
          disabled={loading}
          className="bg-gray-900 hover:bg-gray-850 text-white text-xs font-bold px-5 py-2.5 rounded flex items-center gap-1.5 transition-colors"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Mining ideas...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Explore Topic Clusters
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, key) => (
          <div key={key} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:border-purple-500/30 transition-all text-left flex flex-col justify-between">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <span className="text-[10px] bg-gray-100 font-bold text-gray-500 uppercase px-2 py-0.5 rounded tracking-wide">CLUSTER CARD</span>
                <span className="text-xs font-semibold text-purple-650 font-mono">{card.volume} / mo</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mt-2.5 leading-snug">{card.title}</h3>
              <div className="text-[11px] text-gray-400 mt-1">SEO Difficulty: <span className="font-semibold text-gray-700">{card.difficulty}</span></div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Questions Asked on Search</span>
                  <ul className="space-y-1">
                    {card.questions.map((q, qKey) => (
                      <li key={qKey} className="text-xs text-gray-600 flex items-start gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50/70 border-t border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Keywords to Include</span>
              <div className="flex flex-wrap gap-1">
                {card.keywords.map((kw, kwKey) => (
                  <span key={kwKey} className="text-[9px] font-semibold bg-white border border-gray-200 text-gray-600 rounded px-1.5 py-0.5">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. SEO CONTENT TEMPLATE VIEW
// ==========================================
export function SeoContentTemplateView() {
  const [topic, setTopic] = useState("sustainable bamboo coffee mugs");
  const [country, setCountry] = useState("United States");
  const [loading, setLoading] = useState(false);

  const [guidelines, setGuidelines] = useState({
    optimumWords: "1,850 - 2,100 words",
    readabilityScore: "68.2 (Flesch Easy Reading)",
    headingDensity: "H1: 1, H2: 4, H3: 6",
    competitorLinks: ["https://www.joyfulearth.com/bamboo-cup", "https://eco-living-co.org/best-reusable-mugs"],
    lsiKeywords: [
      { term: "biodegradable design structure", density: "1-2 times" },
      { term: "silicone sleeve options", density: "2-3 times" },
      { term: "dishwasher safe testing results", density: "1 time" },
      { term: "reusable cup material properties", density: "4 times" }
    ]
  });

  const handleGenerateTemplate = () => {
    setLoading(true);
    setTimeout(() => {
      setGuidelines({
        optimumWords: "1,600 - 1,950 words",
        readabilityScore: "62.4 (College / standard Level)",
        headingDensity: "H1: 1, H2: 5, H3: 4",
        competitorLinks: [`https://www.topreviews.com/best-${topic.slice(0, 5)}`, `https://wikipedia.org/wiki/${topic.slice(0, 5)}`],
        lsiKeywords: [
          { term: `${topic} buyer guide`, density: "3 times" },
          { term: `high durability index under heat`, density: "1-2 times" },
          { term: "zero waste product line comparisons", density: "1 time" },
          { term: "eco commerce carbon footprint offset", density: "2 times" }
        ]
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">SEO Content Template blueprints</h1>
          <p className="text-xs text-gray-500 mt-0.5">Auto-generate structural briefs to guide content writers based on competitor analysis</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <h3 className="text-xs font-bold text-gray-800 uppercase mb-3">Target Blueprint parameters</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input 
              type="text" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Primary SEO term to rank (e.g. keto diet plan, best remote work tool)"
              className="w-full text-xs border border-gray-200 px-3 py-2.5 rounded focus:ring-1 focus:ring-purple-500 outline-none bg-[#f9fafb] text-[#111827] font-semibold"
            />
          </div>
          <div className="w-48">
            <select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)}
              className="w-full text-xs border border-gray-200 px-3 py-2.5 rounded focus:ring-1 focus:ring-purple-500 outline-none bg-white font-semibold text-gray-700"
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
          </div>
          <button 
            onClick={handleGenerateTemplate}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs font-bold px-6 py-2.5 rounded transition-colors shadow-sm"
          >
            {loading ? "Rebuilding outline Brief..." : "Create Outline Template"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Box Column 1: Reading indicators */}
        <div className="md:col-span-1 space-y-4">
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs text-left">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Outline Stats Limits</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Recommended Length</span>
                <span className="text-sm font-bold text-gray-900 block mt-0.5">{guidelines.optimumWords}</span>
              </div>
              <hr className="border-gray-100" />
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Flesch Readability Goal</span>
                <span className="text-sm font-bold text-purple-600 block mt-0.5">{guidelines.readabilityScore}</span>
              </div>
              <hr className="border-gray-100" />
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Tag Density recommendations</span>
                <span className="text-sm font-bold text-gray-900 block mt-0.5">{guidelines.headingDensity}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs text-left">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Competitor Landing Pages Reference</h3>
            <div className="space-y-2">
              {guidelines.competitorLinks.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block text-xs font-mono text-gray-500 hover:text-purple-650 truncate hover:underline flex items-center gap-1"
                >
                  <Link2 className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                  <span className="truncate">{link}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Box Column 2: Content terms checklist */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-xs text-left">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase">Recommended semantic Keywords & Bidding Terms</h3>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono uppercase">Optimizes search index matching</span>
          </div>

          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Include the following semantically related phrases directly inside your paragraphs, headers, or alt-tags. The densities correspond to the high ranking pages in top positions:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-bold">
                  <th className="pb-2">Phrase / Term</th>
                  <th className="pb-2 text-right">Optimum Repeat frequency</th>
                  <th className="pb-2 text-right">Status Checklist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {guidelines.lsiKeywords.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-55/40">
                    <td className="py-3 font-semibold text-gray-900">{item.term}</td>
                    <td className="py-3 text-right font-mono text-gray-600 font-bold">{item.density}</td>
                    <td className="py-3 text-right">
                      <button className="text-[10px] bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 px-2.5 py-1 rounded font-bold transition-all inline-flex items-center gap-1 mr-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Mark Included
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-50/50 p-4 rounded-lg mt-5 border border-purple-100">
            <div className="flex gap-2.5">
              <Sparkles className="w-4.5 h-4.5 text-purple-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">AI Assistant Content Outline suggestion</h4>
                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                  Start with an introductory H2 clearing myths about bamboo reusable mugs, then build nested H3 components comparing thermo conductivity of dual metal cups vs raw bamboo composites. Write a strong CTA at the footer block highlighting fast shipping times.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
