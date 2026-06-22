/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { generateSiteAuditMetrics } from "../mockData";
import { SiteAuditMetrics } from "../types";
import { 
  Activity, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RefreshCw, 
  Globe
} from "lucide-react";

interface SiteAuditProps {
  initialDomain?: string;
}

export default function SiteAuditView({ initialDomain = "SEOtool.com" }: SiteAuditProps) {
  const [domain, setDomain] = useState(initialDomain);
  const [data, setData] = useState<SiteAuditMetrics | null>(null);
  const [crawlingState, setCrawlingState] = useState<"idle" | "crawling" | "done">("done");
  const [filterCategory, setFilterCategory] = useState<"All" | "Error" | "Warning" | "Notice">("All");

  const runAuditCrawl = () => {
    setCrawlingState("crawling");
    setTimeout(() => {
      const result = generateSiteAuditMetrics(domain);
      setData(result);
      setCrawlingState("done");
    }, 1500); // simulate interactive crawler
  };

  useEffect(() => {
    runAuditCrawl();
  }, [initialDomain]);

  if (!data) return null;

  // Filter issues based on clicked category
  const filteredChecks = data.checks.filter(check => {
    if (filterCategory === "All") return true;
    return check.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-600" /> Dynamic Website Technical Audit
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Simulate a technical crawler scan to detect broken link statuses, duplicate metas, speed constraints, or index failures
        </p>
      </div>

      {/* Audit Search bar */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-left">
        <div className="max-w-2xl flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  runAuditCrawl();
                }
              }}
              disabled={crawlingState === "crawling"}
              placeholder="e.g. shopdomain.com..."
              className="w-full bg-white border border-gray-205 py-2.5 pl-10 pr-4 text-sm font-semibold text-gray-805 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
            />
            <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>
          <button 
            onClick={runAuditCrawl}
            disabled={crawlingState === "crawling"}
            className="bg-[#111827] hover:bg-gray-800 disabled:opacity-55 text-sm text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2"
          >
            {crawlingState === "crawling" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-purple-500" /> Spider Crawling...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-pink-500" /> Launch Site Crawler
              </>
            )}
          </button>
        </div>
      </div>

      {/* CRAWLER SPINDLE OR ACTIVE RESULTS CARD */}
      {crawlingState === "crawling" ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm space-y-4">
          <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-gray-800">Crawl Audit in Operations Progress...</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Please hold. SuiteRank spider bots are crawling sitemaps, checking structural canonical mappings and measuring responsive Core Web Vitals on: <span className="font-bold text-gray-700">{domain}</span>
          </p>
          <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-slate-800 rounded-full animate-[loading_1.5s_infinite]"></div>
          </div>
        </div>
      ) : (
        <>
          {/* HEALTH SUMMARY SECTOR */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Health score gauge card */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm text-left flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Technical Health Score</span>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-extrabold font-mono text-gray-900">{data.healthScore}%</span>
                    <span className="block text-xs text-emerald-600 font-bold mt-1">Passed Core Audits</span>
                  </div>
                  
                  {/* Circle health index */}
                  <div className="w-16 h-16 rounded-full border-4 border-gray-50 flex items-center justify-center relative">
                    <div 
                      className={`absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-l-emerald-500`}
                      style={{ transform: `rotate(${Math.min(360, (data.healthScore * 3.6))}deg)` }}
                    ></div>
                    <span className="text-[10px] font-bold text-gray-400">HEALTH</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-4 border-t pt-4 border-gray-50 leading-relaxed">
                Indexed score based on critical crawl achievements out of sitemaps.
              </p>
            </div>

            {/* Diagnostic Categories split cards */}
            <div 
              onClick={() => setFilterCategory("Error")}
              className={`bg-white border-b-4 border-rose-505 rounded-xl p-6 shadow-sm text-left lg:col-span-1 cursor-pointer transition-all hover:scale-[1.01] ${filterCategory === "Error" ? "ring-2 ring-rose-500" : ""}`}
            >
              <div className="flex justify-between items-center text-gray-450 text-xs font-bold uppercase tracking-wider">
                <span>Critical Errors</span>
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-3xl font-extrabold font-mono text-rose-600 block mt-4">{data.errorsCount}</span>
              <p className="text-[10px] text-gray-400 mt-2">Urgent checklist item issues requiring priority rebuilds</p>
            </div>

            <div 
              onClick={() => setFilterCategory("Warning")}
              className={`bg-white border-b-4 border-amber-505 rounded-xl p-6 shadow-sm text-left lg:col-span-1 cursor-pointer transition-all hover:scale-[1.01] ${filterCategory === "Warning" ? "ring-2 ring-amber-500" : ""}`}
            >
              <div className="flex justify-between items-center text-gray-450 text-xs font-bold uppercase tracking-wider">
                <span>Warnings</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-3xl font-extrabold font-mono text-amber-600 block mt-4">{data.warningsCount}</span>
              <p className="text-[10px] text-gray-400 mt-2">Potential issues which diminish core authority weighting</p>
            </div>

            <div 
              onClick={() => setFilterCategory("Notice")}
              className={`bg-white border-b-4 border-blue-505 rounded-xl p-6 shadow-sm text-left lg:col-span-1 cursor-pointer transition-all hover:scale-[1.01] ${filterCategory === "Notice" ? "ring-2 ring-blue-500" : ""}`}
            >
              <div className="flex justify-between items-center text-gray-450 text-xs font-bold uppercase tracking-wider">
                <span>Discovery Notices</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-3xl font-extrabold font-mono text-blue-600 block mt-4">{data.noticesCount}</span>
              <p className="text-[10px] text-gray-400 mt-2">Recommended elements or settings checks</p>
            </div>

          </div>

          {/* DIAGNOSTIC DETAILED CHECKS TABLE */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-left overflow-hidden">
            
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Detailed Audit Checks ({filteredChecks.length} entries)</span>
              
              {filterCategory !== "All" && (
                <button 
                  onClick={() => setFilterCategory("All")}
                  className="text-xs text-purple-600 hover:underline font-bold"
                >
                  Show All Issues ({data.checks.length})
                </button>
              )}
            </div>

            <div className="divide-y divide-gray-100">
              {filteredChecks.map((check, idx) => {
                const passed = check.status === "passed";
                return (
                  <div key={idx} className="p-4 flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    
                    <div className="flex gap-3 items-start">
                      <div className="p-1 rounded bg-slate-50 mt-1">
                        {passed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : check.category === "Error" ? (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-gray-900 block">{check.name}</span>
                        <span className="text-gray-400 block mt-0.5">{check.description}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {passed ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Pass</span>
                      ) : (
                        <div className="text-xs">
                          <span className={`font-mono font-bold block ${
                            check.category === "Error" ? "text-rose-600" : "text-amber-600"
                          }`}>{check.count} items failed</span>
                          <span className="text-[10px] text-gray-400 font-semibold">{check.category} tag</span>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </>
      )}

    </div>
  );
}
