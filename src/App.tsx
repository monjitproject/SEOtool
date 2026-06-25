/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ActiveView } from "./types";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import KeywordResearchView from "./components/KeywordResearchView";
import KeywordOverviewView from "./components/KeywordOverviewView";
import DomainOverviewView from "./components/DomainOverviewView";
import CompetitorComparisonView from "./components/CompetitorComparisonView";
import BacklinkAnalyticsView from "./components/BacklinkAnalyticsView";
import SiteAuditView from "./components/SiteAuditView";
import PositionTrackingView from "./components/PositionTrackingView";
import AiToolsView from "./components/AiToolsView";
import ReportsBuilderView from "./components/ReportsBuilderView";
import BillingView from "./components/BillingView";
import SettingsView from "./components/SettingsView";
import ProjectPlanView from "./components/ProjectPlanView";
import EnterpriseMonitorView from "./components/EnterpriseMonitorView";
import SeoUrlSuiteView from "./components/SeoUrlSuiteView";
import PublisherCenterView from "./components/PublisherCenterView";
import HeaderSearch from "./components/HeaderSearch";
import ToastContainer from "./components/ToastContainer";
import { 
  OrganicRankingsView, 
  TopPagesView, 
  BacklinkGapView, 
  TopicResearchView, 
  SeoContentTemplateView 
} from "./components/ExtraSeoViews";
import { Sparkles, Globe, Key, Link2, ShieldCheck, Menu } from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Dashboard);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Quick jump callback: e.g. clicking "Compare" jumps to CompetitorComparison
  const handleDomainOverviewCompare = (domain: string) => {
    setActiveView(ActiveView.CompetitorComparison);
  };

  // Rendering selector
  const renderActiveViewContent = () => {
    switch (activeView) {
      case ActiveView.Dashboard:
        return (
          <DashboardView 
            setActiveView={setActiveView}
            onSearchDomain={handleDomainOverviewCompare}
          />
        );
      
      // SEO
      case ActiveView.KeywordResearch:
        // Render keyword analyzer overview section
        return <KeywordResearchView initialKeyword="saas analytics" />;

      case ActiveView.KeywordOverview:
        return <KeywordOverviewView />;

      case ActiveView.KeywordMagicTool:
        // Pre-mounted with magic tool tab filter focus
        return <KeywordResearchView initialKeyword="free fire" defaultTab="magic-tool" />;

      case ActiveView.KeywordGap:
        // Pre-mounted with gap tab filter focus
        return <KeywordResearchView initialKeyword="SEOtool.com vs semrush.com" />;

      case ActiveView.PositionTracking:
        return <PositionTrackingView />;

      // Competitors
      case ActiveView.DomainOverview:
        return (
          <DomainOverviewView 
            initialDomain="SEOtool.com" 
            onCompareRequest={handleDomainOverviewCompare} 
          />
        );

      case ActiveView.CompetitorComparison:
        return <CompetitorComparisonView defaultDomain="SEOtool.com" />;

      case ActiveView.OrganicRankings:
        return <OrganicRankingsView />;

      case ActiveView.TopPages:
        return <TopPagesView />;

      case ActiveView.BacklinkGap:
        return <BacklinkGapView />;

      // Backlinks
      case ActiveView.BacklinkAnalytics:
      case ActiveView.BacklinkAudit:
      case ActiveView.LinkBuilding:
        return <BacklinkAnalyticsView initialDomain="SEOtool.com" />;

      // General Tools
      case ActiveView.SiteAudit:
        return <SiteAuditView initialDomain="SEOtool.com" />;

      case ActiveView.AiSnsTools:
        return <AiToolsView />;

      case ActiveView.TopicResearch:
        return <TopicResearchView />;

      case ActiveView.SeoContentTemplate:
        return <SeoContentTemplateView />;

      case ActiveView.ReportsBuilder:
        return <ReportsBuilderView />;

      case ActiveView.Billing:
        return <BillingView />;

      case ActiveView.Settings:
        return <SettingsView />;

      case ActiveView.ProjectPlan:
        return <ProjectPlanView />;

      case ActiveView.EnterpriseMonitor:
        return <EnterpriseMonitorView />;

      case ActiveView.SeoUrlSuite:
        return <SeoUrlSuiteView />;

      case ActiveView.PublisherCenter:
        return <PublisherCenterView />;

      default:
        return (
          <DashboardView 
            setActiveView={setActiveView}
            onSearchDomain={handleDomainOverviewCompare}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9fafb] font-sans text-[#111827]">
      
      {/*Collapsible Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Workspace Frame container */}
      <div className="flex-1 flex flex-col h-full bg-[#f9fafb] overflow-hidden">
        
        {/* Top bar (Invisible or compact helper header) */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 print:hidden select-none shadow-xs gap-4 animate-in fade-in duration-300">
          
          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">WORKSPACE STATE:</span>
              <span className="bg-purple-600/80 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide">
                {activeView.replace("-", " ")}
              </span>
            </div>

            <HeaderSearch onSelectView={setActiveView} activeView={activeView} />
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 border-r pr-4 border-gray-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-[10px] italic">US</div>
              <span className="text-xs font-semibold text-gray-505">United States</span>
            </div>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure Session
            </span>
          </div>
        </header>

        {/* Dynamic content scroll frame area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-thin print:p-0">
          <div className="max-w-7xl mx-auto h-full">
            {renderActiveViewContent()}
          </div>
        </main>

      </div>

      <ToastContainer />
    </div>
  );
}
