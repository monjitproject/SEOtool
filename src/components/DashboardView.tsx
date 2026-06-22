/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { toast } from "../lib/toast";
import { ActiveView } from "../types";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe, 
  Link2, 
  Activity, 
  Key, 
  Layers, 
  Sparkles, 
  Plus, 
  Timer,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  Settings,
  Share2,
  Info,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Smartphone,
  Monitor,
  RefreshCw,
  Search,
  Check
} from "lucide-react";

interface DashboardProps {
  setActiveView: (view: ActiveView) => void;
  onSearchDomain: (domain: string) => void;
}

export default function DashboardView({ setActiveView, onSearchDomain }: DashboardProps) {
  // Domain analyzed state
  const [domainInput, setDomainInput] = useState("SEOtool.com");
  const [domain, setDomain] = useState("SEOtool.com");
  const [isEditingDomain, setIsEditingDomain] = useState(false);

  // Filter selections
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedDevice, setSelectedDevice] = useState<"desktop" | "mobile">("desktop");
  const [seoTimeRange, setSeoTimeRange] = useState("Jun 20, 2026");

  // Traffic Analytics Filters
  const [trafficLineFilter, setTrafficLineFilter] = useState<"semrush" | "google">("semrush");
  const [trafficMonths, setTrafficMonths] = useState("May 2026");
  const [activeLines, setActiveLines] = useState({
    direct: true,
    referral: true,
    organic: true,
    paidSocial: false,
    displayAds: false,
    email: false
  });

  // Google Integration states
  const [googleConnected, setGoogleConnected] = useState(false);
  const [connectingGoogle, setConnectingGoogle] = useState(false);

  // Hidden/Visible Cards Registry - Allows closing cards and restoring them
  const [visibleCards, setVisibleCards] = useState({
    aiSearch: true,
    seoSummary: true,
    siteAudit: true,
    organicRankings: true,
    trafficAnalytics: true,
    backlinks: true,
    positionTracking: false,
    backlinkAudit: false,
    linkBuildingTool: false,
    onPageSeoChecker: false,
    organicTrafficInsights: false
  });

  // Dynamic values helper based on domain string to reflect live data updates
  const hashValue = (str: string, seed: number) => {
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const domainMetrics = useMemo(() => {
    const d = domain.trim().toLowerCase() || "seotool.com";
    const seedAuthority = (hashValue(d, 12) % 45) + 35; // 35 - 80
    
    // Core SEO parameters
    const authorityScore = d.includes("google") ? 99 : d.includes("wikipedia") ? 95 : seedAuthority;
    const isUp = hashValue(d, 45) % 2 === 0;
    const authorityDelta = (hashValue(d, 77) % 3) + 1;
    
    const organicTrafficVal = (hashValue(d, 23) % 450) + 12; // 12K to 462K
    const organicTrafficPercent = ((hashValue(d, 84) % 1500) / 100 + 1).toFixed(2);
    
    const organicKeywordsVal = (hashValue(d, 19) % 300) + 15; // 15K to 315K
    const organicKeywordsPercent = ((hashValue(d, 99) % 800) / 100 + 1).toFixed(2);
    
    const refDomainsVal = (hashValue(d, 41) % 45) / 10 + 2.5; // 2.5K to 7.0K
    const refDomainsPercent = ((hashValue(d, 16) % 300) / 100 + 0.1).toFixed(2);
    
    const backlinksVal = (hashValue(d, 8) % 600) / 10 + 35.5; // 35.5K to 95.5K
    
    // AI Search metrics
    const aiVisibility = (hashValue(d, 51) % 45) + 8; // 8 - 53
    const aiMentions = (hashValue(d, 62) % 80) + 15; // 15 - 95
    const citedPages = ((hashValue(d, 91) % 80) / 10 + 1.2).toFixed(1); // 1.2K to 9.2K
    
    // AI Table pages
    const chatGptCited = Math.floor(hashValue(d, 14) % 1800) + 100;
    const googleAIOfficed = Math.floor(hashValue(d, 28) % 1800) + 150;
    const aiModeCited = Math.floor(hashValue(d, 39) % 1500) + 50;
    const geminiCited = Math.floor(hashValue(d, 40) % 400) + 10;
    
    // Site Audit params
    const siteHealth = (hashValue(d, 88) % 15) + 80; // 80 - 95%
    const siteErrors = (hashValue(d, 22) % 8) + 1; // 1 - 9
    const siteWarnings = (hashValue(d, 33) % 450) + 200; // 200 - 650
    const siteCrawledPages = (hashValue(d, 55) % 900) + 100; // 100 - 1000

    return {
      authorityScore,
      isUp,
      authorityDelta,
      organicTrafficVal: `${organicTrafficVal}K`,
      organicTrafficPercent,
      organicKeywordsVal: `${organicKeywordsVal}K`,
      organicKeywordsPercent,
      refDomainsVal: `${refDomainsVal.toFixed(1)}K`,
      refDomainsPercent,
      backlinksVal: `${backlinksVal.toFixed(1)}K`,
      aiVisibility,
      aiMentions,
      citedPages: `${citedPages}K`,
      aiTable: {
        chatGpt: chatGptCited,
        googleAI: googleAIOfficed,
        aiMode: aiModeCited,
        gemini: geminiCited
      },
      siteAudit: {
        health: siteHealth,
        errors: siteErrors,
        warnings: siteWarnings,
        crawled: siteCrawledPages
      }
    };
  }, [domain]);

  const handleDomainSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domainInput.trim()) {
      setDomain(domainInput.trim());
      onSearchDomain(domainInput.trim());
    }
    setIsEditingDomain(false);
  };

  const handleQuickDomainChange = (newDom: string) => {
    setDomainInput(newDom);
    setDomain(newDom);
    onSearchDomain(newDom);
  };

  const toggleLine = (line: keyof typeof activeLines) => {
    setActiveLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  const setCardVisibility = (card: keyof typeof visibleCards, visible: boolean) => {
    setVisibleCards(prev => ({ ...prev, [card]: visible }));
  };

  const restoreAll = () => {
    setVisibleCards({
      aiSearch: true,
      seoSummary: true,
      siteAudit: true,
      organicRankings: true,
      trafficAnalytics: true,
      backlinks: true,
      positionTracking: true,
      backlinkAudit: true,
      linkBuildingTool: true,
      onPageSeoChecker: true,
      organicTrafficInsights: true
    });
  };

  const handleConnectGoogle = () => {
    if (googleConnected) {
      setGoogleConnected(false);
      return;
    }
    setConnectingGoogle(true);
    setTimeout(() => {
      setConnectingGoogle(false);
      setGoogleConnected(true);
    }, 850);
  };

  // Supported countries dropdown dictionary
  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "AU", name: "Australia", flag: "🇦🇺" }
  ];

  const currentCountryObj = countries.find(c => c.code === selectedCountry) || countries[0];

  return (
    <div className="space-y-6 text-left font-sans bg-[#f8fafc] p-1 sm:p-4 rounded-2xl border border-slate-100">
      
      {/* 1. TOP BREADCRUMB & UTILITY HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-slate-500 font-bold">SEO Suite Dashboard</span>
          </div>
          
          <div className="flex items-center flex-wrap gap-2">
            <h1 className="text-[28px] sm:text-[32px] md:text-[36px] font-bold font-sans tracking-tight text-slate-900 flex items-center gap-2">
              SEO Dashboard:
            </h1>
            
            {isEditingDomain ? (
              <form onSubmit={handleDomainSearchSubmit} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="px-2.5 py-1 text-sm font-semibold text-slate-850 border border-slate-300 bg-slate-50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-505 w-48"
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="px-3 py-1.5 text-[14px] font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                >
                  Analyze
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditingDomain(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setIsEditingDomain(true)}
                  className="px-3 py-1 text-lg font-bold text-purple-600 hover:bg-purple-50/50 rounded-lg transition-all flex items-center gap-1 cursor-pointer select-none border border-transparent hover:border-purple-100/30"
                  title="Click to change target website"
                >
                  <span>{domain}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <a 
                  href={`https://www.${domain}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1 text-slate-400 hover:text-purple-600"
                  title="Visit live website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => handleQuickDomainChange("SEOtool.com")}
            className="px-2.5 py-1 text-[14px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded"
          >
            SEOtool.com
          </button>
          <button 
            onClick={() => handleQuickDomainChange("techcrunch.com")}
            className="px-2.5 py-1 text-[14px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded"
          >
            techcrunch.com
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
          
          <button 
            onClick={() => setActiveView(ActiveView.SiteAudit)}
            className="bg-[#111827] hover:bg-slate-800 text-white font-semibold text-[14px] py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Create SEO Project
          </button>
          <button 
            onClick={() => toast.success(`Share link copied: share view active for domain "${domain}"`)}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[14px] py-2 px-3.5 rounded-lg flex items-center gap-1 transition-colors bg-white"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" /> Share
          </button>
          <button 
            onClick={() => setActiveView(ActiveView.Settings)}
            className="border border-slate-200 hover:bg-slate-50 p-2.5 rounded-lg bg-white transition-colors"
            title="SEO Settings"
          >
            <Settings className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Quick feedback line */}
      <div className="flex justify-between items-center text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Core search indexing engines queried in real-time</span>
        </div>
        <a 
          href="mailto:support@semrush.com" 
          className="hover:text-purple-600 font-semibold flex items-center gap-1 text-slate-500"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Send feedback
        </a>
      </div>

      {/* 2. ROW 1: AI SEARCH CARD & SEO SUMMARY CARD */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        
        {/* CARD A: AI SEARCH */}
        {visibleCards.aiSearch && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
            {/* Header portion */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider">
                  AI Search Insights
                </span>
                <span className="text-[11px] text-slate-400 font-medium">SGE & LLM citations visibility indices</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Country selector */}
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="appearance-none font-semibold text-xs text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 pr-6 rounded-md outline-none focus:border-purple-300 w-28 cursor-pointer"
                  >
                    {countries.map((c, i) => (
                      <option key={i} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2.5 pointer-events-none" />
                </div>
                
                <button 
                  onClick={() => setCardVisibility("aiSearch", false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                  title="Hide summary card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics group */}
            <div className="p-5 grid grid-cols-3 gap-4 border-b border-slate-150">
              <div className="space-y-1 relative pr-1 border-r border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">AI Visibility</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {domainMetrics.aiVisibility}%
                  </span>
                  
                  {/* Gauge SVG representation */}
                  <svg className="w-8 h-8 rounded-full shadow-xs shrink-0" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f3e8ff" strokeWidth="3" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="#a855f7" 
                      strokeWidth="3.5" 
                      strokeDasharray={`${domainMetrics.aiVisibility}, 100`} 
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                </div>
                <span className="text-[10px] text-fuchsia-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Over performing idx
                </span>
              </div>

              <div className="space-y-1 pr-1 border-r border-slate-100 pl-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Mentions</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {domainMetrics.aiMentions}
                </div>
                <span className="text-[10px] text-slate-550 block">Tracked reference links</span>
              </div>

              <div className="space-y-1 pl-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Cited Pages</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 tracking-tight">
                  {domainMetrics.citedPages}
                </div>
                <span className="text-[10px] text-slate-550 block">Estimated indexing count</span>
              </div>
            </div>

            {/* Citations list table */}
            <div className="p-4 bg-slate-50/20">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                AI Search Engines Sweep & Citations Table
              </div>
              <div className="space-y-2 text-xs">
                {/* Row 1 */}
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50 hover:bg-slate-50/50 px-1 rounded transition-colors">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    ChatGPT
                  </span>
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-slate-400 font-semibold font-mono text-[11px] w-12 block">Rank: 0</span>
                    <span className="text-purple-650 font-bold font-mono w-16 block text-right">
                      {domainMetrics.aiTable.chatGpt} cit
                    </span>
                  </div>
                </div>
                {/* Row 2 */}
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50 hover:bg-slate-50/50 px-1 rounded transition-colors">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Google SGE / AI Overviews
                  </span>
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-pink-600 font-semibold font-mono text-[11px] w-12 block">Rank: #23</span>
                    <span className="text-purple-650 font-bold font-mono w-16 block text-right">
                       {(domainMetrics.aiTable.googleAI).toLocaleString()} cit
                    </span>
                  </div>
                </div>
                {/* Row 3 */}
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50 hover:bg-slate-50/50 px-1 rounded transition-colors">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    AI Mode / Perplexity
                  </span>
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-slate-400 font-semibold font-mono text-[11px] w-12 block">Rank: #6</span>
                    <span className="text-purple-650 font-bold font-mono w-16 block text-right">
                      {(domainMetrics.aiTable.aiMode).toLocaleString()} cit
                    </span>
                  </div>
                </div>
                {/* Row 4 */}
                <div className="flex justify-between items-center py-1.5 hover:bg-slate-50/50 px-1 rounded transition-colors">
                  <span className="font-semibold text-slate-705 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    Gemini API citations
                  </span>
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-slate-400 font-semibold font-mono text-[11px] w-12 block">Rank: #7</span>
                    <span className="text-purple-650 font-bold font-mono w-16 block text-right">
                      {domainMetrics.aiTable.gemini} cit
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer action button */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                onClick={() => setActiveView(ActiveView.AiSnsTools)}
                className="text-xs font-bold text-slate-655 hover:text-purple-600 transition-all flex items-center gap-1 justify-center mx-auto"
              >
                Launch AI Search Analytics Optimizer <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CARD B: SEO SUMMARY */}
        {visibleCards.seoSummary && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
            {/* Header portion */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                  SEO INDEX
                </span>
                <span className="text-[11px] font-semibold text-slate-400 font-mono">Scope: Root Domain</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded font-mono">
                  {currentCountryObj.flag} {selectedCountry}
                </span>
                
                <span className="text-[11px] text-slate-400 font-sans font-semibold bg-white border border-slate-250/50 px-2 py-0.5 rounded">
                  {selectedDevice === "desktop" ? "💻 Desktop" : "📱 Mobile"}
                </span>

                <span className="text-[11px] text-slate-400 font-semibold bg-white border border-slate-250/50 px-2 py-0.5 rounded font-mono">
                  {seoTimeRange}
                </span>

                <button 
                  onClick={() => setCardVisibility("seoSummary", false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                  title="Hide summary card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Major grid metrics from the mockup */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Box 1: Authority Score */}
              <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1 justify-between">
                  <span>Authority Score</span>
                  <Info className="w-3 h-3 text-slate-300" />
                </span>
                
                <div className="flex items-end justify-between mt-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {domainMetrics.authorityScore}
                    </span>
                    <span className="text-xs font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded font-mono flex items-center">
                      <TrendingDown className="w-3 h-3 shrink-0 mr-0.5" /> -2
                    </span>
                  </div>
                  
                  {/* Miniture visual gauge */}
                  <div className="relative w-9 h-9">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path 
                        className="text-slate-200" 
                        strokeWidth="3.5" 
                        stroke="currentColor" 
                        strokeDasharray="75, 100" 
                        strokeLinecap="round" 
                        fill="none" 
                        d="M 6.4 29.6 A 16 16 0 1 1 29.6 29.6" 
                      />
                      <path 
                        className="text-indigo-600" 
                        strokeWidth="3.5" 
                        stroke="currentColor" 
                        strokeDasharray={`${(domainMetrics.authorityScore / 100) * 75}, 100`} 
                        strokeLinecap="round" 
                        fill="none" 
                        d="M 6.4 29.6 A 16 16 0 1 1 29.6 29.6" 
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 mt-1.5 font-mono">
                  Trust & Domain referral weight
                </div>
              </div>

              {/* Box 2: Organic Traffic */}
              <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center justify-between">
                  <span>Organic Traffic</span>
                  <Info className="w-3 h-3 text-slate-300" />
                </span>

                <div className="mt-1 pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-blue-900 font-mono">
                      {domainMetrics.organicTrafficVal}
                    </span>
                    <span className="text-[10px] font-extrabold text-rose-500 font-mono">
                      -{domainMetrics.organicTrafficPercent}%
                    </span>
                  </div>

                  {/* Tiny SVG trace trendline */}
                  <div className="w-full h-6 mt-1.5">
                    <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path 
                        d="M0,8 Q20,1 40,12 T80,4 T100,16" 
                        fill="none" 
                        stroke="#2563eb" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Box 3: Organic Keywords */}
              <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center justify-between">
                  <span>Organic Keywords</span>
                  <Info className="w-3 h-3 text-slate-300" />
                </span>

                <div className="mt-1 pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-slate-850 font-mono">
                      {domainMetrics.organicKeywordsVal}
                    </span>
                    <span className="text-[10px] font-extrabold text-rose-500 font-mono">
                      -{domainMetrics.organicKeywordsPercent}%
                    </span>
                  </div>

                  {/* Tiny SVG trace histogram */}
                  <div className="w-full h-6 mt-1.5">
                    <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <rect x="2" y="11" width="6" height="9" fill="#93c5fd" />
                      <rect x="12" y="3" width="6" height="17" fill="#93c5fd" />
                      <rect x="22" y="7" width="6" height="13" fill="#93c5fd" />
                      <rect x="32" y="12" width="6" height="8" fill="#93c5fd" />
                      <rect x="42" y="6" width="6" height="14" fill="#3b82f6" />
                      <rect x="52" y="8" width="6" height="12" fill="#3b82f6" />
                      <rect x="62" y="13" width="6" height="7" fill="#3b82f6" />
                      <rect x="72" y="5" width="6" height="15" fill="#1d4ed8" />
                      <rect x="82" y="4" width="6" height="16" fill="#1d4ed8" />
                      <rect x="92" y="9" width="6" height="11" fill="#1d4ed8" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Extra submetrics checklist from mockup */}
            <div className="p-4 px-5 bg-slate-50/30 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Paid Keywords</span>
                <span className="font-bold text-slate-700 font-mono text-sm block mt-0.5">0</span>
                <span className="text-[9px] text-slate-400 font-semibold font-mono">0.0% PPC ads</span>
              </div>
              <div className="border-l border-slate-150 pl-2">
                <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Ref. Domains</span>
                <span className="font-bold text-slate-700 font-mono text-sm block mt-0.5">
                  {domainMetrics.refDomainsVal}
                </span>
                <span className="text-[9px] text-rose-500 font-semibold font-mono flex items-center">
                  -{domainMetrics.refDomainsPercent}%
                </span>
              </div>
              <div className="border-l border-slate-150 pl-2">
                <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Paid Traffic</span>
                <span className="font-bold text-slate-400 font-mono text-sm block mt-0.5">0</span>
                <span className="text-[9px] text-slate-400">No ad budgets found</span>
              </div>
              <div className="border-l border-slate-150 pl-2">
                <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Backlinks</span>
                <span className="font-[#1d4ed8] font-black text-slate-900 font-mono text-sm block mt-0.5">
                  {domainMetrics.backlinksVal}
                </span>
                <span className="text-[9px] text-emerald-600 font-extrabold flex items-center pr-1 bg-emerald-50 max-w-[50px] px-1 rounded mt-0.5">
                  Active
                </span>
              </div>
            </div>

            {/* Toggle trigger link */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                onClick={() => setActiveView(ActiveView.DomainOverview)}
                className="text-xs font-bold text-slate-650 hover:text-purple-600 transition-all flex items-center gap-1 justify-center mx-auto"
              >
                Inspect Full Domain Overview <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* 3. ROW 2: SIDE-BY-SIDE Site Audit & Organic Rankings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        
        {/* CARD C: SITE AUDIT */}
        {visibleCards.siteAudit && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 flex flex-col justify-between text-left">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-bold text-slate-900">Site Audit</h2>
                    <span className="text-[9px] bg-pink-50 text-pink-600 font-bold px-1.5 py-0.5 rounded-full uppercase">Crawler active</span>
                  </div>
                  <p className="text-xs text-slate-400">Updated: Mon, Jun 22, 2026 • Live crawl diagnostics</p>
                </div>
                <button 
                  onClick={() => setCardVisibility("siteAudit", false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Crawl overview body */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Dial Gauge */}
                <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100/80">
                  <div className="relative w-20 h-20 shrink-0">
                    {/* SVG Radial Gauge */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="16" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="4.5" 
                        strokeDasharray={`${domainMetrics.siteAudit.health}, 100`} 
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-800">{domainMetrics.siteAudit.health}%</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Health</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-805">Crawled Health Index</div>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                      No critical warnings changes
                    </p>
                  </div>
                </div>

                {/* Audit counts list */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#fee2e2]/40 p-2 px-3.5 rounded-lg border border-red-100">
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      Crawl Errors
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-black text-rose-700 font-mono">
                        {domainMetrics.siteAudit.errors}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Critical fix pending</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-amber-50/45 p-2 px-3.5 rounded-lg border border-amber-100">
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-amber-500 shrink-0" />
                      Crawl Warnings
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-black text-amber-700 font-mono">
                        {domainMetrics.siteAudit.warnings}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">Needs optimization</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Horizontal colorful segmented progress bar representing crawling pages */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Crawled Pages Segmented Index
                  </span>
                  <span className="text-sm font-black text-slate-800 font-mono">
                    {domainMetrics.siteAudit.crawled} / 1000
                  </span>
                </div>
                
                {/* Horizontal progress stack bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-emerald-500" style={{ width: "72%" }} title="Healthy: 72%"></div>
                  <div className="h-full bg-amber-400" style={{ width: "18%" }} title="Warnings: 18%"></div>
                  <div className="h-full bg-rose-500" style={{ width: "6%" }} title="Blocked/Locked: 6%"></div>
                  <div className="h-full bg-[#3b82f6]" style={{ width: "3%" }} title="Redirects: 3%"></div>
                  <div className="h-full bg-slate-300" style={{ width: "1%" }} title="No Index: 1%"></div>
                </div>
                
                <div className="flex gap-2.5 flex-wrap text-[9px] text-[#2c3e50] font-bold mt-2 font-mono uppercase">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 block"></span> Regular (72%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 block"></span> Warns (18%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 block"></span> Error (6%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 block"></span> Redir (3%)</span>
                </div>
              </div>

            </div>

            {/* View Full Report footer button */}
            <div className="mt-6 pt-3 border-t border-slate-100 text-center">
              <button 
                onClick={() => setActiveView(ActiveView.SiteAudit)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                View full technical Audit report <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CARD D: ORGANIC RANKINGS */}
        {visibleCards.organicRankings && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 flex flex-col justify-between text-left">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-[20px] font-bold text-slate-900">Organic Rankings</h2>
                  <p className="text-xs text-slate-400">Target: root-level crawl • 🇺🇸 US • Monthly Trend</p>
                </div>
                <button 
                  onClick={() => setCardVisibility("organicRankings", false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Two sub-charts: Line trace and column trace */}
              <div className="space-y-5">
                
                {/* 1. Organic Traffic Line Chart */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                    <span>Organic traffic Index trend line (visits/mo)</span>
                    <span className="text-blue-650 font-black">12.4K</span>
                  </div>
                  
                  <div className="h-24 bg-slate-50/55 rounded-lg border border-slate-100 p-2 relative flex items-end">
                    {/* SVG smooth graph path */}
                    <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                      <fill>
                        <linearGradient id="trendGradFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                        </linearGradient>
                      </fill>
                      
                      {/* Area beneath curve */}
                      <path 
                        d="M0,80 L0,32 Q60,18 120,41 T240,49 T360,28 L400,35 L400,80 Z" 
                        fill="url(#trendGradFill)" 
                      />

                      {/* Spark line route */}
                      <path 
                        d="M0,32 Q60,18 120,41 T240,49 T360,28 L400,35" 
                        fill="none" 
                        stroke="#4f46e5" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                      />

                      {/* Bullet highlights */}
                      <circle cx="120" cy="41" r="3.5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                      <circle cx="360" cy="28" r="3.5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                    </svg>
                    
                    {/* Month indicators */}
                    <div className="absolute left-2 right-2 bottom-0 flex justify-between text-[8px] text-slate-400 font-semibold font-mono">
                      <span>May 23</span>
                      <span>May 28</span>
                      <span>Jun 2</span>
                      <span>Jun 7</span>
                      <span>Jun 12</span>
                      <span>Jun 20</span>
                    </div>
                  </div>
                </div>

                {/* 2. Position changes histogram columns */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                    <span>Keywords Position Changes (Improved / Declined)</span>
                  </div>

                  <div className="h-16 bg-slate-50/40 rounded-lg border border-slate-100 p-2 flex items-center justify-between">
                    {/* Visual representative bar blocks list */}
                    <div className="w-full flex justify-between items-end h-12 px-1 gap-[2px]">
                      {[12, 18, -6, 22, -14, 8, 15, -4, 25, 10, -9, 14, 19, -5, 29, 6, -11, 24, -3, 16].map((it, idx) => (
                        <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                          {it >= 0 ? (
                            <div 
                              className="bg-emerald-400 w-full rounded-xs hover:bg-emerald-500 hover:scale-105 transition-all shadow-xs" 
                              style={{ height: `${it * 1.5}%` }}
                              title={`Improved by +${it} positions`}
                            ></div>
                          ) : (
                            <div className="w-[1.8px] sm:w-[3px] flex-1 flex flex-col justify-start h-full">
                              <div 
                                className="bg-amber-400 w-full rounded-xs hover:bg-amber-500 hover:scale-105 transition-all mt-[1px]" 
                                style={{ height: `${Math.abs(it) * 1.5}%` }}
                                title={`Declined by -${Math.abs(it)} positions`}
                              ></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend indicators */}
                <div className="flex gap-4 text-[9px] font-extrabold text-slate-500 px-1 font-mono uppercase">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 inline-block"></span>
                    Improved keyword rankings
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block"></span>
                    Declined keyword rankings
                  </span>
                </div>

              </div>
            </div>

            {/* View full report trigger button */}
            <div className="mt-6 pt-3 border-t border-slate-100 text-center">
              <button 
                onClick={() => setActiveView(ActiveView.OrganicRankings)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                View full organic keywords positions list <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 4. ROW 3: WIDE TRAFFIC ANALYTICS CHART WITH INTERACTIVE CHECKBOX STATE */}
      {visibleCards.trafficAnalytics && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-left">
          
          {/* Header portion */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
            <div className="space-y-0.5">
              <h2 className="text-[20px] font-bold text-slate-900 flex items-center gap-1.5">
                Traffic Analytics
                <span className="text-[10px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Traffic Breakdown
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">Historical data: May 2026 • Combined telemetry logs</p>
            </div>

            {/* Toggle Switch Filters */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
              <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setTrafficLineFilter("semrush")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    trafficLineFilter === "semrush" 
                      ? "bg-purple-600 text-white shadow-xs" 
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Semrush Data index
                </button>
                <button
                  onClick={() => setTrafficLineFilter("google")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    trafficLineFilter === "google" 
                      ? "bg-purple-600 text-white shadow-xs" 
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Google Data index
                </button>
              </div>

              <select
                value={trafficMonths}
                onChange={(e) => setTrafficMonths(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-1 px-2 text-xs font-bold text-slate-700 pointer focus:ring-1 focus:ring-purple-500 outline-none"
              >
                <option>Historical data: May 2026</option>
                <option>Historical data: Apr 2026</option>
                <option>Historical data: Mar 2026</option>
                <option>Historical data: Feb 2026</option>
              </select>

              <button 
                onClick={() => setCardVisibility("trafficAnalytics", false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                title="Hide Traffic Analytics"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Mini Metrics checklist stats layout */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-left mb-6">
            
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Visits</span>
              <span className="text-xl font-bold text-slate-900 block font-mono">1.6M</span>
              <span className="text-[10px] text-emerald-600 font-extrabold font-mono flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mr-0.5" /> +46.98%
              </span>
            </div>

            <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Unique Visitors</span>
              <span className="text-xl font-bold text-slate-900 block font-mono">1.1M</span>
              <span className="text-[10px] text-emerald-600 font-extrabold font-mono flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mr-0.5" /> +21.48%
              </span>
            </div>

            <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Pages / Visit</span>
              <span className="text-xl font-bold text-slate-900 block font-mono">2.53</span>
              <span className="text-[10px] text-emerald-600 font-extrabold font-mono flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mr-0.5" /> +12.42%
              </span>
            </div>

            <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Avg. Visit Dur</span>
              <span className="text-xl font-bold text-slate-900 block font-mono">00:07:33</span>
              <span className="text-[10px] text-rose-500 font-extrabold font-mono flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5 shrink-0 mr-0.5" /> -25.62%
              </span>
            </div>

            <div className="space-y-0.5 border-l border-slate-200/80 pl-2">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Bounce Rate</span>
              <span className="text-xl font-bold text-slate-900 block font-mono">63.48%</span>
              <span className="text-[10px] text-emerald-605 font-extrabold text-emerald-600 font-mono flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5 shrink-0 mr-0.5" /> -12.03% (Pos)
              </span>
            </div>

          </div>

          {/* Interactive Multi-line chart */}
          <div className="h-64 relative bg-[#fcfdfe] p-4 border border-slate-100 rounded-xl">
            <span className="absolute left-2.5 top-2.5 text-[9px] font-mono font-bold text-slate-300 uppercase select-none">
              6 Months Trend Analytics Grid
            </span>

            <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
              {/* Grid guide lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* LINE 1: Direct (Blue) */}
              {activeLines.direct && (
                <path 
                  d="M0,132 Q100,121 200,123 T400,141 T600,119" 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
              )}

              {/* LINE 2: Referral (Teal) */}
              {activeLines.referral && (
                <path 
                  d="M0,150 Q120,135 240,148 T480,145 T600,146" 
                  fill="none" 
                  stroke="#0d9488" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
              )}

              {/* LINE 3: Organic Search (Red) */}
              {activeLines.organic && (
                <path 
                  d="M0,60 Q120,55 240,110 T480,95 T600,70" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
              )}

              {/* LINE 4: Paid Social (Indigo) */}
              {activeLines.paidSocial && (
                <path 
                  d="M0,105 Q120,115 240,85 T480,115 T600,100" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                />
              )}

              {/* LINE 5: Display Ads (Amber) */}
              {activeLines.displayAds && (
                <path 
                  d="M0,140 Q150,110 300,135 T600,115" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              )}

              {/* LINE 6: Email (Green) */}
              {activeLines.email && (
                <path 
                  d="M0,118 Q180,90 360,115 T600,85" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeDasharray="6 3"
                />
              )}

              {/* Scatter nodes for highlights */}
              {activeLines.organic && (
                <>
                  <circle cx="240" cy="110" r="4.5" fill="#ffffff" stroke="#ef4444" strokeWidth="2.5" />
                  <circle cx="600" cy="70" r="4.5" fill="#ef4444" stroke="#ef4444" strokeWidth="1" />
                </>
              )}
            </svg>
            
            {/* Axis Labels */}
            <div className="absolute left-4 right-4 bottom-1 flex justify-between text-[10px] text-slate-400 font-bold font-mono">
              <span>Dec 25</span>
              <span>Jan 26</span>
              <span>Feb 26</span>
              <span>Mar 26</span>
              <span>Apr 26</span>
              <span>May 26</span>
            </div>
          </div>

          {/* CHECKBOX SELECTION CONTROLS ROW */}
          <div className="mt-5 p-3 px-4 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-wrap gap-x-6 gap-y-2 text-xs">
            
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input 
                type="checkbox" 
                checked={activeLines.direct} 
                onChange={() => toggleLine("direct")}
                className="rounded border-slate-300 text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400 w-4 h-4 cursor-pointer"
              />
              <span className="w-2.5 h-2.5 bg-[#2563eb] rounded-xs inline-block"></span>
              Direct Traffic
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input 
                type="checkbox" 
                checked={activeLines.referral} 
                onChange={() => toggleLine("referral")}
                className="rounded border-slate-300 text-teal-600 focus:outline-[#0d9488] w-4 h-4 cursor-pointer"
              />
              <span className="w-2.5 h-2.5 bg-[#0d9488] rounded-xs inline-block"></span>
              Referrals Web
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input 
                type="checkbox" 
                checked={activeLines.organic} 
                onChange={() => toggleLine("organic")}
                className="rounded border-slate-300 text-red-600 focus:outline-none focus:ring-2 w-4 h-4 cursor-pointer"
              />
              <span className="w-2.5 h-2.5 bg-[#ef4444] rounded-xs inline-block"></span>
              Organic Search
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input 
                type="checkbox" 
                checked={activeLines.paidSocial} 
                onChange={() => toggleLine("paidSocial")}
                className="rounded border-slate-300 text-indigo-600 w-4 h-4 cursor-pointer"
              />
              <span className="w-2.5 h-2.5 bg-[#6366f1] rounded-xs inline-block"></span>
              Paid Social Ads
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input 
                type="checkbox" 
                checked={activeLines.displayAds} 
                onChange={() => toggleLine("displayAds")}
                className="rounded border-slate-300 text-amber-500 w-4 h-4 cursor-pointer"
              />
              <span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-xs inline-block"></span>
              Display Banner Advertising
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input 
                type="checkbox" 
                checked={activeLines.email} 
                onChange={() => toggleLine("email")}
                className="rounded border-slate-300 text-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span className="w-2.5 h-2.5 bg-[#10b981] rounded-xs inline-block"></span>
              Email Campaigns
            </label>

          </div>

          <div className="mt-4 text-center">
            <button 
              onClick={() => setActiveView(ActiveView.DomainOverview)}
              className="text-xs font-bold text-slate-650 hover:text-purple-600 transition-all flex items-center justify-center gap-1 mx-auto"
            >
              Analyze detailed audience Traffic flows & bounce analytics <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>
      )}

      {/* 5. ROW 4: BACKLINKS (Wide Banner Card) */}
      {visibleCards.backlinks && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-left">
          
          <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 flex items-center gap-1">
                Backlinks Overviews Check
                <Info className="w-3.5 h-3.5 text-slate-300" />
              </h2>
              <p className="text-xs text-slate-400">Track incoming hyperlinks, anchor domains and authority weights</p>
            </div>
            <button 
              onClick={() => setCardVisibility("backlinks", false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Column A: Referring Domains Graph over last 12 months */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-700 uppercase">Referring Domains history</span>
                <span className="font-bold text-indigo-750 bg-indigo-50 px-1 py-0.5 rounded text-[10px] uppercase">
                  Last 12 months
                </span>
              </div>

              {/* SVG Area chart */}
              <div className="h-44 relative bg-white border border-slate-100 rounded-lg p-2 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 350 120" preserveAspectRatio="none">
                  {/* Area gradient */}
                  <defs>
                    <linearGradient id="backlinkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Path area fill */}
                  <path 
                    d="M 0,110 Q 70,80 140,40 T 280,95 Q 315,80 350,90 L 350,120 L 0,120 Z" 
                    fill="url(#backlinkGrad)" 
                  />

                  {/* Top boundary path */}
                  <path 
                    d="M 0,110 Q 70,80 140,40 T 280,95 Q 315,80 350,90" 
                    fill="none" 
                    stroke="#1d4ed8" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                  />

                  {/* Specific anchor circles */}
                  <circle cx="140" cy="40" r="4" fill="#ffffff" stroke="#1d4ed8" strokeWidth="2" />
                  <circle cx="280" cy="95" r="4" fill="#ffffff" stroke="#1d4ed8" strokeWidth="2" />
                </svg>
                
                {/* 12 months ticks layout */}
                <div className="absolute left-2.5 right-2.5 bottom-1 flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                  <span>Jul 25</span>
                  <span>Sep 25</span>
                  <span>Nov 25</span>
                  <span>Jan 26</span>
                  <span>Mar 26</span>
                  <span>May 26</span>
                </div>
              </div>
            </div>

            {/* Column B: Referring Domains by Authority Score */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-800 uppercase tracking-wide">
                  Referring Domains by Authority Score
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">Jun 2026</span>
              </div>

              {/* Progress Bar Rows block */}
              <div className="space-y-2.5 text-xs">
                
                {/* Row 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span className="font-mono text-slate-400">81 - 100 (High Trust)</span>
                    <span className="font-semibold text-slate-500 font-mono">0.37% (24 domains)</span>
                  </div>
                  <div className="w-full bg-slate-205 h-2 rounded-full overflow-hidden bg-slate-200">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: "1%" }}></div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-750">
                    <span className="font-mono text-slate-400">61 - 80</span>
                    <span className="font-semibold text-slate-500 font-mono">1.0% (64 domains)</span>
                  </div>
                  <div className="w-full bg-slate-205 h-2 rounded-full overflow-hidden bg-slate-200">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: "3.5%" }}></div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-750">
                    <span className="font-mono text-slate-400">41 - 60</span>
                    <span className="font-semibold text-slate-500 font-mono">3.66% (235 domains)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-650 h-full rounded-full bg-indigo-500" style={{ width: "10%" }}></div>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-750">
                    <span className="font-mono text-slate-400">21 - 40</span>
                    <span className="font-semibold text-slate-650 font-mono">10.91% (701 domains)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-700 h-full rounded-full bg-indigo-600" style={{ width: "24%" }}></div>
                  </div>
                </div>

                {/* Row 5 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-755">
                    <span className="font-mono text-slate-400">0 - 20 (Low Trust / Spam risk)</span>
                    <span className="font-black text-slate-900 font-mono">84.06% (5,399 domains)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1d4ed8] h-full rounded-full" style={{ width: "84.06%" }}></div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="mt-5 text-center">
            <button 
              onClick={() => setActiveView(ActiveView.BacklinkAnalytics)}
              className="px-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-lg transition-colors inline-flex items-center gap-1"
            >
              Examine referring domain anchors and toxic backlinks <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>
      )}

      {/* 6. GOOGLE SERVICES INTEGRATION CARD VIEW */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Mock graphics section */}
          <div className="md:col-span-5 bg-slate-50/60 p-4 rounded-xl border border-slate-150 flex items-center justify-center relative min-h-[140px] overflow-hidden">
            
            {/* Absolute element overlays to look exactly like mockup wireframe */}
            <div className="w-full max-w-sm space-y-2 select-none opacity-40">
              <div className="h-2 bg-slate-300 rounded w-1/3"></div>
              <div className="h-6 bg-slate-300 rounded w-1/2"></div>
              <div className="h-20 bg-slate-200 rounded-xl"></div>
            </div>

            {/* Popup connector model */}
            <div className="absolute bg-white border border-slate-200/80 p-3 rounded-lg shadow-lg flex flex-col items-center space-y-2 text-center max-w-[210px] hover:scale-105 transition-transform">
              <div className="flex items-center space-x-1 justify-center">
                <span className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-xs">G</span>
                <span className="text-slate-300 text-xs font-semibold">&lt;&gt;</span>
                <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-xs">SR</span>
              </div>
              <span className="text-[10px] font-black text-slate-800">CONNECT YOUR ACCOUNT</span>
              <div className="space-y-1 w-full scale-90">
                <div className="h-1.5 bg-slate-150 rounded w-full"></div>
                <div className="h-1.5 bg-slate-150 rounded w-11/12 mx-auto"></div>
                <div className="h-2 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 block text-[7px] font-bold rounded">
                  {googleConnected ? "AUTHORIZED SEAMLESS" : "AWAITING AUTHORIZATION"}
                </div>
              </div>
            </div>

          </div>

          {/* Description and connect button */}
          <div className="md:col-span-7 text-left space-y-3.5 pr-1">
            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900">
                Connect Google services
              </h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                Enrich your analysis with real-time website performance data pulled directly from your official **Google Analytics** properties & **Google Search Console** search performance indices directly here in SuiteRank SEO Dashboard.
              </p>
            </div>

            {connectingGoogle ? (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200 max-w-xs">
                <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                <span>Redirecting & syncing secure Google OAuth token...</span>
              </div>
            ) : googleConnected ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 max-w-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Google Console Properties Synced Live for {domain}</span>
                </div>
                <button 
                  onClick={handleConnectGoogle}
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 underline"
                >
                  Disconnect service properties
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleConnectGoogle}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                  {/* Mock google colors logo prefix */}
                  <span className="bg-white text-[10px] text-blue-600 font-extrabold p-1 rounded-full w-4.5 h-4.5 flex items-center justify-center">G</span>
                  Connect Google Properties
                </button>
                
                <button 
                  onClick={() => toast.info("Retrieved Google analytics data complies with API OAuth terms and standard private partition policies.")}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold underline decoration-dotted"
                >
                  Disclaimer policies
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 7. HIDDEN WIDGETS MANAGER ROW */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-5 text-left space-y-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
            Hidden Widgets Manager
          </h3>
          <Info className="w-3.5 h-3.5 text-slate-350" />
        </div>

        {/* Dynamic List links based on active status */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 text-xs">
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("aiSearch", !visibleCards.aiSearch)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.aiSearch ? "text-slate-400" : "text-[#2563eb] font-bold"}>
                {visibleCards.aiSearch ? "Hide" : "Restore"}
              </span>
              <span className="text-slate-700">AI Search Insights</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("seoSummary", !visibleCards.seoSummary)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.seoSummary ? "text-slate-400" : "text-[#2563eb] font-bold"}>
                {visibleCards.seoSummary ? "Hide" : "Restore"}
              </span>
              <span className="text-slate-700">SEO Index Stats</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("siteAudit", !visibleCards.siteAudit)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.siteAudit ? "text-slate-400" : "text-[#2563eb] font-bold"}>
                {visibleCards.siteAudit ? "Hide" : "Restore"}
              </span>
              <span className="text-slate-700">Site Technical Audit</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("organicRankings", !visibleCards.organicRankings)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.organicRankings ? "text-slate-400" : "text-[#2563eb] font-bold"}>
                {visibleCards.organicRankings ? "Hide" : "Restore"}
              </span>
              <span className="text-slate-700">Organic rankings</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("trafficAnalytics", !visibleCards.trafficAnalytics)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.trafficAnalytics ? "text-slate-400" : "text-[#2563eb] font-bold"}>
                {visibleCards.trafficAnalytics ? "Hide" : "Restore"}
              </span>
              <span className="text-slate-700">Traffic Analytics</span>
            </button>
          </div>

          {/* Additional mockup restore cards */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("positionTracking", !visibleCards.positionTracking)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.positionTracking ? "text-slate-400 font-normal" : "text-[#2563eb] font-bold"}>
                {visibleCards.positionTracking ? "Close" : "Restore"}
              </span>
              <span className="text-slate-700">Position Tracking</span>
            </button>
            <span className="text-[9px] bg-sky-50 text-sky-600 font-extrabold px-1 rounded transform scale-90">Restore info</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("backlinkAudit", !visibleCards.backlinkAudit)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.backlinkAudit ? "text-slate-400 font-normal" : "text-[#2563eb] font-bold"}>
                {visibleCards.backlinkAudit ? "Close" : "Restore"}
              </span>
              <span className="text-slate-700">Backlink Audit</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("linkBuildingTool", !visibleCards.linkBuildingTool)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.linkBuildingTool ? "text-slate-400 font-normal" : "text-[#2563eb] font-bold"}>
                {visibleCards.linkBuildingTool ? "Close" : "Restore"}
              </span>
              <span className="text-slate-700">Link Building Tool</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("onPageSeoChecker", !visibleCards.onPageSeoChecker)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.onPageSeoChecker ? "text-slate-400 font-normal" : "text-[#2563eb] font-bold"}>
                {visibleCards.onPageSeoChecker ? "Close" : "Restore"}
              </span>
              <span className="text-slate-700">On Page SEO Checker</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCardVisibility("organicTrafficInsights", !visibleCards.organicTrafficInsights)}
              className="font-bold hover:underline text-[#2563eb] cursor-pointer flex items-center gap-1"
            >
              <span className={visibleCards.organicTrafficInsights ? "text-slate-400 font-normal" : "text-[#2563eb] font-bold"}>
                {visibleCards.organicTrafficInsights ? "Close" : "Restore"}
              </span>
              <span className="text-slate-700">Organic Traffic Insights</span>
            </button>
          </div>

        </div>

        {/* Master action controls */}
        <div className="flex gap-2.5 pt-2">
          <button 
            onClick={restoreAll}
            className="bg-white hover:bg-slate-50 text-slate-705 border border-slate-300 font-extrabold text-xs py-1.5 px-4 rounded-lg transition-all shadow-xs"
          >
            Restore all widgets
          </button>
          <button 
            onClick={() => toast.success("Feature suggestion recorded: widget dispatched to product planning queues.")}
            className="text-xs hover:text-purple-700 font-bold text-purple-600 underline decoration-dotted"
          >
            + Suggest new widget
          </button>
        </div>
      </div>

      {/* RENDER DYNAMICALLY ADDED EXTRA CARDS FOR ADDITIONAL SECTIONS */}
      {visibleCards.positionTracking && (
        <div className="bg-white border-2 border-indigo-200/80 rounded-xl p-5 text-left space-y-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-500" />
                Live Position Tracking Supplement
              </h3>
              <p className="text-xs text-slate-400">Restored from Hidden Widgets registry</p>
            </div>
            <button 
              onClick={() => setCardVisibility("positionTracking", false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase">Average Position Rank</span>
              <span className="text-2xl font-black text-slate-800">#4.2</span>
              <span className="text-[10px] text-emerald-600 flex items-center font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +0.8 rank boost this week
              </span>
            </div>
            <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase">Top 3 Keywords count</span>
              <span className="text-2xl font-black text-indigo-755 text-indigo-700 font-mono">14 terms</span>
              <span className="text-[10px] text-slate-400 block">Of {domain}</span>
            </div>
            <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase">Top 10 Keywords count</span>
              <span className="text-2xl font-black text-indigo-755 text-indigo-700 font-mono">59 terms</span>
              <span className="text-[10px] text-slate-400 block">Healthy visibility density</span>
            </div>
          </div>
        </div>
      )}

      {visibleCards.backlinkAudit && (
        <div className="bg-white border-2 border-indigo-200/80 rounded-xl p-5 text-left space-y-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-indigo-500" />
                Live Backlink Audit Supplement
              </h3>
              <p className="text-xs text-slate-400">Restored from Hidden Widgets registry</p>
            </div>
            <button 
              onClick={() => setCardVisibility("backlinkAudit", false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3 bg-emerald-50/30 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-emerald-800 block uppercase font-bold">Toxic Score Zero</span>
              <span className="text-xl font-bold text-emerald-700">0% High Risk</span>
            </div>
            <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase">Medium Risk</span>
              <span className="text-xl font-bold text-slate-700">2 active items</span>
            </div>
            <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase">Low Risk</span>
              <span className="text-xl font-bold text-slate-700">849 active items</span>
            </div>
            <div className="p-3 bg-red-50/20 rounded-lg border border-red-100">
              <span className="text-[10px] text-red-800 block uppercase font-bold">Disavowed Link URLs</span>
              <span className="text-xl font-bold text-rose-700 font-mono">0 active urls</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. BRAND FOOTER LINKS ROW */}
      <div className="pt-8 border-t border-slate-200 text-slate-450 text-[11px] font-semibold">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            <a href="https://www.semrush.com/contact-us/" target="_blank" rel="noreferrer" className="hover:text-purple-600">Contact us</a>
            <a href="https://www.semrush.com/company/" target="_blank" rel="noreferrer" className="hover:text-purple-600">About us</a>
            <a href="https://www.semrush.com/blog/" target="_blank" rel="noreferrer" className="hover:text-purple-600">Blog</a>
            
            <div className="relative inline-block text-left text-slate-500">
              <span className="cursor-pointer hover:text-slate-700 flex items-center gap-0.5 select-none">
                🌐 English <ChevronDown className="w-3 h-3 stroke-[2.5]" />
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4">
            <button 
              onClick={() => setActiveView(ActiveView.Billing)}
              className="text-slate-500 hover:text-slate-800"
            >
              See plans and pricing
            </button>
            <button 
              onClick={() => setActiveView(ActiveView.Billing)}
              className="bg-[#009f5e] hover:bg-[#008f54] text-white font-extrabold px-3 py-1.5 rounded transition-all text-[11.5px]"
            >
              Get started with Semrush Enterprise
            </button>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100/70 text-center sm:text-left text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between gap-2.5">
          <span>© 2026 Semrush Holdings. All rights reserved. Live replica console.</span>
          <div className="flex justify-center sm:justify-end gap-3.5">
            <a href="https://www.semrush.com/legal/cookie-policy/" className="hover:underline">Cookie settings</a>
            <a href="https://www.semrush.com/legal/" className="hover:underline">Legal info</a>
            <a href="https://www.semrush.com/privacy/" className="hover:underline">Privacy policy</a>
            <a href="https://www.semrush.com/privacy/dns/" className="hover:underline">Do not sell my personal info</a>
          </div>
        </div>
      </div>

    </div>
  );
}
