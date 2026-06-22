/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
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
  Filter
} from "lucide-react";

interface KeywordResearchViewProps {
  initialKeyword?: string;
}

export default function KeywordResearchView({ initialKeyword = "saas analytics" }: KeywordResearchViewProps) {
  // Primary keyword state
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [searchedWord, setSearchedWord] = useState(initialKeyword);
  const [country, setCountry] = useState("US");
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"overview" | "magic-tool" | "keyword-gap">("overview");

  // Keyword dataset state
  const [keywordList, setKeywordList] = useState<KeywordRecord[]>([]);

  // Filter configurations
  const [kdFilter, setKdFilter] = useState("all"); // all | easy | medium | hard
  const [intentFilter, setIntentFilter] = useState("all"); // all | Info | Comm | Trans
  const [questionsOnly, setQuestionsOnly] = useState(false);
  const [minVolume, setMinVolume] = useState<number>(0);

  // Cluster sidebar selection
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

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
        <div className="space-y-6">
          
          {/* Advanced filters card */}
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm text-left">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
              <Filter className="w-4 h-4 text-[#ff642d]" /> Advanced Database Refinement Filters
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* KD Sorter filter */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Difficulty (KD)</label>
                <select 
                  value={kdFilter}
                  onChange={(e) => setKdFilter(e.target.value)}
                  className="w-full bg-white border border-gray-250 py-2 px-3 rounded-lg text-xs font-semibold text-gray-700 outline-none"
                >
                  <option value="all">⚡ All Difficulties (0-100%)</option>
                  <option value="easy">🟢 Easy (Under 35%)</option>
                  <option value="medium">🔵 Medium (35% to 55%)</option>
                  <option value="hard">🔴 Hard (Above 55%)</option>
                </select>
              </div>

              {/* Intent tags filter */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Search Intent Type</label>
                <select 
                  value={intentFilter}
                  onChange={(e) => setIntentFilter(e.target.value)}
                  className="w-full bg-white border border-gray-250 py-2 px-3 rounded-lg text-xs font-semibold text-gray-700 outline-none"
                >
                  <option value="all">💡 All Intent Targets</option>
                  <option value="Informational">I - Informational</option>
                  <option value="Commercial">C - Commercial</option>
                  <option value="Transactional">T - Transactional</option>
                  <option value="Navigational">N - Navigational</option>
                </select>
              </div>

              {/* Volume scale filter */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Min Search Volume</label>
                <select 
                  value={minVolume}
                  onChange={(e) => setMinVolume(Number(e.target.value))}
                  className="w-full bg-white border border-gray-250 py-2 px-3 rounded-lg text-xs font-semibold text-gray-700 outline-none"
                >
                  <option value="0">📈 Any Volume</option>
                  <option value="1000">1,000+ searches / mo</option>
                  <option value="2000">2,000+ searches / mo</option>
                  <option value="4000">4,000+ searches / mo</option>
                </select>
              </div>

              {/* Questions toggle */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input 
                    type="checkbox" 
                    checked={questionsOnly}
                    onChange={(e) => setQuestionsOnly(e.target.checked)}
                    className="w-4 h-4 text-[#ff642d] accent-[#ff642d]" 
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-700 block">Questions Only</span>
                    <span className="text-[10px] text-gray-400 block">Matches who, why, how, what</span>
                  </div>
                </label>
              </div>

            </div>

            {/* active cluster warning filter tag */}
            {selectedCluster && (
              <div className="mt-4 p-2 bg-orange-50 border border-orange-100 rounded-lg flex justify-between items-center text-xs text-orange-850">
                <span className="font-semibold">Filtered by Semantic Cluster: "{selectedCluster}"</span>
                <button 
                  onClick={() => setSelectedCluster(null)}
                  className="text-orange-950 font-bold underline"
                >
                  Clear cluster selection to reveal full lists
                </button>
              </div>
            )}
          </div>

          {/* Table display */}
          <KeywordTableView data={finalList} />

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
