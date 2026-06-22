/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ReportWidget } from "../types";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  ShieldAlert, 
  Clock, 
  Award,
  Sparkles,
  RefreshCw,
  Sliders
} from "lucide-react";

export default function ReportsBuilderView() {
  // Preset list of active widgets in workspace canvas
  const [reportTitle, setReportTitle] = useState("Enterprise SEO Executive Summary Audit");
  const [widgets, setWidgets] = useState<ReportWidget[]>([
    { id: "widget-1", type: "Header", title: "Site Overview Overview", config: { subTitle: "SEOtool.com Executive Tracking Audit" } },
    { id: "widget-2", type: "KpiSummary", title: "Target Traffic Highlights", config: { metricType: "Traffic" } },
    { id: "widget-3", type: "ChartWidget", title: "Organic Growth Multipliers Index", config: { metricType: "Keywords" } },
    { id: "widget-4", type: "TableWidget", title: "Failed Crawl Checkpoints (Site Audit)", config: { metricType: "Audit" } }
  ]);

  // Settings
  const [whiteLabeled, setWhiteLabeled] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [recipient, setRecipient] = useState("vmanjeet773@gmail.com");

  // Selection list of widgets that can be clicked to incorporate
  const availableWidgetTemplates = [
    { type: "KpiSummary", label: "KPI Metric block", desc: "Showcases Volume, KD, and Average Authority parameters" },
    { type: "ChartWidget", label: "Traffic Vector Chart", desc: "Draws responsive SVG organic visibility curves" },
    { type: "TableWidget", label: "Site Audit Warnings list", desc: "Lists failed crawl checkpoints and diagnostic categories" },
    { type: "TextWidget", label: "Custom Text Block", desc: "Add advisory text notes or recommendations" }
  ];

  const handleAddWidget = (templateType: string, label: string) => {
    const id = `widget-custom-${Date.now()}`;
    const newWidget: ReportWidget = {
      id,
      type: templateType as any,
      title: `${label} Summary`,
      config: templateType === "TextWidget" ? { text: "Use this advisory section to note performance priorities..." } : {}
    };
    setWidgets([...widgets, newWidget]);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  // Triggers browser print layout which outputs pristine PDF summaries
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0">
      
      {/* Title block */}
      <div className="text-left print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#ff642d]" /> Drag-and-Add Report Builder
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Compose white-labeled executive PDF reports of keyword visibility, backlink counts, sitemaps errors, and scheduled deliveries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:grid-cols-1">
        
        {/* Left Side: Drag template click additions and schedule options (Hidden on raw Printing) */}
        <div className="lg:col-span-4 space-y-4 text-left print:hidden">
          
          {/* Template blocks additions */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Report Grid Blocks</span>
            
            <div className="space-y-2">
              {availableWidgetTemplates.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddWidget(item.type, item.label)}
                  className="w-full p-3 rounded-lg border border-gray-100 text-left hover:border-gray-300 hover:bg-slate-50 transition-all flex items-start gap-2.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#ff642d] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">{item.label}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5 leading-snug">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reporting Configuration params */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Branding & Delivery Settings</span>
            
            {/* White labeling */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input 
                type="checkbox" 
                checked={whiteLabeled}
                onChange={(e) => setWhiteLabeled(e.target.checked)}
                className="w-4 h-4 text-[#ff642d] accent-[#ff642d]" 
              />
              <div>
                <span className="font-bold text-gray-700 block">White Label Mode</span>
                <span className="text-[10px] text-gray-400 block">Erase SuiteRank brand stamps with custom corporate flags</span>
              </div>
            </label>

            {/* In-app scheduler */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input 
                type="checkbox" 
                checked={scheduled}
                onChange={(e) => setScheduled(e.target.checked)}
                className="w-4 h-4 text-[#ff642d] accent-[#ff642d]" 
              />
              <div>
                <span className="font-bold text-gray-700 block">Schedule Crawl Report</span>
                <span className="text-[10px] text-gray-400 block">Automate PDF deliveries at sitemaps crawl endpoints</span>
              </div>
            </label>

            {scheduled && (
              <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/50 space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase block">Recipient Email</label>
                <input 
                  type="email" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-white border border-gray-205 py-1.5 px-2.5 text-xs text-gray-700 rounded-lg outline-none"
                />
              </div>
            )}

            <button 
              onClick={handlePrintPdf}
              className="w-full bg-[#111827] hover:bg-gray-800 text-xs font-bold text-white py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#ff642d]" /> Prepare Executable PDF
            </button>

          </div>

        </div>

        {/* Right Side: Virtual Report page canvas (Print target) */}
        <div className="lg:col-span-8 space-y-4 print:w-full">
          
          <div className="bg-white border rounded-xl p-8 shadow-sm space-y-6 print:border-0 print:p-0 print:shadow-none text-left">
            
            {/* Header branding strip */}
            <div className="flex justify-between items-center border-b pb-4 border-gray-150">
              <div>
                {whiteLabeled ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-slate-800"></div>
                    <span className="text-xs font-black uppercase text-gray-700 tracking-wide">Enterprise Custom Workspace Corp</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-[#ff642d] flex items-center justify-center font-bold text-[10px] text-white">S</div>
                    <span className="text-xs font-black uppercase text-gray-800 tracking-wide">SuiteRank Reports Engine</span>
                  </div>
                )}
              </div>
              <div className="text-right text-[10px] text-gray-405 font-medium">
                <span>CRAWL RUN ID: C-2026-0621</span>
                <span className="block text-gray-300">Date: Jun 21, 2026</span>
              </div>
            </div>

            {/* Editable report title */}
            <div>
              <input 
                type="text" 
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="text-lg font-black text-gray-950 bg-transparent py-0.5 border-b border-transparent hover:border-gray-200 outline-none w-full print:border-0"
              />
              <span className="text-xs text-gray-400 block mt-1">Audit of organic keywords overlap and diagnostic crawl scores.</span>
            </div>

            {/* CANVAS GRID CONTAINER */}
            <div className="space-y-6 mt-4">
              {widgets.length === 0 ? (
                <div className="py-20 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
                  Report page is blank. Click template widget blocks on the left panel to incorporate insights!
                </div>
              ) : (
                widgets.map((w, index) => (
                  <div key={w.id} className="relative group border border-slate-50 p-5 rounded-xl bg-slate-50/20 hover:border-gray-200 transition-colors">
                    
                    {/* Hover delete button (Hidden on print) */}
                    <button
                      onClick={() => handleRemoveWidget(w.id)}
                      className="absolute right-3 top-3 p-1 rounded-md text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 print:hidden cursor-pointer"
                      title="Delete Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#ff642d]" /> {w.title}
                    </h4>

                    {/* Content render blocks relative to Widget Type */}
                    {w.type === "Header" && (
                      <div className="p-3 bg-slate-900 text-white rounded-lg">
                        <span className="text-xs font-bold block">{w.config.subTitle || "Custom Domain Overview"}</span>
                        <span className="text-[10px] text-gray-300">Target localized scope audits of search indexing parameters</span>
                      </div>
                    )}

                    {w.type === "KpiSummary" && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-white border border-gray-100 rounded-lg text-center">
                          <span className="text-[9px] text-gray-400 font-bold block">AUDIT HEALTH</span>
                          <span className="font-mono text-base font-bold text-gray-800">84%</span>
                        </div>
                        <div className="p-3 bg-white border border-gray-100 rounded-lg text-center">
                          <span className="text-[9px] text-gray-400 font-bold block">TRAFFIC/MO</span>
                          <span className="font-mono text-base font-bold text-[#ff642d]">128.4K</span>
                        </div>
                        <div className="p-3 bg-white border border-gray-100 rounded-lg text-center">
                          <span className="text-[9px] text-gray-400 font-bold block">KEYWORDS</span>
                          <span className="font-mono text-base font-bold text-gray-800">14.2K</span>
                        </div>
                      </div>
                    )}

                    {w.type === "ChartWidget" && (
                      <div className="h-24 relative mt-2 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 350 70" preserveAspectRatio="none">
                          <path 
                            d="M 0,60 Q 70,50 140,30 Q 210,40 280,20 Q 350,15 350,15 L 350,70 L 0,70 Z" 
                            fill="#ff642d" 
                            fillOpacity="0.08" 
                          />
                          <path 
                            d="M 0,60 Q 70,50 140,30 Q 210,40 280,20 Q 350,15 350,15" 
                            fill="none" 
                            stroke="#ff642d" 
                            strokeWidth="1.8" 
                          />
                        </svg>
                        <span className="absolute bottom-1 right-2 text-[9px] text-gray-400 font-mono">Organic Visibility curve</span>
                      </div>
                    )}

                    {w.type === "TableWidget" && (
                      <div className="space-y-1.5 text-xs font-medium text-gray-650">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 border-b pb-1">
                          <span>Diagnostic Parameter Check</span>
                          <span>Audit Status</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Broken hyperlink references check</span>
                          <span className="text-rose-600 font-bold">2 items Failed</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Missing meta SEO document tags check</span>
                          <span className="text-rose-600 font-bold">4 items Failed</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Page loading performance speeds speed index (<span className="font-mono">CWV</span>)</span>
                          <span className="text-amber-600 font-semibold">Slow responses warnings</span>
                        </div>
                      </div>
                    )}

                    {w.type === "TextWidget" && (
                      <textarea
                        defaultValue={w.config.text}
                        className="w-full bg-white border border-transparent hover:border-gray-200 text-xs text-gray-600 p-2 rounded-lg outline-none resize-none print:border-0"
                        rows={3}
                      />
                    )}

                  </div>
                ))
              )}
            </div>

            {/* Print Footer markings */}
            <div className="border-t border-gray-150 pt-5 text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span>CONFIDENTIAL SEO PERFORMANCE ANALYSIS - PREPARED BY SUITERANK WORKSPACE</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
