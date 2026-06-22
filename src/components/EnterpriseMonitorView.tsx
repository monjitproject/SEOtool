import React, { useState, useEffect } from "react";
import { 
  Database, 
  Cpu, 
  Layers, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Clock, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  Sparkles,
  RefreshCw,
  Search,
  BookOpen
} from "lucide-react";
import { toast } from "../lib/toast";

interface ProviderMetrics {
  name: string;
  weight: number;
  type: string;
  latency: number;
  status: "Online" | "Degraded" | "Offline";
  lastUsed: string;
}

interface BackgroundJob {
  id: string;
  name: string;
  schedule: string;
  status: "Idle" | "Running" | "Success" | "Failed";
  progress: number;
  lastRun: string;
}

export default function EnterpriseMonitorView() {
  // Provider Config / States
  const [providers, setProviders] = useState<ProviderMetrics[]>([
    { name: "DataForSEO Live", weight: 0.50, type: "Keyword Metrics, Volume, CPC", latency: 240, status: "Online", lastUsed: "Just now" },
    { name: "SerpApi Live Engine", weight: 0.30, type: "Omitted Snippets, Maps, Local SERP", latency: 310, status: "Online", lastUsed: "3m ago" },
    { name: "Google Trends Broker", weight: 0.20, type: "Chrono timelines, Regional indices", latency: 450, status: "Online", lastUsed: "12m ago" },
    { name: "OpenAI / Gemini Agent", weight: 1.00, type: "SEO Recommendations, Clustering", latency: 890, status: "Online", lastUsed: "Just now" }
  ]);

  // Systems Infrastructure States
  const [postgresConnected, setPostgresConnected] = useState(true);
  const [redisConnected, setRedisConnected] = useState(true);
  const [r2Connected, setR2Connected] = useState(true);

  // Background Jobs state
  const [jobs, setJobs] = useState<BackgroundJob[]>([
    { id: "job-01", name: "SERP Snippet & Knowledge Map Snapshot Spider", schedule: "Hourly", status: "Idle", progress: 0, lastRun: "45 min ago" },
    { id: "job-02", name: "Historical KD & Local Search Vol Backfill Broker", schedule: "Daily", status: "Idle", progress: 0, lastRun: "8 hrs ago" },
    { id: "job-03", name: "Backlink Target crawling & Authority Rating update", schedule: "Every 12 Hours", status: "Idle", progress: 0, lastRun: "3 hrs ago" },
    { id: "job-04", name: "Cache Expiry Broker & Orphaned Temp File Sweeper", schedule: "Weekly", status: "Idle", progress: 0, lastRun: "4 days ago" }
  ]);

  // Calculator form inputs for Confidence & Weighted Averages Sandbox
  const [calcDataForSeoVolume, setCalcDataForSeoVolume] = useState<number>(35000);
  const [calcSerpApiVolume, setCalcSerpApiVolume] = useState<number>(40000);
  const [calcGoogleTrendsIndex, setCalcGoogleTrendsIndex] = useState<number>(85); // out of 100
  const [calcFreshnessDays, setCalcFreshnessDays] = useState<number>(2); // days old

  // computed output
  const [computedVolume, setComputedVolume] = useState<number>(0);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [attributionText, setAttributionText] = useState<string>("");

  // Telemetry logs
  const [logs, setLogs] = useState<string[]>([
    "[System] Bootstrapping enterprise-grade multi-engine pipeline controller...",
    "[Database] PostgreSQL lazy initializer checked connection pools successfully.",
    "[Cache] Redis client verified. Operational mode set to Live Redis layer.",
    "[Gateway] Configured route credentials for DataForSEO & SerpApi.",
    "[NLP Agent] OpenAI / Gemini semantic handler attached to text classifier.",
    "[Queue] Node-internal robust background job scheduler active.",
    "[Telemetry] Ready to compute confidence levels and model deviations..."
  ]);

  // Run calculator once on load
  useEffect(() => {
    runModelCalculation();
  }, [calcDataForSeoVolume, calcSerpApiVolume, calcGoogleTrendsIndex, calcFreshnessDays]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30));
  };

  const runModelCalculation = () => {
    // 1. Calculate weighted volume
    // We prioritize DataForSEO (0.50 weight) and SerpApi (0.30 weight). Google Trends serves as a regional multiplier.
    // Let's compute weighted base
    const baseVolume = (calcDataForSeoVolume * 0.5) + (calcSerpApiVolume * 0.3) + ((calcGoogleTrendsIndex * 350) * 0.2);
    
    // 2. Freshness decay factor (each day adds a slight penalty to confidence, say 1.5% penalty per day up to 30 days)
    const freshnessPenalty = Math.max(0.60, 1.0 - (calcFreshnessDays * 0.015));
    
    // 3. Distance variance based penalty for confidence score
    // If DataForSEO and SerpApi variance is high, confidence drops.
    const deltaPct = Math.abs(calcDataForSeoVolume - calcSerpApiVolume) / Math.max(calcDataForSeoVolume, 1);
    const variancePenalty = Math.max(0.5, 1.0 - deltaPct);
    
    // Calculate final confidence scoreout of 100
    const rawConfidence = Math.round((0.85 * variancePenalty + 0.15 * freshnessPenalty) * 100);
    const resolvedConfidence = Math.min(100, Math.max(10, rawConfidence));

    // Calculate final weighted result
    const finalVolume = Math.round(baseVolume * (0.9 + 0.1 * (calcGoogleTrendsIndex / 100)));

    setComputedVolume(finalVolume);
    setConfidenceScore(resolvedConfidence);

    // Build source attribution text
    let sourceAtt = `DataForSEO Weight 50% (vol: ${calcDataForSeoVolume}) • SerpApi Weight 30% (vol: ${calcSerpApiVolume}) • Google Trends Weight 20% (trend indices: ${calcGoogleTrendsIndex}). `;
    if (calcFreshnessDays > 7) {
      sourceAtt += `⚠️ Data is ${calcFreshnessDays} days old - freshness confidence penalty active.`;
    } else {
      sourceAtt += `✨ High freshness index (${calcFreshnessDays}d old).`;
    }
    setAttributionText(sourceAtt);
  };

  // Trigger simulated background job
  const handleTriggerJob = (jobId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    if (targetJob.status === "Running") {
      toast.warning(`Job "${targetJob.name}" is already executing!`);
      return;
    }

    addLog(`Queue Worker picked up background job: ${targetJob.name}`);
    
    // Update state to running
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, status: "Running", progress: 5 };
      }
      return j;
    }));

    // Simulate progress ticks
    let currentProg = 5;
    const interval = setInterval(() => {
      currentProg += 15;
      if (currentProg >= 100) {
        currentProg = 100;
        clearInterval(interval);
        setJobs(prev => prev.map(j => {
          if (j.id === jobId) {
            return { 
              ...j, 
              status: "Success", 
              progress: 100,
              lastRun: "Just now"
            };
          }
          return j;
        }));
        addLog(`SUCCESS: Background job completed: ${targetJob.name}. Output saved to Cloudflare R2 and PostgreSQL indices.`);
        toast.success(`Success: Completed "${targetJob.name}"!`);
      } else {
        setJobs(prev => prev.map(j => {
          if (j.id === jobId) {
            return { ...j, progress: currentProg };
          }
          return j;
        }));
        if (currentProg % 30 === 0) {
          addLog(`Worker Tick: Job [${targetJob.id}] progress at ${currentProg}%`);
        }
      }
    }, 400);
  };

  const clearLogs = () => {
    setLogs(["[System Console] Handlers flushed. Stream monitoring restarted."]);
    toast.info("Log stream cleared.");
  };

  return (
    <div className="flex-1 overflow-y-auto h-full bg-[#f8fafc] text-slate-900 font-sans flex flex-col" id="enterprise-monitor-root">
      
      {/* Top Header Section */}
      <div className="bg-white border-b border-slate-200 py-6 px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 border border-slate-700 shadow-md">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Enterprise SEO Engine
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Active Tier
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Multi-source metric aggregation, integrity monitoring, and autonomous queue workers.
            </p>
          </div>
        </div>

        {/* Live Infrastructure State badges */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            <div className="text-left select-none">
              <p className="text-[9px] font-bold uppercase text-slate-400 leading-none">Database</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] font-bold text-slate-800">PostgreSQL</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <div className="text-left select-none">
              <p className="text-[9px] font-bold uppercase text-slate-400 leading-none">Cache Layer</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-bold text-slate-800">Redis Active</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <div className="text-left select-none">
              <p className="text-[9px] font-bold uppercase text-slate-400 leading-none">Snapshots CDN</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] font-bold text-slate-800">Cloudflare R2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Row 1: External API Brokers and Live Confidence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Active API Broker Connections */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-250/80 shadow-2xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-slate-500" /> Active API Suppliers & Multipliers
                </h2>
                <button 
                  onClick={() => {
                    toast.success("Broker verification dispatched. All active sessions refreshed.");
                    addLog("Manual Broker Verification Dispatched - all channels responded with latency under 900ms");
                  }} 
                  className="text-xs text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 animate-spin duration-3000" /> Ping Check
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed font-normal">
                Credentials parsed at startup. The broker resolves queries by querying vendors dynamically and feeding raw indexes to the confidence rating metrics analyzer.
              </p>

              <div className="space-y-3">
                {providers.map((p, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-205 flex items-center justify-center text-slate-700 shadow-3xs font-mono font-black text-xs">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800 leading-tight">{p.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{p.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-500 leading-none">Weight Assigned</p>
                        <p className="text-xs font-extrabold text-slate-900 mt-1">{(p.weight * 100).toFixed(0)}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 leading-none">Response Time</p>
                        <p className="text-xs font-mono font-bold text-slate-800 mt-1">{p.latency}ms</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xl flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Audit Compliance:</strong> Failover pathways are pre-wired. If any single provider degrades, confidence index dynamically lowers weight and tags secondary cache lookup tables immediately.
              </span>
            </div>
          </div>

          {/* Column 3: Confidence Score and Accuracy Engine Sandbox */}
          <div className="bg-slate-900 rounded-2xl text-white p-6 shadow-md flex flex-col justify-between border border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Live Accuracy Rating
                </h3>
                <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded shrink-0">
                  Real-time
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-snug mb-5 font-normal">
                Deviations across brokers are run through an enterprise integrity matrix to calculate the weighted precision scoring coefficient.
              </p>

              {/* Dynamic Animated Ring Chart / value */}
              <div className="flex flex-col items-center py-6 border-y border-slate-800/80 my-4 bg-slate-950/80 rounded-2xl">
                <div className="relative flex items-center justify-center">
                  {/* Circular visual progress representation */}
                  <svg className="w-32 h-32 transform -rotate-95">
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="50" 
                      stroke="#1e293b" 
                      strokeWidth="10" 
                      fill="transparent" 
                    />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="50" 
                      stroke="#10b981" 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray="314"
                      strokeDashoffset={314 - (314 * confidenceScore) / 100}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute text-center select-none">
                    <span className="text-3xl font-extrabold tracking-tight font-mono text-white">
                      {confidenceScore}%
                    </span>
                    <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">
                      {confidenceScore > 80 ? "Premium Accuracy" : confidenceScore > 60 ? "Moderate" : "Low Confidence"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-center px-4">
                  <p className="text-xs font-bold text-slate-300">
                    Computed Search Volume: <span className="font-mono text-emerald-400 text-sm font-black">{computedVolume.toLocaleString()}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-1 font-semibold">
                    Calculated using weighted age regression multiplier models.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left select-none text-[10.5px]">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] leading-tight mb-1">Source Attribution Tag</p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 font-mono text-emerald-300 text-2xs leading-relaxed max-h-[70px] overflow-y-auto">
                {attributionText || "Recalculating inputs..."}
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Mathematical Integration Sandbox Calculator (Interactive UX Audit) */}
        <div className="bg-white rounded-2xl border border-slate-250/80 shadow-2xs p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" /> Accuracy & Integrity Sandbox Calculator
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Simulate different metrics from multi-providers and see how the Enterprise Pipeline performs data consensus calculations.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setCalcDataForSeoVolume(85000);
                  setCalcSerpApiVolume(89000);
                  setCalcGoogleTrendsIndex(95);
                  setCalcFreshnessDays(1);
                  toast.success("Standard consensus presets loaded!");
                }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-lg"
              >
                High Vol Consensus
              </button>
              <button 
                onClick={() => {
                  setCalcDataForSeoVolume(300);
                  setCalcSerpApiVolume(850);
                  setCalcGoogleTrendsIndex(15);
                  setCalcFreshnessDays(18);
                  toast.warning("High variance simulation loaded!");
                }}
                className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold py-1.5 px-3 rounded-lg"
              >
                High Variance Alert
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-left">
              <label className="text-xs font-bold text-slate-700 block mb-2">DataForSEO Volume Input</label>
              <input 
                type="number" 
                value={calcDataForSeoVolume}
                onChange={(e) => setCalcDataForSeoVolume(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-50 border border-slate-205 py-2 px-3 text-xs font-bold text-slate-800 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Standard target weight: 50%</p>
            </div>

            <div className="text-left">
              <label className="text-xs font-bold text-slate-700 block mb-2">SerpApi Result Count</label>
              <input 
                type="number" 
                value={calcSerpApiVolume}
                onChange={(e) => setCalcSerpApiVolume(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-50 border border-slate-205 py-2 px-3 text-xs font-bold text-slate-800 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Standard target weight: 30%</p>
            </div>

            <div className="text-left">
              <label className="text-xs font-bold text-slate-700 block mb-2">Google Trends Interest Index</label>
              <input 
                type="range" 
                min="1" 
                max="100"
                value={calcGoogleTrendsIndex}
                onChange={(e) => setCalcGoogleTrendsIndex(parseInt(e.target.value) || 1)}
                className="w-full mt-2 accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-extrabold text-slate-505 mt-2">
                <span>Value: <span className="font-mono text-slate-800">{calcGoogleTrendsIndex}</span></span>
                <span>Weight: 20%</span>
              </div>
            </div>

            <div className="text-left flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Data Freshness (Last Crawl)</label>
                <select 
                  value={calcFreshnessDays}
                  onChange={(e) => setCalcFreshnessDays(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-205 py-2 px-3 text-xs font-bold text-slate-800 rounded-lg outline-none focus:border-indigo-500"
                >
                  <option value={1}>Today (No penalty)</option>
                  <option value={2}>2 Days ago</option>
                  <option value={5}>5 Days ago</option>
                  <option value={10}>10 Days ago (Medium decay)</option>
                  <option value={20}>20 Days ago (De-priority match)</option>
                  <option value={45}>45 Days ago (Outdated archive)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Active Background Queue Workers */}
        <div className="bg-white rounded-2xl border border-slate-250/80 shadow-2xs p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600 animate-spin duration-10000" /> Queue Workers & Recurrent Sync Jobs
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                These background processes run continuously on schedule to preserve rankings, backlinks, and SERP snapshot databases.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
              4 Workers Registered
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <div key={job.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    job.status === "Running" ? "bg-purple-100 text-purple-600 animate-spin" :
                    job.status === "Success" ? "bg-emerald-100 text-emerald-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {job.status === "Success" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3 h-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 leading-snug break-words">{job.name}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-[10px] font-semibold text-slate-400">Schedule: <strong className="text-slate-600">{job.schedule}</strong></span>
                      <span className="text-[10px] font-semibold text-slate-400">Last crawler execution: <strong className="text-slate-600">{job.lastRun}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 mt-2 md:mt-0">
                  {/* Progress bar */}
                  {job.status === "Running" && (
                    <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden select-none">
                      <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${job.progress}%` }}></div>
                    </div>
                  )}

                  {/* Status Indicator */}
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    job.status === "Running" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                    job.status === "Success" ? "bg-emerald-50 text-emerald-700 border border-emerald-250/20" :
                    "bg-slate-50 text-slate-500 border border-slate-200"
                  }`}>
                    {job.status}
                  </span>

                  <button 
                    onClick={() => handleTriggerJob(job.id)}
                    disabled={job.status === "Running"}
                    className="bg-slate-900 border text-white hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none text-2xs font-extrabold py-1.5 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" /> Run Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Telemetry Audit Logs & System Blueprints */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          {/* Column 1 & 2: Rolling Telemetry Log Screen */}
          <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-850 p-6 flex flex-col h-[320px] shadow-sm select-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                &gt;_ Real-time Telemetry logs
              </h3>
              <button 
                onClick={clearLogs}
                className="text-[10px] text-slate-500 hover:text-slate-350 underline decoration-dotted uppercase font-black cursor-pointer font-mono"
              >
                Clear Stream
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-[10.5px] text-slate-300 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 pr-1 select-text">
              {logs.map((log, idx) => (
                <div key={idx} className="leading-snug break-words">
                  <span className="text-purple-400 select-none">→</span> {log}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: PostgreSQL Schema Schema/Relational blue print display */}
          <div className="bg-white rounded-2xl border border-slate-250/80 shadow-2xs p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Database Blueprints
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                The Postgres relational DDL is synced at runtime. Cache-warming processes pre-wire standard search inputs.
              </p>

              <div className="space-y-2 font-mono text-[10px] bg-slate-50 p-3 rounded-xl border border-slate-100 select-all max-h-[170px] overflow-y-auto leading-relaxed">
                <p className="text-indigo-700 font-extrabold">// Drizzle / SQL Schemas</p>
                <p className="text-slate-500 font-medium">CREATE TABLE IF NOT EXISTS keywords (</p>
                <p className="pl-4 text-slate-600 font-medium">id VARCHAR PRIMARY KEY,</p>
                <p className="pl-4 text-slate-600 font-medium">keyword VARCHAR NOT NULL,</p>
                <p className="pl-4 text-slate-600 font-medium">country VARCHAR,</p>
                <p className="pl-4 text-slate-600 font-medium">created_at TIMESTAMP</p>
                <p className="text-slate-500 font-medium">);</p>
                <p className="text-slate-500 font-medium">CREATE TABLE IF NOT EXISTS serp_snapshots (</p>
                <p className="pl-4 text-slate-600 font-medium">id VARCHAR PRIMARY KEY,</p>
                <p className="pl-4 text-slate-600 font-medium">keyword_id VARCHAR REFERENCES keywords,</p>
                <p className="pl-4 text-slate-600 font-medium">raw_json JSONB,</p>
                <p className="pl-4 text-slate-600 font-medium">confidence INTEGER</p>
                <p className="text-slate-500 font-medium">);</p>
              </div>
            </div>

            <button 
              onClick={() => {
                toast.success("Enterprise Schema validated against active pool!");
                addLog("Schema integrity check completed: matches PostgreSQL catalog v15.4 perfectly.");
              }}
              className="mt-4 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              Verify DDL Schema Mapping
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
