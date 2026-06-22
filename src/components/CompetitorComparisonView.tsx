/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { toast } from "../lib/toast";
import { Plus, Trash2, Globe, Sliders, Layers, BarChart, ArrowUpRight } from "lucide-react";

interface CompetitorComparisonProps {
  defaultDomain?: string;
}

export default function CompetitorComparisonView({ defaultDomain = "SEOtool.com" }: CompetitorComparisonProps) {
  // Array of tracked domains (starts with standard shoes-market layout)
  const [domains, setDomains] = useState<string[]>([
    defaultDomain, 
    "semrush.com", 
    "ahrefs.com", 
    "moz.com"
  ]);
  const [newDomainInput, setNewDomainInput] = useState("");

  const handleAddDomain = () => {
    const clean = newDomainInput.trim().toLowerCase().replace(/https?:\/\//, "");
    if (!clean) return;
    if (domains.includes(clean)) return;
    if (domains.length >= 5) {
      toast.warning("Limits Exceeded: You can compare up to 5 domains simultaneously in the sandbox workspace.");
      return;
    }
    setDomains([...domains, clean]);
    setNewDomainInput("");
  };

  const handleRemoveDomain = (idx: number) => {
    if (domains.length <= 1) {
      toast.warning("Incomplete Profile: A comparative metrics profile requires at least 1 domain reference.");
      return;
    }
    setDomains(domains.filter((_, i) => i !== idx));
  };

  // Simulated metrics dataset computed for each domain
  const comparedMetrics = domains.map((dom, index) => {
    // Generate deterministic values relative to length and index
    const seed = dom.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const authorityScore = Math.max(15, Math.min(99, Math.floor((seed % 65) + 30)));
    const estimatedTraffic = (seed * 1800) + 120000;
    const rankingKeywords = Math.floor(estimatedTraffic / 8.2);
    const backlinkRefs = Math.floor(estimatedTraffic * 8.5);
    const pageSpeedScore = Math.min(99, Math.max(45, Math.floor((seed % 40) + 55)));

    // Colors
    const colors = [
      { text: "text-orange-500", bg: "bg-[#ff642d]", hex: "#ff642d" },
      { text: "text-blue-500", bg: "bg-blue-500", hex: "#3b82f6" },
      { text: "text-indigo-500", bg: "bg-indigo-500", hex: "#6366f1" },
      { text: "text-emerald-500", bg: "bg-emerald-500", hex: "#10b981" },
      { text: "text-purple-500", bg: "bg-purple-500", hex: "#a855f7" }
    ];

    return {
      domain: dom,
      authorityScore,
      estimatedTraffic,
      rankingKeywords,
      backlinkRefs,
      pageSpeedScore,
      style: colors[index % colors.length]
    };
  });

  // Calculate Overlaps vector
  const topOverlappingKeywords = [
    { text: "comfort shoe models online", searchVol: 8500, rankings: comparedMetrics.map(m => Math.max(1, (m.authorityScore % 15) + 1)) },
    { text: "best sneakers comparison list", searchVol: 4500, rankings: comparedMetrics.map(m => Math.max(1, (m.authorityScore % 11) + 2)) },
    { text: "leather boots discount coupons", searchVol: 2200, rankings: comparedMetrics.map(m => Math.max(1, (m.authorityScore % 30) + 5)) },
    { text: "running platform metrics free", searchVol: 1500, rankings: comparedMetrics.map(m => Math.max(1, (m.authorityScore % 8) + 1)) },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-[#ff642d]" /> Competitor Insight Comparison
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Perform multi-site overlapping keyword checks. Stack profiles under side-by-side comparison vectors
        </p>
      </div>

      {/* DOMAIN CHIPS CONTROLLER INPUT */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-left space-y-4">
        
        <div className="flex border-b pb-4 border-slate-100 flex-wrap gap-2">
          {domains.map((dom, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 py-1.5 px-3 bg-slate-100 text-slate-800 rounded-lg text-sm font-semibold border border-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{dom}</span>
              <button 
                onClick={() => handleRemoveDomain(idx)}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ml-1"
                title="Remove Domain"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {domains.length < 5 && (
            <div className="text-xs text-gray-400 self-center ml-2">
              ({5 - domains.length} slots left)
            </div>
          )}
        </div>

        {/* Input Bar */}
        {domains.length < 5 && (
          <div className="max-w-md flex gap-2">
            <input 
              type="text"
              value={newDomainInput}
              onChange={(e) => setNewDomainInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddDomain(); }}
              placeholder="e.g. adidas.com, puma.com..."
              className="flex-1 bg-white border border-gray-205 py-2 px-3 rounded-lg text-xs font-semibold text-gray-700 outline-none"
            />
            <button 
              onClick={handleAddDomain}
              className="bg-[#ff642d] hover:bg-[#e05320] text-xs font-bold text-white py-2 px-4 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Domain
            </button>
          </div>
        )}

      </div>

      {/* SIDE-BY-SIDE ANALYTICS BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {comparedMetrics.map((item, idx) => (
          <div key={idx} className="bg-white border-t-4 rounded-xl p-5 shadow-sm text-left relative" style={{ borderTopColor: item.style.hex }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Property {idx + 1}</span>
            <span className="text-sm font-bold text-gray-900 block truncate mt-1">{item.domain}</span>
            
            <div className="mt-4 space-y-3 font-sans">
              
              {/* Authority score */}
              <div>
                <span className="text-[10px] text-gray-400 uppercase">Authority Score</span>
                <span className="text-lg font-bold font-mono text-gray-800 block">{item.authorityScore} / 100</span>
              </div>
              
              {/* Est traffic */}
              <div>
                <span className="text-[10px] text-gray-400 uppercase">Search Traffic / Mo</span>
                <span className="text-lg font-bold font-mono text-gray-800 block">{item.estimatedTraffic.toLocaleString()}</span>
              </div>
              
              {/* Keywords count */}
              <div>
                <span className="text-[10px] text-gray-400 uppercase">Search Keywords</span>
                <span className="text-lg font-bold font-mono text-gray-800 block">{item.rankingKeywords.toLocaleString()}</span>
              </div>
              
              {/* Backlinks */}
              <div>
                <span className="text-[10px] text-gray-400 uppercase">Spider Backlinks</span>
                <span className="text-lg font-bold font-mono text-gray-800 block font-mono">{item.backlinkRefs.toLocaleString()}</span>
              </div>

              {/* Crawl Performance item */}
              <div>
                <span className="text-[10px] text-gray-400 uppercase">Mobile Crawl Index</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full" style={{ width: `${item.pageSpeedScore}%` }}></div>
                  </div>
                  <span className="text-xs font-mono font-medium text-gray-500">{item.pageSpeedScore}%</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* TRAFFIC COMPARISON CHART */}
      <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm text-left">
        <h3 className="text-sm font-bold text-gray-900 mb-5">Metric Comparison Vector (Indexed representation)</h3>
        
        <div className="space-y-4">
          {comparedMetrics.map((item, idx) => {
            // Percent relative to maximum traffic domain in listed group
            const maxTraffic = Math.max(...comparedMetrics.map(m => m.estimatedTraffic)) || 1;
            const widthPct = Math.max(15, Math.min(100, Math.floor((item.estimatedTraffic / maxTraffic) * 100)));
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded ${item.style.bg}`}></span>
                    <span>{item.domain}</span>
                  </span>
                  <span className="font-mono text-gray-500 font-bold">{item.estimatedTraffic.toLocaleString()} / mo</span>
                </div>
                
                <div className="w-full h-4 bg-gray-50 rounded overflow-hidden">
                  <div className={`h-full rounded transition-all ${item.style.bg}`} style={{ width: `${widthPct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KEYWORD OVERLAPPING CLUSTERS DATAGRID */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 text-left">
        <h3 className="text-sm font-bold text-gray-900 border-b pb-3 mb-4">Competitor Rankings Overlay matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-gray-100">
                <th className="py-2.5 px-3 font-bold text-left uppercase">Semantic Overlap Phrase</th>
                <th className="py-2.5 px-3 font-bold text-center uppercase">Est. Global Vol</th>
                {domains.map((dom, id) => (
                  <th key={id} className="py-2.5 px-3 font-semibold text-right truncate uppercase">{dom}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topOverlappingKeywords.map((kw, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-3 font-semibold text-gray-800">{kw.text}</td>
                  <td className="py-3.5 px-3 text-center text-gray-700 font-mono">{kw.searchVol.toLocaleString()}</td>
                  {kw.rankings.map((rank, rIdx) => {
                    const domainStyle = comparedMetrics[rIdx]?.style;
                    return (
                      <td key={rIdx} className="py-3.5 px-3 text-right">
                        <span className={`font-mono font-bold text-xs py-1 px-2.5 rounded-full ${
                          rank <= 3 ? "bg-emerald-50 text-emerald-700 font-extrabold" : "bg-slate-100 text-slate-700"
                        }`}>
                          #{rank}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
