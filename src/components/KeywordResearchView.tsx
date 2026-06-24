/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { KeywordRecord } from "../types";
import { generateKeywordsForQuery } from "../mockData";
import KeywordTableView from "./KeywordTableView";
import { 
  Search, 
  HelpCircle, 
  Layers, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  SlidersHorizontal,
  ChevronDown,
  CornerDownRight,
  Filter,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Plus,
  Clock,
  Settings,
  Share2,
  Globe,
  RefreshCw,
  FileText,
  ChevronRight,
  Eye,
  Check
} from "lucide-react";

interface KeywordResearchViewProps {
  initialKeyword?: string;
  defaultTab?: "overview" | "magic-tool" | "keyword-gap";
}

export default function KeywordResearchView({ initialKeyword = "saas analytics", defaultTab }: KeywordResearchViewProps) {
  // Primary keyword state
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [searchedWord, setSearchedWord] = useState(initialKeyword);
  const [country, setCountry] = useState("US");
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"overview" | "magic-tool" | "keyword-gap">(defaultTab || "overview");

  // Keyword dataset state
  const [keywordList, setKeywordList] = useState<KeywordRecord[]>([]);

  // Filter configurations
  const [kdFilter, setKdFilter] = useState("all"); // all | easy | medium | hard
  const [intentFilter, setIntentFilter] = useState("all"); // all | Info | Comm | Trans
  const [questionsOnly, setQuestionsOnly] = useState(false);
  const [minVolume, setMinVolume] = useState<number>(0);

  // Cluster sidebar selection
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  // --- REVAMPED SEMRUSH DESIGN STATES ---
  const [matchType, setMatchType] = useState<"All" | "Questions" | "Broad Match" | "Phrase Match" | "Exact Match" | "Related">("Broad Match");
  const [dbCountry, setDbCountry] = useState<string>("IN");
  const [currencyCode, setCurrencyCode] = useState<string>("USD");
  const [sidebarUnit, setSidebarUnit] = useState<"number" | "volume">("number");
  const [selectedWordGroup, setSelectedWordGroup] = useState<string | null>(null);
  
  // Personalization
  const [personalizedDomain, setPersonalizedDomain] = useState<string>("");
  const [showPersonalizedInput, setShowPersonalizedInput] = useState(false);

  // Advanced dropdown states
  const [minVolumeRange, setMinVolumeRange] = useState<string>("all");
  const [kdRangeFilter, setKdRangeFilter] = useState<string>("all");
  const [intentSelection, setIntentSelection] = useState<string>("all");
  const [cpcRangeFilter, setCpcRangeFilter] = useState<string>("all");
  const [includeText, setIncludeText] = useState<string>("");
  const [excludeText, setExcludeText] = useState<string>("");

  // Table selections
  const [selectedKws, setSelectedKws] = useState<string[]>([]);

  // Magic Tool table pagination and sorting
  const [magicPage, setMagicPage] = useState(1);
  const [magicSortField, setMagicSortField] = useState<"keyword" | "volume" | "kd" | "cpc">("volume");
  const [magicSortDirection, setMagicSortDirection] = useState<"asc" | "desc">("desc");

  // Reset page index when any search parameter shifts
  useEffect(() => {
    setMagicPage(1);
  }, [selectedWordGroup, matchType, minVolumeRange, kdRangeFilter, intentSelection, cpcRangeFilter, includeText, excludeText, searchedWord]);

  // Seed on search or first mount
  const executeSearch = () => {
    const list = generateKeywordsForQuery(searchTerm);
    setKeywordList(list);
    setSearchedWord(searchTerm);
    setSelectedCluster(null); // Reset cluster filter on new query
  };

  useEffect(() => {
    executeSearch();
  }, []);

  // Filtered dataset computed from parameters
  const finalList = React.useMemo(() => {
    return keywordList.filter(item => {
      // Intent filter
      if (intentFilter !== "all" && item.intent !== intentFilter) return false;
      
      // KD filter
      if (kdFilter === "easy" && item.kd > 35) return false;
      if (kdFilter === "medium" && (item.kd <= 35 || item.kd > 55)) return false;
      if (kdFilter === "hard" && item.kd <= 55) return false;
      
      // Volume filter
      if (minVolume > 0 && item.volume < minVolume) return false;

      // Questions filter simulation (keywords starting with standard indicators)
      if (questionsOnly) {
        const triggers = ["how", "why", "what", "best", "where", "tutorial"];
        return triggers.some(t => item.keyword.toLowerCase().includes(t));
      }

      // Semantic cluster filter
      if (selectedCluster) {
        const clus = selectedCluster.toLowerCase();
        // If clus is "for beginners" filter keywords containing "guide" or "tutorial"
        if (clus === "beginners") return item.keyword.toLowerCase().includes("guide") || item.keyword.toLowerCase().includes("beginners");
        if (clus === "commercial tools") return item.intent === "Commercial" || item.keyword.toLowerCase().includes("tools") || item.keyword.toLowerCase().includes("trial");
        if (clus === "advanced/enterprise") return item.kd > 60 || item.keyword.toLowerCase().includes("enterprise");
        if (clus === "coupons/cost") return item.intent === "Transactional" || item.keyword.toLowerCase().includes("cost") || item.keyword.toLowerCase().includes("coupon");
      }

      return true;
    });
  }, [keywordList, kdFilter, intentFilter, questionsOnly, minVolume, selectedCluster]);

  // --- SHADOW FILTERED MAGIC TOOL DATA INDEXES ---
  const magicToolList = useMemo(() => {
    return keywordList.filter(item => {
      // Semantic Word Group
      if (selectedWordGroup) {
        if (!item.keyword.toLowerCase().includes(selectedWordGroup.toLowerCase())) return false;
      }

      // Match tab/chip (Broad, Phrase, Exact, Related, Questions)
      if (matchType === "Questions") {
        const triggers = ["how", "why", "what", "best", "where", "tutorial", "code", "redeem"];
        return triggers.some(t => item.keyword.toLowerCase().includes(t));
      }
      if (matchType === "Exact Match" && item.keyword !== searchedWord) {
        if (item.keyword.split(/\s+/).length > 2) return false;
      }
      if (matchType === "Phrase Match") {
        if (!item.keyword.toLowerCase().startsWith(searchedWord.toLowerCase())) return false;
      }

      // Volume limits
      if (minVolumeRange !== "all") {
        if (minVolumeRange === "high" && item.volume < 100000) return false;
        if (minVolumeRange === "med" && (item.volume < 10000 || item.volume >= 100000)) return false;
        if (minVolumeRange === "low" && item.volume >= 10000) return false;
      }

      // KD selector
      if (kdRangeFilter !== "all") {
        if (kdRangeFilter === "easy" && item.kd > 35) return false;
        if (kdRangeFilter === "medium" && (item.kd <= 35 || item.kd > 69)) return false;
        if (kdRangeFilter === "hard" && item.kd <= 69) return false;
      }

      // Intent filter
      if (intentSelection !== "all" && item.intent !== intentSelection) return false;

      // CPC filter
      if (cpcRangeFilter !== "all") {
        if (cpcRangeFilter === "free" && item.cpc > 0) return false;
        if (cpcRangeFilter === "paid" && item.cpc <= 0) return false;
      }

      // Include text trigger
      if (includeText.trim() !== "") {
        if (!item.keyword.toLowerCase().includes(includeText.toLowerCase().trim())) return false;
      }

      // Exclude text trigger
      if (excludeText.trim() !== "") {
        if (item.keyword.toLowerCase().includes(excludeText.toLowerCase().trim())) return false;
      }

      return true;
    });
  }, [keywordList, selectedWordGroup, matchType, minVolumeRange, kdRangeFilter, intentSelection, cpcRangeFilter, includeText, excludeText, searchedWord]);

  // Sidebar dynamic semantic words
  const sidebarGroups = useMemo(() => {
    if (searchedWord.toLowerCase().includes("free fire")) {
      return [
        { name: "download", count: 10849 },
        { name: "game", count: 6249 },
        { name: "pc", count: 4147 },
        { name: "hack", count: 3984 },
        { name: "garena", count: 3906 },
        { name: "apk", count: 3697 },
        { name: "diamond", count: 3191 },
        { name: "play", count: 2147 },
        { name: "online", count: 2054 },
        { name: "mod", count: 1953 },
      ];
    } else {
      // Extract common words
      const freqMap: Record<string, number> = {};
      keywordList.forEach(item => {
        const words = item.keyword.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 3 && !searchedWord.toLowerCase().includes(word)) {
            freqMap[word] = (freqMap[word] || 0) + 1;
          }
        });
      });
      return Object.entries(freqMap)
        .map(([name, count]) => ({ name, count: count * 1500 + Math.floor(Math.random() * 200) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }
  }, [searchedWord, keywordList]);

  // Sum up volumes for magic stats
  const magicTotalCount = searchedWord.toLowerCase().includes("free fire") ? 50610 : magicToolList.length * 1520;
  const magicTotalVolume = searchedWord.toLowerCase().includes("free fire") ? 22159080 : magicToolList.reduce((acc, curr) => acc + curr.volume, 0) * 1.5;
  const magicAvgKd = searchedWord.toLowerCase().includes("free fire") ? 39 : (magicToolList.length ? Math.floor(magicToolList.reduce((acc, curr) => acc + curr.kd, 0) / magicToolList.length) : 39);

  // Sorting list logic
  const magicSortedData = useMemo(() => {
    return [...magicToolList].sort((a, b) => {
      let valA = a[magicSortField];
      let valB = b[magicSortField];

      if (magicSortField === "keyword") {
        return magicSortDirection === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }

      const numA = typeof valA === "number" ? valA : 0;
      const numB = typeof valB === "number" ? valB : 0;
      return magicSortDirection === "asc" ? numA - numB : numB - numA;
    });
  }, [magicToolList, magicSortField, magicSortDirection]);

  const magicItemsPerPage = 10;

  const magicPaginatedData = useMemo(() => {
    const startIdx = (magicPage - 1) * magicItemsPerPage;
    return magicSortedData.slice(startIdx, startIdx + magicItemsPerPage);
  }, [magicSortedData, magicPage]);

  const magicTotalPages = Math.max(1, Math.ceil(magicSortedData.length / magicItemsPerPage));

  // Aggregate metrics calculation for search overview
  const totalVolume = keywordList.reduce((acc, current) => acc + current.volume, 0);
  const avgKd = keywordList.length ? Math.floor(keywordList.reduce((acc, current) => acc + current.kd, 0) / keywordList.length) : 55;
  const avgCpc = keywordList.length ? parseFloat((keywordList.reduce((acc, current) => acc + current.cpc, 0) / keywordList.length).toFixed(2)) : 3.5;
  const primaryIntent = "Commercial"; // typical for search marketing

  // KD Tier indicator text
  const getKdTierText = (kd: number) => {
    if (kd <= 35) return { text: "Easy", color: "text-emerald-500" };
    if (kd <= 55) return { text: "Medium", color: "text-blue-500" };
    if (kd <= 75) return { text: "Hard", color: "text-amber-500" };
    return { text: "Very Hard", color: "text-rose-500" };
  };

  const kdTier = getKdTierText(avgKd);

  // Global Volume countries simulator
  const globalVolumes = [
    { country: "United States", code: "US", pct: 45, volume: Math.floor(totalVolume * 0.45) },
    { country: "United Kingdom", code: "UK", pct: 15, volume: Math.floor(totalVolume * 0.15) },
    { country: "Germany", code: "DE", pct: 10, volume: Math.floor(totalVolume * 0.1) },
    { country: "Canada", code: "CA", pct: 8, volume: Math.floor(totalVolume * 0.08) },
    { country: "Australia", code: "AU", pct: 6, volume: Math.floor(totalVolume * 0.06) },
    { country: "Others", code: "INTL", pct: 16, volume: Math.floor(totalVolume * 0.16) },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-[#ff642d]" /> Keyword Research Suite
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Perform keyword overview audits or dive into the Keyword Magic Tool to find millions of related terms
        </p>
      </div>

      {/* SEARCH COMMAND BAR CARD */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-left">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Country Flag Dropdown */}
          <div className="relative w-full md:w-48">
            <label className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">Target Market</label>
            <div className="relative">
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white border border-gray-205 text-sm font-semibold text-gray-700 py-2.5 pl-3 pr-8 rounded-lg outline-none appearance-none cursor-pointer"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="DE">🇩🇪 Germany</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="AU">🇦🇺 Australia</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>
          
          {/* Core keyword input */}
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-gray-400 uppercase block mb-1 font-sans">Enter Keyword or Focus Phrase</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') executeSearch(); }}
                placeholder="e.g. leather shoes, saas tracking, marketing analytics..."
                className="w-full bg-white border border-gray-205 text-sm font-medium text-gray-800 py-2.5 pl-10 pr-4 rounded-lg focus:outline-none focus:border-[#ff642d] transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Search Trigger */}
          <div className="flex items-end">
            <button 
              onClick={executeSearch}
              className="w-full md:w-auto bg-[#ff642d] hover:bg-[#e05320] text-sm text-white font-semibold py-2.5 px-6 rounded-lg transition-all cursor-pointer shadow-md shadow-[#ff642d]/10"
            >
              Analyze Keyword
            </button>
          </div>

        </div>
      </div>

      {/* CORE TAB NAVIGATION */}
      <div className="flex border-b border-gray-250 select-none">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "overview" 
              ? "border-[#ff642d] text-[#ff642d]" 
              : "border-transparent text-gray-400 hover:text-gray-800"
          }`}
        >
          Keyword Overview
        </button>
        <button 
          onClick={() => setActiveTab("magic-tool")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "magic-tool" 
              ? "border-[#ff642d] text-[#ff642d]" 
              : "border-transparent text-gray-400 hover:text-gray-800"
          }`}
        >
          Keyword Magic Tool
        </button>
        <button 
          onClick={() => setActiveTab("keyword-gap")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "keyword-gap" 
              ? "border-[#ff642d] text-[#ff642d]" 
              : "border-transparent text-gray-400 hover:text-gray-800"
          }`}
        >
          Keyword Gap Analysis
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* OVERVIEW TABS PANEL */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left section: Metric blocks */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Volume metrics */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Average Search Volume</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono text-gray-900">{(totalVolume / 2.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className="text-xs text-gray-400">searches / mo</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                  <span>Target Region: {country}</span>
                  <span className="text-emerald-600 font-semibold flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-0.5" /> High volume stability</span>
                </div>
              </div>

              {/* Keyword difficulty circle bar */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Keyword Difficulty (KD%)</span>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold font-mono text-gray-900">{avgKd}%</span>
                    <span className={`block text-xs font-bold mt-1 ${kdTier.color}`}>{kdTier.text}</span>
                  </div>
                  
                  {/* Arc simulation */}
                  <div className="w-14 h-14 rounded-full border-4 border-gray-100 relative flex items-center justify-center">
                    <div 
                      className={`absolute inset-0 rounded-full border-4 border-transparent border-t-[#ff642d] border-r-[#ff642d]`}
                      style={{ transform: `rotate(${Math.min(360, (avgKd * 3.6))}deg)` }}
                    ></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">KD</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
                  Calculated score represent work force budget needed to challenge absolute search results ranks.
                </p>
              </div>

              {/* CPC estimate */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Cost Per Click (CPC)</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-gray-900">${avgCpc.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">USD</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                  Average ad pricing paid when searchers press primary sponsor tags on google search query blocks.
                </p>
              </div>

              {/* Intent breakdown */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Primary Search Intent</span>
                <div className="mt-3 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center font-black text-lg">
                    C
                  </span>
                  <div>
                    <span className="text-base font-bold text-gray-900 block">{primaryIntent}</span>
                    <span className="text-[10px] text-gray-400">Investigation search of competitors</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                  Users search profiles are evaluating comparable services or features to determine absolute fits.
                </p>
              </div>

            </div>

            {/* Keyword Trends graph element */}
            <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm text-left">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Search Trend Index (Last 12 Months)</h2>
              <p className="text-xs text-gray-450 mb-4">Volume aggregate trend for search tags: "{searchedWord}"</p>
              
              <div className="h-44 relative mt-6 flex items-end">
                <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200"></div>
                
                {/* Simulated bar chart columns */}
                <div className="w-full flex justify-between items-end gap-1 px-4">
                  {Array.from({ length: 12 }).map((_, mIdx) => {
                    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
                    const barHeightPct = 40 + Math.round(Math.sin(mIdx * 1.5) * 35) + (mIdx % 3 * 5);
                    return (
                      <div key={mIdx} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-slate-500 hover:bg-[#ff642d] rounded-t transition-all cursor-pointer"
                          style={{ height: `${barHeightPct}px` }}
                          title={`Searches Index: ${barHeightPct * 75}`}
                        ></div>
                        <span className="text-[9px] text-gray-400 font-medium mt-1 uppercase tracking-tighter">{months[mIdx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Overview Quick Tips List */}
            <div className="bg-[#111827] text-white p-5 rounded-xl flex items-center justify-between gap-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-gray-800 rounded-lg text-[#ff642d] mt-1"><Sparkles className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-sm font-bold">SuiteRank Smart AI Advice</h3>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-xl">
                    The keyword cluster for "{searchedWord}" has heavy commercial intent. We recommend building a comparative landing page framework or high-authority blog outlining the key alternatives to capturing early leads!
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab("magic-tool")}
                className="bg-white/10 hover:bg-white/20 text-xs font-semibold text-white py-2 px-3 rounded transition-all whitespace-nowrap hidden sm:block"
              >
                Explore Keywords
              </button>
            </div>

          </div>

          {/* Right section: Global Volume distribution & Semantic clusters selection */}
          <div className="space-y-6 text-left">
            
            {/* Global volume card */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3 mb-3">Global Search Volume</h3>
              
              <div className="space-y-3 font-sans">
                {globalVolumes.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-700">{item.country}</span>
                      <span className="font-mono text-gray-500 font-medium">{item.volume.toLocaleString()} ({item.pct}%)</span>
                    </div>
                    {/* Bar representation */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff642d] rounded-full" style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword clusters sidebar selection */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-3">
                <h3 className="text-sm font-bold text-gray-900">Topical Cluster Groups</h3>
                {selectedCluster && (
                  <button 
                    onClick={() => setSelectedCluster(null)}
                    className="text-[10px] text-[#ff642d] hover:underline font-bold"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              
              <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
                We grouped related synonyms and informational terms. Click a group block to instantly filter tables!
              </p>

              <div className="space-y-2">
                {[
                  { name: "Beginners", count: 4, desc: "Introductory guides and tutorial terms", code: "beginners" },
                  { name: "Commercial Tools", count: 6, desc: "Product comparisons and pricing queries", code: "commercial tools" },
                  { name: "Advanced/Enterprise", count: 3, desc: "High-volume corporate level requests", code: "advanced/enterprise" },
                  { name: "Coupons/Cost", count: 2, desc: "Discount values and subscription audits", code: "coupons/cost" },
                ].map((clus, idx) => {
                  const active = selectedCluster === clus.code;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCluster(active ? null : clus.code);
                        setActiveTab("magic-tool"); // jump to search block
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        active 
                          ? "border-[#ff642d] bg-orange-50/20 shadow-sm" 
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className={active ? "text-[#ff642d]" : "text-gray-800"}>{clus.name}</span>
                        <span className="bg-gray-100 text-gray-500 font-mono font-medium px-1.5 py-0.5 rounded text-[10px]">{clus.count}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{clus.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MAGIC TOOL TAB PANEL */}
      {activeTab === "magic-tool" && (
        <div className="space-y-4 text-left font-sans text-gray-800">
          
          {/* Breadcrumb row & Quick Links */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-gray-100 pb-2">
            <div className="flex items-center gap-1.5 text-gray-400 select-none">
              <span className="hover:text-gray-600 cursor-pointer">Home</span>
              <span>&gt;</span>
              <span className="hover:text-gray-600 cursor-pointer">SEO</span>
              <span>&gt;</span>
              <span className="text-gray-700 font-semibold">Keyword Magic Tool</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-medium text-blue-600 select-none">
              <span className="flex items-center gap-1 hover:underline cursor-pointer">
                <GraduationCap className="w-4 h-4 text-blue-500" /> Keyword Research course
              </span>
              <span className="flex items-center gap-1 hover:underline cursor-pointer">
                <BookOpen className="w-4 h-4 text-blue-500" /> User manual
              </span>
              <span className="flex items-center gap-1 hover:underline cursor-pointer">
                <MessageSquare className="w-4 h-4 text-blue-500" /> Send feedback
              </span>
            </div>
          </div>

          {/* Heading Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
            <h1 className="text-2xl font-bold font-sans text-gray-900 tracking-tight">
              Keyword Magic Tool: <span className="font-semibold text-gray-700">{searchedWord}</span>
            </h1>
            
            <button className="bg-white hover:bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-all focus:outline-none">
              View search history
            </button>
          </div>

          {/* Database and Currency selectors */}
          <div className="flex flex-wrap gap-4 items-center text-xs font-medium text-gray-700 select-none bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5">
              <span>Database:</span>
              <div className="relative">
                <select 
                  value={dbCountry} 
                  onChange={(e) => setDbCountry(e.target.value)}
                  className="bg-white border border-gray-250 py-1 pl-2 pr-7 rounded font-bold text-gray-800 outline-none cursor-pointer appearance-none text-xs"
                >
                  <option value="IN">🇮🇳 India</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="UK">🇬🇧 United Kingdom</option>
                  <option value="DE">🇩🇪 Germany</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-1.5 top-1.5 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Currency:</span>
              <div className="relative">
                <select 
                  value={currencyCode} 
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="bg-white border border-gray-250 py-1 pl-2 pr-7 rounded font-bold text-gray-800 outline-none cursor-pointer appearance-none text-xs"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-1.5 top-1.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search match type tabs & Languages dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-2">
            <div className="flex flex-wrap items-center gap-1.5 text-sm select-none">
              
              {/* All / Questions main Toggle */}
              <button 
                onClick={() => { setMatchType("All"); setQuestionsOnly(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  matchType === "All" && !questionsOnly
                    ? "bg-[#ff642d] text-white" 
                    : "bg-gray-150 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              
              <button 
                onClick={() => { setMatchType("Questions"); setQuestionsOnly(true); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  matchType === "Questions" || questionsOnly
                    ? "bg-[#ff642d] text-white" 
                    : "bg-gray-150 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Questions
              </button>

              <div className="h-4 w-px bg-gray-300 mx-1"></div>

              {/* Match modifier filters */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                {["All Keywords", "Broad Match", "Phrase Match", "Exact Match", "Related"].map((m) => {
                  const active = matchType === m;
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        setMatchType(m as any);
                        if (m === "Questions") setQuestionsOnly(true);
                        else if (m !== "All Keywords") setQuestionsOnly(false);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-semibold border-r border-gray-200 last:border-0 transition-all ${
                        active 
                          ? "bg-slate-50 border-blue-500 ring-2 ring-blue-500/10 text-blue-600 font-bold" 
                          : "text-gray-700 hover:bg-slate-50"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>

              {/* Languages selective chip */}
              <div className="relative">
                <button className="flex items-center gap-1 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none">
                  Languages <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>

            </div>
          </div>

          {/* Personalization promo block */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-purple-100 rounded-xl p-3 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-850">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Enter domain for personalized keyword rankings, search profiles & opportunities</span>
            </div>
            
            <div className="flex items-center gap-2">
              {showPersonalizedInput ? (
                <div className="flex gap-1.5">
                  <input 
                    type="text"
                    value={personalizedDomain}
                    onChange={(e) => setPersonalizedDomain(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setShowPersonalizedInput(false);
                      }
                    }}
                    placeholder="e.g. tracking.com"
                    className="bg-white border border-purple-200 outline-none rounded p-1 text-xs font-medium w-40"
                  />
                  <button 
                    onClick={() => setShowPersonalizedInput(false)}
                    className="bg-purple-600 text-white rounded px-2.5 py-1 text-[11px] font-bold"
                  >
                    Set
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowPersonalizedInput(true)}
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 rounded px-3 py-1 font-bold text-[11px] transition-all"
                >
                  {personalizedDomain ? `Filtered by ${personalizedDomain}` : "+ Enter domain"}
                </button>
              )}
            </div>
          </div>

          {/* Filter selectors toolbar */}
          <div className="flex flex-wrap items-center gap-2 bg-white rounded-lg select-none">
            
            {/* Volume range dropdown */}
            <div className="relative">
              <select 
                value={minVolumeRange}
                onChange={(e) => setMinVolumeRange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 hover:border-gray-500 px-3.5 pr-8 py-1.5 rounded text-xs font-semibold text-gray-700 outline-none cursor-pointer h-8"
              >
                <option value="all">Volume</option>
                <option value="high">High (&gt; 100k)</option>
                <option value="med">Medium (10k - 100k)</option>
                <option value="low">Low (&lt; 10k)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* KD % selector dropdown */}
            <div className="relative">
              <select 
                value={kdRangeFilter}
                onChange={(e) => setKdRangeFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 hover:border-gray-500 px-3.5 pr-8 py-1.5 rounded text-xs font-semibold text-gray-700 outline-none cursor-pointer h-8"
              >
                <option value="all">KD %</option>
                <option value="easy">Easy (🔑 &lt; 35%)</option>
                <option value="medium">Medium (⚡ 35% - 69%)</option>
                <option value="hard">Hard (🔥 &gt; 69%)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Intent Selector */}
            <div className="relative">
              <select 
                value={intentSelection}
                onChange={(e) => setIntentSelection(e.target.value)}
                className="appearance-none bg-white border border-gray-300 hover:border-gray-500 px-3.5 pr-8 py-1.5 rounded text-xs font-semibold text-gray-700 outline-none cursor-pointer h-8"
              >
                <option value="all">Intent</option>
                <option value="Informational">I - Informational</option>
                <option value="Commercial">C - Commercial</option>
                <option value="Transactional">T - Transactional</option>
                <option value="Navigational">N - Navigational</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* CPC selector */}
            <div className="relative">
              <select 
                value={cpcRangeFilter}
                onChange={(e) => setCpcRangeFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 hover:border-gray-500 px-3.5 pr-8 py-1.5 rounded text-xs font-semibold text-gray-700 outline-none cursor-pointer h-8"
              >
                <option value="all">CPC (USD)</option>
                <option value="free">No Cost ($0.00)</option>
                <option value="paid">Commercial (&gt; $0.00)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Inline Include text filter */}
            <div className="relative">
              <input 
                type="text" 
                value={includeText}
                onChange={(e) => setIncludeText(e.target.value)}
                placeholder="Include keywords"
                className="bg-white border border-gray-300 hover:border-gray-500 px-3 py-1.5 rounded text-xs font-semibold text-gray-700 placeholder-gray-400 outline-none w-36 h-8 focus:border-blue-500 focus:bg-slate-50/50"
              />
            </div>

            {/* Inline Exclude text filter */}
            <div className="relative">
              <input 
                type="text" 
                value={excludeText}
                onChange={(e) => setExcludeText(e.target.value)}
                placeholder="Exclude keywords"
                className="bg-white border border-gray-300 hover:border-gray-500 px-3 py-1.5 rounded text-xs font-semibold text-gray-700 placeholder-gray-400 outline-none w-36 h-8 focus:border-blue-500 focus:bg-slate-50/50"
              />
            </div>

            {/* Advanced Filters dropdown dummy trigger */}
            <div className="relative">
              <button 
                onClick={() => {
                  // toggle reset
                  setMinVolumeRange("all");
                  setKdRangeFilter("all");
                  setIntentSelection("all");
                  setCpcRangeFilter("all");
                  setIncludeText("");
                  setExcludeText("");
                  setSelectedWordGroup(null);
                }}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded px-3.5 py-1.5 text-xs font-semibold h-8"
              >
                Reset filters
              </button>
            </div>

          </div>

          {/* MAIN SPLIT GRID LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-4 items-start select-none">
            
            {/* LEFT SIDEBAR SECTION */}
            <div className="w-full lg:w-52 flex-shrink-0 bg-white border border-gray-250 p-2.5 rounded-xl text-left bg-slate-50/10">
              
              {/* Segment Toggles: By Number vs By Volume */}
              <div className="bg-slate-100 p-0.5 rounded-lg flex text-center my-1 select-none">
                <button 
                  onClick={() => setSidebarUnit("number")}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${
                    sidebarUnit === "number" ? "bg-white text-gray-950 shadow-sm" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  By number
                </button>
                <button 
                  onClick={() => setSidebarUnit("volume")}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${
                    sidebarUnit === "volume" ? "bg-white text-gray-950 shadow-sm" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  By volume
                </button>
              </div>

              {/* Semantic items header */}
              <div className="py-2.5 px-1 font-bold text-xs text-gray-500 uppercase tracking-wider flex justify-between items-center text-left border-b border-gray-100 mb-1">
                <span>All keywords</span>
                <span className="font-mono text-gray-800 text-[11px]">{magicTotalCount.toLocaleString()}</span>
              </div>

              {/* Semantic group button list */}
              <div className="space-y-0.5 max-h-[380px] overflow-y-auto pr-1">
                <button 
                  onClick={() => setSelectedWordGroup(null)}
                  className={`w-full flex justify-between items-center px-2 py-1.5 rounded text-xs font-semibold transition-all text-left ${
                    selectedWordGroup === null ? "bg-orange-50 text-[#ff642d]" : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  <span>All keywords</span>
                  <span className="font-mono text-gray-400 text-[10px]">{magicTotalCount.toLocaleString()}</span>
                </button>

                {sidebarGroups.map((group, idx) => {
                  const active = selectedWordGroup === group.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedWordGroup(active ? null : group.name)}
                      className={`w-full flex justify-between items-center px-1.5 py-1.5 rounded text-xs transition-all text-left group ${
                        active 
                          ? "bg-slate-100 text-blue-600 font-bold" 
                          : "text-gray-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1 overflow-hidden">
                        <ChevronRight className={`w-3 h-3 flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-transform ${active ? "rotate-90 text-blue-500" : ""}`} />
                        <span className="truncate">{group.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="font-mono text-gray-400 text-[10px]">{group.count.toLocaleString()}</span>
                        <Eye className="w-3.5 h-3.5 text-gray-300 opacity-60 hover:opacity-100 hover:text-gray-500 transition-all pointer-events-auto" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setSelectedWordGroup(null)}
                className="w-full text-center py-2 border-t border-gray-100 mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                Show more
              </button>

            </div>

            {/* RIGHT MAIN TABLE CONTAINER */}
            <div className="flex-1 w-full bg-white border border-gray-250 rounded-xl overflow-hidden shadow-sm">
              
              {/* Indices and Right Table actions row */}
              <div className="p-3 bg-slate-50/55 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 select-none">
                
                {/* Metric Summary */}
                <div className="text-xs font-medium text-gray-600">
                  All keywords: <span className="font-bold text-gray-800">{magicTotalCount.toLocaleString()}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  Total Volume: <span className="font-bold text-gray-800">{magicTotalVolume.toLocaleString()}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  Average KD: <span className="font-bold text-gray-800">{magicAvgKd}%</span>
                </div>

                {/* Right hand buttons */}
                <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                  
                  {/* Send keywords pill action button */}
                  <button className="flex items-center gap-1 bg-black hover:bg-gray-900 border border-black rounded px-3 py-1.5 text-xs font-bold text-white shadow relative">
                    <Share2 className="w-3.5 h-3.5 rotate-90" />
                    Send keywords
                    <span className="w-2 h-2 rounded-full bg-orange-500 absolute -top-0.5 -right-0.5 border border-white"></span>
                  </button>

                  {/* Refresh button */}
                  <button 
                    onClick={executeSearch}
                    className="flex justify-center items-center gap-1 bg-white hover:bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                    Update
                  </button>

                  {/* Setting button */}
                  <button className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-1.5 text-xs text-gray-600 shadow-sm">
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Export button */}
                  <button className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-1.5 text-xs text-gray-400 hover:text-gray-600 shadow-sm">
                    <SlidersHorizontal className="w-4 h-4 rotate-90" />
                  </button>

                </div>

              </div>

              {/* TABLE AREA */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200 font-semibold text-gray-550 select-none">
                      
                      {/* Checkbox column */}
                      <th className="py-2.5 px-3 w-8">
                        <input 
                          type="checkbox"
                          checked={magicPaginatedData.length > 0 && magicPaginatedData.every(item => selectedKws.includes(item.keyword))}
                          onChange={() => {
                            const screenKeys = magicPaginatedData.map(i => i.keyword);
                            const allOnScreenSelected = screenKeys.every(k => selectedKws.includes(k));
                            if (allOnScreenSelected) {
                              setSelectedKws(prev => prev.filter(k => !screenKeys.includes(k)));
                            } else {
                              setSelectedKws(prev => Array.from(new Set([...prev, ...screenKeys])));
                            }
                          }}
                          className="rounded text-orange-500 accent-orange-500 cursor-pointer w-3.5 h-3.5"
                        />
                      </th>

                      {/* Header Sorting buttons */}
                      <th className="py-2.5 px-3 select-none text-left w-6"></th>

                      <th className="py-2.5 px-3 font-semibold hover:text-gray-900 cursor-pointer text-left select-none">
                        <button 
                          onClick={() => {
                            if (magicSortField === "keyword") {
                              setMagicSortDirection(magicSortDirection === "asc" ? "desc" : "asc");
                            } else {
                              setMagicSortField("keyword");
                              setMagicSortDirection("asc");
                            }
                          }}
                          className="flex items-center gap-1 text-left uppercase text-[10px] font-bold text-gray-400"
                        >
                          Keyword {magicSortField === "keyword" && (magicSortDirection === "asc" ? "▲" : "▼")}
                        </button>
                      </th>

                      <th className="py-2.5 px-2 font-semibold hover:text-gray-900 cursor-pointer text-center select-none bg-slate-100/50 w-16">
                        <span className="uppercase text-[10px] font-bold text-gray-400">Intent</span>
                      </th>

                      <th className="py-2.5 px-3 font-semibold hover:text-gray-900 cursor-pointer text-right select-none bg-slate-150/50 w-28">
                        <button 
                          onClick={() => {
                            if (magicSortField === "volume") {
                              setMagicSortDirection(magicSortDirection === "asc" ? "desc" : "asc");
                            } else {
                              setMagicSortField("volume");
                              setMagicSortDirection("desc");
                            }
                          }}
                          className="flex items-center justify-end gap-1 text-right ml-auto uppercase text-[10px] font-bold text-gray-400"
                        >
                          Volume {magicSortField === "volume" && (magicSortDirection === "asc" ? "▲" : "▼")}
                        </button>
                      </th>

                      <th className="py-2.5 px-3 font-semibold hover:text-gray-900 cursor-pointer text-left select-none w-20">
                        <button 
                          onClick={() => {
                            if (magicSortField === "kd") {
                              setMagicSortDirection(magicSortDirection === "asc" ? "desc" : "asc");
                            } else {
                              setMagicSortField("kd");
                              setMagicSortDirection("desc");
                            }
                          }}
                          className="flex items-center gap-1 text-left uppercase text-[10px] font-bold text-gray-400"
                        >
                          KD % {magicSortField === "kd" && (magicSortDirection === "asc" ? "▲" : "▼")}
                        </button>
                      </th>

                      <th className="py-2.5 px-3 font-semibold hover:text-gray-900 cursor-pointer text-right select-none w-24">
                        <button 
                          onClick={() => {
                            if (magicSortField === "cpc") {
                              setMagicSortDirection(magicSortDirection === "asc" ? "desc" : "asc");
                            } else {
                              setMagicSortField("cpc");
                              setMagicSortDirection("desc");
                            }
                          }}
                          className="flex items-center justify-end gap-1 text-right ml-auto uppercase text-[10px] font-bold text-gray-400"
                        >
                          CPC (USD) {magicSortField === "cpc" && (magicSortDirection === "asc" ? "▲" : "▼")}
                        </button>
                      </th>

                      <th className="py-2.5 px-3 font-semibold text-center select-none w-16">
                        <span className="uppercase text-[10px] font-bold text-gray-400">SF</span>
                      </th>

                      <th className="py-2.5 px-3 font-semibold text-right select-none w-28">
                        <span className="uppercase text-[10px] font-bold text-gray-400">Updated</span>
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 font-medium">
                    {magicPaginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10 text-center text-gray-400 font-medium">
                          No keyword matches found. Reset filters above or type another search phrase!
                        </td>
                      </tr>
                    ) : (
                      magicPaginatedData.map((item) => {
                        const isSelected = selectedKws.includes(item.keyword);
                        
                        // Custom multi-intents solver to mirror Semrush screenshot exactly
                        const renderIntentBadges = (term: string) => {
                          const lowerTerm = term.toLowerCase();
                          if (lowerTerm === "free fire" || lowerTerm === "free fire nickname" || lowerTerm === "free fire india") {
                            // Show informational I and transactional T next to each other
                            return (
                              <div className="flex gap-1 justify-center">
                                <span className="w-5 h-5 bg-[#e1f5fe] text-blue-700 font-semibold rounded flex items-center justify-center text-[10px] border border-blue-100" title="Informational">I</span>
                                <span className="w-5 h-5 bg-[#e0f2f1] text-[#00695c] font-semibold rounded flex items-center justify-center text-[10px] border border-teal-100" title="Transactional">T</span>
                              </div>
                            );
                          }
                          if (lowerTerm.includes("max") || lowerTerm.includes("codes")) {
                            return (
                              <div className="flex gap-1 justify-center">
                                <span className="w-5 h-5 bg-[#f3e5f5] text-purple-700 font-semibold rounded flex items-center justify-center text-[10px] border border-purple-100" title="Navigational">N</span>
                              </div>
                            );
                          }
                          if (item.intent === "Navigational") {
                            return (
                              <div className="flex gap-1 justify-center">
                                <span className="w-5 h-5 bg-[#f3e5f5] text-purple-700 font-semibold rounded flex items-center justify-center text-[10px] border border-purple-100" title="Navigational">N</span>
                              </div>
                            );
                          }
                          if (item.intent === "Transactional") {
                            return (
                              <div className="flex gap-1 justify-center">
                                <span className="w-5 h-5 bg-[#e0f2f1] text-[#00695c] font-semibold rounded flex items-center justify-center text-[10px] border border-teal-100" title="Transactional">T</span>
                              </div>
                            );
                          }
                          // Defaults informational (Blue I)
                          return (
                            <div className="flex gap-1 justify-center">
                              <span className="w-5 h-5 bg-[#e1f5fe] text-blue-700 font-semibold rounded flex items-center justify-center text-[10px] border border-blue-100" title="Informational">I</span>
                            </div>
                          );
                        };

                        // KD Difficulty dot solver
                        const getKdDot = (kdVal: number) => {
                          if (kdVal > 70) return "bg-red-500";
                          if (kdVal > 40) return "bg-amber-500";
                          return "bg-green-500";
                        };

                        return (
                          <tr 
                            key={item.id}
                            className={`hover:bg-slate-50/70 border-b border-gray-100 transition-colors ${
                              isSelected ? "bg-orange-50/15" : ""
                            }`}
                          >
                            {/* Checkbox column */}
                            <td className="py-2 px-3">
                              <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedKws(prev => prev.filter(k => k !== item.keyword));
                                  } else {
                                    setSelectedKws(prev => [...prev, item.keyword]);
                                  }
                                }}
                                className="rounded text-orange-500 accent-orange-500 cursor-pointer w-3.5 h-3.5"
                              />
                            </td>

                            {/* Action element */}
                            <td className="py-2 px-1 text-center font-bold">
                              <button 
                                onClick={() => {
                                  setSelectedKws(p => Array.from(new Set([...p, item.keyword])));
                                }}
                                className="text-gray-400 hover:text-blue-500 hover:scale-110 transition-all font-bold text-sm h-5 w-5 rounded flex items-center justify-center focus:outline-none"
                              >
                                ⊕
                              </button>
                            </td>

                            {/* Keyword name with small document icon */}
                            <td className="py-2.5 px-3 font-semibold text-gray-900">
                              <div className="flex items-center gap-1.5">
                                <span className="hover:text-blue-600 cursor-pointer font-sans text-xs">
                                  {item.keyword}
                                </span>
                                <FileText className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" title="Landing page available" />
                              </div>
                            </td>

                            {/* Custom double Intent badges column matching Semrush */}
                            <td className="py-2 px-2 text-center bg-slate-50/30">
                              {renderIntentBadges(item.keyword)}
                            </td>

                            {/* Vol column */}
                            <td className="py-2 px-3 text-right font-mono text-gray-800 font-medium">
                              {item.volume.toLocaleString()}
                            </td>

                            {/* KD % column */}
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-gray-800 font-bold">{item.kd}</span>
                                <span className={`w-2.5 h-2.5 rounded-full ${getKdDot(item.kd)}`} />
                              </div>
                            </td>

                            {/* CPC column */}
                            <td className="py-2 px-3 text-right font-mono text-gray-800 font-medium">
                              {item.cpc.toFixed(2)}
                            </td>

                            {/* SERP Features count */}
                            <td className="py-2 px-3 text-center">
                              <div className="flex items-center gap-1 justify-center text-gray-400 font-medium">
                                <span className="cursor-help font-mono border-b border-dotted border-gray-400 text-gray-600 text-[11px] pb-0.5">
                                  {item.serpFeatures.length || 2}
                                </span>
                              </div>
                            </td>

                            {/* Updated timeframe column */}
                            <td className="py-2 px-3 text-right text-gray-400">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-[11px]">{item.updatedDate || "1 month"}</span>
                                <RefreshCw className="w-3 h-3 text-gray-350 cursor-pointer hover:text-slate-600 hover:rotate-18 rotated transition-all" />
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION AREA */}
              {magicTotalPages > 1 && (
                <div className="p-3.5 bg-slate-50 border-t border-gray-200 flex items-center justify-between select-none">
                  
                  <span className="text-xs font-semibold text-gray-500">
                    Page <span className="text-gray-800">{magicPage}</span> of <span className="text-gray-800">{magicTotalPages}</span>
                  </span>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => setMagicPage(prev => Math.max(1, prev - 1))}
                      disabled={magicPage === 1}
                      className="bg-white hover:bg-slate-50 border border-gray-300 rounded px-3 py-1.5 text-[11px] font-bold text-gray-700 disabled:opacity-40 select-none cursor-pointer transition-all focus:outline-none"
                    >
                      &lt; Previous
                    </button>
                    <button 
                      onClick={() => setMagicPage(prev => Math.min(magicTotalPages, prev + 1))}
                      disabled={magicPage === magicTotalPages}
                      className="bg-white hover:bg-slate-50 border border-gray-300 rounded px-3 py-1.5 text-[11px] font-bold text-gray-700 disabled:opacity-40 select-none cursor-pointer transition-all focus:outline-none"
                    >
                      Next &gt;
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* KEYWORD GAP TAB PANEL */}
      {activeTab === "keyword-gap" && (
        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-[#ff642d] flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Find Hidden Organic Keyword Gaps</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Compare and query overlapping search vectors against up to 5 properties at once. Find the lucrative terms that your primary competitors rank for, but you are completely missing!
          </p>
          <div className="pt-2">
            <button 
              onClick={() => {
                // Navigate over to domain overview comparators
                const input = document.getElementById("search-ref-comp");
                if (input) input.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#111827] text-white hover:bg-gray-800 text-xs font-bold py-2.5 px-5 rounded-lg transition-all"
            >
              Open Competitor Research Comparison
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
