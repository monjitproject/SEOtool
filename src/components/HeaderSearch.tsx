/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ActiveView } from "../types";
import { 
  Search, 
  LayoutDashboard, 
  SearchCode, 
  Layers, 
  Globe, 
  ChevronRight, 
  Activity, 
  Sparkles, 
  FileText, 
  Settings, 
  CreditCard,
  Map,
  Link2
} from "lucide-react";

interface SearchableItem {
  id: ActiveView;
  name: string;
  category: "SEO Analysis" | "Competitive" | "Reports & AI" | "Account";
  description: string;
  keywords: string[];
  icon: React.ReactNode;
}

interface HeaderSearchProps {
  onSelectView: (view: ActiveView) => void;
  activeView: ActiveView;
}

export default function HeaderSearch({ onSelectView, activeView }: HeaderSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchItems: SearchableItem[] = [
    {
      id: ActiveView.Dashboard,
      name: "Dashboard Overview",
      category: "SEO Analysis",
      description: "Aggregate rank index, active alerts, and project logs",
      keywords: ["main", "dashboard", "home", "index", "overview"],
      icon: <LayoutDashboard className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.SeoUrlSuite,
      name: "SEO URL Architecture",
      category: "SEO Analysis",
      description: "Manage clean URLs, sitemaps, robots.txt, schema, and redirects",
      keywords: ["url", "routing", "seo", "redirect", "sitemap", "robots", "schema", "architecture"],
      icon: <Link2 className="w-4 h-4 text-purple-500" />
    },
    {
      id: ActiveView.DomainOverview,
      name: "Domain Overview",
      category: "SEO Analysis",
      description: "Analyse traffic, backlinks, authority index of any domain",
      keywords: ["domain", "nike", "competitor", "traffic", "authority", "lookup"],
      icon: <Globe className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.KeywordResearch,
      name: "Keyword Research",
      category: "SEO Analysis",
      description: "Search search-volume, KD indexes, intent categorization",
      keywords: ["keyword", "research", "search", "terms", "volume", "cpc"],
      icon: <Search className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.KeywordOverview,
      name: "Keyword Overview",
      category: "SEO Analysis",
      description: "Detailed keyword CPC metrics and competition analysis",
      keywords: ["keywords", "overview", "intent", "cpc", "stats"],
      icon: <Layers className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.KeywordMagicTool,
      name: "Keyword Magic Tool",
      category: "SEO Analysis",
      description: "Generate thousands of semantic search variations",
      keywords: ["magic", "keywords", "generator", "ideas", "suggest"],
      icon: <Sparkles className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.KeywordGap,
      name: "Keyword Gap Tool",
      category: "SEO Analysis",
      description: "Compare domain gaps and reveal missing keywords",
      keywords: ["gap", "missing", "difference", "compare", "domain vs"],
      icon: <Layers className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.PositionTracking,
      name: "Position Tracking",
      category: "SEO Analysis",
      description: "Track Google organic ranks for target terms daily",
      keywords: ["position", "rank", "track", "monitoring", "movement"],
      icon: <Activity className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.CompetitorComparison,
      name: "Comparison Tool",
      category: "Competitive",
      description: "Overlapping keyword grids and visibility matchups",
      keywords: ["competitor", "vs", "comparison", "overlap", "matrix"],
      icon: <Layers className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.BacklinkAnalytics,
      name: "Backlink Analytics",
      category: "SEO Analysis",
      description: "Referring domains, anchor text, and trust flows",
      keywords: ["backlinks", "links", "referral", "anchor", "domains"],
      icon: <Link2 className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.BacklinkAudit,
      name: "Backlink Audit Tracker",
      category: "SEO Analysis",
      description: "Evaluate backlink profile toxic markers and health",
      keywords: ["spam", "toxic", "audit", "lost", "links health"],
      icon: <Link2 className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.SiteAudit,
      name: "Site Audit Crawler",
      category: "SEO Analysis",
      description: "Scan technical crawl errors, warnings, redirects",
      keywords: ["site", "crawl", "audit", "technical", "errors", "health"],
      icon: <SearchCode className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.AiSnsTools,
      name: "AI SEO Content Copilot",
      category: "Reports & AI",
      description: "Autogenerate meta tags, outlines, and semantic titles",
      keywords: ["ai", "copilot", "writer", "generate", "content", "meta"],
      icon: <Sparkles className="w-4 h-4 text-orange-500" />
    },
    {
      id: ActiveView.ReportsBuilder,
      name: "PDF Reports Builder",
      category: "Reports & AI",
      description: "Compile and schedule professional client-facing SEO reports",
      keywords: ["pdf", "report", "builder", "invoice", "schedule"],
      icon: <FileText className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.ProjectPlan,
      name: "Project Progress Roadmap",
      category: "Account",
      description: "Project phases, milestones, team action plans",
      keywords: ["roadmap", "progress", "tasks", "schedule", "plan"],
      icon: <Map className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.Settings,
      name: "Account Settings",
      category: "Account",
      description: "Configure profile credentials, api domains, and tokens",
      keywords: ["profile", "settings", "token", "keys", "config"],
      icon: <Settings className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.Billing,
      name: "Billing & Plans",
      category: "Account",
      description: "Review credit packages, subscription status, and tier limits",
      keywords: ["billing", "subscription", "price", "credit", "upgrade"],
      icon: <CreditCard className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.OrganicRankings,
      name: "Organic Rankings Index",
      category: "Competitive",
      description: "Search position metrics, track ranks and estimate traffic",
      keywords: ["organic", "rankings", "google position", "positions"],
      icon: <Activity className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.TopPages,
      name: "Top Landing Pages Tracker",
      category: "Competitive",
      description: "Scan traffic share and ranking keywords of URLs",
      keywords: ["top pages", "urls", "traffic share", "landing url"],
      icon: <Layers className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.BacklinkGap,
      name: "Backlink Gap Intelligence",
      category: "Competitive",
      description: "Identify backlink overlaps and referring domains",
      keywords: ["backlink gap", "referring gap", "referrals match"],
      icon: <Link2 className="w-4 h-4 text-slate-500" />
    },
    {
      id: ActiveView.TopicResearch,
      name: "Semantic Topic Explorer",
      category: "Reports & AI",
      description: "Discovers clustered ideas and search user questions",
      keywords: ["topic", "research", "clusters", "questions"],
      icon: <Sparkles className="w-4 h-4 text-orange-500" />
    },
    {
      id: ActiveView.SeoContentTemplate,
      name: "SEO Content templates blueprint",
      category: "Reports & AI",
      description: "Generate structural brief blueprints for content writers",
      keywords: ["brief", "templates", "outline", "content strategy"],
      icon: <FileText className="w-4 h-4 text-slate-500" />
    }
  ];

  // Global hotkey Ctrl+K / Cmd+K to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter items
  const filteredItems = query.trim() === "" 
    ? searchItems.slice(0, 5) // Show popular items initially
    : searchItems.filter(item => {
        const q = query.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some(tag => tag.toLowerCase().includes(q))
        );
      });

  // Handle outside clicks to close overlay
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation inside options list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectView(filteredItems[selectedIndex].id);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectView = (viewId: ActiveView) => {
    onSelectView(viewId);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md select-none font-sans">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for tools, features or commands... (⌘K)"
          className="w-full pl-10 pr-16 py-2 bg-gray-50 hover:bg-gray-100/70 border border-gray-200 focus:border-purple-500 focus:bg-white rounded text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
        
        {/* Cmd/Ctrl + K UI Badge */}
        <div className="absolute right-3 top-2.5 hidden sm:flex items-center gap-0.5 bg-gray-250 border border-gray-200 text-gray-400 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm select-none pointer-events-none">
          <span className="text-[11px]">⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Autocomplete Results Overlay */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded shadow-xl z-50 overflow-hidden max-h-96 flex flex-col mt-0.5 animate-in fade-in duration-100">
          
          <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 flex justify-between items-center">
            <span>{query.trim() === "" ? "QUICK RECENT LAUNCHERS" : `SEARCH MATCHES (${filteredItems.length})`}</span>
            <span className="text-[9px] font-normal tracking-normal capitalize font-sans">Use ↑↓ keys to navigate</span>
          </div>

          <div className="overflow-y-auto divide-y divide-gray-50 flex-1">
            {filteredItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                <p className="font-semibold text-gray-500 mb-1">No matching tools found</p>
                <p className="text-[11px]">Try searching "domain", "keywords", "backlinks" or "audit"</p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const isActive = item.id === activeView;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectView(item.id)}
                    className={`w-full text-left p-3 flex gap-3 transition-colors ${
                      isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`p-2 rounded flex-shrink-0 flex items-center justify-center ${
                      isSelected ? "bg-white text-purple-600 shadow-xs" : isActive ? "bg-purple-50 text-purple-600" : "bg-gray-100"
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-900 truncate">
                          {item.name}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded-sm">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="bg-gray-50 p-2 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between items-center px-4">
            <span>Press <kbd className="font-mono bg-white px-1 border rounded-sm">Enter</kbd> to jump</span>
            <span>SEO Architect Suite</span>
          </div>

        </div>
      )}
    </div>
  );
}
