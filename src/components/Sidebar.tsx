/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ActiveView } from "../types";
import { 
  Home, 
  Activity, 
  Layers, 
  Sparkles, 
  Gauge, 
  Globe, 
  Link2, 
  Settings, 
  CreditCard, 
  FileText, 
  Map, 
  FileEdit, 
  Compass, 
  Layout, 
  ChevronRight, 
  ChevronLeft,
  FileCode
} from "lucide-react";

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }: SidebarProps) {
  
  // Helper to check active status
  const isSelected = (view: ActiveView) => activeView === view;

  // Render a standard sub-item inside sidebar group
  const renderSubItem = (view: ActiveView, label: string) => {
    const active = isSelected(view);
    return (
      <button
        id={`subitem-${view.replace("-", "_")}`}
        onClick={() => setActiveView(view)}
        className={`w-full text-left px-4 py-2 text-[14px] rounded-md font-medium transition-all duration-150 ${
          active 
            ? "bg-[#e5e7eb] text-[#111827] font-bold shadow-xs border-l-2 border-[#111827] pl-3.5" 
            : "text-gray-600 hover:text-[#111827] hover:bg-gray-100/50"
        }`}
      >
        {label}
      </button>
    );
  };

  // Helper to check what group is currently active based on current activeView
  const getActiveGroup = (): "SEO" | "Site Performance" | "Competitive Analysis" | "Keyword Research" | "Content Ideas" | "Link Building" | "Account" => {
    switch (activeView) {
      case ActiveView.Dashboard:
        return "SEO";
      case ActiveView.SiteAudit:
      case ActiveView.PositionTracking:
        return "Site Performance";
      case ActiveView.DomainOverview:
      case ActiveView.OrganicRankings:
      case ActiveView.TopPages:
      case ActiveView.CompetitorComparison:
      case ActiveView.KeywordGap:
      case ActiveView.BacklinkGap:
        return "Competitive Analysis";
      case ActiveView.KeywordOverview:
      case ActiveView.KeywordResearch:
      case ActiveView.KeywordMagicTool:
        return "Keyword Research";
      case ActiveView.AiSnsTools:
      case ActiveView.TopicResearch:
      case ActiveView.SeoContentTemplate:
        return "Content Ideas";
      case ActiveView.BacklinkAnalytics:
      case ActiveView.BacklinkAudit:
      case ActiveView.LinkBuilding:
        return "Link Building";
      default:
        return "Account";
    }
  };

  const activeGroup = getActiveGroup();

  // Handle clicking left rail icon: switches to the primary view of that group
  const handleRailClick = (group: "SEO" | "Site Performance" | "Competitive Analysis" | "Keyword Research" | "Content Ideas" | "Link Building" | "Account") => {
    switch (group) {
      case "SEO":
        setActiveView(ActiveView.Dashboard);
        break;
      case "Site Performance":
        setActiveView(ActiveView.SiteAudit);
        break;
      case "Competitive Analysis":
        setActiveView(ActiveView.DomainOverview);
        break;
      case "Keyword Research":
        setActiveView(ActiveView.KeywordOverview);
        break;
      case "Content Ideas":
        setActiveView(ActiveView.AiSnsTools);
        break;
      case "Link Building":
        setActiveView(ActiveView.BacklinkAnalytics);
        break;
      case "Account":
        setActiveView(ActiveView.Settings);
        break;
    }
    if (collapsed) {
      setCollapsed(false);
    }
  };

  return (
    <div className="h-screen flex text-gray-800 border-r border-gray-200 select-none flex-shrink-0 relative">
      
      {/* 1. LEFT NARROW ICON RAIL (High Fidelity styling like screenshot) */}
      <div className="w-[60px] bg-white border-r border-gray-150 flex flex-col items-center py-4 justify-between flex-shrink-0 z-20 shadow-xs">
        
        {/* Top brand logo or miniature */}
        <div className="flex flex-col items-center gap-6 w-full">
          <button 
            onClick={() => handleRailClick("SEO")} 
            className="w-10 h-10 bg-purple-600/80 text-white font-bold text-xl italic rounded-lg flex items-center justify-center shadow-md hover:bg-purple-600/90 transition-all hover:scale-105"
          >
            S
          </button>
          
          {/* Navigation group icons */}
          <div className="flex flex-col items-center gap-3 w-full px-2">
            
            {/* Dashboard / Home */}
            <button
              onClick={() => handleRailClick("SEO")}
              title="SEO Home & Dashboard"
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeGroup === "SEO" 
                  ? "bg-gray-900 text-white shadow-xs" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Home className="w-5 h-5" />
            </button>

            {/* Site Performance */}
            <button
              onClick={() => handleRailClick("Site Performance")}
              title="Site Performance Tools"
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeGroup === "Site Performance" 
                  ? "bg-gray-900 text-white shadow-xs" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Gauge className="w-5 h-5" />
            </button>

            {/* Competitive Analysis */}
            <button
              onClick={() => handleRailClick("Competitive Analysis")}
              title="Competitive & Domain Analysis"
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeGroup === "Competitive Analysis" 
                  ? "bg-gray-900 text-white shadow-xs" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Layers className="w-5 h-5" />
            </button>

            {/* Keyword Research */}
            <button
              onClick={() => handleRailClick("Keyword Research")}
              title="Keyword Research Toolkit"
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeGroup === "Keyword Research" 
                  ? "bg-gray-900 text-white shadow-xs" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </button>

            {/* Content Ideas */}
            <button
              onClick={() => handleRailClick("Content Ideas")}
              title="SaaS Content Ideas & AI Copilot"
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeGroup === "Content Ideas" 
                  ? "bg-gray-900 text-white shadow-xs" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <FileEdit className="w-5 h-5" />
            </button>

            {/* Link Building */}
            <button
              onClick={() => handleRailClick("Link Building")}
              title="Backlinks & Link Spider"
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeGroup === "Link Building" 
                  ? "bg-gray-900 text-white shadow-xs" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Link2 className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* Administrative Bottom Icons */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          
          <button
            onClick={() => handleRailClick("Account")}
            title="SaaS Settings & Billing"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeGroup === "Account" 
                ? "bg-gray-900 text-white shadow-xs" 
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors mt-2"
            title={collapsed ? "Expand Accordion List" : "Collapse Accordion List"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* 2. DYNAMIC ACCORDION SUB-LIST COLUMN */}
      <div 
        className={`h-full bg-[#f4f6f8] flex flex-col justify-between overflow-hidden transition-all duration-300 border-r border-gray-100 ${
          collapsed ? "w-0" : "w-[210px]"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-5 select-none scrollbar-none">
          
          {/* SEO SECTION */}
          <div className="px-3 mb-5">
            <span className="text-[11px] font-bold text-gray-800 uppercase tracking-widest pl-3.5 block mb-1.5">SEO</span>
            <div className="space-y-0.5">
              {renderSubItem(ActiveView.Dashboard, "Dashboard")}
            </div>
          </div>

          {/* SITE PERFORMANCE */}
          <div className="px-3 mb-5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-3.5 block mb-1.5">Site Performance</span>
            <div className="space-y-0.5">
              {renderSubItem(ActiveView.SiteAudit, "Site Audit")}
              {renderSubItem(ActiveView.PositionTracking, "Position Tracking")}
            </div>
          </div>

          {/* COMPETITIVE ANALYSIS */}
          <div className="px-3 mb-5">
            <span className="text-[11px] font-bold text-gray-400 text-left uppercase tracking-widest pl-3.5 block mb-1.5">Competitive Analysis</span>
            <div className="space-y-0.5">
              {renderSubItem(ActiveView.DomainOverview, "Domain Overview")}
              {renderSubItem(ActiveView.OrganicRankings, "Organic Rankings")}
              {renderSubItem(ActiveView.TopPages, "Top Pages")}
              {renderSubItem(ActiveView.CompetitorComparison, "Compare Domains")}
              {renderSubItem(ActiveView.KeywordGap, "Keyword Gap")}
              {renderSubItem(ActiveView.BacklinkGap, "Backlink Gap")}
            </div>
          </div>

          {/* KEYWORD RESEARCH */}
          <div className="px-3 mb-5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-3.5 block mb-1.5">Keyword Research</span>
            <div className="space-y-0.5">
              {renderSubItem(ActiveView.KeywordOverview, "Keyword Overview")}
              {renderSubItem(ActiveView.KeywordMagicTool, "Keyword Magic Tool")}
            </div>
          </div>

          {/* CONTENT IDEAS */}
          <div className="px-3 mb-5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-3.5 block mb-1.5">Content Ideas</span>
            <div className="space-y-0.5">
              {renderSubItem(ActiveView.AiSnsTools, "SEO Writing Assistant")}
              {renderSubItem(ActiveView.TopicResearch, "Topic Research")}
              {renderSubItem(ActiveView.SeoContentTemplate, "SEO Content Template")}
            </div>
          </div>

          {/* LINK BUILDING */}
          <div className="px-3 mb-5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-3.5 block mb-1.5">Link Building</span>
            <div className="space-y-0.5">
              {renderSubItem(ActiveView.BacklinkAnalytics, "Backlink Analytics")}
              {renderSubItem(ActiveView.BacklinkAudit, "Backlink Audit")}
            </div>
          </div>

          {/* EXTRA REPORTS */}
          <div className="px-3 mb-5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-3.5 block mb-1.5">Reporting</span>
            <div className="space-y-0.5">
              {renderSubItem(ActiveView.ReportsBuilder, "PDF Reports Builder")}
              {renderSubItem(ActiveView.ProjectPlan, "SaaS Project Plan")}
              {renderSubItem(ActiveView.EnterpriseMonitor, "Enterprise Engine")}
            </div>
          </div>

        </div>

        {/* Dynamic Credit meter at the bottom */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50 text-xs">
          <div className="flex justify-between font-medium text-gray-500 mb-1">
            <span>Quota Credits</span>
            <span className="text-gray-900 font-bold">4,280 / 5,000</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-full rounded-full" style={{ width: "85.6%" }}></div>
          </div>
        </div>

      </div>

    </div>
  );
}
