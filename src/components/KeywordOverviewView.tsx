import React, { useState, useEffect } from "react";
import { toast } from "../lib/toast";
import { 
  Search, 
  HelpCircle, 
  Calendar, 
  Laptop, 
  Smartphone, 
  RefreshCw, 
  Download, 
  ChevronDown, 
  TrendingUp, 
  Plus, 
  ExternalLink,
  Video,
  Play,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
  Share2,
  FileSpreadsheet,
  FileText,
  Clock,
  Database,
  Coins,
  CheckCircle,
  Hash
} from "lucide-react";

// Types
interface KeywordItem {
  keyword: string;
  volume: string;
  volumeValue: number;
  kd: number;
}

interface SerpItem {
  position: number;
  title: string;
  url: string;
  domain: string;
  hasImage?: boolean;
  isVideoCarousel?: boolean;
  videoCount?: number;
  isShortVideos?: boolean;
  shortVideoCount?: number;
  as?: number;
  refDomains?: string;
  backlinks?: string;
  traffic?: string;
  keywordsCount?: number;
}

export default function KeywordOverviewView() {
  const [keyword, setKeyword] = useState("free fire");
  const [searchedWord, setSearchedWord] = useState("free fire");
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [selectedDevice, setSelectedDevice] = useState("Desktop");
  const [selectedDate, setSelectedDate] = useState("Jun 22, 2026");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [activeTab, setActiveTab] = useState<"overview" | "bulk" | "history">("overview");
  const [bulkInput, setBulkInput] = useState("free fire\nkeyword tool\nseo rankings");
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  // API dynamic states
  const [seoPayload, setSeoPayload] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [showClearSuccess, setShowClearSuccess] = useState(false);

  // Interactive metrics state
  const [serpMetricsRevealed, setSerpMetricsRevealed] = useState(false);
  const [revealingLoading, setRevealingLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Bulk dialog state
  const [showBulkSuccess, setShowBulkSuccess] = useState(false);

  // Keyword variations states
  const [isCopied, setIsCopied] = useState(false);

  // Dropdown states for interactive filters requested by focus-mode
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isDeviceOpen, setIsDeviceOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const countries = [
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "CA", name: "Canada", flag: "🇨🇦" }
  ];

  const devices = ["Desktop", "Mobile"];
  const dates = ["Jun 22, 2026", "Jun 21, 2026", "Jun 20, 2026", "Jun 15, 2026"];
  const currencies = ["USD", "EUR", "INR", "GBP"];

  const currentCountry = countries.find(c => c.code === selectedCountry) || countries[0];

  // Search autocomplete or fast options
  const quickSearchOptions = ["free fire", "seo tools", "shoes discount", "saas marketing", "insurance deals"];

  // Fetch complete SEO data from the backend
  const fetchSeoData = async (word: string, country: string, device: string) => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/seo/keyword-overview?keyword=${encodeURIComponent(word)}&country=${country}&device=${device}`);
      if (!resp.ok) {
        throw new Error("Failed to load metrics from the backend.");
      }
      const data = await resp.json();
      setSeoPayload(data);
      setIsCached(!!data.apiCached);
    } catch (err) {
      console.error("[FetchError] SEO parameters failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch search history records
  const loadSearchHistory = async () => {
    try {
      const resp = await fetch("/api/seo/history");
      if (resp.ok) {
        const data = await resp.json();
        setHistoryLogs(data.history || []);
      }
    } catch (err) {
      console.error("Failed to query footprint history database:", err);
    }
  };

  // Handle Clear Cache
  const handleClearCache = async () => {
    try {
      const resp = await fetch("/api/seo/clear-cache", { method: "POST" });
      if (resp.ok) {
        setShowClearSuccess(true);
        setTimeout(() => setShowClearSuccess(false), 2000);
        await fetchSeoData(searchedWord, selectedCountry, selectedDevice);
      }
    } catch (err) {
      console.error("Cache flush query failed:", err);
    }
  };

  useEffect(() => {
    fetchSeoData(searchedWord, selectedCountry, selectedDevice);
    loadSearchHistory();
  }, [searchedWord, selectedCountry, selectedDevice]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      setSearchedWord(keyword.trim().toLowerCase());
      setSerpMetricsRevealed(false); // reset metrics toggle
    }
  };

  const triggerUpdateMetrics = () => {
    setIsUpdating(true);
    // Force call backend to clear and update metrics
    fetchSeoData(searchedWord, selectedCountry, selectedDevice).then(() => {
      setIsUpdating(false);
    });
  };

  const handleRevealSerpMetrics = () => {
    setRevealingLoading(true);
    setTimeout(() => {
      setRevealingLoading(false);
      setSerpMetricsRevealed(true);
    }, 1000);
  };

  const handleBulkAnalysis = () => {
    const list = bulkInput.split("\n").filter(k => k.trim());
    const generated = list.map((kw, i) => {
      let charSum = 0;
      for (let j = 0; j < kw.length; j++) {
        charSum += kw.charCodeAt(j);
      }
      const vol = ((charSum % 8) + 1) * 15000 + (charSum % 10) * 120;
      const kd = (charSum % 60) + 35;
      const cpc = (charSum % 4 === 0) ? "n/a" : `$${((charSum % 250) / 100 + 0.1).toFixed(2)}`;
      return {
        keyword: kw.trim(),
        volume: vol.toLocaleString(),
        kd,
        intent: (charSum % 3 === 0) ? "Transactional" : (charSum % 2 === 0) ? "Commercial" : "Informational",
        cpc
      };
    });
    setBulkResults(generated);
    setShowBulkSuccess(true);
  };

  // Generate deterministic fallback metrics if backend is uncontactable
  const getKeywordData = (word: string) => {
    let sum = 0;
    for (let j = 0; j < word.length; j++) {
      sum += word.charCodeAt(j);
    }
    
    // Core check for "free fire" to replicate requested screenshot exactly
    if (word === "free fire") {
      return {
        volume: "2.2M",
        volumeValue: 2200000,
        globalVolume: "8.6M",
        globalVolumeValue: 8600000,
        kd: 86,
        kdLabel: "Very hard",
        kdDescription: "The hardest keyword to compete for. It will take a lot of on-page SEO, link building, and content promotion efforts.",
        cpc: "$0.01",
        competitiveDensity: "0.02",
        pla: "n/a",
        ads: "1",
        intent: ["Informational", "Transactional"],
        trend: [50, 60, 70, 80, 85, 90, 95, 100, 90, 80, 70, 75],
        countries: [
          { code: "IN", name: "India", flag: "🇮🇳", volume: "2.2M", pct: 25 },
          { code: "AR", name: "Argentina", flag: "🇦🇷", volume: "823.0K", pct: 10 },
          { code: "ID", name: "Indonesia", flag: "🇮🇩", volume: "823.0K", pct: 10 },
          { code: "BD", name: "Bangladesh", flag: "🇧🇩", volume: "450.0K", pct: 5.2 },
          { code: "BR", name: "Brazil", flag: "🇧🇷", volume: "450.0K", pct: 5.2 },
          { code: "VE", name: "Venezuela", flag: "🇻🇪", volume: "450.0K", pct: 5.2 },
          { code: "Other", name: "Other Countries", flag: "🌐", volume: "3.4M", pct: 39.4 }
        ],
        variations: [
          { keyword: "free fire", volume: "2.2M", volumeValue: 2200000, kd: 86 },
          { keyword: "free fire max", volume: "1.8M", volumeValue: 1800000, kd: 90 },
          { keyword: "free fire game", volume: "1.0M", volumeValue: 1000000, kd: 90 },
          { keyword: "free fire name", volume: "823.0K", volumeValue: 823000, kd: 63 },
          { keyword: "free fire nickname", volume: "823.0K", volumeValue: 823000, kd: 66 }
        ],
        variationsVolume: "22.2M",
        variationsCount: "50.6K",
        questions: [
          { keyword: "how to hack free fire diamond", volume: "110.0K", volumeValue: 110000, kd: 47 },
          { keyword: "how to hack free fire diamonds 99999", volume: "18.1K", volumeValue: 18100, kd: 43 },
          { keyword: "how to hack free fire", volume: "12.1K", volumeValue: 12100, kd: 76 },
          { keyword: "how to hack free fire unlimited diamonds", volume: "12.1K", volumeValue: 12100, kd: 29 },
          { keyword: "how to get free diamonds in free fire", volume: "8.1K", volumeValue: 8100, kd: 17 }
        ],
        questionsVolume: "430.4K",
        questionsCount: "4.9K",
        clusters: [
          { name: "ff", pct: "75%" },
          { name: "free fire online play", pct: "90%" },
          { name: "free fire game in windows", pct: "60%" },
          { name: "free fire downloadable content", pct: "85%" },
          { name: "free fire 2", pct: "40%" }
        ],
        serpResults: "103",
        serpFeatures: ["Site links", "Knowledge Panel", "Featured Snippet", "Video snippet", "People also ask"],
        serps: [
          { position: 1, title: "Garena Free Fire Max - Apps on Google Play", url: "https://play.google.com/store/apps/details?id=com.dts.freefiremax&hl=en_IN", domain: "google.com", as: 98, refDomains: "1.5M", backlinks: "54.2M", traffic: "120M", keywordsCount: 154000 },
          { position: 2, title: "Garena Free Fire | Be Free, Fight in Style!", url: "https://ff.garena.com/", domain: "garena.com", hasImage: true, as: 85, refDomains: "45.2K", backlinks: "2.1M", traffic: "8.4M", keywordsCount: 12400 },
          { position: 3, title: "Free Fire for Android - Download the APK from Uptodown", url: "https://free-fire-111dots-studio.en.uptodown.com/app", domain: "uptodown.com", hasImage: true, as: 92, refDomains: "85.6K", backlinks: "4.8M", traffic: "6.2M", keywordsCount: 31200 },
          { position: 4, title: "Video Carousel (3 links)", url: "#video-carousel", domain: "youtube.com", isVideoCarousel: true, videoCount: 3 },
          { position: 5, title: "Short Videos (4 links)", url: "#short-videos", domain: "youtube.com", isShortVideos: true, shortVideoCount: 4 },
          { position: 6, title: "Free Fire (video game) - Wikipedia", url: "https://en.wikipedia.org/wiki/Free_Fire_(video_game)", domain: "wikipedia.org", as: 94, refDomains: "125K", backlinks: "9.2M", traffic: "4.5M", keywordsCount: 89000 },
          { position: 7, title: "Free Fire - Download Gameloop emulator & play on PC", url: "https://free-fire-gameloop.en.softonic.com/", domain: "softonic.com", as: 89, refDomains: "18.2K", backlinks: "920K", traffic: "1.2M", keywordsCount: 5400 },
          { position: 8, title: "Garena Free Fire Official Channel - YouTube", url: "https://www.youtube.com/channel/UC_vVy4OI86F0amXqFN_zTMg", domain: "youtube.com", as: 99, refDomains: "1.2M", backlinks: "48.2M", traffic: "320M", keywordsCount: 650000 },
          { position: 9, title: "Free Fire (2016) - IMDb Entry, Details & Cast", url: "https://www.imdb.com/title/tt9197514/", domain: "imdb.com", as: 93, refDomains: "62.4K", backlinks: "3.1M", traffic: "820K", keywordsCount: 22000 },
          { position: 10, title: "Garena Free Fire Wiki | Fandom Wiki guides & stats", url: "https://garenafreefire.fandom.com/wiki/Free_Fire_Wiki", domain: "fandom.com", as: 88, refDomains: "12.5K", backlinks: "612K", traffic: "500K", keywordsCount: 16200 }
        ]
      };
    }

    // Dynamic generation logic for any word to ensure full active working functionality!
    const volVal = ((sum % 12) + 1) * 23000 + (sum % 100) * 45;
    const globalVal = volVal * 4.2;
    const kdScore = (sum % 80) + 15;
    let kdCategory = "Medium";
    let kdDesc = "A moderate priority level. Standard domain authority and on-page metadata optimization should suffice to gain steady results.";
    if (kdScore < 35) {
      kdCategory = "Easy";
      kdDesc = "An excellent opportunity! Low competition, quick crawling index times, and immediate low-budget ranking visibility.";
    } else if (kdScore > 75) {
      kdCategory = "Very hard";
      kdDesc = "High competition level. Demands extensive social media backing, rich backlink campaigns, and comprehensive pillar content.";
    }

    const cpcVal = sum % 3 === 0 ? `$${((sum % 200) / 100 + 0.15).toFixed(2)}` : `$${((sum % 1205) / 100).toFixed(2)}`;
    const compDensity = ((sum % 95) / 100).toFixed(2);
    const plaCount = sum % 2 === 0 ? `${sum % 12}` : "n/a";
    const adsCount = sum % 3 === 0 ? "0" : `${(sum % 6) + 1}`;

    const intents = sum % 2 === 0 ? ["Commercial", "Informational"] : sum % 3 === 0 ? ["Transactional"] : ["Informational"];

    // Trend simulation representation (12 figures)
    const seedTrend = [20, 25, 30, 40, 50, 45, 60, 70, 80, 75, 90, volVal % 100];
    const trendMax = Math.max(...seedTrend);
    const trendResult = seedTrend.map(v => Math.round((v / trendMax) * 100));

    // Dynamic countries
    const countries = [
      { code: "US", name: "United States", flag: "🇺🇸", volume: `${Math.round(volVal * 0.4 / 1000)}K`, pct: 40 },
      { code: "UK", name: "United Kingdom", flag: "🇬🇧", volume: `${Math.round(volVal * 0.2 / 1000)}K`, pct: 20 },
      { code: "DE", name: "Germany", flag: "🇩🇪", volume: `${Math.round(volVal * 0.15 / 1000)}K`, pct: 15 },
      { code: "IN", name: "India", flag: "🇮🇳", volume: `${Math.round(volVal * 0.1 / 1000)}K`, pct: 10 },
      { code: "CA", name: "Canada", flag: "🇨🇦", volume: `${Math.round(volVal * 0.08 / 1000)}K`, pct: 8 },
      { code: "Other", name: "Others", flag: "🌐", volume: `${Math.round(volVal * 0.07 / 1000)}K`, pct: 7 }
    ];

    // Dynamic variations
    const itemVariations = [
      { keyword: word, volume: `${Math.round(volVal / 1000)}K`, volumeValue: volVal, kd: kdScore },
      { keyword: `${word} review`, volume: `${Math.round(volVal * 0.7 / 1000)}K`, volumeValue: Math.round(volVal * 0.7), kd: Math.max(10, kdScore - 12) },
      { keyword: `best ${word}`, volume: `${Math.round(volVal * 0.5 / 1000)}K`, volumeValue: Math.round(volVal * 0.5), kd: Math.min(99, kdScore + 5) },
      { keyword: `${word} free download`, volume: `${Math.round(volVal * 0.35 / 1000)}K`, volumeValue: Math.round(volVal * 0.35), kd: Math.max(15, kdScore - 25) },
      { keyword: `${word} alternatives`, volume: `${Math.round(volVal * 0.2 / 1000)}K`, volumeValue: Math.round(volVal * 0.2), kd: Math.max(20, kdScore - 5) }
    ];

    // Dynamic questions
    const itemQuestions = [
      { keyword: `what is ${word}?`, volume: `${Math.round(volVal * 0.22 / 1000)}K`, volumeValue: Math.round(volVal * 0.22), kd: Math.max(10, kdScore - 15) },
      { keyword: `how to use ${word} securely`, volume: `${Math.round(volVal * 0.12 / 1000)}K`, volumeValue: Math.round(volVal * 0.12), kd: Math.max(5, kdScore - 30) },
      { keyword: `how much does ${word} cost`, volume: `${Math.round(volVal * 0.08 / 1000)}K`, volumeValue: Math.round(volVal * 0.08), kd: Math.max(12, kdScore - 8) },
      { keyword: `is ${word} worth using in school?`, volume: `${Math.round(volVal * 0.05 / 1000)}K`, volumeValue: Math.round(volVal * 0.05), kd: Math.max(10, kdScore - 20) },
      { keyword: `where can I buy ${word} discounted`, volume: `${Math.round(volVal * 0.03 / 1000)}K`, volumeValue: Math.round(volVal * 0.03), kd: Math.max(15, kdScore - 14) }
    ];

    // Dynamic strategy hubs
    const itemStrategy = [
      { name: `${word} guides`, pct: "80%" },
      { name: `best cheap ${word}`, pct: "65%" },
      { name: `how to bypass ${word} restrictions`, pct: "95%" },
      { name: `why is ${word} useful`, pct: "50%" },
      { name: `updated ${word}`, pct: "30%" }
    ];

    // SERP entries mapping
    const serpResults = `${(sum % 200) + 40}`;
    const itemSerp = [
      { position: 1, title: `Official ${word.charAt(0).toUpperCase() + word.slice(1)} Portal & documentation`, url: `https://www.${word.replace(/\s+/g, "")}.com/`, domain: `${word.replace(/\s+/g, "")}.com`, as: Math.min(99, Math.max(45, (sum % 40) + 55)), refDomains: "15.4K", backlinks: "235K", traffic: "142K", keywordsCount: 1200 },
      { position: 2, title: `What is ${word.charAt(0).toUpperCase() + word.slice(1)}? - Full Wikipedia Explanation`, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(word)}`, domain: "wikipedia.org", as: 95, refDomains: "450K", backlinks: "18.5M", traffic: "4.2M", keywordsCount: 380400 },
      { position: 3, title: `Best ${word.charAt(0).toUpperCase() + word.slice(1)} Guides and Comparison Reviews (2026)`, url: `https://www.g2.com/categories/${word.replace(/\s+/g, "-")}`, domain: "g2.com", hasImage: true, as: 88, refDomains: "12.4K", backlinks: "115K", traffic: "54K", keywordsCount: 6500 },
      { position: 4, title: `Interactive Videos for ${word}`, url: "#video-carousel", domain: "youtube.com", isVideoCarousel: true, videoCount: 3 },
      { position: 5, title: `Read standard reddit reviews for ${word}`, url: `https://www.reddit.com/r/search?q=${encodeURIComponent(word)}`, domain: "reddit.com", as: 91, refDomains: "84K", backlinks: "1.2M", traffic: "230K", keywordsCount: 41200 },
      { position: 6, title: `Everything you need to know about setting up ${word}`, url: `https://medium.com/tag/${word.replace(/\s+/g, "-")}`, domain: "medium.com", as: 86, refDomains: "3.5K", backlinks: "45K", traffic: "12K", keywordsCount: 1500 }
    ];

    return {
      volume: `${Math.round(volVal / 1000)}K`,
      volumeValue: volVal,
      globalVolume: `${Math.round(globalVal / 1000)}K`,
      globalVolumeValue: globalVal,
      kd: kdScore,
      kdLabel: kdCategory,
      kdDescription: kdDesc,
      cpc: cpcVal,
      competitiveDensity: compDensity,
      pla: plaCount,
      ads: adsCount,
      intent: intents,
      trend: trendResult,
      countries: countries,
      variations: itemVariations,
      variationsVolume: `${Math.round(volVal * 3.4 / 1000)}K`,
      variationsCount: `${(sum % 25) + 3}K`,
      questions: itemQuestions,
      questionsVolume: `${Math.round(volVal * 0.6 / 1000)}K`,
      questionsCount: `${(sum % 12) + 1}K`,
      clusters: itemStrategy,
      serpResults,
      serpFeatures: ["Site links", "Knowledge Panel", "Video snippet"],
      serps: itemSerp
    };
  };

  const data = seoPayload || getKeywordData(searchedWord);

  // Status dot color index based on KD percentage
  const getKdDotColor = (kd: number) => {
    if (kd <= 14) return "bg-emerald-500";
    if (kd <= 29) return "bg-emerald-400";
    if (kd <= 49) return "bg-amber-400";
    if (kd <= 69) return "bg-orange-500";
    if (kd <= 84) return "bg-rose-500";
    return "bg-rose-600";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(searchedWord);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-5 animate-fade-in text-left text-sans bg-[#f8fafc] min-h-screen pb-12">
      
      {/* Pristine White header panel block */}
      <div className="bg-white border-b border-gray-200">
        {/* 1. Header Path Navigation & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 font-sans border-b border-gray-150 pb-2.5 px-6 pt-4 bg-white/50">
          <div className="flex items-center gap-1 font-medium select-none">
            <span className="hover:text-gray-800 cursor-pointer transition-colors">Home</span>
            <span className="text-gray-300 font-normal">&gt;</span>
            <span className="hover:text-gray-800 cursor-pointer transition-colors">SEO</span>
            <span className="text-gray-300 font-normal">&gt;</span>
            <span className="text-gray-800 font-bold">Keyword Overview</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold select-none">
            <button className="text-gray-655 hover:text-[#005fb8] transition-colors flex items-center gap-1">
              <span className="text-xs">🎓</span> Keyword Research course
            </button>
            <button className="text-gray-655 hover:text-[#005fb8] transition-colors flex items-center gap-1">
              <span className="text-xs">📖</span> User manual
            </button>
            <button className="text-gray-655 hover:text-[#005fb8] transition-colors flex items-center gap-1">
              <span className="text-xs">💬</span> Send feedback
            </button>
          </div>
        </div>

        {/* 2. Top Header Info Bar with country flag dropdowns */}
        <div className="px-6 space-y-3 pt-4 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold font-sans text-gray-950 tracking-tight flex items-center gap-1.5">
                  Keyword Overview: <span className="font-extrabold text-slate-800">{searchedWord}</span>
                </h1>
                <button 
                  onClick={copyToClipboard}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer rounded-full transition-colors flex items-center gap-1"
                  title={isCopied ? "Copied!" : "Copy Keyword"}
                >
                  <HelpCircle className="w-4 h-4 text-gray-450" />
                  {isCopied && <span className="text-[10px] text-green-655 font-bold bg-green-50 px-1.5 py-0.2 rounded">Copied!</span>}
                </button>
              </div>

              {/* Inline filters - Semrush look */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#005fb8] font-semibold pt-0.5 select-none z-20">
                
                {/* Country Selector */}
                <div className="relative">
                  <div 
                    onClick={() => {
                      setIsCountryOpen(!isCountryOpen);
                      setIsDeviceOpen(false);
                      setIsDateOpen(false);
                      setIsCurrencyOpen(false);
                    }}
                    className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors text-[#005fb8]"
                  >
                    <span>{currentCountry.flag} {currentCountry.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#005fb8]" />
                  </div>
                  {isCountryOpen && (
                    <div className="absolute left-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 text-gray-700 font-sans font-semibold">
                      {countries.map((c) => (
                        <div
                          key={c.code}
                          onClick={() => {
                            setSelectedCountry(c.code);
                            setIsCountryOpen(false);
                            toast.success(`Country filter changed to ${c.name}`);
                          }}
                          className={`px-3 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs ${selectedCountry === c.code ? "bg-indigo-50/50 text-indigo-600 font-bold" : ""}`}
                        >
                          <span>{c.flag} {c.name}</span>
                          {selectedCountry === c.code && <span className="text-[10px] text-indigo-600 font-extrabold font-mono">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-gray-300">|</span>

                {/* Device */}
                <div className="relative">
                  <div 
                    onClick={() => {
                      setIsDeviceOpen(!isDeviceOpen);
                      setIsCountryOpen(false);
                      setIsDateOpen(false);
                      setIsCurrencyOpen(false);
                    }}
                    className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors text-[#005fb8]"
                  >
                    <Laptop className="w-3.5 h-3.5 text-slate-500 mr-0.5" />
                    <span>{selectedDevice}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#005fb8]" />
                  </div>
                  {isDeviceOpen && (
                    <div className="absolute left-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 text-gray-700 font-sans font-semibold">
                      {devices.map((d) => (
                        <div
                          key={d}
                          onClick={() => {
                            setSelectedDevice(d);
                            setIsDeviceOpen(false);
                            toast.success(`Device filter changed to ${d}`);
                          }}
                          className={`px-3 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs ${selectedDevice === d ? "bg-indigo-50/50 text-indigo-600 font-bold" : ""}`}
                        >
                          <span>{d === "Desktop" ? "💻 Desktop" : "📱 Mobile"}</span>
                          {selectedDevice === d && <span className="text-[10px] text-indigo-600 font-extrabold font-mono">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-gray-300">|</span>

                {/* Date range */}
                <div className="relative">
                  <div 
                    onClick={() => {
                      setIsDateOpen(!isDateOpen);
                      setIsCountryOpen(false);
                      setIsDeviceOpen(false);
                      setIsCurrencyOpen(false);
                    }}
                    className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors text-[#005fb8]"
                  >
                    <span>{selectedDate}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#005fb8]" />
                  </div>
                  {isDateOpen && (
                    <div className="absolute left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 text-gray-700 font-sans font-semibold">
                      {dates.map((dt) => (
                        <div
                          key={dt}
                          onClick={() => {
                            setSelectedDate(dt);
                            setIsDateOpen(false);
                            toast.success(`Date filter changed to ${dt}`);
                          }}
                          className={`px-3 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs ${selectedDate === dt ? "bg-indigo-50/50 text-indigo-600 font-bold" : ""}`}
                        >
                          <span>{dt}</span>
                          {selectedDate === dt && <span className="text-[10px] text-indigo-600 font-extrabold font-mono">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-gray-300">|</span>

                {/* Currency */}
                <div className="relative">
                  <div 
                    onClick={() => {
                      setIsCurrencyOpen(!isCurrencyOpen);
                      setIsCountryOpen(false);
                      setIsDeviceOpen(false);
                      setIsDateOpen(false);
                    }}
                    className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors text-[#005fb8]"
                  >
                    <span>{selectedCurrency}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#005fb8]" />
                  </div>
                  {isCurrencyOpen && (
                    <div className="absolute left-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 text-gray-700 font-sans font-semibold">
                      {currencies.map((curr) => (
                        <div
                          key={curr}
                          onClick={() => {
                            setSelectedCurrency(curr);
                            setIsCurrencyOpen(false);
                            toast.success(`Currency changed to ${curr}`);
                          }}
                          className={`px-3 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs ${selectedCurrency === curr ? "bg-indigo-50/50 text-indigo-600 font-bold" : ""}`}
                        >
                          <span>{curr === "INR" ? "₹ INR" : curr === "USD" ? "$ USD" : curr === "EUR" ? "€ EUR" : "£ GBP"}</span>
                          {selectedCurrency === curr && <span className="text-[10px] text-indigo-600 font-extrabold font-mono">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Live Search Form & PDF buttons */}
            <div className="flex items-stretch gap-2.5">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center min-w-[220px]">
                <input 
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="free fire"
                  className="w-full bg-slate-50 hover:bg-white text-slate-850 font-semibold text-xs border border-slate-300 rounded-lg py-2 pl-8 pr-4 focus:outline-none focus:border-slate-500 transition-all placeholder:text-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              </form>
              <button 
                type="submit" 
                onClick={handleSearchSubmit}
                className="bg-slate-950 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Analyze
              </button>
            </div>
          </div>

          {/* Example Fast Trends Filters Row */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 text-xs select-none border-t border-slate-100 mt-1">
            <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Example Trends:</span>
            {quickSearchOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setKeyword(opt);
                  setSearchedWord(opt);
                  setSerpMetricsRevealed(false);
                }}
                className={`px-2.5 py-0.5 bg-slate-50 hover:bg-slate-100 font-bold text-[11px] rounded transition-all cursor-pointer border ${opt === searchedWord ? "text-blue-600 bg-blue-50/50 border-blue-200" : "text-slate-650 border-gray-200"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Overview vs Bulk Analysis Tab Selector */}
        <div className="px-6 border-b border-gray-250 select-none flex items-center gap-5 pt-1 bg-white">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 text-[13px] font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "overview" 
                ? "border-[#ff642d] text-slate-950 font-extrabold" 
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("bulk")}
            className={`py-2 px-1 text-[13px] font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "bulk" 
                ? "border-[#ff642d] text-slate-950 font-extrabold" 
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            Bulk Analysis
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`py-2 px-1 text-[13px] font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "history" 
                ? "border-[#ff642d] text-slate-950 font-extrabold" 
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              History Footprints
            </span>
          </button>
        </div>
      </div>

      {/* 4. MAIN PANEL CONTENT */}
      {activeTab === "overview" ? (
        <div className="space-y-5 px-6 pb-8">
          
          {/* Active Data Source and Relational Caching state banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. API Connection Status */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
              data?.apiSource === "Mock/Simulation" 
                ? "bg-amber-50/70 border-amber-200 text-amber-800 animate-fade-in" 
                : "bg-emerald-50/70 border-emerald-250 text-emerald-800 animate-fade-in"
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${data?.apiSource === "Mock/Simulation" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                <div>
                  <span className="font-extrabold block">SEO Source Connection: {data?.apiSource || "Fallback Simulation"}</span>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {data?.apiSource === "Mock/Simulation" 
                      ? "Running offline simulation. Configure DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD or SERPAPI_API_KEY in Secrets."
                      : `Successfully streaming real-time metrics from live ${data?.apiSource} API integrations.`}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Redis/Memory Cache indicator */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 flex items-center justify-between gap-3 text-xs text-blue-800 font-semibold shadow-3xs hover:border-blue-300 transition-all">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <div className="truncate">
                  <span className="font-extrabold block text-blue-900 leading-snug">Cache Status: {isCached ? "Cache Hit (24H TTL active)" : "Live API Retrieve"}</span>
                  <p className="text-[10px] text-blue-600 truncate font-semibold">Redis/Memory caching layer automatically handles requests to optimize credits.</p>
                </div>
              </div>
              <button 
                onClick={handleClearCache}
                className="bg-white hover:bg-blue-100 border border-blue-300 text-blue-700 font-bold px-2.5 py-1 rounded transition-colors text-[10px] flex items-center gap-1 shrink-0 cursor-pointer shadow-3xs"
              >
                <RefreshCw className="w-3 h-3 text-blue-600" /> Refresh Cache
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white border rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-3xs min-h-[350px]">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#ff642d] animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Aggregating SEO data sources...</p>
                <p className="text-xs text-slate-400 font-medium font-mono">Connecting Keyword Planner, Trends Over Time and Organic SERP links from active providers.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Subheader bar below tabs with sparkles "Enter domain for personalized data" */}
              <div className="bg-[#f0f4f9] border border-slate-200 p-2.5 rounded-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs text-sans mt-1">
            <div className="flex-1 flex items-center gap-2 relative bg-white border border-slate-350 rounded px-2.5 py-1.5 max-w-lg">
              <span className="text-[#a855f7] font-bold">✨</span>
              <input 
                type="text" 
                placeholder="Enter domain for personalized data" 
                className="w-full text-xs text-slate-700 font-semibold outline-none placeholder:text-gray-400 placeholder:font-medium bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <div className="bg-white border border-slate-350 rounded px-2.5 py-1.5 flex items-center gap-2 text-slate-600 font-bold text-xs cursor-pointer hover:bg-slate-50 transition-colors">
                <span>🌐 Select location</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>

              <button 
                onClick={triggerUpdateMetrics} 
                disabled={isUpdating}
                className="bg-white border border-slate-350 rounded hover:bg-slate-50 text-slate-700 font-bold text-xs py-1.5 px-3 flex items-center justify-center gap-1.5 transition-all shadow-3xs"
              >
                <RefreshCw className={`w-3 h-3 text-slate-500 ${isUpdating ? "animate-spin text-[#ff642d]" : ""}`} />
                <span>{isUpdating ? "Updated" : "Update metrics"}</span>
              </button>

              <button 
                onClick={() => toast.success(`Export job queued: Generating PDF report for "${searchedWord}"`)}
                className="bg-white border border-slate-350 rounded hover:bg-slate-50 text-slate-700 font-bold text-xs py-1.5 px-3 flex items-center justify-center gap-1.5 transition-all shadow-3xs"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>Export to PDF</span>
              </button>
            </div>
          </div>

          {/* SEMRUSH MATRIX OVERVIEW CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Volume & Difficulty */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Volume</span>
                <div className="flex items-center gap-2">
                  <span className="text-[32px] sm:text-[36px] font-bold font-sans text-gray-900 tracking-tight leading-none">{data.volume}</span>
                  <span className="text-xl" title="Chosen Region Flag">🇮🇳</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Keyword Difficulty</span>
                    <span className="text-xs font-bold text-gray-950 font-sans bg-slate-100 px-1.5 py-0.5 rounded">{data.kd}%</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    {/* Ring progress bar circle */}
                    <div className="w-12 h-12 flex-shrink-0 relative flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={data.kd > 75 ? "text-rose-500" : data.kd > 40 ? "text-amber-500" : "text-emerald-500"} strokeDasharray={`${data.kd}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-slate-800 uppercase">KD</span>
                    </div>
                    <div>
                      <span className={`text-sm font-bold block ${data.kd > 75 ? "text-rose-600" : data.kd > 40 ? "text-amber-600" : "text-emerald-600"}`}>{data.kdLabel}</span>
                      <p className="text-[11px] text-gray-400 leading-snug font-medium mt-0.5 mt-1">Difficulty level score for ranking positions.</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 font-normal leading-relaxed mt-3 border-t border-gray-50 pt-3">{data.kdDescription}</p>
            </div>

            {/* Card 2: Global Volume country table map */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Global Volume</span>
              <div className="flex items-center gap-2">
                <span className="text-[32px] sm:text-[36px] font-bold font-sans text-gray-900 tracking-tight leading-none">{data.globalVolume}</span>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase">Summed</span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                {data.countries.map((c, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="text-sm font-sans flex-shrink-0">{c.flag}</span>
                      <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wide w-6">{c.code}</span>
                      {/* Regional horizontal bar chart */}
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${c.pct}%` }}></div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800 font-sans">{c.volume}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Intent and Trend graph */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Intent</span>
                <div className="flex gap-2 flex-wrap mb-4">
                  {data.intent.map((int, i) => (
                    <span 
                      key={i} 
                      className={`px-2.5 py-1 rounded text-[11px] font-extrabold uppercase select-none ${
                        int === "Informational" 
                          ? "bg-sky-50 text-sky-700 border border-sky-200" 
                          : int === "Transactional" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {int}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Trend</span>
                  {/* Monthly bar-graph preview representing search volume direction */}
                  <div className="h-[75px] flex items-end gap-[3px] px-1 bg-slate-50/50 rounded-lg p-2.5 border border-slate-100">
                    {data.trend.map((val, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 bg-indigo-300 hover:bg-indigo-400 rounded-xs transition-all" 
                        style={{ height: `${Math.max(10, val * 0.7)}%` }}
                        title={`Month index: ${val}%`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase text-center mt-3 tracking-wider">Search demand over 12 months</p>
            </div>

            {/* Card 4: CPC and other metric fields */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">CPC</span>
                <span className="text-[28px] font-bold font-sans text-slate-900 block tracking-tight">{data.cpc}</span>
                <p className="text-[10px] text-gray-400 leading-snug">Average advertiser pricing per click.</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Comp. Density</span>
                  <span className="text-base font-bold font-sans text-slate-800 block">{data.competitiveDensity}</span>
                  <p className="text-[9px] text-gray-400 mt-0.5">Competitiveness ratio</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">PLA</span>
                  <span className="text-base font-bold font-sans text-slate-800 block uppercase">{data.pla}</span>
                  <p className="text-[9px] text-gray-400 mt-0.5">Product list ads</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Ads</span>
                  <span className="text-base font-bold font-sans text-indigo-700 block">{data.ads}</span>
                  <p className="text-[9px] text-gray-400 mt-0.5">Primary sponsor count</p>
                </div>
              </div>
            </div>

          </div>

          {/* GOOGLE TRENDS PREMIUM INTEGRATION GRAPH & CORES */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs text-left space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="bg-[#fbbf24]/10 text-amber-700 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded border border-amber-400/20 inline-block mb-1">
                  🔥 Google Trends Real-Time Stream
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Google Trends Interest Analysis: "{searchedWord}"
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  12-month interest timeline, regional popularity density indices and breakout search entities.
                </p>
              </div>
              <div className="text-[11px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-lg">
                Location Target: <span className="text-[#a855f7] font-black">{selectedCountry}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: 12-Month Interactive Interest Timeline (7 columns) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Interest Over Time (Index: 0 - 100)
                  </span>
                  <span className="text-xs text-slate-500 font-bold font-sans">
                    Peak Vol Score: <span className="text-indigo-600 font-black">100%</span>
                  </span>
                </div>

                {/* SVG Line Graph */}
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 h-[220px] flex flex-col justify-between">
                  <div className="relative flex-1 flex items-end">
                    
                    {/* SVG Chart Line and Circles */}
                    <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                      {/* Grid Lines */}
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      
                      {/* Interactive Gradient Fill */}
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path 
                        d={`M 0 100 
                          ${(data.trend || [45, 60, 50, 75, 90, 80, 100, 95, 70, 85, 90, 80]).map((val: any, idx: number, arr: any[]) => {
                            const x = (idx / (arr.length - 1)) * 100;
                            const y = 100 - val;
                            return `L ${x} ${y}`;
                          }).join(" ")} 
                          L 100 100 Z`}
                        fill="url(#trendGrad)"
                      />

                      {/* Line Path */}
                      <path 
                        d={(data.trend || [45, 60, 50, 75, 90, 80, 100, 95, 70, 85, 90, 80]).map((val: any, idx: number, arr: any[]) => {
                          const x = (idx / (arr.length - 1)) * 100;
                          const y = 100 - val;
                          return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                        }).join(" ")}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Horizontal months labels */}
                    <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[9px] text-gray-400 font-mono font-bold pt-2 border-t border-slate-100">
                      <span>Jul 23</span>
                      <span>Sep 23</span>
                      <span>Nov 23</span>
                      <span>Jan 24</span>
                      <span>Mar 24</span>
                      <span>May 24</span>
                      <span>Jul 24</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                  *Index values represent search interest relative to the highest point on the chart for the given region and time. A value of 100 is the peak popularity of the term!
                </p>
              </div>

              {/* Right Column: Regional Interest and Queries (5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Regional Density Progress Bars */}
                <div className="space-y-3 text-left">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
                    Top Regional Popularity Index
                  </span>
                  
                  <div className="space-y-2.5">
                    {(data.trendsData?.regionalInterest || [
                      { region: "Maharashtra", value: 100 },
                      { region: "Uttar Pradesh", value: 92 },
                      { region: "Delhi NCR", value: 87 },
                      { region: "Karnataka", value: 76 },
                      { region: "Tamil Nadu", value: 64 }
                    ]).map((reg: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">{reg.region}</span>
                          <span className="font-mono font-bold text-slate-900">{reg.value}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-150 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full" 
                            style={{ width: `${reg.value}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Trending Related Queries tag list */}
                <div className="space-y-3 text-left">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
                    Trending Related Queries (Breakout Growth)
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {(data.trendsData?.relatedQueries || [
                      { query: `${searchedWord} download latest`, value: 180 },
                      { query: `garena ${searchedWord} update link`, value: 240 },
                      { query: `best alternative to ${searchedWord}`, value: 450 },
                      { query: `${searchedWord} online play game`, value: 120 }
                    ]).map((q: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setKeyword(q.query);
                          setSearchedWord(q.query);
                          setSerpMetricsRevealed(false);
                          setActiveTab("overview");
                        }}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-indigo-700 font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:border-slate-300"
                      >
                        <span className="text-slate-700 font-semibold">{q.query}</span>
                        <span className="bg-purple-100 text-purple-700 text-[9px] px-1 rounded-sm font-sans font-black">
                          +{q.value}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* MID LEVEL PROMO HERO BLOCK */}
          <div className="relative bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white rounded-2xl p-6 md:p-8 overflow-hidden shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
              <svg className="w-96 h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40" />
              </svg>
            </div>

            <div className="relative z-10 space-y-2 max-w-xl text-left">
              <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded border border-indigo-400/20">SEM RUSH PRO ACCELERATOR</span>
              <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight">
                This keyword could be your next <span className="text-[#3fd68c] font-black underline">growth driver</span>.
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Go beyond basic volume statistics and unlock advanced trends, real competitors backlink indexes, dynamic keyword gap comparisons, and automatic SEO briefs generator.
              </p>
            </div>

            <button 
              onClick={() => toast.success(`Provisioning Semrush Pro premium sandbox for keyword: "${searchedWord}"`)}
              className="bg-[#3fd68c] hover:bg-[#34b675] text-slate-900 hover:scale-102 transition-all font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-1.5 whitespace-nowrap self-start md:self-center cursor-pointer shadow-lg shadow-[#3fd68c]/10"
            >
              Get started with Semrush Pro <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* KEYWORD IDEAS SECTION (Variations, Questions, Hub) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900">Keyword ideas</h3>
                <p className="text-xs text-slate-400">Discover synonyms, variations, clustered phrases, and strategic questions.</p>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-600 font-black px-2 py-0.5 rounded uppercase">Search terms</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Keyword Variations */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs text-left">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-900">Keyword Variations</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span className="font-extrabold text-slate-800">{data.variationsCount}</span> phrases
                    <span>•</span>
                    Total Vol: <span className="font-bold text-slate-700">{data.variationsVolume}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-sans">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-black text-left">
                        <th className="pb-2">Keyword</th>
                        <th className="pb-2 text-right">Volume</th>
                        <th className="pb-2 text-center">KD%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.variations.map((v, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 font-bold text-[#005fb8] hover:underline cursor-pointer font-sans" onClick={() => { setKeyword(v.keyword); setSearchedWord(v.keyword); setSerpMetricsRevealed(false); }}>
                            {v.keyword}
                          </td>
                          <td className="py-2.5 font-sans font-medium text-right text-slate-950">{v.volume}</td>
                          <td className="py-2.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${getKdDotColor(v.kd)}`} />
                              <span className="font-sans text-slate-655 font-semibold">{v.kd}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button 
                  onClick={() => toast.info(`Viewing all ${data.variationsCount} variations for "${searchedWord}" - list filtered in main table.`)}
                  className="w-full mt-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-750 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  View all {data.variationsCount} keywords
                </button>
              </div>

              {/* Column 2: Questions */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs text-left">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-900">Questions</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span className="font-extrabold text-slate-800">{data.questionsCount}</span> queries
                    <span>•</span>
                    Total Vol: <span className="font-bold text-slate-700">{data.questionsVolume}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-sans">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-black text-left">
                        <th className="pb-2">Questions Asked</th>
                        <th className="pb-2 text-right">Volume</th>
                        <th className="pb-2 text-center">KD%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.questions.map((q, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 font-sans font-semibold text-[#005fb8] hover:underline cursor-pointer" onClick={() => { setKeyword(q.keyword); setSearchedWord(q.keyword); setSerpMetricsRevealed(false); }}>
                            {q.keyword}
                          </td>
                          <td className="py-2.5 font-sans font-medium text-right text-slate-950">{q.volume}</td>
                          <td className="py-2.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${getKdDotColor(q.kd)}`} />
                              <span className="font-sans text-slate-655 font-semibold">{q.kd}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button 
                  onClick={() => toast.info(`Filtered questions catalog: displayed ${data.questionsCount} question entities matching "${searchedWord}"`)}
                  className="w-full mt-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-755 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  View all {data.questionsVolume} questions List
                </button>
              </div>

              {/* Column 3: Keyword Strategy and mind map */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs text-left">
                <div className="mb-3">
                  <h4 className="text-sm font-bold text-gray-900">Keyword Strategy</h4>
                  <p className="text-xs text-slate-400">Get topics, pillar categories, and subpages automatically</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                    <span className="text-xs font-mono font-black text-slate-800 uppercase tracking-widest">{searchedWord}</span>
                  </div>

                  {/* Connecting mind-map lines */}
                  <div className="pl-3.5 border-l-2 border-dashed border-slate-300 space-y-3.5 relative">
                    {data.clusters.map((cl, i) => (
                      <div key={i} className="flex items-center gap-3 relative">
                        <div className="absolute -left-3.5 w-3.5 h-px bg-dashed border-t border-slate-300" />
                        
                        <div className="flex-1 flex items-center justify-between gap-1.5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-850 truncate">{cl.name}</span>
                          <span className="text-[10px] bg-white border border-slate-150 px-1.5 py-0.5 rounded font-bold font-sans text-slate-655">{cl.pct} match</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => toast.success(`Generated topical semantic map of clusters for keyword: "${searchedWord}"`)}
                  className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  View all topical clusters
                </button>
              </div>

            </div>
          </div>

          {/* NEW ENTERPRISE INTEGRATION CONSENSUS & AI AUDIT MATRIX */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Portion: Consensus Details (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 shadow-xs text-left">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Multi-Source Verification Engine</h3>
                    <p className="text-[10px] text-slate-400">Aggregating DataForSEO + SerpApi + Google Trends</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">Integrity Score</span>
                  <span className="text-sm font-mono font-black text-indigo-600">{data.confidenceScore || 95}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <span className="font-semibold text-slate-600">Attribution Index</span>
                  </div>
                  <span className="font-bold text-slate-800 text-right">{data.sourceAttribution || "Consensus baseline weighted indices."}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase mb-1">Estimated CPC</span>
                    <strong className="text-slate-900 font-sans">{data.cpc} USD</strong>
                  </div>
                  <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase mb-1">Competition Density</span>
                    <strong className="text-slate-900 font-sans">{data.competitiveDensity}</strong>
                  </div>
                </div>

                <div className="p-3 bg-[#e0f2fe]/40 border border-[#bae6fd]/50 rounded-lg text-[11px] text-[#0369a1] leading-relaxed">
                  <strong>Enterprise Note:</strong> Raw data is snapshotted into PostgreSQL binary `serp_snapshots` tables on every unique query. This creates a durable audit log to monitor domain positional fluctuations over time.
                </div>
              </div>
            </div>

            {/* Right Portion: Generative AI Audit Content Gap (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 rounded-xl text-white p-6 shadow-xs text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
                <Sparkles className="w-32 h-32 text-indigo-300" />
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#3fd68c]" />
                  <span className="text-sm font-bold text-slate-100">AI Content Gap Audits</span>
                </div>
                <span className="bg-[#3fd68c]/15 text-[#3fd68c] text-[9px] font-black uppercase px-2 py-0.5 rounded border border-[#3fd68c]/20">OpenAI Match</span>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {data.aiContentGap && data.aiContentGap.map((gap: any, idx: number) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-200">{gap.gapTopic}</strong>
                      <span className={`text-[9px] font-black uppercase px-1.5 rounded ${
                        gap.priority === "High" ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"
                      }`}>{gap.priority} Priority</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-snug">{gap.recommendation}</p>
                  </div>
                ))}
                {!data.aiContentGap && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-200">Featured guidelines match</strong>
                      <span className="bg-rose-500/20 text-rose-300 text-[9px] font-black uppercase px-1.5 rounded">High Priority</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-snug">Ensure long-tail structural questions of search engines are covered within body text.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SERP ANALYSIS SECTION (REAL DATA FETCH AND METRICS ACTUATE) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs text-left">
            <div className="bg-slate-50 p-5 border-b border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">SERP Analysis</h3>
                <p className="text-xs text-slate-450 mt-0.5">Crawl database organic results index listings for keyword.</p>
              </div>

              {/* SERP controls */}
              <div className="flex items-center gap-3">
                <div className="flex bg-slate-200/60 rounded-lg p-0.5 border border-slate-200">
                  <button className="bg-white text-slate-800 font-bold text-xs py-1.5 px-3 rounded-md shadow-xs">Domain</button>
                  <button className="text-slate-500 hover:text-slate-800 font-bold text-xs py-1.5 px-3">URL</button>
                </div>

                <button 
                  onClick={() => toast.info(`Opening Google SERP snapshot overlay for: "${searchedWord}"`)}
                  className="bg-white hover:bg-slate-100 text-slate-850 font-bold text-xs py-1.5 px-3 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View SERP
                </button>
              </div>
            </div>

            {/* Results headers */}
            <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Organic Results</span>
                  <span className="text-xl font-bold font-sans text-gray-900">{data.serpResults}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">SERP Features detected</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {data.serpFeatures.map((f, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-650 px-2 py-0.5 rounded text-[10px] font-semibold">{f}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-400 font-semibold mr-1">Pages:</span>
                <span className="bg-slate-900 text-white font-extrabold px-2.5 py-1 rounded cursor-pointer">1-10</span>
                <span className="hover:bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded cursor-pointer">11-20</span>
                <span className="hover:bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded cursor-pointer">21-30</span>
                <span className="hover:bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded cursor-pointer">31-40</span>
                <span className="hover:bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded cursor-pointer">41-50</span>
              </div>
            </div>

            {/* Combined Table and Dynamic Metric Overlay */}
            <div className="relative">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 overflow-x-auto">
                
                {/* Left block (URLs listings, occupying 7 columns) */}
                <div className="lg:col-span-7 border-r border-gray-100 min-w-[480px]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b border-gray-100 text-left">
                        <th className="py-2.5 px-4 font-black">Rank / SERP URL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.serps.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-start gap-3">
                              <span className="text-slate-500 font-bold font-sans min-w-[16px] text-center mt-0.5">{s.position}</span>
                              <div className="space-y-0.5 min-w-0">
                                {s.isVideoCarousel ? (
                                  <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg py-1 select-none font-semibold">
                                    <Video className="w-4 h-4 text-[#ff5555]" />
                                    <span>Video Carousel ({s.videoCount} entries indexed)</span>
                                  </div>
                                ) : s.isShortVideos ? (
                                  <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg py-1 select-none font-semibold">
                                    <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                    <span>Short Videos ({s.shortVideoCount} clips matching search)</span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-1.5">
                                      <a 
                                        href={s.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        referrerPolicy="no-referrer"
                                        className="font-bold text-slate-900 hover:text-[#005fb8] hover:underline font-sans text-xs truncate max-w-lg flex items-center gap-1"
                                      >
                                        {s.title}
                                        <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                      </a>
                                    </div>
                                    <p className="text-[11px] font-sans font-medium text-slate-500 truncate">{s.url}</p>
                                    <div className="flex items-center gap-1.5 pt-1 text-[10px] text-gray-400 font-medium">
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-sans">{s.domain}</span>
                                      {s.hasImage && <span className="bg-indigo-50 text-indigo-700 font-bold px-1 py-0.2 rounded">JPEG Badge</span>}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right block (Competitor stats details, representing 5 columns) */}
                <div className="lg:col-span-5 relative min-w-[320px]">
                  
                  {/* Absolute or overlay blur if not revealed */}
                  {!serpMetricsRevealed && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10">
                      <div className="max-w-xs space-y-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-lg text-center animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                          <TrendingUp className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900">Get a SERP breakdown analysis</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            View up-to-date data on your top 100 competitors, their backlinks, referring domains, organic key ratios, and metrics.
                          </p>
                        </div>
                        <button 
                          onClick={handleRevealSerpMetrics}
                          disabled={revealingLoading}
                          className="w-full bg-[#10b981] hover:bg-[#0d9488] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {revealingLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Crawling pages...</span>
                            </>
                          ) : (
                            <span>Get metrics</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Standard columns structure */}
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b border-gray-100 text-right">
                        <th className="py-2.5 px-2 font-black text-center">Page AS</th>
                        <th className="py-2.5 px-2 font-black text-right">Ref. Domains</th>
                        <th className="py-2.5 px-2 font-black text-right">Backlinks</th>
                        <th className="py-2.5 px-2 font-black text-right">Search Traffic</th>
                        <th className="py-2.5 px-2 font-black text-center pr-4">URL Keywords</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.serps.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-[19.8px] px-2 text-center">
                            <span className="font-extrabold text-slate-800 font-sans">{serpMetricsRevealed && s.as ? s.as : "—"}</span>
                          </td>
                          <td className="py-[19.8px] px-2 text-right">
                            <span className="font-sans font-semibold text-slate-655">{serpMetricsRevealed && s.refDomains ? s.refDomains : "—"}</span>
                          </td>
                          <td className="py-[19.8px] px-2 text-right">
                            <span className="font-semibold text-emerald-600 font-sans">{serpMetricsRevealed && s.backlinks ? s.backlinks : "—"}</span>
                          </td>
                          <td className="py-[19.8px] px-2 text-right font-sans font-semibold text-slate-800">
                            {serpMetricsRevealed && s.traffic ? s.traffic : "—"}
                          </td>
                          <td className="py-[19.8px] px-2 text-center pr-4 font-bold font-sans text-indigo-700">
                            {serpMetricsRevealed && s.keywordsCount ? s.keywordsCount.toLocaleString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>

              </div>
            </div>

          </div>

          {/* PLA COPIES SEGMENT */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs text-left">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <span>PLA Copies</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded">Ad Campaign Intelligence</span>
            </h3>
            
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">We have no advertising (PLA) placement data to show for "{searchedWord}"</p>
              <p className="text-xs text-slate-400 mt-1">This term shows high organic concentration with minimal transactional bidding history in this specific region.</p>
            </div>
          </div>

          {/* FINAL BOTTOM PROMO BLOCK */}
          <div className="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
            <div className="space-y-1.5 text-left">
              <h3 className="text-lg font-bold font-sans text-slate-900">
                You've scrolled through all the free data—ready for the <span className="text-indigo-600 font-extrabold underline">full story?</span>
              </h3>
              <p className="text-xs md:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Unlock deeper ranking history logs, compare backlinks matrices directly, and query actual regional competitor benchmarks using Semrush premium tools.
              </p>
            </div>

            <button 
              onClick={() => toast.success("Routing to Enterprise Upgrade consultation form...")}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-white hover:scale-102 transition-all font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-1 cursor-pointer shadow-md self-start md:self-center"
            >
              Get started <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

            </>
          )}

        </div>
      ) : activeTab === "bulk" ? (
        
        // TAB 2: BULK ANALYSIS WORKSPACE
        <div className="space-y-6 text-left">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">SEO Bulk Keyword Analysis Terminal</h3>
              <p className="text-xs text-slate-400 mt-0.5">Enter up to 50 keywords (one per line) to parse volume, KD, CPC, and intent ratios in real-time.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Core Keyword Set (1 phrase per line)</label>
              <textarea 
                rows={6}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="e.g.&#10;shoes brand&#10;free gaming APK link&#10;saas tools pricing"
                className="w-full bg-slate-50 hover:bg-white text-slate-800 font-mono text-xs border border-slate-250 p-4 rounded-xl focus:outline-none focus:border-[#ff642d] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                <Info className="w-3.5 h-3.5 text-[#ff642d]" />
                <span>Deterministic SEMrush model index computation active</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setBulkInput("")}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-4 rounded-lg border border-slate-200 transition-colors"
                >
                  Clear Terminal
                </button>
                <button 
                  onClick={handleBulkAnalysis}
                  className="bg-[#ff642d] hover:bg-[#e05320] text-white font-extrabold text-xs py-2 px-5 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Analyze list
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Results Table block */}
          {bulkResults.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs animate-fade-in">
              <div className="px-5 py-4 border-b border-gray-150 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Analyzed Term Metrics Matrix</h4>
                  <p className="text-xs text-slate-400">Total terms evaluated: <span className="font-extrabold text-slate-700 font-mono">{bulkResults.length}</span></p>
                </div>

                <button 
                  onClick={() => {
                    const headers = "Keyword,Volume,KD,CPC,Intent\n";
                    const rows = bulkResults.map(r => `"${r.keyword}",${r.volume},${r.kd},${r.cpc},"${r.intent}"`).join("\n");
                    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `bulk_keywords_${searchedWord || "unnamed"}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success(`Success! Compiled spreadsheet for ${bulkResults.length} terms saved.`);
                  }}
                  className="bg-white hover:bg-slate-100 border text-slate-750 font-bold text-xs py-1.5 px-3 rounded-md flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" /> Export CSV List
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b border-gray-100 text-left">
                      <th className="py-3 px-5">Target word</th>
                      <th className="py-3 px-5 text-right font-black">Search Volume</th>
                      <th className="py-3 px-5 text-center font-black">KD Ratio</th>
                      <th className="py-3 px-5 text-center font-black">Detected Intent</th>
                      <th className="py-3 px-5 text-right font-black">ValueCPC</th>
                      <th className="py-3 px-5 text-center font-black">Launch Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bulkResults.map((res, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-5">
                          <span className="font-bold text-slate-905 font-sans">{res.keyword}</span>
                        </td>
                        <td className="py-3 px-5 text-right font-sans font-semibold text-slate-950">{res.volume}</td>
                        <td className="py-3 px-5 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded font-sans font-bold text-slate-800">
                            <span className={`w-1.5 h-1.5 rounded-full ${getKdDotColor(res.kd)}`} />
                            <span>{res.kd}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${res.intent === "Transactional" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : res.intent === "Commercial" ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-sky-50 text-sky-700 border border-sky-100"}`}>
                            {res.intent}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-right font-sans font-semibold text-slate-700">{res.cpc}</td>
                        <td className="py-3 px-5 text-center">
                          <button 
                            onClick={() => {
                              setKeyword(res.keyword);
                              setSearchedWord(res.keyword);
                              setActiveTab("overview");
                              setSerpMetricsRevealed(false);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-2.5 py-1 rounded transition-colors"
                          >
                            Explore Overview
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* TAB 3: RELATIONAL DATABASE HISTORY FOOTPRINTS */
        <div className="space-y-6 text-left animate-fade-in pb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-5 h-5 text-indigo-600" /> Relational Audit Database Indexes
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live database querying lines from the persistent SQLite/PostgreSQL system storing audit trails.
                </p>
              </div>

              <button 
                onClick={async () => {
                  if (confirm("Are you sure you want to flush all cache and audit histories?")) {
                    await handleClearCache();
                    await loadSearchHistory();
                  }
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-2 px-4 rounded-xl border border-rose-200 transition-colors cursor-pointer"
              >
                Flush System Log Streams
              </button>
            </div>

            {historyLogs.length === 0 ? (
              <div className="py-12 text-center border rounded-xl bg-slate-50 border-dashed border-slate-200 flex flex-col items-center justify-center">
                <Clock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No persistent log records found</p>
                <p className="text-xs text-slate-400 mt-1">Start performing keyword searches to populate audit tables.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase border-b border-gray-150">
                      <th className="py-3 px-5">ID</th>
                      <th className="py-3 px-5">Phrase Query</th>
                      <th className="py-3 px-5">Geo Target</th>
                      <th className="py-3 px-5">Agent Client</th>
                      <th className="py-3 px-5">Timestamp</th>
                      <th className="py-3 px-5 text-right">DB Cache Status</th>
                      <th className="py-3 px-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-5 font-mono text-slate-400">#{log.id}</td>
                        <td className="py-3.5 px-5">
                          <span className="font-extrabold text-slate-900 text-sm font-mono">{log.keyword}</span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-black">{log.country}</span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-slate-500 font-semibold">{log.device}</span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-400 font-medium">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[9px] font-bold">Stored SQLite/PSQL</span>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <button 
                            onClick={() => {
                              setKeyword(log.keyword);
                              setSearchedWord(log.keyword);
                              setSelectedCountry(log.country);
                              setSelectedDevice(log.device);
                              setActiveTab("overview");
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] px-3 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Restore Search
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER METRICS INFO NOTE */}
      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-start gap-2.5 text-xs text-slate-500">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-slate-800 mb-0.5">Semrush Professional SEO Database Sync</p>
          <p className="leading-relaxed">
            Data values represent statistical monthly crawl aggregates. Cost Per Click (CPC) estimates are priced inside secondary Google ads auctions based on regional advertiser demand metrics.
          </p>
        </div>
      </div>

    </div>
  );
}
