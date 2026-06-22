/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { KeywordRecord } from "../types";
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  CheckSquare, 
  Square,
  HelpCircle,
  Eye,
  ChevronsUpDown
} from "lucide-react";

interface KeywordTableProps {
  data: KeywordRecord[];
  onSelectedKeywordsChange?: (selected: string[]) => void;
}

export default function KeywordTableView({ data, onSelectedKeywordsChange }: KeywordTableProps) {
  // Sorting states
  const [sortField, setSortField] = useState<keyof KeywordRecord>("volume");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected multi-keywords state
  const [selectedKws, setSelectedKws] = useState<string[]>([]);

  // Column Resizing mockup (width multipliers)
  const [colWidthMultiplier, setColWidthMultiplier] = useState(1.0);

  // Intent tags color map
  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "Informational":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Commercial":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Transactional":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Navigational":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Intent tags letter code
  const getIntentAbbrev = (intent: string) => {
    switch (intent) {
      case "Informational": return "I";
      case "Commercial": return "C";
      case "Transactional": return "T";
      case "Navigational": return "N";
      default: return "?";
    }
  };

  // Multi Sort Logic
  const handleSort = (field: keyof KeywordRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // default desc for numbers
    }
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle simple comparisons
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc" 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      
      const numA = typeof valA === "number" ? valA : 0;
      const numB = typeof valB === "number" ? valB : 0;
      return sortDirection === "asc" ? numA - numB : numB - numA;
    });
  }, [data, sortField, sortDirection]);

  // Paginated Segment
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

  // Toggle Single Selection
  const toggleSelectKeyword = (kwText: string) => {
    let next: string[];
    if (selectedKws.includes(kwText)) {
      next = selectedKws.filter(k => k !== kwText);
    } else {
      next = [...selectedKws, kwText];
    }
    setSelectedKws(next);
    if (onSelectedKeywordsChange) onSelectedKeywordsChange(next);
  };

  // Toggle All Selection on Screen
  const toggleAllOnScreen = () => {
    const screenKws = paginatedData.map(item => item.keyword);
    const allSelected = screenKws.every(k => selectedKws.includes(k));
    
    let next: string[];
    if (allSelected) {
      next = selectedKws.filter(k => !screenKws.includes(k));
    } else {
      next = Array.from(new Set([...selectedKws, ...screenKws]));
    }
    setSelectedKws(next);
    if (onSelectedKeywordsChange) onSelectedKeywordsChange(next);
  };

  // CSV Output Export handler
  const handleExportCSV = (format: "csv" | "excel") => {
    const targetData = selectedKws.length > 0 
      ? sortedData.filter(item => selectedKws.includes(item.keyword))
      : sortedData;

    const headers = "Keyword,Volume,Difficulty(KD),Intent,CPC,Competition,Monthly Searches,SERP Count\n";
    const rows = targetData.map(item => 
      `"${item.keyword}",${item.volume},${item.kd}%,${item.intent},${item.cpc},${item.competition},"${item.trend.join("|")}",${item.results}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SuiteRank_Keywords_Export_${format === "excel" ? "Excel" : "CSV"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render KD badge
  const renderKdBadge = (kd: number) => {
    let color = "text-emerald-700 bg-emerald-50 border-emerald-100";
    let desc = "Easy";
    if (kd > 75) {
      color = "text-rose-700 bg-rose-50 border-rose-100";
      desc = "Very Hard";
    } else if (kd > 55) {
      color = "text-amber-700 bg-amber-50 border-amber-100";
      desc = "Hard";
    } else if (kd > 35) {
      color = "text-blue-700 bg-blue-50 border-blue-100";
      desc = "Medium";
    }
    return (
      <div className="flex items-center gap-1.5 font-semibold">
        <span className="font-mono text-gray-800 text-sm">{kd}%</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${color}`}>{desc}</span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-left overflow-hidden">
      {/* Table Actions Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            {selectedKws.length > 0 ? (
              <span className="text-[#ff642d] font-bold">{selectedKws.length} selected</span>
            ) : (
              <span>Showing {data.length} keywords</span>
            )}
          </span>
          {selectedKws.length > 0 && (
            <button 
              onClick={() => { setSelectedKws([]); if (onSelectedKeywordsChange) onSelectedKeywordsChange([]); }}
              className="text-xs text-gray-400 hover:text-gray-600 underline font-medium"
            >
              Clear Selection
            </button>
          )}
        </div>

        {/* Export triggers */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => handleExportCSV("csv")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 .py-1.5 py-2 bg-white border border-gray-250 text-xs text-gray-700 font-semibold rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button 
            onClick={() => handleExportCSV("excel")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-[#111827] text-xs text-white font-semibold rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#ff642d]" /> Export Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {/* Checkbox selector */}
              <th className="py-3.5 pl-4 pr-1 text-left w-10">
                <button onClick={toggleAllOnScreen} className="text-gray-400 hover:text-gray-600">
                  {paginatedData.every(item => selectedKws.includes(item.keyword)) ? (
                    <CheckSquare className="w-4 h-4 text-[#ff642d]" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              
              <th className="py-3.5 px-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider min-w-[200px]">
                <button onClick={() => handleSort("keyword")} className="flex items-center gap-1 hover:text-gray-800 transition-colors uppercase">
                  Keyword <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </th>
              
              <th className="py-3.5 px-4 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort("volume")} className="flex items-center gap-1 hover:text-gray-800 transition-colors mx-auto uppercase">
                  Volume <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </th>
              
              <th className="py-3.5 px-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort("kd")} className="flex items-center gap-1 hover:text-gray-800 transition-colors uppercase">
                  KD % <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </th>
              
              <th className="py-3.5 px-4 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort("intent")} className="flex items-center gap-1 hover:text-gray-800 transition-colors mx-auto uppercase">
                  Intent <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </th>
              
              <th className="py-3.5 px-4 text-right font-semibold text-xs text-gray-500 uppercase tracking-wider">
                <button onClick={() => handleSort("cpc")} className="flex items-center gap-1 hover:text-gray-800 transition-colors ml-auto uppercase">
                  CPC ($) <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </th>
              
              <th className="py-3.5 px-4 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1 justify-center uppercase">Trend</span>
              </th>

              <th className="py-3.5 px-4 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">
                <span className="uppercase">SERP Features</span>
              </th>

              <th className="py-3.5 px-4 text-right font-semibold text-xs text-gray-500 uppercase tracking-wider">
                <span className="uppercase">Results</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-400">
                  No keyword records found matching selected constraints. Use broader keyword searches above!
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => {
                const isSelected = selectedKws.includes(item.keyword);
                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-50/50 transition-colors ${isSelected ? "bg-orange-50/20" : ""}`}
                  >
                    {/* Checkbox column */}
                    <td className="py-3.5 pl-4 pr-1 text-left">
                      <button 
                        onClick={() => toggleSelectKeyword(item.keyword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#ff642d]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Term Title */}
                    <td className="py-3.5 px-4 font-semibold text-gray-900 text-sm">
                      <span className="hover:text-[#ff642d] transition-colors cursor-pointer">{item.keyword}</span>
                    </td>

                    {/* Search Volume */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-800 text-sm">
                      {item.volume.toLocaleString()}
                    </td>

                    {/* KD difficulty% */}
                    <td className="py-3.5 px-4">
                      {renderKdBadge(item.kd)}
                    </td>

                    {/* Primary Intent Code */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center" title={`${item.intent} Search Intent`}>
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center border text-[11px] font-extrabold ${getIntentColor(item.intent)}`}>
                          {getIntentAbbrev(item.intent)}
                        </span>
                      </div>
                    </td>

                    {/* CPC price */}
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-gray-700">
                      ${item.cpc.toFixed(2)}
                    </td>

                    {/* Monthly Volume Mini Chart */}
                    <td className="py-3.5 px-4">
                      <div className="w-20 h-6 mx-auto flex items-end gap-0.5 justify-center">
                        {item.trend.map((val, mIdx) => {
                          const maxVal = Math.max(...item.trend) || 1;
                          const htPct = Math.round((val / maxVal) * 100);
                          return (
                            <div 
                              key={mIdx} 
                              className="w-1 bg-[#ff642d]/80 rounded-t-sm" 
                              style={{ height: `${Math.max(15, htPct)}%` }}
                              title={`Month ${mIdx + 1}: ${val.toLocaleString()}`}
                            ></div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Features list */}
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {item.serpFeatures.map((feat, fIdx) => (
                          <span key={fIdx} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Static Results count */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-gray-400">
                      {(item.results / 1000000).toFixed(1)}M
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Page <span className="font-bold text-gray-700">{currentPage}</span> of <span className="font-bold text-gray-700">{totalPages}</span>
        </span>
        
        <div className="flex gap-1.5">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1 px-2.5 rounded border border-gray-300 bg-white text-xs text-gray-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
          >
            <ChevronLeft className="w-4 h-4 inline-block align-middle" /> Prev
          </button>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-1 px-2.5 rounded border border-gray-300 bg-white text-xs text-gray-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
          >
            Next <ChevronRight className="w-4 h-4 inline-block align-middle" />
          </button>
        </div>
      </div>
    </div>
  );
}
