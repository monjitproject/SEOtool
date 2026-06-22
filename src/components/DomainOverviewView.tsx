/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Search, 
  TrendingUp, 
  Link2, 
  Activity, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  ExternalLink,
  Calendar,
  HelpCircle,
  Download,
  Monitor,
  Smartphone,
  FileText,
  CheckCircle,
  Info,
  RefreshCw,
  Layers,
  DollarSign,
  PieChart,
  BarChart as BarChartIcon,
  Filter,
  Check,
  AlertTriangle
} from "lucide-react";

interface DomainOverviewProps {
  initialDomain?: string;
  onCompareRequest?: (domain: string) => void;
}

export default function DomainOverviewView({ initialDomain = "SEOtool.com", onCompareRequest }: DomainOverviewProps) {
  const [domainQuery, setDomainQuery] = useState(initialDomain);
  const [activeDomain, setActiveDomain] = useState(initialDomain);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [countryFilter, setCountryFilter] = useState<"Worldwide" | "US" | "UK" | "DE" | "IN">("Worldwide");
  const [deviceFilter, setDeviceFilter] = useState<"desktop" | "mobile">("desktop");
  const [timeframe, setTimeframe] = useState<"1M" | "6M" | "1Y" | "2Y" | "All time">("2Y");
  const [activeTab, setActiveTab] = useState<"Overview" | "Growth" | "Countries">("Overview");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "INR">("USD");
  const [selectedDate, setSelectedDate] = useState("Jun 21, 2026");

  // Chart visibility states (matching the checkboxes in "Traffic")
  const [showOrganicTraffic, setShowOrganicTraffic] = useState(true);
  const [showPaidTraffic, setShowPaidTraffic] = useState(true);
  const [showBrandedTraffic, setShowBrandedTraffic] = useState(true);

  // New states for Advanced Semrush design mapping
  const [chartTab, setChartTab] = useState<"traffic" | "keywords">("traffic");
  const [showTop3, setShowTop3] = useState(true);
  const [showTop4_10, setShowTop4_10] = useState(true);
  const [showTop11_20, setShowTop11_20] = useState(true);
  const [showTop21_50, setShowTop21_50] = useState(true);
  const [showTop51_100, setShowTop51_100] = useState(true);
  const [showAiOverviews, setShowAiOverviews] = useState(true);
  const [showOtherSerp, setShowOtherSerp] = useState(true);

  // Keyword Research Search Filter
  const [keywordSearchQuery, setKeywordSearchQuery] = useState("");
  
  // Topic generation simulated state
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [topicsList, setTopicsList] = useState<string[]>([]);

  // Simulation of Paid campaigns (allows the user to "turn on" ads to test functionality)
  const [simulateActivePaidCampaigns, setSimulateActivePaidCampaigns] = useState(false);

  // Export progress animation State
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Growth Trend Chart Hovers & Data
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  const trends6M = React.useMemo(() => {
    if (!data) return [];
    const finalTraffic = data.organicTraffic;
    const pctChange = data.organicTrafficChange || 0;
    const monthNames = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"];
    
    // Calculate past traffic points based on percentage changes
    const changeRatio = 1 - (pctChange / 100);
    const baseFactors = [changeRatio, changeRatio * 0.96, changeRatio * 1.03, 1.06, 1.02, 1.0];
    
    return monthNames.map((month, idx) => {
      let factor = baseFactors[idx];
      if (idx === 5) factor = 1.0;
      
      const seedVal = (activeDomain.length + idx) % 5;
      const microVariance = (seedVal - 2) * 0.008;
      const val = Math.round(finalTraffic * (factor + (idx === 5 ? 0 : microVariance)));
      
      return {
        month,
        traffic: val > 0 ? val : 1000
      };
    });
  }, [data, activeDomain]);

  // Pre-calculate chart metrics for elegant SVG plotting
  const chartConfig = React.useMemo(() => {
    if (trends6M.length === 0) return null;
    const trafficList = trends6M.map((t: any) => t.traffic);
    const minVal = Math.min(...trafficList) * 0.9;
    const maxVal = Math.max(...trafficList) * 1.1;
    const rangeDiff = maxVal - minVal || 1;
    
    // Build coordinate steps (X: 50 to 670, Y: 15 to 105)
    const coordinates = trends6M.map((pt: any, idx: number) => {
      const x = 50 + idx * 124;
      const y = 105 - ((pt.traffic - minVal) / rangeDiff) * 90;
      return { x, y, ...pt };
    });

    const lineD = "M " + coordinates.map(c => `${c.x} ${c.y}`).join(" L ");
    const areaD = `${lineD} L 670 120 L 50 120 Z`;

    return {
      minVal,
      maxVal,
      rangeDiff,
      coordinates,
      lineD,
      areaD
    };
  }, [trends6M]);

  // Fetch Domain Details from the Real API route
  const fetchDomainData = async (domain: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/seo/domain-overview?domain=${encodeURIComponent(domain)}`);
      if (!resp.ok) {
        throw new Error("Unable to retrieve analytical intelligence for that domain.");
      }
      const json = await resp.json();
      setData(json);
      setTopicsList([]); // Reset topic generator on new search
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainData(activeDomain);
  }, [activeDomain]);

  const handleSearchTrigger = () => {
    const cleanDomain = domainQuery.trim().toLowerCase().replace(/https?:\/\//, "").split("/")[0];
    if (cleanDomain) {
      setActiveDomain(cleanDomain);
    }
  };

  // Simulated PDF Export
  const triggerPdfExport = () => {
    setExporting(true);
    setExportSuccess(false);
    setExportProgress(10);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExporting(false);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 4000);
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  // Simulated AI Topics Generator
  const generateAiTopics = () => {
    setLoadingTopics(true);
    setTimeout(() => {
      setLoadingTopics(false);
      setTopicsList([
        `Core General Studies Syllabus & High-Yield Subsections for UPSC`,
        `Daily National & International Current Affairs Summary Archive`,
        `Indian History Timeline Outline (Ancient, Medieval & Modern Movements)`,
        `Objective GK Mock Test Series & Score Benchmarkers`,
        `Indian Polity Constitutional Amendments Cheat Sheets`,
        `General Science & Environment Topics targeted by state PSC exams`
      ]);
    }, 1500);
  };

  if (loading) {
    return (
      <div id="loading-container-seo" className="min-h-screen bg-[#f4f5f7] p-8 flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
        </div>
        <p className="text-gray-500 text-sm font-semibold animate-pulse font-sans">
          Simulating SEMrush live crawl... analyzing {activeDomain}
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div id="error-container-seo" className="bg-white border border-red-200 rounded-xl p-8 max-w-xl mx-auto my-12 text-center text-sans shadow-sm">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Analysis Sweep Failed</h3>
        <p className="text-sm text-gray-500 mt-2">{error || "Could not retrieve analytical data"}</p>
        <button 
          onClick={() => setActiveDomain("SEOtool.com")}
          className="mt-5 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors"
        >
          Reset to SEOtool.com
        </button>
      </div>
    );
  }

  // Filter components locally
  const filteredKeywords = data.topOrganicKeywords.filter((kw: any) => 
    kw.keyword.toLowerCase().includes(keywordSearchQuery.toLowerCase())
  );

  return (
    <div id="domain-overview-screen" className="bg-[#f4f5f7] min-h-screen text-sans pr-2 pl-2 md:pr-4 md:pl-4 pb-12 text-left">
      
      {/* 1. Breadcrumb and Dashboard Actions */}
      <div className="max-w-[1400px] mx-auto pt-4 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span>SEO</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Domain Overview</span>
        </div>
        
        {/* User Manual and Export controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <button className="text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer">
            <span className="bg-blue-50 text-blue-600 rounded px-1.5 py-0.5 font-bold text-[10px]">?</span>
            User manual
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1 font-medium cursor-pointer">
            <FileText className="w-3.5 h-3.5" />
            Send feedback
          </button>
          <span className="text-gray-300">|</span>
          <button 
            id="pdf-export-button"
            onClick={triggerPdfExport}
            disabled={exporting}
            className="bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            {exporting ? `Exporting PDF (${exportProgress}%)` : "Export to PDF"}
          </button>
        </div>
      </div>

      {/* Export progress toast overlay */}
      {exporting && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3 w-80 text-sans animate-bounce border border-gray-800 md:bottom-12">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-purple-400 border-gray-600"></div>
          <div className="flex-1">
            <p className="text-xs font-bold">Building SEO Intelligence Summary</p>
            <div className="w-full bg-gray-700 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-purple-400 h-full transition-all duration-150" style={{ width: `${exportProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Export success banner */}
      {exportSuccess && (
        <div className="max-w-[1400px] mx-auto mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 flex items-center justify-between text-xs font-semibold animate-pulse">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Success! The PDF Report containing authority metrics, dynamic backlink audits, and country trends has been successfully compiled and saved.</span>
          </span>
          <button onClick={() => setExportSuccess(false)} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>
      )}

      {/* 2. Main Title Row with Domain Lookup & 6-Month Trend Chart */}
      <div id="main-title-lookup-card-container" className="max-w-[1400px] mx-auto mt-4">
        <div id="main-title-lookup-card" className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs mb-6 text-left">
          
          {/* Top segment: Title information & lookup input */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-gray-150 mb-5">
            <div className="text-left flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[28px] sm:text-[34px] font-bold font-sans text-gray-900 flex items-center gap-2">
                  Domain Overview:
                  <span className="text-[#ff642d] hover:underline font-extrabold flex items-center gap-1.5 transition-colors">
                    {activeDomain}
                  </span>
                </h1>
                <a 
                  href={`https://${activeDomain}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                  title="Visit Live Domain"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Explore absolute visibility ratings, organic footprint, paid CPC estimations, backlinks citation health, and traffic share divisions.
              </p>
            </div>

            {/* Domain search controller */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:w-full lg:w-auto max-w-xl">
              <div className="relative flex-1 sm:w-80">
                <input 
                  type="text" 
                  value={domainQuery}
                  onChange={(e) => setDomainQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearchTrigger(); }}
                  placeholder="Lookup another domain (e.g. techcrunch.com)..."
                  className="w-full bg-[#f9fafb] border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-shadow font-sans"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <button 
                id="analyze-domain-button"
                onClick={handleSearchTrigger}
                className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap"
              >
                Analyze Domain
              </button>
            </div>
          </div>

          {/* Bottom segment: Highly polished visual 6-Month Traffic Growth Trends chart */}
          {chartConfig && (
            <div id="six-month-traffic-trend-section" className="pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <TrendingUp className={`w-3.5 h-3.5 ${data?.organicTrafficChange < 0 ? "text-red-500" : "text-emerald-500"}`} />
                    6-MONTH TRAFFIC GROWTH TRENDS
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-none font-medium">
                    Estimated monthly organic visitor volume for {activeDomain} over the preceding 6 months
                  </p>
                </div>
                
                {/* Micro indicators */}
                <div className="flex items-center gap-2.5">
                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 text-[11px] font-sans">
                    <span className="text-gray-400 font-bold">Growth Rate:</span>
                    <span id="six-month-growth-rate-badge" className={`font-black font-mono ml-1.5 ${data?.organicTrafficChange < 0 ? "text-red-500" : "text-emerald-600"}`}>
                      {data?.organicTrafficChange < 0 ? "" : "+"}{data?.organicTrafficChange}%
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 text-[11px] font-sans">
                    <span className="text-gray-400 font-bold">Monthly Average:</span>
                    <span className="font-extrabold text-slate-800 font-mono ml-1.5">
                      {Math.round(trends6M.reduce((sum: number, item: any) => sum + item.traffic, 0) / 6).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-stretch">
                {/* Left Mini Metric Highlights card */}
                <div id="six-month-stats-card" className="bg-[#f9fafb] border border-gray-150 p-4 rounded-xl flex flex-col justify-between min-h-[145px] md:col-span-1">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] uppercase font-black text-gray-400 block leading-none tracking-widest">Growth Peak</span>
                      <span className="text-base font-extrabold font-mono text-gray-900 mt-1 block">
                        {Math.max(...trends6M.map((t: any) => t.traffic)).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-black text-gray-400 block leading-none tracking-widest">Base Floor</span>
                      <span className="text-base font-extrabold font-mono text-gray-700 mt-1 block">
                        {Math.min(...trends6M.map((t: any) => t.traffic)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Current Month Active Status indicator */}
                  <div className="border-t border-gray-200/60 pt-2 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-gray-400 font-bold">Jun 2026</span>
                    <span className="font-black text-purple-600 font-mono">
                      {data?.organicTraffic?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Right Interactive SVG Chart Card */}
                <div id="six-month-timeline-svg-wrapper" className="bg-white border border-gray-150 p-3.5 rounded-xl md:col-span-3 relative h-[145px] flex flex-col justify-end">
                  
                  {/* Hover Popover Tooltip */}
                  {hoveredTrendIndex !== null && (
                    <div 
                      id="six-month-hover-popover"
                      className="absolute z-10 bg-slate-900 text-white rounded-lg p-2.5 text-[10px] shadow-lg border border-slate-800 transition-all duration-75 pointer-events-none text-sans font-sans"
                      style={{
                        left: `${Math.min(500, Math.max(10, (50 + hoveredTrendIndex * 124) - 50))}px`,
                        top: "5px"
                      }}
                    >
                      <div className="font-extrabold text-slate-300">{trends6M[hoveredTrendIndex].month}</div>
                      <div className="font-black text-purple-300 font-mono text-[11px] mt-0.5">
                        {trends6M[hoveredTrendIndex].traffic.toLocaleString()} visitors
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {hoveredTrendIndex === 0 ? "Initial period" : (
                          () => {
                            const prev = trends6M[hoveredTrendIndex - 1].traffic;
                            const curr = trends6M[hoveredTrendIndex].traffic;
                            const diff = curr - prev;
                            const pct = Math.round((diff / prev) * 100);
                            return `${pct >= 0 ? "▲ +" : "▼ "}${pct}% month-over-month`;
                          }
                        )()}
                      </div>
                    </div>
                  )}

                  <div className="w-full h-full relative">
                    <svg className="w-full h-full" viewBox="0 0 700 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="sixMonthAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Reference Grid lines */}
                      <line x1="50" y1="15" x2="670" y2="15" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="50" y1="60" x2="670" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="50" y1="105" x2="670" y2="105" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Y-axis compact markers */}
                      <text x="10" y="18" fill="#94a3b8" fontSize="8" fontWeight="bold" className="font-sans font-mono">
                        {chartConfig.maxVal >= 1000000 
                          ? `${(chartConfig.maxVal / 1000000).toFixed(1)}M` 
                          : `${Math.round(chartConfig.maxVal / 1000)}K`}
                      </text>
                      <text x="10" y="63" fill="#94a3b8" fontSize="8" fontWeight="bold" className="font-sans font-mono">
                        {((chartConfig.maxVal + chartConfig.minVal) / 2) >= 1000000 
                          ? `${(((chartConfig.maxVal + chartConfig.minVal) / 2) / 1000000).toFixed(1)}M` 
                          : `${Math.round(((chartConfig.maxVal + chartConfig.minVal) / 2) / 1000)}K`}
                      </text>
                      <text x="10" y="108" fill="#94a3b8" fontSize="8" fontWeight="bold" className="font-sans font-mono">
                        {chartConfig.minVal >= 1000000 
                          ? `${(chartConfig.minVal / 1000000).toFixed(1)}M` 
                          : `${Math.round(chartConfig.minVal / 1000)}K`}
                      </text>

                      {/* Vertical guidance indicator line on hover */}
                      {hoveredTrendIndex !== null && (
                        <line 
                          x1={chartConfig.coordinates[hoveredTrendIndex].x} 
                          y1="10" 
                          x2={chartConfig.coordinates[hoveredTrendIndex].x} 
                          y2="110" 
                          stroke="#a855f7" 
                          strokeWidth="1.2" 
                          strokeDasharray="2 2" 
                          opacity="0.5"
                        />
                      )}

                      {/* Area gradient fill under the line path */}
                      <path d={chartConfig.areaD} fill="url(#sixMonthAreaGrad)" />

                      {/* Primary trend drawing line */}
                      <path 
                        d={chartConfig.lineD} 
                        fill="none" 
                        stroke="#8b5cf6" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />

                      {/* Focus circles and responsive drag-grids */}
                      {chartConfig.coordinates.map((pt, idx) => (
                        <g key={idx} className="cursor-pointer">
                          <circle 
                            cx={pt.x} 
                            cy={pt.y} 
                            r={hoveredTrendIndex === idx ? "5.5" : "3.5"} 
                            fill={hoveredTrendIndex === idx ? "#8b5cf6" : "#ffffff"} 
                            stroke="#8b5cf6" 
                            strokeWidth={hoveredTrendIndex === idx ? "2.5" : "1.8"} 
                            className="transition-all duration-150"
                          />

                          {/* Transparent overlay for comfortable mouse hover */}
                          <rect 
                            id={`six-month-hover-rect-${idx}`}
                            x={pt.x - 25} 
                            y="0" 
                            width="50" 
                            height="120" 
                            fill="transparent" 
                            onMouseEnter={() => setHoveredTrendIndex(idx)}
                            onMouseLeave={() => setHoveredTrendIndex(null)}
                          />
                        </g>
                      ))}
                    </svg>

                    {/* Timeline labels bar */}
                    <div className="absolute bottom-[-18px] left-0 right-0 flex justify-between px-[50px] text-[9px] font-black text-gray-400 uppercase font-sans tracking-wide">
                      {trends6M.map((pt: any, idx: number) => (
                        <span 
                          key={idx} 
                          className={`transition-colors duration-150 ${hoveredTrendIndex === idx ? "text-purple-600 font-extrabold" : ""}`}
                        >
                          {pt.month.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* 3. Global Filters Dashboard Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
          
          {/* Country Quick Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mr-2 shrink-0">Focus:</span>
            {[
              { id: "Worldwide", label: "Worldwide", flag: "🌐" },
              { id: "IN", label: "US", flag: "🇺🇸" }, // Mapping labels based on Semrush UI screenshot
              { id: "US", label: "UK", flag: "🇬🇧" },
              { id: "UK", label: "DE", flag: "🇩🇪" },
              { id: "DE", label: "IN", flag: "🇮🇳" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCountryFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  countryFilter === tab.id 
                    ? "bg-purple-50 text-purple-700 border border-purple-200" 
                    : "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span>{tab.flag}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Sub parameters row */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Device selector */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 font-semibold text-xs border border-gray-200">
              <button 
                onClick={() => setDeviceFilter("desktop")}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${deviceFilter === "desktop" ? "bg-white text-purple-700 shadow-2xs font-extrabold" : "text-gray-600 hover:text-gray-900"}`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button 
                onClick={() => setDeviceFilter("mobile")}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${deviceFilter === "mobile" ? "bg-white text-purple-700 shadow-2xs font-extrabold" : "text-gray-600 hover:text-gray-900"}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Date Dropping simulator */}
            <div className="relative">
              <select 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              >
                <option>Jun 21, 2026</option>
                <option>May 15, 2026</option>
                <option>Jan 01, 2026</option>
                <option>Dec 31, 2025</option>
              </select>
            </div>

            {/* Currency select */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-white border border-gray-300 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Subnavigation Tabs for Domain Views */}
        <div className="flex border-b border-gray-200 mb-6 font-semibold">
          {[
            { id: "Overview", label: "Overview" },
            { id: "Growth", label: "Growth report" },
            { id: "Countries", label: "Compare by countries" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-5 text-sm transition-all relative font-bold cursor-pointer ${
                activeTab === tab.id 
                  ? "text-purple-600 border-b-2 border-purple-600 font-extrabold" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 5. TOP CARDS SECTION - TWO PANELS SIDE BY SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          
          {/* Card Left Panel: AI Search Metrics */}
          <div className="lg:col-span-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-5 rounded-2xl border border-purple-100 shadow-2xs text-left">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100/60 mb-4">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI SEARCH CITATION SUMMARY
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" title="Measures domain presence and visibility within ChatGPT and Gemini citation sources." />
            </div>

            {/* AI Search Key numbers */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-3xs">
                <span className="text-[9px] text-gray-400 uppercase font-semibold block leading-none">AI Visibility</span>
                <span className="text-2xl font-extrabold text-purple-600 block mt-1">{data.aiVisibility}%</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-3xs">
                <span className="text-[9px] text-gray-400 uppercase font-semibold block leading-none">Mentions</span>
                <span className="text-2xl font-extrabold text-gray-900 block mt-1">{data.mentions}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-3xs">
                <span className="text-[9px] text-gray-400 uppercase font-semibold block leading-none">Cited Pages</span>
                <span className="text-2xl font-extrabold text-gray-900 block mt-1">{data.citedPages}</span>
              </div>
            </div>

            {/* AI Placement table */}
            <div className="space-y-2 bg-white/70 p-3 rounded-xl border border-purple-50">
              <div className="flex justify-between text-[10px] text-gray-400 font-bold border-b border-gray-100 pb-1.5">
                <span>AI Chat Engine</span>
                <span className="text-right">Placements / Documents Cited</span>
              </div>
              {data.aiPlacements.map((item: any, id: number) => (
                <div key={id} className="flex justify-between items-center text-xs text-gray-700">
                  <span className="font-semibold">{item.platform}</span>
                  <span className="text-right font-mono">
                    <span className="text-purple-600 font-bold">{item.value}</span>
                    <span className="text-gray-300 mx-1">/</span>
                    <span className="text-gray-600">{item.citedDocs}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card Right Panel: Classic SEO Metrics Grid */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-150">
            
            {/* Column 1: Authority Score & Traffic Share */}
            <div className="flex flex-col justify-between pr-4 text-left pb-4 lg:pb-0">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider flex items-center gap-1 mb-1">
                  Authority Score <HelpCircle className="w-3 h-3 text-gray-300" />
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#4f46e5] font-sans">{data.authorityScore}</span>
                </div>
                <span className="mt-2 inline-block text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                  {data.authorityScoreLabel}
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100/60">
                <span className="text-[10px] text-gray-450 uppercase font-bold tracking-wider block mb-1">Traffic Share 🇺🇸</span>
                <span className="text-2xl font-black text-slate-800 block">{data.trafficSharePct}%</span>
              </div>
            </div>

            {/* Column 2: Organic Traffic & Organic Keywords */}
            <div className="flex flex-col justify-between px-4 text-left pb-4 lg:pb-0 pt-4 lg:pt-0">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider flex items-center gap-1 mb-1">
                  Organic Traffic <HelpCircle className="w-3 h-3 text-gray-300" />
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-[#3b82f6] font-sans">
                    {data.organicTraffic >= 1000000 
                      ? `${(data.organicTraffic / 1000000).toFixed(0)}M` 
                      : data.organicTraffic.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded font-mono ${data.organicTrafficChange < 0 ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}>
                    {data.organicTrafficChange}%
                  </span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100/60 font-sans">
                <span className="text-[10px] text-gray-450 uppercase font-bold tracking-wider block mb-1">Organic Keywords</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-800 font-sans">
                    {data.organicKeywords >= 1000 
                      ? `${(data.organicKeywords / 1000).toFixed(1)}K` 
                      : data.organicKeywords}
                  </span>
                  <span className={`text-[10px] font-semibold ${data.organicKeywordsChange < 0 ? "text-red-500" : "text-emerald-00"}`}>
                    {data.organicKeywordsChange}%
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Paid Traffic & Paid Keywords */}
            <div className="flex flex-col justify-between px-4 text-left pb-4 lg:pb-0 pt-4 lg:pt-0">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider flex items-center gap-1 mb-1">
                  Paid Traffic <HelpCircle className="w-3 h-3 text-gray-300" />
                </span>
                <span className="text-3xl font-extrabold text-slate-800 font-sans">
                  {simulateActivePaidCampaigns ? "12.4K" : data.paidTraffic}
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100/60 font-sans">
                <span className="text-[10px] text-gray-450 uppercase font-bold tracking-wider block mb-1">Paid Keywords</span>
                <span className="text-2xl font-black text-slate-800 block">
                  {simulateActivePaidCampaigns ? "145" : data.paidKeywords}
                </span>
              </div>
            </div>

            {/* Column 4: Ref. Domains & Backlinks */}
            <div className="flex flex-col justify-between pl-4 text-left pt-4 lg:pt-0">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider flex items-center gap-1 mb-1">
                  Ref. Domains <HelpCircle className="w-3 h-3 text-gray-300" />
                </span>
                <span className="text-3xl font-extrabold text-slate-800 font-sans">
                  {(data.referringDomainsCount / 1000).toFixed(1)}K
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100/60 font-sans">
                <span className="text-[10px] text-gray-450 uppercase font-bold tracking-wider block mb-1">Backlinks</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-800 font-sans">
                    {data.backlinksCount >= 1000 
                      ? `${(data.backlinksCount / 1000).toFixed(1)}K` 
                      : data.backlinksCount}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-extrabold font-mono">+{data.backlinksChange}%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 6. CHARTS & DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          
          {/* LEFT SUB-PANEL: Distribution Table, Cited Sources, SERP pie */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Country Distribution card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-100 pb-2">
                Distribution by Country
              </h3>
              <div className="space-y-2.5">
                {data.distributionByCountry.map((item: any, id: number) => (
                  <div key={id} className="flex items-center justify-between text-xs text-gray-700">
                    <span className="font-semibold flex items-center gap-1.5 truncate">
                      <span className="font-mono bg-gray-50 text-gray-400 text-[10px] px-1 py-0.5 rounded">
                        {item.country.substring(0, 3).toUpperCase()}
                      </span>
                      <span className="truncate">{item.country}</span>
                    </span>
                    <span className="font-mono text-right flex items-center gap-3">
                      <span className="text-purple-600 font-bold">{item.visibility}%</span>
                      <span className="text-gray-400 text-[10px] w-12 text-left shrink-0">{item.mentions}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cited Sources card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-100 pb-2">
                Top Cited Sources
              </h3>
              <div className="space-y-2.5">
                {data.topCitedSources.map((item: any, id: number) => (
                  <div key={id} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-600 hover:underline cursor-pointer truncate">
                      {item.domain}
                    </span>
                    <span className="font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-extrabold text-[10px]">
                      {item.mentions} mentions
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google SERP Positions block */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-100 pb-2">
                Google SERP Positions Distribution
              </h3>
              
              {/* Fake Donut visualization using custom SVG elements */}
              <div className="flex items-center gap-4 py-2">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="2.5"></circle>
                    {/* Organic: 95.7% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="95.7 4.3" strokeDashoffset="0"></circle>
                    {/* Overviews: 2.1% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="2.1 97.9" strokeDashoffset="-95.7"></circle>
                    {/* Special features: 2.2% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="2.2 97.8" strokeDashoffset="-97.8"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[9px] text-gray-400 font-bold block uppercase leading-none">TOTAL</span>
                    <span className="text-xs font-black text-gray-900">100%</span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 text-xs">
                  {data.googleSerpPositionDistribution.map((item: any, id: number) => (
                    <div key={id} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full block shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="text-gray-600 truncate">{item.category}</span>
                      <span className="font-mono font-black text-gray-900 ml-auto">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SUB-PANEL: Highly functional layered Traffic & Keywords Graph Area */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs text-left flex flex-col justify-between">
            <div>
              {/* Traffic / Keywords Head Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2 mb-4">
                <div className="flex items-center gap-4 border-b border-transparent">
                  <button 
                    onClick={() => setChartTab("traffic")}
                    className={`text-sm font-extrabold pb-2 transition-all relative cursor-pointer ${
                      chartTab === "traffic" ? "text-slate-900 border-b-2 border-[#ff642d]" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    Traffic
                  </button>
                  <button 
                    onClick={() => setChartTab("keywords")}
                    className={`text-sm font-extrabold pb-2 transition-all relative cursor-pointer ${
                      chartTab === "keywords" ? "text-slate-900 border-b-2 border-[#ff642d]" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    Keywords
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Time range switcher */}
                  <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-205 font-bold text-[10px]">
                    {["1M", "6M", "1Y", "2Y", "All time"].map(tf => (
                      <button 
                        key={tf}
                        onClick={() => setTimeframe(tf as any)}
                        className={`px-2 py-1 rounded transition-colors cursor-pointer ${timeframe === tf ? "bg-white text-gray-900 shadow-3xs" : "text-gray-500 hover:text-gray-800"}`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {chartTab === "traffic" ? (
                <>
                  {/* Checkboxes targeting active lines (Organic, Paid, Branded) */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold mb-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showOrganicTraffic} 
                        onChange={() => setShowOrganicTraffic(!showOrganicTraffic)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="w-2.5 h-2 rounded bg-blue-500 block"></span>
                      <span>Organic Traffic</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showPaidTraffic} 
                        onChange={() => setShowPaidTraffic(!showPaidTraffic)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                      />
                      <span className="w-2.5 h-2 rounded bg-purple-500 block"></span>
                      <span>Paid Traffic</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showBrandedTraffic} 
                        onChange={() => setShowBrandedTraffic(!showBrandedTraffic)}
                        className="rounded border-gray-300 text-pink-600 focus:ring-[#ec4899]" 
                      />
                      <span className="w-2.5 h-2 rounded bg-pink-500 block"></span>
                      <span>Branded Traffic</span>
                    </label>
                  </div>

                  {/* Responsive SVG custom Area chart matching SEMrush visual pattern */}
                  <div className="h-56 relative mt-2 w-full">
                    <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                      {/* Grids background */}
                      <line x1="0" y1="50" x2="700" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1="150" x2="700" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                      {/* Gradient masks */}
                      <defs>
                        <linearGradient id="orgGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Chart Paths - we compute points dynamically from data.trafficTrendData */}
                      {showOrganicTraffic && (
                        <>
                          <path 
                            d="M 20,200 L 20,60 L 120,80 L 220,70 L 320,110 L 420,95 L 520,50 L 620,110 L 680,103 L 680,200 Z" 
                            fill="url(#orgGradient)" 
                          />
                          <path 
                            d="M 20,60 L 120,80 L 220,70 L 320,110 L 420,95 L 520,50 L 620,110 L 680,103" 
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="2.5" 
                            strokeLinecap="round"
                          />
                        </>
                      )}

                      {showBrandedTraffic && (
                        <>
                          <path 
                            d="M 20,200 L 20,160 L 120,165 L 220,162 L 320,175 L 420,170 L 520,150 L 620,170 L 680,172 L 680,200 Z" 
                            fill="url(#brandGradient)" 
                          />
                          <path 
                            d="M 20,160 L 120,165 L 220,162 L 320,175 L 420,170 L 520,150 L 620,170 L 680,172" 
                            fill="none" 
                            stroke="#ec4899" 
                            strokeWidth="1.5" 
                            strokeLinecap="round"
                          />
                        </>
                      )}

                      {showPaidTraffic && (simulateActivePaidCampaigns || data.paidTraffic > 0) && (
                        <path 
                          d="M 20,192 L 120,188 L 220,191 L 320,195 L 420,186 L 520,180 L 620,193 L 680,194" 
                          fill="none" 
                          stroke="#a855f7" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                          strokeDasharray="4 2"
                        />
                      )}

                      {/* Draw points for organic path */}
                      {showOrganicTraffic && [60, 80, 70, 110, 95, 50, 110, 103].map((y, idx) => {
                        const x = 20 + idx * 94.2;
                        return (
                          <g key={idx} className="group cursor-pointer">
                            <circle cx={x} cy={y} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" className="hover:scale-150 transition-transform" />
                            <title>Clicks: {Math.round((x * 1250) + 150000).toLocaleString()}</title>
                          </g>
                        );
                      })}
                    </svg>

                    {/* X Axis Timestamps Labels */}
                    <div className="absolute left-0 right-0 bottom-0 flex justify-between text-[9px] text-gray-400 font-mono font-bold border-t border-gray-150 pt-1">
                      {data.trafficTrendData.map((t: any, id: number) => (
                        <span key={id}>{t.date}</span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Keywords Segment Checkboxes */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-extrabold mb-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showTop3} 
                        onChange={() => setShowTop3(!showTop3)}
                        className="rounded border-gray-300 text-[#f59e0b] focus:ring-yellow-500" 
                      />
                      <span className="w-2.5 h-2 rounded bg-yellow-500 block"></span>
                      <span>Top 3</span>
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showTop4_10} 
                        onChange={() => setShowTop4_10(!showTop4_10)}
                        className="rounded border-gray-300 text-indigo-650 focus:ring-indigo-500" 
                      />
                      <span className="w-2.5 h-2 rounded bg-indigo-500 block"></span>
                      <span>4-10</span>
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showTop11_20} 
                        onChange={() => setShowTop11_20(!showTop11_20)}
                        className="rounded border-gray-300 text-blue-500" 
                      />
                      <span className="w-2.5 h-2 rounded bg-blue-500 block"></span>
                      <span>11-20</span>
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showTop21_50} 
                        onChange={() => setShowTop21_50(!showTop21_50)}
                        className="rounded border-gray-300 text-violet-650" 
                      />
                      <span className="w-2.5 h-2 rounded bg-violet-600 block"></span>
                      <span>21-50</span>
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showTop51_100} 
                        onChange={() => setShowTop51_100(!showTop51_100)}
                        className="rounded border-gray-300 text-[#ec4899]" 
                      />
                      <span className="w-2.5 h-2 rounded bg-pink-500 block"></span>
                      <span>51-100</span>
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showAiOverviews} 
                        onChange={() => setShowAiOverviews(!showAiOverviews)}
                        className="rounded border-gray-300 text-[#06b6d4]" 
                      />
                      <span className="w-2.5 h-2 rounded bg-[#06b6d4] block"></span>
                      <span>AI Overviews</span>
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showOtherSerp} 
                        onChange={() => setShowOtherSerp(!showOtherSerp)}
                        className="rounded border-gray-330 text-emerald-600" 
                      />
                      <span className="w-2.5 h-2 rounded bg-emerald-500 block"></span>
                      <span>Other SERP Features</span>
                    </label>
                  </div>

                  <div className="h-56 relative mt-2 w-full">
                    <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                      {/* Grid background */}
                      <line x1="0" y1="50" x2="700" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="0" y1="150" x2="700" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                      {/* Smooth Keyword Area Paths */}
                      {showTop51_100 && (
                        <path 
                          d="M 20,180 Q 120,175 220,172 T 320,185 T 420,165 T 520,155 T 680,165" 
                          fill="none" 
                          stroke="#ec4899" 
                          strokeWidth="2" 
                        />
                      )}
                      
                      {showTop21_50 && (
                        <path 
                          d="M 20,150 Q 120,140 220,135 T 320,148 T 420,130 T 520,120 T 680,124" 
                          fill="none" 
                          stroke="#7c3aed" 
                          strokeWidth="2" 
                        />
                      )}

                      {showTop11_20 && (
                        <path 
                          d="M 20,110 Q 120,105 220,95 T 320,111 T 420,90 T 520,80 T 680,85" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="2.5" 
                        />
                      )}

                      {showTop4_10 && (
                        <path 
                          d="M 20,80 Q 120,70 220,60 T 320,75 T 420,55 T 520,30 T 680,48" 
                          fill="none" 
                          stroke="#6366f1" 
                          strokeWidth="2.5" 
                        />
                      )}

                      {showTop3 && (
                        <path 
                          d="M 20,50 Q 120,42 220,35 T 320,48 T 420,25 T 520,15 T 680,24" 
                          fill="none" 
                          stroke="#eab308" 
                          strokeWidth="3" 
                        />
                      )}

                      {showAiOverviews && (
                        <path 
                          d="M 20,195 Q 120,191 220,194 T 320,190 T 420,185 T 520,180 T 680,182" 
                          fill="none" 
                          stroke="#06b6d4" 
                          strokeWidth="1.5" 
                          strokeDasharray="3 2"
                        />
                      )}

                      {showOtherSerp && (
                        <path 
                          d="M 20,188 Q 120,182 220,185 T 320,181 T 420,175 T 520,172 T 680,174" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="1.5" 
                          strokeDasharray="2 2"
                        />
                      )}
                    </svg>

                    <div className="absolute left-0 right-0 bottom-0 flex justify-between text-[9px] text-gray-400 font-mono font-bold border-t border-gray-150 pt-1">
                      {(data.keywordsTrendData || data.trafficTrendData).map((t: any, id: number) => (
                        <span key={id}>{t.date}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Benchmark diagnostics helper */}
            <div className="mt-4 bg-gray-50 border border-gray-200 p-3.5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs w-full">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-gray-600 font-bold block">
                  The historical traffic trend was calculated by indexing <strong>{data.organicKeywords.toLocaleString()}</strong> organic keywords positions under different devices.
                </span>
              </span>
              {onCompareRequest && (
                <button 
                  onClick={() => onCompareRequest(activeDomain)}
                  className="bg-slate-900 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-md hover:bg-slate-800 cursor-pointer whitespace-nowrap block self-end uppercase tracking-wider transition-colors"
                >
                  Configure Side-by-Side Comparison
                </button>
              )}
            </div>

          </div>

        </div>

        {/* 7. ORGANIC RESEARCH WORKSPACE (US 🇺🇸 Flag Filter in heading) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs mb-6 text-left" id="organic-research-panel">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-5">
            <div>
              <span className="text-xs bg-amber-50 text-amber-800 font-extrabold px-2.5 py-1 rounded border border-amber-200 mr-2 uppercase">
                ORGANIC RESEARCH
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500">
                🇺🇸 US Country Indexes
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-1">
                Top Organic Keywords & Topic Outlines
              </h2>
            </div>

            {/* Keyword filter input */}
            <div className="relative w-full lg:w-72">
              <input 
                type="text" 
                value={keywordSearchQuery}
                onChange={(e) => setKeywordSearchQuery(e.target.value)}
                placeholder="Search focused keywords below..."
                className="w-full bg-[#f9fafb] border border-gray-300 rounded-lg text-xs font-semibold pl-8 pr-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Keywords list column */}
            <div className="lg:col-span-8 overflow-x-auto space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-1">
                <span>Top Keywords ({filteredKeywords.length})</span>
                <span className="text-gray-300">Filtered metrics</span>
              </div>

              <table className="w-full text-[14px] text-sans">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase font-bold text-[14px] text-left">
                    <th className="pb-2.5 font-bold">Keyword</th>
                    <th className="pb-2.5 font-bold text-center">Intent</th>
                    <th className="pb-2.5 font-bold text-center">Pos</th>
                    <th className="pb-2.5 font-bold text-right">Volume</th>
                    <th className="pb-2.5 font-bold text-right">CPC (USD)</th>
                    <th className="pb-2.5 font-bold text-right">Traffic %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredKeywords.map((item: any, id: number) => (
                    <tr key={id} className="hover:bg-gray-50/75 transition-colors">
                      <td className="py-3 font-semibold text-gray-800 max-w-[180px] truncate" title={item.keyword}>
                        {item.keyword}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-block w-4.5 h-4.5 rounded text-[10px] font-black text-center leading-4.5 shadow-3xs uppercase border ${
                          item.intent === "Informational" 
                            ? "bg-blue-50 text-blue-800 border-blue-200" 
                            : item.intent === "Transactional" 
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : item.intent === "Commercial"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-purple-50 text-purple-800 border-purple-200"
                        }`} title={item.intent}>
                          {item.intent.substring(0, 1)}
                        </span>
                      </td>
                      <td className="py-3 text-center font-bold text-gray-500">#{item.position}</td>
                      <td className="py-3 text-right font-mono font-medium text-gray-600">{item.volume.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono font-medium text-gray-500">${item.cpc.toFixed(2)}</td>
                      <td className="py-3 text-right font-mono font-bold text-purple-600">{item.trafficPct}%</td>
                    </tr>
                  ))}
                  {filteredKeywords.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 font-semibold font-sans">
                        No organic terms match your filter terms.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex items-center gap-4 mt-3">
                <button className="bg-slate-950 border border-slate-950 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer shrink-0">
                  View details
                </button>
                {keywordSearchQuery && (
                  <button 
                    onClick={() => setKeywordSearchQuery("")}
                    className="text-[11px] text-gray-500 hover:text-slate-850 font-bold hover:underline cursor-pointer"
                  >
                    Clear Filters & View All Top Keywords
                  </button>
                )}
              </div>
            </div>

            {/* Key Topics & outline recommendation sidebar */}
            <div className="lg:col-span-4 bg-purple-50/40 p-5 rounded-xl border border-purple-100">
              <div className="flex gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-purple-900 block uppercase tracking-wider">
                    AI Topics Generation & Outline
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Consult Google Gemini models about keyword topical clusters and outlines for {activeDomain}.
                  </p>
                </div>
              </div>

              {topicsList.length === 0 ? (
                <div className="text-center py-6 bg-white rounded-lg border border-purple-100 shadow-3xs">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase mb-2">
                    Key Topics Blueprint Offline
                  </span>
                  <button 
                    id="get-topics-button"
                    onClick={generateAiTopics}
                    disabled={loadingTopics}
                    className="bg-purple-600 hover:bg-purple-750 text-white font-bold text-xs px-4 py-2 rounded shadow-2xs hover:shadow-xs transition-shadow cursor-pointer block mx-auto"
                  >
                    {loadingTopics ? "Clustering Blueprint..." : "Get topics"}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 bg-white p-3.5 rounded-lg border border-purple-100 shadow-3xs max-h-60 overflow-y-auto">
                  <h5 className="text-[10px] text-purple-700 uppercase font-black tracking-widest block mb-2 border-b border-purple-100 pb-1">
                    AI Target Blueprints
                  </h5>
                  {topicsList.map((topic, index) => (
                    <div key={index} className="flex gap-1.5 transition-all text-xs font-semibold text-gray-700 hover:text-purple-600">
                      <span className="text-purple-400 shrink-0 mt-0.5">▪</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                  <button 
                    onClick={() => setTopicsList([])}
                    className="text-[10px] text-gray-400 hover:text-purple-600 font-bold block pt-2 mt-2 border-t border-gray-100 cursor-pointer"
                  >
                    Reset & Recalculate Clusters
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Under Keywords block: Intent percentages and Organic distribution charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 pt-6 border-t border-gray-100">
            
            {/* Keywords by Intent breakdown */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">
                Keywords by Intent
              </h4>
              
              {/* Colorful Intent progress line */}
              <div className="w-full bg-gray-200 h-2.5 rounded-full mb-4 flex overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: "92.7%" }} title="Informational 92.7%"></div>
                <div className="bg-purple-500 h-full" style={{ width: "1.7%" }} title="Navigational 1.7%"></div>
                <div className="bg-amber-500 h-full" style={{ width: "1.0%" }} title="Commercial 1.0%"></div>
                <div className="bg-emerald-500 h-full" style={{ width: "4.6%" }} title="Transactional 4.6%"></div>
              </div>

              <div className="space-y-1.5 text-xs text-sans font-semibold text-gray-600">
                {data.keywordIntentDistribution.map((item: any, id: number) => (
                  <div key={id} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full block shrink-0 ${
                      item.intent === "Informational" ? "bg-blue-500" :
                      item.intent === "Navigational" ? "bg-purple-500" :
                      item.intent === "Commercial" ? "bg-amber-500" : "bg-emerald-500"
                    }`}></span>
                    <span className="text-gray-600 font-semibold w-24">{item.intent}</span>
                    <span className="font-mono text-gray-900 ml-auto font-black">{item.pct}%</span>
                    <span className="font-mono text-gray-400 w-12 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Organic Position Distribution bar chart */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">
                Organic Position Distribution
              </h4>
              
              <div className="flex items-end justify-between h-24 gap-1 border-b border-gray-200 pb-1 mb-2 font-mono text-[9px] font-bold">
                {data.organicPositionDistribution.map((bar: any, id: number) => {
                  // Normalize height percentage
                  const heights = [15, 30, 50, 75, 95, 20];
                  const scaleHeight = heights[id];
                  return (
                    <div key={id} className="flex-1 flex flex-col items-center group">
                      <div 
                        className="bg-blue-400 hover:bg-blue-500 rounded-t w-full transition-all duration-300 relative" 
                        style={{ height: `${scaleHeight}%` }}
                      >
                        <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded px-1 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {bar.count.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-gray-500 mt-1 font-semibold">{bar.bucket}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">
                Estimated index coordinates across target position rankings on search engine lists.
              </p>
            </div>

            {/* Main Organic Competitors Table with Horizontal level bars */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-150 pb-1.5">
                Main Organic Competitors <span className="text-gray-400 font-normal">({data.mainOrganicCompetitors.length})</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase">
                      <th className="pb-2">Competitor</th>
                      <th className="pb-2">Com. Level %</th>
                      <th className="pb-2 text-right">Com. Keywords</th>
                      <th className="pb-2 text-right">SE Keywords</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-semibold">
                    {data.mainOrganicCompetitors.map((comp: any, id: number) => (
                      <tr key={id} className="hover:bg-gray-100/50">
                        <td className="py-2 text-blue-600 hover:underline cursor-pointer truncate max-w-[125px] font-bold">
                          {comp.domain}
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                            <div className="w-16 bg-gray-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full" style={{ width: `${comp.comLevel || 30}%` }}></div>
                            </div>
                            <span className="font-mono text-[9px] text-gray-500">{comp.comLevel}%</span>
                          </div>
                        </td>
                        <td className="py-2 text-right font-mono text-gray-800 font-bold">
                          {comp.commonKeywords}
                        </td>
                        <td className="py-2 text-right font-mono text-[#3b82f6] font-bold">
                          {comp.totalKeywords ? comp.totalKeywords.toLocaleString() : comp.commonKeywords * 55}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="bg-slate-950 border border-slate-950 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer mt-3 shrink-0">
                View details
              </button>
            </div>

          </div>

          {/* Competitor Positioning scatter Map */}
          <div className="mt-6 pt-6 border-t border-gray-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  Competitive Positioning Map
                </h4>
                <p className="text-[10px] text-gray-450 mt-0.5">X-axis: Organic Keywords | Y-axis: Search Traffic metrics</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {data.mainOrganicCompetitors.map((comp: any, idx: number) => {
                  const colors = ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#ec4899"];
                  return (
                    <span key={idx} className="inline-flex items-center gap-1 text-[9px] text-gray-505 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                      <span>{comp.domain}</span>
                    </span>
                  );
                })}
                <span className="inline-flex items-center gap-1 text-[9px] text-gray-700 font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                  <span>{activeDomain}</span>
                </span>
              </div>
            </div>
            
            {/* Simulated interactive premium bubble coordinates graph in pure SVG */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative h-64 flex flex-col justify-end w-full">
              <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="50" x2="600" y2="50" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="150" x2="600" y2="150" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

                {/* Vertical Grid lines */}
                <line x1="100" y1="0" x2="100" y2="200" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="200" y1="0" x2="200" y2="200" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="300" y1="0" x2="300" y2="200" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="400" y1="0" x2="400" y2="200" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="500" y1="0" x2="500" y2="200" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

                {/* Bubble 1: afrihost */}
                <g className="group cursor-pointer">
                  <circle cx="120" cy="150" r="14" fill="#8b5cf6" fillOpacity="0.4" stroke="#8b5cf6" strokeWidth="1.5" />
                  <text x="120" y="153" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#5b21b6">afrihost</text>
                  <title>afrihost.com: Common terms: 73, comLevel: 15%</title>
                </g>

                {/* Bubble 2: gbmb */}
                <g className="group cursor-pointer">
                  <circle cx="280" cy="90" r="18" fill="#10b981" fillOpacity="0.4" stroke="#10b981" strokeWidth="1.5" />
                  <text x="280" y="93" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#065f46">gbmb.org</text>
                  <title>gbmb.org: Common terms: 121, comLevel: 25%</title>
                </g>

                {/* Bubble 3: insights */}
                <g className="group cursor-pointer">
                  <circle cx="200" cy="120" r="16" fill="#3b82f6" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="200" y="123" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#1e40af">insights</text>
                  <title>insightsonindia.com: Common terms: 78, comLevel: 42%</title>
                </g>

                {/* Bubble 4: kilomegabyte */}
                <g className="group cursor-pointer">
                  <circle cx="80" cy="170" r="12" fill="#f59e0b" fillOpacity="0.4" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="80" y="173" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#92400e">kilomega</text>
                  <title>kilomegabyte.com: Common terms: 46, comLevel: 31%</title>
                </g>

                {/* Bubble 5: vajiram */}
                <g className="group cursor-pointer">
                  <circle cx="450" cy="80" r="22" fill="#ec4899" fillOpacity="0.4" stroke="#ec4899" strokeWidth="1.5" />
                  <text x="450" y="83" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#9d174d">vajiram</text>
                  <title>vajiramandravi.com: Common terms: 192, comLevel: 55%</title>
                </g>

                {/* Bubble centered: current queried domain */}
                <g className="group cursor-pointer">
                  <circle cx="360" cy="40" r="24" fill="#ef4444" fillOpacity="0.85" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                  <text x="360" y="43" fontSize="9" fontWeight="black" textAnchor="middle" fill="#ffffff">{activeDomain.substring(0, 7)}</text>
                  <title>{activeDomain}: Primary queried core authority node</title>
                </g>
              </svg>

              {/* Graphic Labels */}
              <div className="flex justify-between w-full text-[8px] text-gray-400 font-mono font-bold mt-1 z-10 p-1 bg-white/70 rounded border border-gray-100">
                <span>0</span>
                <span>20K SE Keywords</span>
                <span>40K SE Keywords</span>
                <span>60K SE Keywords</span>
                <span>80K SE Keywords</span>
                <span>100K+ SE Keywords</span>
              </div>
            </div>
          </div>

        </div>

        {/* 8. ADVERTISING RESEARCH SECTION (PPC Campaign - matching "Nothing found" screenshot or simulated) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs mb-6 text-left" id="ads-research-panel">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-5">
            <div>
              <span className="text-xs bg-purple-50 text-purple-800 font-extrabold px-2.5 py-1 rounded border border-purple-200 mr-2 uppercase">
                ADVERTISING RESEARCH
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500">
                🇺🇸 US Desktop Indexes
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-1">
                PPC Budgets & Sample Competitive Ads
              </h2>
            </div>

            {/* Simulator CTA */}
            <button 
              onClick={() => setSimulateActivePaidCampaigns(!simulateActivePaidCampaigns)}
              className="bg-transparent hover:bg-gray-100 text-[#ff642d] font-bold text-xs px-4 py-2 border border-[#ff642d] rounded-lg transition-colors cursor-pointer"
            >
              {simulateActivePaidCampaigns ? "✕ Deactivate Test Campaign" : "✦ Simulate Ads Live Active state"}
            </button>
          </div>

          {!simulateActivePaidCampaigns ? (
            /* EXACT mirror of the "Nothing found - Try changing filters" screenshots */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
              <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-300 p-8 text-center flex flex-col items-center justify-center">
                <Globe className="w-10 h-10 text-gray-300 mb-3" />
                <h4 className="text-xs font-bold text-gray-700">Top Paid Keywords</h4>
                <p className="text-[11px] text-gray-400 mt-1">Nothing found for {activeDomain}. No active campaigns index.</p>
              </div>

              <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-300 p-8 text-center flex flex-col items-center justify-center">
                <BarChartIcon className="w-10 h-10 text-gray-300 mb-3" />
                <h4 className="text-xs font-bold text-gray-700">Paid Position Distribution</h4>
                <p className="text-[11px] text-gray-400 mt-1">Nothing found for {activeDomain}.</p>
              </div>

              <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-300 p-8 text-center flex flex-col items-center justify-center">
                <Layers className="w-10 h-10 text-gray-300 mb-3" />
                <h4 className="text-xs font-bold text-gray-700">Main Paid Competitors</h4>
                <p className="text-[11px] text-gray-400 mt-1">Nothing found. Try changing your country filters.</p>
              </div>

              <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-300 p-8 text-center flex flex-col items-center justify-center">
                <Calendar className="w-10 h-10 text-gray-300 mb-3" />
                <h4 className="text-xs font-bold text-gray-700">Sample Text Ads</h4>
                <p className="text-[11px] text-gray-400 mt-1">Nothing found. No archived advertisement records detected.</p>
              </div>
            </div>
          ) : (
            /* Populated simulation state when "Ads Simulation" is toggled */
            <div className="space-y-5 py-2">
              <div className="bg-purple-50/60 p-3.5 border border-purple-150 rounded-lg text-xs font-semibold text-purple-900 mb-2">
                🌟 Test simulation active! Demonstrating Semrush visual parsing capability. 
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Keywords listing simulated */}
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Top Paid Keywords</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-gray-100 pb-1.5 font-bold text-gray-400">
                      <span>Term</span>
                      <span>CPC</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold">{activeDomain.split('.')[0]} exam syllabus</span>
                      <span className="font-mono font-bold">$1.45</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold">daily GK quiz pdf</span>
                      <span className="font-mono font-bold">$0.85</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Competition ads text copy block */}
                <div className="bg-gray-50 p-4 rounded-xl border col-span-2">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Active Google Text Ads Copy</h4>
                  <div className="border border-gray-200 bg-white p-3.5 rounded-lg max-w-lg mb-2 text-left">
                    <span className="text-[10px] text-gray-400 font-mono block">Ad · https://www.{activeDomain}/mock-campaign</span>
                    <h5 className="text-[#1a0dab] hover:underline text-sm font-semibold cursor-pointer block mt-1">
                      {activeDomain.toLowerCase().includes("gktoday") 
                        ? "GKToday - Crack Competitive Exams in 2026 | Authority Syllabus Outline" 
                        : "SEOtool.com - Advanced SEO Auditing & High-Fidelity Competitor Analysis"}
                    </h5>
                    <p className="text-[#4d5156] text-xs mt-1.5 leading-relaxed leading-normal">
                      Access objective general knowledge question banks, monthly current affairs dossiers. Learn offline or take mock scores with standard evaluation frameworks!
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* 9. BACKLINKS IN-DEPTH AUDIT REPORT (Worldwide Flag Header in chart) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs mb-6 text-left" id="backlinks-panel">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-5 gap-2">
            <div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-extrabold px-2.5 py-1 rounded border border-emerald-200 mr-2 uppercase">
                BACKLINKS ANALYTICS
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                🌐 Worldwide Index
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-1">
                Referring Citing URLs & Quality Audit Profiles
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider"> Cites:</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-100">
                {data.backlinksCount.toLocaleString()} indexed backlinks
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Real backlink references details list */}
            <div className="lg:col-span-8 overflow-x-auto space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-gray-400 mb-1">
                <span>Citing Live Pages</span>
                <span className="text-[10px] text-gray-300">Anchor text parsing</span>
              </div>

              <table className="w-full text-[14px] text-sans">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[14px] text-left">
                    <th className="pb-2.5 font-bold">Referring Page</th>
                    <th className="pb-2.5 font-bold">Anchor Text / Destination</th>
                    <th className="pb-2.5 font-bold text-right">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-left">
                  {data.backlinkRecords.map((item: any, id: number) => (
                    <tr key={id} className="hover:bg-gray-50/50">
                      <td className="py-3 pr-4 max-w-[280px]">
                        <span className="font-bold text-gray-800 line-clamp-1 leading-tight">{item.referringPageTitle}</span>
                        <a 
                          href={item.referringPageUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-blue-500 hover:underline block truncate mt-1 text-[10px] font-mono"
                        >
                          {item.referringPageUrl}
                        </a>
                      </td>
                      <td className="py-3 pr-2 max-w-[180px]">
                        <span className="font-semibold text-gray-700 block truncate leading-none">{item.anchorText}</span>
                        <span className="text-[10px] text-gray-400 block truncate mt-1.5 font-mono">{item.linkUrl || `https://${activeDomain}/`}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-block font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase border ${
                          item.type === "follow" 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                            : "bg-gray-150 text-gray-600 border-gray-200"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="bg-slate-950 border border-slate-950 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer mt-4 block">
                View details
              </button>
            </div>

            {/* Follow vs nofollow chart & target assets types side list */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              {/* Donut chart for follow pct */}
              <div className="bg-gray-50 p-4 border rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider mb-2">Follow vs Nofollow ratio</span>
                
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3"></circle>
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${data.followVsNofollow.followPct} ${100 - data.followVsNofollow.followPct}`} strokeDashoffset="0"></circle>
                    </svg>
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                      <span className="font-semibold text-gray-700">Follow Citations ({data.followVsNofollow.followPct}%)</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono font-bold">
                      {data.followVsNofollow.followCount} total indexed
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
                      <span className="font-semibold text-gray-600">Nofollow Citations ({data.followVsNofollow.nofollowPct}%)</span>
                    </div>
                  </div>
                </div>
                <button className="bg-slate-950 border border-slate-950 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer mt-3 block">
                  View details
                </button>
              </div>

              {/* Backlink Type distribution panel */}
              <div className="bg-gray-50 p-4 border rounded-xl text-xs space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider mb-2">Dynamic links formats</span>
                
                {[
                  { label: "Text", pct: data.backlinkTypeBreakdown.textPct, count: data.backlinkTypeBreakdown.textCount },
                  { label: "Image", pct: data.backlinkTypeBreakdown.imagePct, count: data.backlinkTypeBreakdown.imageCount },
                  { label: "Form", pct: data.backlinkTypeBreakdown.formPct, count: data.backlinkTypeBreakdown.formCount },
                  { label: "Frame", pct: data.backlinkTypeBreakdown.framePct, count: data.backlinkTypeBreakdown.frameCount }
                ].map((row, id) => (
                  <div key={id} className="space-y-1">
                    <div className="flex justify-between font-semibold text-gray-700">
                      <span>{row.label}</span>
                      <span className="font-mono">{row.pct}% <span className="text-gray-400">({row.count})</span></span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full" style={{ width: `${row.pct}%` }}></div>
                    </div>
                  </div>
                ))}
                <button className="bg-slate-950 border border-slate-950 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer mt-4 block">
                  View full report
                </button>
              </div>

            </div>

          </div>

          {/* Under Backlinks: Top Anchors, Referring countries IP, and indexes pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 pt-6 border-t border-gray-100">
            
            {/* Top Anchors breakdown table */}
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3 pb-1 border-b">Top Anchors</h4>
              <div className="space-y-2 text-xs text-sans font-semibold">
                <div className="flex justify-between font-bold text-gray-400 text-[10px] border-b pb-1">
                  <span>Anchor Text</span>
                  <span>Backlinks</span>
                </div>
                {data.topAnchors.map((item: any, id: number) => (
                  <div key={id} className="flex justify-between text-gray-700">
                    <span className="truncate max-w-[150px]">{item.anchor}</span>
                    <span className="font-mono text-gray-600">
                      {item.backlinks.toLocaleString()}{" "}
                      <span className="text-gray-400 text-[9px] font-bold">({item.domains} doms)</span>
                    </span>
                  </div>
                ))}
              </div>
              <button className="bg-slate-955 border border-slate-950 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded hover:bg-slate-800 transition-all cursor-pointer mt-3.5 block">
                View details
              </button>
            </div>

            {/* Referring Domains IP */}
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3 pb-1 border-b">Referring Domains</h4>
              <div className="space-y-2 text-xs text-sans font-semibold">
                <div className="flex justify-between font-bold text-gray-400 text-[10px] border-b pb-1">
                  <span>Citing Domain / Country / IP</span>
                  <span className="text-right">Links</span>
                </div>
                {data.referringDomains.map((item: any, id: number) => (
                  <div key={id} className="flex justify-between text-gray-700 items-start">
                    <div className="truncate pr-1">
                      <span className="font-bold text-blue-600 hover:underline cursor-pointer block truncate">{item.domain}</span>
                      <span className="text-[9px] text-gray-400 block font-mono font-bold">{item.country} · {item.ip}</span>
                    </div>
                    <span className="font-mono text-gray-650 shrink-0 font-bold">{item.backlinks.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <button className="bg-slate-955 border border-slate-950 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded hover:bg-slate-800 transition-all cursor-pointer mt-3.5 block">
                View details
              </button>
            </div>

            {/* Index Pages list */}
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3 pb-1 border-b">Indexed Landing Pages</h4>
              <div className="space-y-2.5 text-xs text-sans">
                {data.indexedPages.map((item: any, id: number) => (
                  <div key={id} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0 font-semibold">
                    <div className="line-clamp-1 text-gray-850 leading-tight font-bold" title={item.title}>{item.title}</div>
                    <span className="block truncate text-[10px] text-blue-500 hover:underline cursor-pointer font-mono mt-1">{item.url}</span>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono font-bold">
                      <span>Doms: <span className="text-gray-600 font-bold">{item.domains}</span></span>
                      <span>Links: <span className="text-purple-650 font-bold">{item.backlinks.toLocaleString()}</span></span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="bg-slate-955 border border-slate-950 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded hover:bg-slate-800 transition-all cursor-pointer mt-3.5 block">
                View details
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Footer copyright */}
      <div className="max-w-[1400px] mx-auto pt-6 text-center text-[10px] text-gray-400 font-mono font-semibold">
        © 2026 Semrush Holdings. All rights reserved. Powered by Google AI Studio Build Node Integrations.
      </div>
    </div>
  );
}
