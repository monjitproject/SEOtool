/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { generatePositionTrack } from "../mockData";
import { PositionTrackItem } from "../types";
import { 
  Activity, 
  MapPin, 
  Smartphone, 
  Monitor, 
  TrendingUp, 
  Search, 
  ChevronRight, 
  Plus, 
  Clock,
  RefreshCw,
  X
} from "lucide-react";

export default function PositionTrackingView() {
  const [topic, setTopic] = useState("shoe collections");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [country, setCountry] = useState("US");
  const [cityInput, setCityInput] = useState("Chicago, IL");
  
  const [trackedItems, setTrackedItems] = useState<PositionTrackItem[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [reloading, setReloading] = useState(false);

  const fetchTrackData = () => {
    setReloading(true);
    setTimeout(() => {
      const data = generatePositionTrack(topic);
      setTrackedItems(data);
      setReloading(false);
    }, 800);
  };

  useEffect(() => {
    fetchTrackData();
  }, [topic]);

  const handleAddKeyword = () => {
    const clean = newKeyword.trim();
    if (!clean) return;
    
    const newItem: PositionTrackItem = {
      keyword: clean,
      volume: 850,
      currentPosition: 12,
      previousPosition: 15,
      history: [15, 14, 15, 13, 14, 12, 12],
      device: device,
      location: `United States (${cityInput})`
    };

    setTrackedItems([newItem, ...trackedItems]);
    setNewKeyword("");
  };

  const handleRemoveTrack = (kw: string) => {
    setTrackedItems(trackedItems.filter(item => item.keyword !== kw));
  };

  // Aggregates
  const visibilityIndex = "34.2%";
  const avgPosition = trackedItems.length 
    ? (trackedItems.reduce((acc, cur) => acc + cur.currentPosition, 0) / trackedItems.length).toFixed(1) 
    : "0";

  return (
    <div className="space-y-6">
      
      {/* Page header */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-[#ff642d]" /> Position & Visibility tracking
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Perform daily ranking analysis of specified search terms, optimized for localized city scopes and target device types
        </p>
      </div>

      {/* TRACKING TARGET CONTROLLER CARD */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Tracking topic */}
          <div>
            <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Crawl Subject Topic</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchTrackData();
                }
              }}
              placeholder="e.g. running shoe store..."
              className="w-full bg-white border border-gray-205 py-2 px-3 text-xs font-semibold text-gray-700 rounded-lg outline-none"
            />
          </div>

          {/* Location city */}
          <div>
            <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Target City Scope</label>
            <div className="relative">
              <input 
                type="text" 
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchTrackData();
                  }
                }}
                placeholder="e.g. Chicago, IL..."
                className="w-full bg-white border border-gray-205 py-2 pl-8 pr-3 text-xs font-semibold text-gray-700 rounded-lg outline-none"
              />
              <MapPin className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Device toggle */}
          <div>
            <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Spider Device</label>
            <div className="flex bg-slate-50 border p-1 border-gray-200 rounded-lg">
              <button 
                onClick={() => setDevice("desktop")}
                className={`flex-1 py-1 px-2 rounded font-bold text-xs flex justify-center items-center gap-1 ${device === "desktop" ? "bg-[#ff642d] text-white" : "hover:bg-white text-gray-500"}`}
              >
                <Monitor className="w-3 h-3" /> Desktop
              </button>
              <button 
                onClick={() => setDevice("mobile")}
                className={`flex-1 py-1 px-2 rounded font-bold text-xs flex justify-center items-center gap-1 ${device === "mobile" ? "bg-[#ff642d] text-white" : "hover:bg-white text-gray-500"}`}
              >
                <Smartphone className="w-3 h-3" /> Mobile
              </button>
            </div>
          </div>

          {/* Trigger manual refresh */}
          <div>
            <button 
              onClick={fetchTrackData}
              disabled={reloading}
              className="w-full bg-[#111827] hover:bg-gray-800 disabled:opacity-55 py-2 px-4 text-xs font-bold text-white rounded-lg transition-all flex justify-center items-center gap-1.5"
            >
              {reloading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ff642d]" /> Tracking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-[#ff642d]" /> Force Daily Check
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* CORE AGGREGATES SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Visibility Index */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Visibility Index</span>
          <span className="text-3xl font-extrabold font-mono text-[#ff642d] block mt-1">{visibilityIndex}</span>
          <p className="text-[10px] text-gray-400 mt-1">Est. organic CTR weight in results</p>
        </div>

        {/* Avg position */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Average Position rank</span>
          <span className="text-3xl font-extrabold font-mono text-gray-900 block mt-1">#{avgPosition}</span>
          <p className="text-[10px] text-gray-400 mt-1">Mean calculation for keywords campaign</p>
        </div>

        {/* Total Tracked keywords */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Tracker Keywords</span>
          <span className="text-3xl font-extrabold font-mono text-gray-900 block mt-1">{trackedItems.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">Specified target keywords in run checks</p>
        </div>

      </div>

      {/* KEYWORD INPUT CONTROL BAR */}
      <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input 
            type="text" 
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddKeyword(); }}
            placeholder="Add new keyword term to tracking system (e.g. leather loafers buy Chicago)..."
            className="w-full bg-white border border-gray-205 py-2 px-3 text-xs font-semibold text-gray-700 rounded-lg outline-none"
          />
        </div>
        <button 
          onClick={handleAddKeyword}
          className="bg-[#ff642d] hover:bg-[#e05320] text-xs font-bold text-white py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Keyword
        </button>
      </div>

      {/* TRACKING LIST GRID */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-left overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-400 uppercase">
                <th className="py-3 px-4 text-left font-semibold">Tracked Search Keyword</th>
                <th className="py-3 px-4 text-center font-semibold">Search Vol</th>
                <th className="py-3 px-4 text-center font-semibold">Previous Rank</th>
                <th className="py-3 px-4 text-center font-semibold">Current Rank</th>
                <th className="py-3 px-4 text-center font-semibold">Position Shift</th>
                <th className="py-3 px-4 text-center font-semibold">Rank Trend Path (7 Days)</th>
                <th className="py-3 px-4 text-right font-semibold">Scope Parameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trackedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    No keywords active in tracking system. Key some in above!
                  </td>
                </tr>
              ) : (
                trackedItems.map((item, idx) => {
                  const valDiff = item.previousPosition - item.currentPosition; // positive is improvement
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* Keyword tag */}
                      <td className="py-3.5 px-4 font-semibold text-gray-950 flex items-center gap-2 justify-between">
                        <span>{item.keyword}</span>
                        <button 
                          onClick={() => handleRemoveTrack(item.keyword)}
                          className="text-gray-300 hover:text-rose-600 transition-colors"
                          title="Remove Track"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      {/* Search Volume */}
                      <td className="py-3.5 px-4 text-center font-mono text-gray-600 font-bold">
                        {item.volume.toLocaleString()}
                      </td>

                      {/* Prev Rank */}
                      <td className="py-3.5 px-4 text-center font-mono text-gray-500">
                        #{item.previousPosition}
                      </td>

                      {/* Current Rank */}
                      <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-800 text-sm">
                        #{item.currentPosition}
                      </td>

                      {/* Rank delta */}
                      <td className="py-3.5 px-4 text-center">
                        {valDiff > 0 ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            +{valDiff} positions
                          </span>
                        ) : valDiff < 0 ? (
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            {valDiff} positions
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-gray-450 bg-gray-50 px-2 py-0.5 rounded-full">
                            Stable
                          </span>
                        )}
                      </td>

                      {/* Past 7 days sparkline */}
                      <td className="py-3.5 px-4">
                        <div className="w-24 h-6 mx-auto flex items-end justify-center gap-1">
                          {item.history.map((pt, pIdx) => {
                            const maxPos = Math.max(...item.history) || 1;
                            // inverted coordinate: lower rank is better (draw taller bar)
                            const htPct = Math.round(((maxPos - pt + 1.5) / (maxPos + 1)) * 100);
                            return (
                              <div 
                                key={pIdx} 
                                className="w-1.5 bg-[#ff642d] rounded-t-sm" 
                                style={{ height: `${Math.max(10, Math.min(100, htPct))}%` }}
                                title={`Day ${pIdx + 1}: Rank #${pt}`}
                              ></div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Target params summary */}
                      <td className="py-3.5 px-4 text-right text-xs text-gray-450 font-semibold font-sans">
                        <div className="flex items-center justify-end gap-1.5 font-sans">
                          {item.device === "desktop" ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                          <span className="uppercase">{item.device}</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-450 font-bold truncate max-w-[120px]">{item.location}</span>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
