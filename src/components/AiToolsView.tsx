/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { toast } from "../lib/toast";
import { 
  Sparkles, 
  FileText, 
  Search, 
  Layers, 
  RefreshCw, 
  Clipboard, 
  Check, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

type AiAction = "article" | "title" | "description" | "brief" | "cluster";

export default function AiToolsView() {
  const [activeAction, setActiveAction] = useState<AiAction>("article");
  const [keywordInput, setKeywordInput] = useState("leather shoes");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [outputResult, setOutputResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false);

  // Available Tools
  const tools = [
    { id: "article" as AiAction, label: "AI Article Writer", desc: "Generates outline + complete draft content naturally weaving keywords" },
    { id: "brief" as AiAction, label: "Content Brief Creator", desc: "Analyzes target intent & recommends precise heading architectures" },
    { id: "title" as AiAction, label: "Title Tag Suggested", desc: "Suggests 5 clickable, high CTR titles kept under 60 character boundaries" },
    { id: "description" as AiAction, label: "Meta Descriptions Engine", desc: "Drafts persuasive description tags including direct call-to-actions" },
    { id: "cluster" as AiAction, label: "Topical Keywords Cluster", desc: "Organizes random raw arrays of terms into logical hub-and-spoke rings" }
  ];

  const handleGenerate = async () => {
    if (!keywordInput.trim()) {
      toast.warning("Empty Input: Please specify a focus target keyword or text list.");
      return;
    }
    
    setLoading(true);
    setOutputResult("");
    setIsSimulation(false);

    try {
      const res = await fetch("/api/ai/seo-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: activeAction,
          keyword: keywordInput,
          options: {
            country: "US",
            instructions: additionalInstructions
          }
        })
      });

      if (!res.ok) {
        throw new Error("Local Express AI channel timed out or failed.");
      }

      const payload = await res.json();
      setOutputResult(payload.text);
      setIsSimulation(payload.isMocked);
    } catch (err: any) {
      console.error(err);
      setOutputResult("Verification warning: Workspace Express backend is timed out or unavailable. Running in local fallback preview mode...");
      setIsSimulation(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Crude simple markdown parsing directly into pretty styled JSX
  const renderFormattedBlocks = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith("###")) {
        return <h4 key={idx} className="text-sm font-bold text-gray-900 mt-4 mb-2">{trimmed.replace("###", "")}</h4>;
      }
      if (trimmed.startsWith("##")) {
        return <h3 key={idx} className="text-base font-extrabold text-gray-950 mt-5 border-b pb-1.5 border-slate-100">{trimmed.replace("##", "")}</h3>;
      }
      if (trimmed.startsWith("#")) {
        return <h2 key={idx} className="text-lg font-black text-gray-950 mt-6 mb-3">{trimmed.replace("#", "")}</h2>;
      }
      
      // Bullets
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return <li key={idx} className="ml-5 text-xs text-gray-700 list-disc leading-relaxed mt-1">{trimmed.substring(1).trim()}</li>;
      }

      // Numbers
      if (/^\d+\./.test(trimmed)) {
        return <p key={idx} className="ml-5 text-xs text-gray-750 font-semibold leading-relaxed mt-1.5">{trimmed}</p>;
      }

      if (trimmed === "") {
        return <div key={idx} className="h-2"></div>;
      }

      // Ordinary paragraphs
      return <p key={idx} className="text-xs text-gray-650 leading-relaxed mt-2 text-left">{trimmed}</p>;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" /> Gemini AI SEO Content Studio
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Compose search optimized outline briefs, cluster raw keywords, or write entire draft segments powered server-side by Gemini 3.5 Flash
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Parameters Form and Tools selector */}
        <div className="lg:col-span-5 space-y-4 text-left">
          
          {/* Tool card selector */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Select Target Writing Tool</span>
            
            <div className="space-y-2">
              {tools.map((t) => {
                const active = activeAction === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveAction(t.id);
                      // Update default search value depending on selected tool
                      if (t.id === "cluster") setKeywordInput("shoes discount, running sneakers cheap, leather loafers buy, orthopedic boots");
                      else setKeywordInput("leather shoes");
                    }}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      active 
                        ? "border-purple-500 bg-purple-50/20 shadow-sm" 
                        : "border-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <span className={`text-xs font-bold block ${active ? "text-purple-600" : "text-gray-800"}`}>{t.label}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5 leading-snug">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt card inputs */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
            
            {/* Primary input term */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                {activeAction === "cluster" ? "Keywords Array list (separated by comma)" : "Primary Target Keyword"}
              </label>
              <textarea 
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                rows={activeAction === "cluster" ? 4 : 2}
                placeholder={activeAction === "cluster" ? "e.g. running shoe store, buy black sneakers..." : "e.g. shoes sale online..."}
                className="w-full bg-white border border-gray-205 p-3 text-xs font-semibold text-gray-700 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-colors resize-none"
              />
            </div>

            {/* In-Audience instruction */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Additional Instructions (Optional)</label>
              <input 
                type="text" 
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading && keywordInput.trim()) {
                    handleGenerate();
                  }
                }}
                placeholder="e.g. write in persuasive tone, mention free shipping..."
                className="w-full bg-white border border-gray-205 py-2 px-3 text-xs font-semibold text-gray-700 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:from-purple-700 hover:via-pink-600 hover:to-blue-600 disabled:opacity-55 text-sm text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/15"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" /> Concocting SEO Copy...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Synthesize Copy Assets
                </>
              )}
            </button>

          </div>

        </div>

        {/* Right Side: Markdown output panel */}
        <div className="lg:col-span-7 text-left space-y-4">
          
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm min-h-[420px] flex flex-col justify-between">
            
            {/* Output header bar */}
            <div>
              <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-50">
                <div>
                  <span className="text-xs font-bold text-gray-900 block flex items-center gap-1">
                    <FileText className="w-4 h-4 text-purple-500" /> Dynamic Output Canvas
                  </span>
                  <span className="text-[10px] text-gray-400">Response output generated server-side</span>
                </div>
                
                {outputResult && (
                  <button 
                    onClick={handleCopy}
                    className="p-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-md transition-all text-xs text-gray-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-3.5 h-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* OUTPUT DISPLAY */}
              {loading ? (
                <div className="py-24 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                  <p className="text-xs text-gray-400 font-semibold">Gemini 3.5 Flash is analyzing your metrics and keying details...</p>
                </div>
              ) : outputResult ? (
                <div className="font-sans px-1 overflow-y-auto max-h-[480px] scrollbar-thin">
                  {renderFormattedBlocks(outputResult)}
                </div>
              ) : (
                <div className="py-28 text-center text-gray-400 space-y-3">
                  <Sparkles className="w-10 h-10 text-slate-100 mx-auto" />
                  <h4 className="text-xs font-bold text-gray-500">Workspace Output is Empty</h4>
                  <p className="text-[11px] text-gray-450 max-w-xs mx-auto leading-relaxed">
                    Choose an SEO copy tool, specify your target focus phrase on the left dashboard form, and press "Synthesize Copy Assets" to invoke AI logic!
                  </p>
                </div>
              )}
            </div>

            {/* Reminder overlay box about GEMINI_API_KEY status */}
            {outputResult && !loading && (
              <div className="mt-6 p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2.5 text-[11px]">
                <HelpCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                <div className="text-gray-500">
                  {isSimulation ? (
                    <span>
                      Operating in <span className="text-emerald-600 font-bold">Stable Sandbox Simulation</span> mode. To hook real Gemini LLM outputs, set up your unique <span className="font-mono text-gray-700 bg-slate-100 px-1 py-0.5 rounded">GEMINI_API_KEY</span> in the Secrets panel!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Connected to live Gemini 3.5 Flash engine! Real-time responses are fully active.
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
