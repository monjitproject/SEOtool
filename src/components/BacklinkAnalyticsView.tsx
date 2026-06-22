/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { generateBacklinks } from "../mockData";
import { BacklinkRecord } from "../types";
import { 
  Link2, 
  Download, 
  Filter, 
  ExternalLink, 
  Clock, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe
} from "lucide-react";

interface BacklinksProps {
  initialDomain?: string;
}

export default function BacklinkAnalyticsView({ initialDomain = "SEOtool.com" }: BacklinksProps) {
  const [domain, setDomain] = useState(initialDomain);
  const [searchedDomain, setSearchedDomain] = useState(initialDomain);
  const [backlinksList, setBacklinksList] = useState<BacklinkRecord[]>([]);

  // Filtering toggles
  const [followFilter, setFollowFilter] = useState<"all" | "dofollow" | "nofollow">("all");
  const [newsFilter, setNewsFilter] = useState<"all" | "new" | "lost">("all");

  const executeBacklinksSearch = () => {
    const data = generateBacklinks(domain);
    setBacklinksList(data);
    setSearchedDomain(domain);
  };

  useEffect(() => {
    executeBacklinksSearch();
  }, [initialDomain]);

  // Compute stats of backlinks
  const aggregateStats = React.useMemo(() => {
    const totalCount = backlinksList.length ? backlinksList.length * 1540 : 0;
    const refDomains = backlinksList.length ? Math.floor(totalCount / 5.2) : 0;
    const refIps = Math.floor(refDomains * 0.85);
    const avgAuthority = backlinksList.length 
      ? Math.floor(backlinksList.reduce((acc, cur) => acc + cur.authority, 0) / backlinksList.length) 
      : 0;

    return { totalCount, refDomains, refIps, avgAuthority };
  }, [backlinksList]);

  // Sorted/Filtered backlinks segment
  const processedBacklinks = React.useMemo(() => {
    return backlinksList.filter(item => {
      // Follow / nofollow
      if (followFilter === "dofollow" && item.isNofollow) return false;
      if (followFilter === "nofollow" && !item.isNofollow) return false;

      // New / Lost
      if (newsFilter === "new" && !item.isNew) return false;
      if (newsFilter === "lost" && !item.isLost) return false;

      return true;
    });
  }, [backlinksList, followFilter, newsFilter]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = "Source URL,Anchor Text,Target URL,Link Type,Authority,Follow/Nofollow,Status\n";
    const rows = processedBacklinks.map(item => 
      `"${item.sourceUrl}","${item.anchorText}","${item.targetUrl}",${item.linkType},${item.authority},${item.isNofollow ? "Nofollow" : "Dofollow"},${item.isLost ? "Lost" : item.isNew ? "New" : "Stable"}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SuiteRank_Backlinks_${searchedDomain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Link2 className="w-6 h-6 text-[#ff642d]" /> Backlink Audit & Analytics
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Monitor your domain referral profiles, evaluate anchor text densities, and trace follow link values
        </p>
      </div>

      {/* Input bar */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-left">
        <div className="max-w-xl flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") executeBacklinksSearch(); }}
              placeholder="e.g. SEOtool.com, semrush.com..."
              className="w-full bg-white border border-gray-205 py-2.5 pl-10 pr-4 text-sm font-semibold text-gray-805 rounded-lg outline-none focus:border-[#ff642d]"
            />
            <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>
          <button 
            onClick={executeBacklinksSearch}
            className="bg-[#ff642d] hover:bg-[#e05320] text-sm text-white font-semibold py-2.5 px-6 rounded-lg transition-all cursor-pointer"
          >
            Audit Backlinks
          </button>
        </div>
      </div>

      {/* CORE STATS SUMMARY PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Backlinks */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm text-left">
          <span className="text-[10px] font-bold text-gray-450 uppercase block tracking-wider">Total Backlinks</span>
          <span className="text-3xl font-extrabold font-mono text-gray-900 block mt-1">
            {aggregateStats.totalCount.toLocaleString()}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Sum aggregate link placements</p>
        </div>

        {/* Referring Domains */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm text-left">
          <span className="text-[10px] font-bold text-gray-450 uppercase block tracking-wider">Referring Domains</span>
          <span className="text-3xl font-extrabold font-mono text-gray-900 block mt-1">
            {aggregateStats.refDomains.toLocaleString()}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Unique root properties</p>
        </div>

        {/* IPs */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm text-left">
          <span className="text-[10px] font-bold text-gray-450 uppercase block tracking-wider">Unique C-Class IPs</span>
          <span className="text-3xl font-extrabold font-mono text-gray-900 block mt-1">
            {aggregateStats.refIps.toLocaleString()}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Network segment diversity score</p>
        </div>

        {/* Authority score average */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm text-left">
          <span className="text-[10px] font-bold text-gray-450 uppercase block tracking-wider">Media Authority Score</span>
          <span className="text-3xl font-extrabold font-mono text-[#ff642d] block mt-1">
            {aggregateStats.avgAuthority} / 100
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Average PageRank tier</p>
        </div>

      </div>

      {/* REFINE CONTROLLERS & TABLE ROWS */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-left overflow-hidden">
        
        {/* Filtering header action bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
            
            <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-lg">
              <span className="text-gray-400 px-1 text-[10px] uppercase font-bold">Anchor Trust:</span>
              <button 
                onClick={() => setFollowFilter("all")} 
                className={`py-1 px-2 rounded font-bold ${followFilter === "all" ? "bg-[#ff642d] text-white" : "hover:bg-slate-55 text-gray-500"}`}
              >
                All Links
              </button>
              <button 
                onClick={() => setFollowFilter("dofollow")} 
                className={`py-1 px-2 rounded font-bold ${followFilter === "dofollow" ? "bg-[#ff642d] text-white" : "hover:bg-slate-55 text-gray-500"}`}
              >
                Dofollow
              </button>
              <button 
                onClick={() => setFollowFilter("nofollow")} 
                className={`py-1 px-2 rounded font-bold ${followFilter === "nofollow" ? "bg-[#ff642d] text-white" : "hover:bg-slate-55 text-gray-500"}`}
              >
                Nofollow
              </button>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-lg">
              <span className="text-gray-400 px-1 text-[10px] uppercase font-bold">Link Age:</span>
              <button 
                onClick={() => setNewsFilter("all")} 
                className={`py-1 px-2 rounded font-bold ${newsFilter === "all" ? "bg-[#ff642d] text-white" : "hover:bg-slate-55 text-gray-500"}`}
              >
                All States
              </button>
              <button 
                onClick={() => setNewsFilter("new")} 
                className={`py-1 px-2 rounded font-bold ${newsFilter === "new" ? "bg-[#ff642d] text-white" : "hover:bg-slate-55 text-gray-500"}`}
              >
                🔴 New Links
              </button>
              <button 
                onClick={() => setNewsFilter("lost")} 
                className={`py-1 px-2 rounded font-bold ${newsFilter === "lost" ? "bg-[#ff642d] text-white" : "hover:bg-slate-55 text-gray-500"}`}
              >
                📉 Lost Links
              </button>
            </div>

          </div>

          <button 
            onClick={handleExportCSV}
            className="w-full md:w-auto bg-white hover:bg-slate-50 border border-gray-250 text-xs font-bold text-gray-700 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export backlink CSV
          </button>

        </div>

        {/* RESULTS ROWS */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase border-b border-gray-150">
                <th className="py-3 px-4 text-left font-semibold">Source Page (Referrer Website)</th>
                <th className="py-3 px-4 text-left font-semibold">Anchor Text</th>
                <th className="py-3 px-4 text-left font-semibold">Target URL</th>
                <th className="py-3 px-4 text-center font-semibold">Crawl Type</th>
                <th className="py-3 px-4 text-center font-semibold">PageTrust</th>
                <th className="py-3 px-4 text-center font-semibold">Attribute</th>
                <th className="py-3 px-4 text-right font-semibold">Date Found</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {processedBacklinks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    No backlink records found matching current selection parameters. Audit broader domains!
                  </td>
                </tr>
              ) : (
                processedBacklinks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    
                    {/* Source page URL */}
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      <div className="max-w-[2400px] truncate">
                        <span className="hover:text-[#ff642d] cursor-pointer text-xs flex items-center gap-1">
                          {item.sourceUrl.replace("https://www.", "")} <ExternalLink className="w-3 h-3 flex-shrink-0 text-gray-300" />
                        </span>
                      </div>
                      <div className="flex gap-1.5 mt-1">
                        {item.isNew && <span className="bg-rose-50 text-rose-700 border border-rose-100 font-bold text-[9px] px-1 rounded">NEW</span>}
                        {item.isLost && <span className="bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[9px] px-1 rounded">LOST</span>}
                      </div>
                    </td>

                    {/* Anchor text description */}
                    <td className="py-3.5 px-4 text-xs font-semibold text-gray-700 italic">
                      "{item.anchorText}"
                    </td>

                    {/* Target landing profile */}
                    <td className="py-3.5 px-4 font-mono text-[10px] text-gray-500">
                      <span className="block truncate max-w-sm">{item.targetUrl}</span>
                    </td>

                    {/* Link type anchor */}
                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-gray-400">
                      {item.linkType}
                    </td>

                    {/* Authority score of source page */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono text-xs font-bold py-0.5 px-1.5 rounded-md ${
                        item.authority > 85 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-700"
                      }`}>{item.authority}</span>
                    </td>

                    {/* Nofollow or Dofollow flag */}
                    <td className="py-3.5 px-4 text-center text-xs">
                      <span className={`font-semibold ${item.isNofollow ? "text-gray-400" : "text-emerald-600 font-bold"}`}>
                        {item.isNofollow ? "Nofollow" : "Dofollow"}
                      </span>
                    </td>

                    {/* Date detected */}
                    <td className="py-3.5 px-4 text-right text-xs font-medium text-gray-400">
                      <Clock className="w-3.5 h-3.5 inline-block align-middle mr-1" /> {item.firstSeen}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
