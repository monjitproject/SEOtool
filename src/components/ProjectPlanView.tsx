/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { toast } from "../lib/toast";
import { 
  FileText, 
  Layers, 
  Database, 
  MapPin, 
  Flame, 
  TrendingUp, 
  Compass, 
  Cpu
} from "lucide-react";

export default function ProjectPlanView() {
  const sections = [
    {
      title: "Core SaaS Module Architecture",
      icon: <Layers className="w-5 h-5 text-[#ff642d]" />,
      desc: "Comprehensive features mapping Semrush and Ahrefs workspaces",
      points: [
        "Dashboard Overview (Crawl counts, health meters, search CTR, backlinks summaries)",
        "Keyword Research (Aggregates average volume indices, country tags, CPC, KD metric systems)",
        "Keyword Magic Tool (Database query matching filters, KD sliders, questions only checkboxes)",
        "Domain Audience (Authority scores, high-performing organic URL tables, competitor lists)",
        "Competitor Research Comparison (Multi-site stack metrics overlays, overlap checklists)",
        "Backlink Audit Analytics (Follow/Nofollow attribute classifications, spider detection anchors)",
        "Site Audit Scanner (Health gauge rings, category errors/warnings/notices diagnostics checks)",
        "Position Tracker (Localized mobile vs desktop crawler tracking, visual Sparklines ranking paths)",
        "Gemini SEO Content Studio (AI Blog drafts builder, keywords clustering organization trees)"
      ]
    },
    {
      title: "Design System Guidelines",
      icon: <Flame className="w-5 h-5 text-[#ff642d]" />,
      desc: "Pixel perfect brand guidelines similar to Semrush",
      points: [
        "Typography: Inter Display typeface pairing for titles with JetBrains Mono data codes",
        "Palette: Semrush premium styling (#ff642d energetic orange, #111827 deep onyx secondary, pristine whites)",
        "Cards layout: Fluid padding with very subtle contrast borders, removing messy dark-mode gradients",
        "Feedback micro-animations: Hover triggers, responsive select options, processing loaders"
      ]
    },
    {
      title: "Relational Database Schema (planned)",
      icon: <Database className="w-5 h-5 text-[#ff642d]" />,
      desc: "High-scalability relational PostgreSQL blueprints",
      points: [
        "Users & Subscriptions (Credentials, team seats metadata, active checkout plan identifiers)",
        "Keyword Projects (Primary tracked target keywords, localize cities, device crawled types)",
        "Backlink Spider Indexes (Referrer authority weights, anchor string arrays, Attribute classifications)",
        "Crawl Checks Logs (Scan sitemaps sitemaps, failed items, category tags, site health indices)"
      ]
    },
    {
      title: "Development Roadmap milestones",
      icon: <TrendingUp className="w-5 h-5 text-[#ff642d]" />,
      desc: "Structured delivery phases towards enterprise production launches",
      points: [
        "Phase 1: Project architectural designs and high-fidelity wireframing layout structure (COMPLETE)",
        "Phase 2: Full functional front-end component coding + local seed data simulator setups (COMPLETE)",
        "Phase 3: Deep server-side integrations (Vite Express + Google GenAI Live models, secure cookie checks) (COMPLETE)",
        "Phase 4: Database schemas migrations and JWT security logins hookups (UPCOMING)",
        "Phase 5: Payments gateways Stripe integrations and SaaS billing automated checkout tests (UPCOMING)"
      ]
    }
  ];

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec, idx) => {
      sec.points.forEach((pt, pIdx) => {
        if (pt.includes("(COMPLETE)")) {
          initial[`${idx}-${pIdx}`] = true;
        }
      });
    });
    return initial;
  });

  const toggleItem = (secIdx: number, ptIdx: number, text: string) => {
    const key = `${secIdx}-${ptIdx}`;
    setCompletedItems(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key]) {
        toast.success(`Milestone completed: "${text.replace(" (COMPLETE)", "")}"`);
      } else {
        toast.info(`Milestone set to pending: "${text.replace(" (COMPLETE)", "")}"`);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#ff642d]" /> SuiteRank Master Project Plan
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Review architecture specifications, design systems guides, database schemas and development milestones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm text-left space-y-4">
            
            <div className="flex gap-2.5 items-center pb-3 border-b border-gray-50">
              <div className="p-2 bg-orange-50 rounded-lg">{sec.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{sec.title}</h3>
                <p className="text-[10px] text-gray-405 font-medium">{sec.desc}</p>
              </div>
            </div>

            <ul className="space-y-2.5 font-sans">
              {sec.points.map((pt, pIdx) => {
                const isDone = !!completedItems[`${idx}-${pIdx}`];
                return (
                  <li 
                    key={pIdx} 
                    onClick={() => toggleItem(idx, pIdx, pt)}
                    className="flex gap-2.5 items-start text-xs leading-relaxed group cursor-pointer select-none"
                  >
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                      isDone 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-gray-300 group-hover:border-[#ff642d] bg-white"
                    }`}>
                      {isDone && <span className="text-[10px] font-black leading-none">✓</span>}
                    </span>
                    <span className={`transition-all duration-150 ${
                      isDone ? "line-through text-gray-400" : "text-gray-650 group-hover:text-gray-900"
                    }`}>
                      {pt}
                    </span>
                  </li>
                );
              })}
            </ul>

          </div>
        ))}
      </div>

      {/* Warning block */}
      <div className="bg-slate-900 text-white p-5 rounded-xl text-left flex gap-3 items-start max-w-xl">
        <Cpu className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0 animate-pulse" />
        <div>
          <h4 className="text-xs font-bold text-orange-400">Architect Technical Note</h4>
          <p className="text-[11px] text-gray-350 mt-1 leading-relaxed">
            The platform's frontend routes, state variables and server side AI controllers are fully complete! This master blueprint guides database migration structures when transitioning code layouts into production servers.
          </p>
        </div>
      </div>

    </div>
  );
}
