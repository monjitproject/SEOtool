import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Link, 
  Map, 
  FileText, 
  Settings, 
  ChevronRight, 
  Search, 
  Copy, 
  Check, 
  RefreshCw, 
  Shield, 
  ExternalLink, 
  Layers, 
  Code,
  Sparkles,
  Database,
  ArrowRight,
  BookOpen,
  User,
  Tag
} from "lucide-react";

export default function SeoUrlSuiteView() {
  const [activeTab, setActiveTab] = useState<"architecture" | "slugs" | "redirects" | "sitemaps" | "meta" | "nextjs">("architecture");
  const [copied, setCopied] = useState<string | null>(null);

  // Slug states
  const [slugInput, setSlugInput] = useState("Best SEO Tools 2026!!!");
  const [slugOutput, setSlugOutput] = useState("");

  // Redirect states
  const [redirectOldInput, setRedirectOldInput] = useState("/index.php?id=123&cat=seo");
  const [redirectNewOutput, setRedirectNewOutput] = useState("");

  // Meta & Schema states
  const [metaUrlInput, setMetaUrlInput] = useState("/tools/keyword-overview/");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [selectedSchema, setSelectedSchema] = useState<"breadcrumb" | "article" | "org" | "faq">("breadcrumb");

  // Breadcrumbs states
  const [breadcrumbPath, setBreadcrumbPath] = useState("/category/seo/best-seo-tools/");

  // Trigger copy feedback
  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. Slug Generator Function
  const generateSlug = (text: string): string => {
    let slug = text.toLowerCase();
    
    // Transliterate common unicode/accent characters
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to   = "aaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
      slug = slug.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    slug = slug
      .replace(/[^a-z0-9 -]/g, "") // Remove special characters
      .trim()
      .replace(/\s+/g, "-")        // Replace spaces with hyphens
      .replace(/-+/g, "-");        // Collapse multiple hyphens

    // Prevent trailing or leading hyphens
    if (slug.startsWith("-")) slug = slug.substring(1);
    if (slug.endsWith("-")) slug = slug.substring(0, slug.length - 1);

    return slug;
  };

  // 2. Redirect Handler
  const resolveRedirect = (oldUrl: string): { newUrl: string; status: number; reason: string } => {
    const cleanUrl = oldUrl.trim();
    if (!cleanUrl) {
      return { newUrl: "/", status: 301, reason: "Default fallback to home" };
    }

    // Try parsing as URL or path with search params
    try {
      const urlObj = new URL(cleanUrl, "https://example.com");
      const pathname = urlObj.pathname;
      const searchParams = urlObj.searchParams;

      // Rule 1: ?id=123
      if (searchParams.has("id")) {
        const id = searchParams.get("id");
        if (id === "123") {
          return { newUrl: "/best-seo-tools/", status: 301, reason: "Matched historic post ID 123 -> modern clean URL" };
        }
        return { newUrl: `/post-${id}/`, status: 301, reason: "Redirected from dynamic ID parameter to slugified container" };
      }

      // Rule 2: ?page=5
      if (searchParams.has("page")) {
        const page = searchParams.get("page");
        return { newUrl: `/blog/page/${page}/`, status: 301, reason: "Mapped legacy page parameter to structured pagination URL" };
      }

      // Rule 3: &cat=seo or ?cat=seo
      if (searchParams.has("cat")) {
        const cat = searchParams.get("cat");
        return { newUrl: `/category/${generateSlug(cat || "seo")}/`, status: 301, reason: "Transformed dynamic category query into folder hierarchy" };
      }

      // Rule 4: Match legacy html extension
      if (pathname.endsWith(".html") || pathname.endsWith(".php")) {
        const base = pathname.replace(/\.(html|php)$/, "");
        const slug = generateSlug(base.split("/").pop() || "");
        return { newUrl: `/blog/${slug}/`, status: 301, reason: "Stripped technology extensions (.html/.php) to clean folders" };
      }

      // Rule 5: Match dynamic tools format
      if (pathname.includes("keyword-research") || pathname.includes("keyword_research")) {
        return { newUrl: "/tools/keyword-research/", status: 301, reason: "Redirected legacy tool file to unified modern directory" };
      }
    } catch (e) {
      // Fallback
    }

    return { 
      newUrl: `/${generateSlug(cleanUrl)}/`, 
      status: 301, 
      reason: "Standard 301 Redirect fallback with automated SEO slug sanitization" 
    };
  };

  // 3. Dynamic Meta & Canonical Tag Simulator
  useEffect(() => {
    const url = metaUrlInput.toLowerCase().trim();
    let title = "SEO Tool - Professional Rank Intelligence Suite";
    let desc = "Command organic search with enterprise-grade keyword analytics, deep backlink crawls, and automatic site health audits.";
    let canon = `https://seotool.com${url}`;

    if (url.includes("/keyword/")) {
      const parts = url.split("/keyword/").filter(Boolean);
      const kw = parts[0]?.replace(/\/$/, "") || "seo-tools";
      const kwNormal = kw.replace(/-/g, " ");
      title = `Keyword Analysis for "${kwNormal}" - Search Volume & Rank Metrics`;
      desc = `Get detailed monthly search volume, keyword difficulty (KD), CPC rates, and competitive density for "${kwNormal}". Scale your rankings today.`;
    } else if (url.includes("/domain/")) {
      const parts = url.split("/domain/").filter(Boolean);
      const dom = parts[0]?.replace(/\/$/, "") || "seotool.com";
      title = `${dom} Domain Overview - Backlink Authority & Organic Traffic Audit`;
      desc = `Analyze organic keywords, estimated monthly search traffic, authority score, and detailed referring domain profiles for ${dom}.`;
    } else if (url.includes("/backlinks/")) {
      const parts = url.split("/backlinks/").filter(Boolean);
      const dom = parts[0]?.replace(/\/$/, "") || "seotool.com";
      title = `Backlink Profile & Link Audit for ${dom} | SEO Tool`;
      desc = `Audit backlink quality, anchor texts, referring domains count, and follow vs nofollow percentages for ${dom}. Prevent penalty issues.`;
    } else if (url.includes("/audit/")) {
      const parts = url.split("/audit/").filter(Boolean);
      const dom = parts[0]?.replace(/\/$/, "") || "example.com";
      title = `Site Technical SEO Audit for ${dom} - Crawl & Health Score`;
      desc = `Detect broken links, duplicate title issues, Core Web Vitals bottlenecks, and markup warnings for ${dom}. Fix structural crawl errors immediately.`;
    } else if (url.includes("/tools/keyword-research")) {
      title = "Keyword Magic Tool & Research Suite | SEO Tool";
      desc = "Discover high-intent keyword variations, search query questions, and dynamic cluster ideas with our ultimate keyword database.";
    } else if (url.includes("/tools/domain-overview")) {
      title = "Domain Competitor Overview Tool | SEO Tool";
      desc = "Enter any domain to audit traffic metrics, authority stats, and global keyword distribution maps immediately.";
    } else if (url.includes("/blog/")) {
      title = "SEO Strategy & Marketing Blog | SEO Tool";
      desc = "Read our latest articles, expert guides, and Google Algorithm update breakdowns to stay ahead of search landscape shifts.";
    }

    setMetaTitle(title);
    setMetaDesc(desc);
    setCanonicalUrl(canon);
  }, [metaUrlInput]);

  // Sync state helpers
  useEffect(() => {
    setSlugOutput(generateSlug(slugInput));
  }, [slugInput]);

  useEffect(() => {
    const res = resolveRedirect(redirectOldInput);
    setRedirectNewOutput(res.newUrl);
  }, [redirectOldInput]);

  // Generate Schemas based on selections
  const generateSchemaJSON = () => {
    switch (selectedSchema) {
      case "breadcrumb":
        return `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://seotool.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://seotool.com/blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "SEO",
      "item": "https://seotool.com/category/seo/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Best SEO Tools",
      "item": "https://seotool.com/best-seo-tools/"
    }
  ]
}`;
      case "article":
        return `{
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://seotool.com/best-seo-tools/"
  },
  "headline": "Best SEO Tools to Skyrocket Your Search Performance",
  "description": "Discover the finest automated search engines, audit suites, and backlink checkers to outpace competitive domains.",
  "image": "https://seotool.com/assets/images/best-seo-tools-banner.jpg",
  "author": {
    "@type": "Person",
    "name": "Alex Mercer",
    "url": "https://seotool.com/author/alex-mercer/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SEO Tool Inc.",
    "logo": {
      "@type": "ImageObject",
      "url": "https://seotool.com/assets/logo.png"
    }
  },
  "datePublished": "2026-01-15T08:00:00+00:00",
  "dateModified": "2026-06-24T19:00:00+00:00"
}`;
      case "org":
        return `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SEO Tool",
  "alternateName": "SEO Tool Suite",
  "url": "https://seotool.com",
  "logo": "https://seotool.com/assets/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-555-0199",
    "contactType": "customer service",
    "areaServed": "US",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://facebook.com/seotool",
    "https://twitter.com/seotool",
    "https://linkedin.com/company/seotool"
  ]
}`;
      case "faq":
        return `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Keyword Difficulty?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Keyword Difficulty (KD) is an index ranging from 0 to 100 that represents how hard it is to rank organically in Google's top 10 search results for a specific query."
      }
    },
    {
      "@type": "Question",
      "name": "Are domain metrics generated in real time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our system queries high-fidelity Generative AI databases and search crawls to fetch up-to-date monthly parameters."
      }
    }
  ]
}`;
    }
  };

  // XML Sitemaps data
  const getSitemapXML = (type: "index" | "post" | "category" | "tool" | "tag") => {
    switch (type) {
      case "index":
        return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://seotool.com/post-sitemap.xml</loc>
    <lastmod>2026-06-24T19:00:00+00:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://seotool.com/category-sitemap.xml</loc>
    <lastmod>2026-06-24T19:00:00+00:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://seotool.com/tool-sitemap.xml</loc>
    <lastmod>2026-06-24T19:00:00+00:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://seotool.com/tag-sitemap.xml</loc>
    <lastmod>2026-06-24T19:00:00+00:00</lastmod>
  </sitemap>
</sitemapindex>`;
      case "post":
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seotool.com/best-seo-tools/</loc>
    <lastmod>2026-06-24T19:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://seotool.com/how-to-rank-on-google/</loc>
    <lastmod>2026-06-20T10:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://seotool.com/keyword-research-guide/</loc>
    <lastmod>2026-06-18T14:30:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
      case "category":
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seotool.com/category/seo/</loc>
    <lastmod>2026-06-24T19:00:00+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://seotool.com/category/content-marketing/</loc>
    <lastmod>2026-06-22T08:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
      case "tool":
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seotool.com/tools/keyword-overview/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seotool.com/tools/keyword-magic-tool/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seotool.com/tools/domain-overview/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
      case "tag":
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seotool.com/tag/seo-tools/</loc>
    <lastmod>2026-06-24T19:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://seotool.com/tag/backlinks/</loc>
    <lastmod>2026-06-24T19:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`;
    }
  };

  const getRobotsTxt = () => {
    return `# Dynamic robots.txt generated by SEO Tool Architecture Engine
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/

# Sitemaps declaration
Sitemap: https://seotool.com/sitemap.xml
`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Technical SEO Suite
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                <Shield className="w-3.5 h-3.5" /> Core Schema Engine Active
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-sans">
              Dynamic SEO URL & Routing Architecture
            </h1>
            <p className="text-sm text-gray-500 max-w-3xl">
              Simulate and inspect professional URL rewriting, automatic slug generation, canonical rules, XML sitemaps, robots.txt directives, and custom structured JSON-LD schemas.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setSlugInput("Best SEO Tools 2026!!!");
                setRedirectOldInput("/index.php?id=123&cat=seo");
                setMetaUrlInput("/tools/keyword-overview/");
              }}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Playboard
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto pb-px">
        {[
          { id: "architecture", label: "URL Architecture Map", icon: Link },
          { id: "slugs", label: "Automated Slug System", icon: Sparkles },
          { id: "redirects", label: "301 Redirect Rules", icon: ChevronRight },
          { id: "sitemaps", label: "Sitemaps & Robots.txt", icon: Map },
          { id: "meta", label: "Meta & Schema Playground", icon: FileText },
          { id: "nextjs", label: "Next.js Dynamic Routing", icon: Code }
        ].map(tab => {
          const ActiveIcon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                active 
                  ? "border-purple-600 text-purple-600 font-bold" 
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <ActiveIcon className={`w-4 h-4 ${active ? "text-purple-600" : "text-gray-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab content area */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 1. URL Architecture Map */}
            {activeTab === "architecture" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Rules summary */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Link className="w-5 h-5 text-purple-600" />
                        Human-Readable Slug Directories
                      </h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Eliminate messy query string parameters that leak server technology details and fragment link equity. We enforce clean, slash-terminated, semantic folders.
                      </p>

                      <div className="space-y-4">
                        {[
                          { title: "Dynamic Search URLs", type: "Search Engine", oldUrl: "?tool=keyword&q=seo-tools", newUrl: "/keyword/seo-tools/", color: "purple" },
                          { title: "Competitor Overview Domain", type: "Search Engine", oldUrl: "?type=domain&query=openai.com", newUrl: "/domain/openai.com/", color: "purple" },
                          { title: "Backlink Analytics Anchor", type: "Search Engine", oldUrl: "?type=backlinks&query=openai.com", newUrl: "/backlinks/openai.com/", color: "blue" },
                          { title: "Health Audit Crawler", type: "Search Engine", oldUrl: "?type=audit&query=example.com", newUrl: "/audit/example.com/", color: "emerald" },
                          { title: "Primary Post Template", type: "Blog Articles", oldUrl: "/blog-post.php?id=123", newUrl: "/best-seo-tools/", color: "orange" },
                          { title: "Taxonomy Classification", type: "Categories", oldUrl: "/index.php?cat=seo", newUrl: "/category/seo/", color: "rose" },
                          { title: "Semantic Filter tags", type: "Tags", oldUrl: "/tag.html?name=seo-tools", newUrl: "/tag/seo-tools/", color: "sky" },
                          { title: "Dedicated Tool Workspace", type: "Apps & Tools", oldUrl: "/keyword-research.html", newUrl: "/tools/keyword-research/", color: "indigo" }
                        ].map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-150 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full bg-${item.color}-500`}></span>
                                <span className="text-sm font-bold text-gray-800">{item.title}</span>
                              </div>
                              <span className="text-xs text-gray-400 block font-mono">{item.type}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-2.5 py-1 bg-red-50 text-red-700 font-mono rounded-md border border-red-100 line-through">
                                {item.oldUrl}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold font-mono rounded-md border border-emerald-100">
                                {item.newUrl}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Visual Breadcrumbs and automatic schemas */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Automatic Breadcrumbs
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        Enables clean visual navigation for users while building deep hierarchical relevance loops for Google crawlers.
                      </p>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-150 space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Enter Path to Test Breadcrumbs:</label>
                          <input 
                            type="text" 
                            value={breadcrumbPath}
                            onChange={(e) => setBreadcrumbPath(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md font-mono bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <span className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">Visual Rendering:</span>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-600 font-medium bg-white px-3 py-2 rounded border border-gray-150">
                            <span>Home</span>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                            {breadcrumbPath.split("/").filter(Boolean).map((part, i, arr) => (
                              <React.Fragment key={i}>
                                <span className={i === arr.length - 1 ? "text-purple-600 font-bold" : "capitalize text-gray-800"}>
                                  {part.replace(/-/g, " ")}
                                </span>
                                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        <div className="text-[11px] text-gray-400">
                          * Generates automated <strong>BreadcrumbList Schema</strong> dynamically inside head.
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-xl p-6 text-white space-y-4 shadow-sm">
                      <h4 className="font-bold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-300" /> Core Canonical Rules
                      </h4>
                      <ul className="text-xs space-y-3 text-purple-200">
                        <li className="flex gap-2">
                          <span className="text-purple-400 font-bold font-mono">1.</span>
                          <span>Always include trailing slashes automatically to prevent multi-indexed duplicate headers.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-purple-400 font-bold font-mono">2.</span>
                          <span>Serve <code>rel="canonical"</code> referencing the pristine, absolute protocol and host.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-purple-400 font-bold font-mono">3.</span>
                          <span>Avoid dynamic tracking queries like <code>?fbclid</code> or <code>?utm_source</code> in canonical tags.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Automated Slug System */}
            {activeTab === "slugs" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Transliterated Hyphen-Separated Slug Engine
                  </h3>
                </div>
                <p className="text-sm text-gray-500 max-w-4xl">
                  Test our custom slug generation algorithm. It strips away special punctuation marks, translates accent marks or unicode elements, normalizes everything to clean lowercase, and forces uniform hyphen boundaries.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pristine Headline Input:</label>
                    <textarea
                      value={slugInput}
                      onChange={(e) => setSlugInput(e.target.value)}
                      placeholder="e.g., Best SEO Tools 2026!!!"
                      className="w-full h-32 p-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white font-medium"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col justify-between">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pruned SEO Friendly Slug Output:</label>
                      <div className="w-full h-24 p-4 text-sm bg-gray-900 text-purple-300 font-mono rounded-lg flex items-center justify-between border border-gray-850">
                        <span>{slugOutput ? `/${slugOutput}/` : "/"}</span>
                        {slugOutput && (
                          <button 
                            onClick={() => triggerCopy(`/${slugOutput}/`, "slug")}
                            className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
                            title="Copy Slug"
                          >
                            {copied === "slug" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-gray-150 space-y-2">
                      <span className="text-xs font-bold text-gray-700 block">Sanitization Highlights Applied:</span>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded">Force Lowercase</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded">Strip Exclamation/Symbols</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">Accent Transliteration</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded">No Double Hyphens</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive example list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Example Transformation Database:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                    {[
                      { original: "Mastering SEO in 2026! A-Z Guide", result: "/mastering-seo-in-2026-a-z-guide/" },
                      { original: "Café SEO: Content, Authority, & Links", result: "/cafe-seo-content-authority-links/" },
                      { original: "Domain Ranking Checkers --- Free list", result: "/domain-ranking-checkers-free-list/" }
                    ].map((ex, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 border border-gray-250 hover:border-purple-300 rounded-lg bg-gray-50 hover:bg-white transition-all cursor-pointer"
                        onClick={() => setSlugInput(ex.original)}
                      >
                        <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">Click to load:</span>
                        <span className="text-gray-800 font-bold block">{ex.original}</span>
                        <span className="text-purple-600 block font-mono mt-1 font-bold">{ex.result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. 301 Redirect Rules */}
            {activeTab === "redirects" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5">
                  <ChevronRight className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Legacy Parameter to Semantic Path Rewrite Engine
                  </h3>
                </div>
                <p className="text-sm text-gray-500 max-w-4xl">
                  Prevent broken backlinks and indexing loss. Input legacy URL patterns below to simulate how the server parses them and automatically issues a <strong>301 Moved Permanently</strong> redirect to the optimized path.
                </p>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Legacy Query URL / Path:</label>
                      <input 
                        type="text" 
                        value={redirectOldInput}
                        onChange={(e) => setRedirectOldInput(e.target.value)}
                        placeholder="e.g., /index.php?id=123"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg font-mono bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pristine 301 Redirect Target:</label>
                      <div className="w-full px-4 py-2.5 text-sm bg-gray-950 text-emerald-400 font-mono rounded-lg flex items-center justify-between border border-gray-900 font-bold">
                        <span>{redirectNewOutput}</span>
                        <button 
                          onClick={() => triggerCopy(redirectNewOutput, "redir")}
                          className="p-1 hover:bg-gray-850 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
                          title="Copy Target"
                        >
                          {copied === "redir" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                    <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block mb-1">Crawl Engine Action / Match Verdict:</span>
                    <p className="text-xs text-purple-900 font-semibold">
                      {resolveRedirect(redirectOldInput).reason}
                    </p>
                  </div>
                </div>

                {/* Common test scenarios */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Simulated Mapping Catalog (Click to Test):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { label: "Post ID Parameter", old: "/post.php?id=123" },
                      { label: "Category Parameter", old: "/category-list.php?cat=seo-tips" },
                      { label: "Legacy HTML Extension", old: "/keyword-research-guide.html" },
                      { label: "Messy Pagination", old: "/blog.php?page=5" }
                    ].map((sc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setRedirectOldInput(sc.old)}
                        className="p-3 text-left border border-gray-200 hover:border-purple-300 bg-gray-50 hover:bg-white rounded-lg transition-all cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-purple-600 block mb-1">{sc.label}</span>
                        <span className="text-xs font-mono text-gray-700 block truncate">{sc.old}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Sitemaps & Robots.txt */}
            {activeTab === "sitemaps" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sitemaps Panel */}
                  <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Map className="w-5 h-5 text-purple-600" />
                        Dynamic XML Sitemap Index System
                      </h3>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full uppercase">
                        Pruned for Google Search console
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Sitemaps partition and prioritize site crawls, ensuring index priority is allocated to pages that attract search visibility. Select a dynamic sitemap below to view its XML markup structure:
                    </p>

                    {/* Sitemap selector tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-gray-150 pb-3">
                      {[
                        { id: "index", label: "/sitemap.xml (Index)" },
                        { id: "post", label: "/post-sitemap.xml" },
                        { id: "category", label: "/category-sitemap.xml" },
                        { id: "tool", label: "/tool-sitemap.xml" },
                        { id: "tag", label: "/tag-sitemap.xml" }
                      ].map(sm => {
                        const active = (metaUrlInput === sm.id);
                        return (
                          <button
                            key={sm.id}
                            onClick={() => setMetaUrlInput(sm.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                              active
                                ? "bg-purple-600 text-white shadow-xs"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                            }`}
                          >
                            {sm.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Code render box */}
                    <div className="relative">
                      <div className="absolute right-4 top-4 z-10">
                        <button
                          onClick={() => triggerCopy(getSitemapXML(metaUrlInput as any || "index"), "xml")}
                          className="px-2.5 py-1 text-[11px] font-bold text-gray-300 bg-gray-800 hover:bg-gray-750 hover:text-white rounded border border-gray-700 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copied === "xml" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied === "xml" ? "Copied XML" : "Copy XML Schema"}
                        </button>
                      </div>
                      <pre className="p-5 text-xs bg-gray-900 text-purple-300 rounded-xl overflow-x-auto font-mono border border-gray-850 h-96">
                        {getSitemapXML(metaUrlInput as any || "index")}
                      </pre>
                    </div>
                  </div>

                  {/* Robots.txt panel */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        Robots.txt Output
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        Tells crawlers which directories can be requested. Declares sitemap placement so Google finds our index naturally.
                      </p>

                      <div className="relative">
                        <pre className="p-4 text-xs bg-gray-900 text-purple-200 rounded-lg overflow-x-auto font-mono border border-gray-850 h-64">
                          {getRobotsTxt()}
                        </pre>
                        <button
                          onClick={() => triggerCopy(getRobotsTxt(), "robots")}
                          className="absolute right-3 top-3 p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
                          title="Copy robots.txt"
                        >
                          {copied === "robots" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 border border-purple-100 rounded-lg text-xs space-y-2">
                      <span className="font-bold text-purple-800 block uppercase tracking-wide">Crawler Directives Added:</span>
                      <ul className="list-disc pl-4 space-y-1 text-purple-900">
                        <li><code>Allow: /</code> (Full Indexation of app)</li>
                        <li><code>Disallow: /admin/</code> (Protects configuration dashboard)</li>
                        <li><code>Disallow: /api/</code> (Saves CPU limits by blocking endpoint crawl noise)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Meta & Schema Playground */}
            {activeTab === "meta" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Headers & Head simulation */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-purple-600" />
                      Dynamic Meta tags & Social Cards Auditor
                    </h3>
                    <p className="text-sm text-gray-500">
                      Select or type a path to see how the metadata engine dynamically injects headers, Open Graph, and Twitter crawler cards to optimize search click-through rates.
                    </p>

                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-150">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Audit Pathname Input:</label>
                        <select
                          value={metaUrlInput}
                          onChange={(e) => setMetaUrlInput(e.target.value)}
                          className="w-full mt-1 px-3 py-2 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                        >
                          <option value="/tools/keyword-overview/">/tools/keyword-overview/</option>
                          <option value="/keyword/seo-tools/">/keyword/seo-tools/</option>
                          <option value="/domain/google.com/">/domain/google.com/</option>
                          <option value="/backlinks/openai.com/">/backlinks/openai.com/</option>
                          <option value="/audit/example.com/">/audit/example.com/</option>
                          <option value="/blog/best-seo-tools/">/blog/best-seo-tools/</option>
                        </select>
                      </div>

                      <div className="space-y-2 text-xs font-semibold">
                        <div className="bg-white p-3 rounded border border-gray-150">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Meta Title Tag:</span>
                          <p className="text-gray-800 mt-1 font-bold">{metaTitle}</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-150">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Meta Description:</span>
                          <p className="text-gray-600 mt-1 font-medium">{metaDesc}</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-150">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Canonical Link URL:</span>
                          <p className="text-purple-600 mt-1 font-mono">{canonicalUrl}</p>
                        </div>
                      </div>
                    </div>

                    {/* Social mockup card */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        <span className="text-[10px] text-gray-400 font-mono ml-2 font-bold">Google Search Preview snippet</span>
                      </div>
                      <div className="p-4 bg-white space-y-1">
                        <span className="text-[11px] text-gray-500 font-mono">seotool.com &gt; tools &gt; overview</span>
                        <h4 className="text-sm font-bold text-blue-800 hover:underline cursor-pointer leading-tight">
                          {metaTitle}
                        </h4>
                        <p className="text-xs text-gray-600 leading-normal">
                          {metaDesc.slice(0, 150)}...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Schemas & Structured Data Code */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Code className="w-5 h-5 text-purple-600" />
                        JSON-LD Schema Markup Engine
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Structured schema markup provides explicit clues about the meaning of a page to search engine crawlers, enabling rich snippets like review stars, FAQs, or event dates.
                    </p>

                    {/* Schema selector tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-gray-150 pb-3">
                      {[
                        { id: "breadcrumb", label: "BreadcrumbList Schema" },
                        { id: "article", label: "Article Schema" },
                        { id: "org", label: "Organization Schema" },
                        { id: "faq", label: "FAQ Page Schema" }
                      ].map(sc => {
                        const active = (selectedSchema === sc.id);
                        return (
                          <button
                            key={sc.id}
                            onClick={() => setSelectedSchema(sc.id as any)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                              active
                                ? "bg-purple-600 text-white shadow-xs"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                            }`}
                          >
                            {sc.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Code render box */}
                    <div className="relative">
                      <div className="absolute right-4 top-4 z-10">
                        <button
                          onClick={() => triggerCopy(generateSchemaJSON(), "schema")}
                          className="px-2.5 py-1 text-[11px] font-bold text-gray-300 bg-gray-800 hover:bg-gray-750 hover:text-white rounded border border-gray-700 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copied === "schema" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied === "schema" ? "Copied" : "Copy JSON-LD"}
                        </button>
                      </div>
                      <pre className="p-4 text-xs bg-gray-900 text-emerald-300 rounded-xl overflow-x-auto font-mono border border-gray-850 h-96">
                        {generateSchemaJSON()}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Next.js Routing Map */}
            {activeTab === "nextjs" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <div className="flex items-center gap-2.5">
                    <Code className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Vite SPA to Next.js App Router Migration Blueprints
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 max-w-4xl">
                    For enterprise-scale SEO campaigns, migrating the SPA views to Next.js file-based routing ensures full pre-rendering (SSR/SSG) of pages, enabling instant crawler delivery of content, optimized Core Web Vitals, and automatic asset processing.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Directory structure map */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Recommended Directory Tree (App Router):</span>
                      <pre className="text-xs font-mono text-gray-800 bg-white p-4 rounded-lg border border-gray-150 overflow-x-auto leading-relaxed">
{`app/
├── layout.tsx                # Base metadata, HTML Shell & Sidebar
├── page.tsx                  # Home Dashboard View (/)
├── sitemap.ts                # Dynamic Sitemap Generation API
├── robots.ts                 # Dynamic robots.txt API
├── post-sitemap.xml/
│   └── route.ts              # Custom post sitemap stream
├── [slug]/
│   ├── page.tsx              # Dynamic Clean Post Page (/best-seo-tools/)
│   └── layout.tsx            # Injects dynamic Article JSON-LD Schema
├── category/
│   └── [slug]/
│       └── page.tsx          # Dynamic Category Listings Page
├── tag/
│   └── [slug]/
│       └── page.tsx          # Dynamic Tag Filters page
├── author/
│   └── [slug]/
│       └── page.tsx          # Dynamic Author Page
├── tools/
│   ├── layout.tsx            # Unified layout wrapper for SaaS apps
│   ├── keyword-overview/
│   │   └── page.tsx          # Keyword Overview Workspace (/tools/keyword-overview/)
│   ├── domain-overview/
│   │   └── page.tsx          # Domain Overview Workspace (/tools/domain-overview/)
│   └── backlink-checker/
│       └── page.tsx          # Backlinks Workspace (/tools/backlink-checker/)
├── keyword/
│   └── [keyword]/
│       └── page.tsx          # Dynamic Search URL for Keyword (/keyword/[keyword])
├── domain/
│   └── [domain]/
│       └── page.tsx          # Dynamic Search URL for Domain (/domain/[domain])
└── audit/
    └── [domain]/
        └── page.tsx          # Dynamic Site Audit URL (/audit/[domain])`}
                      </pre>
                    </div>

                    {/* Code comparison block */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-xl p-6 text-white space-y-4 shadow-sm">
                        <h4 className="font-bold flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-300" /> Next.js Dynamic Head Metadata Example
                        </h4>
                        <p className="text-xs text-purple-200 leading-normal">
                          By leveraging the <code>generateMetadata</code> hook in Next.js, metadata is generated dynamically on the server before transferring the response, avoiding client-side layout flashes and maximizing rank potential.
                        </p>
                        <pre className="text-[11px] font-mono text-purple-100 bg-black/30 p-4 rounded border border-purple-800 overflow-x-auto">
{`// app/domain/[domain]/page.tsx
import { Metadata } from 'next';

interface Props {
  params: { domain: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const domain = params.domain;
  return {
    title: \`\${domain} Domain Analytics Overview | SEO Tool\`,
    description: \`Analyze backlinks, organic traffic indexes, and top-ranking keywords for \${domain}.\`,
    alternates: {
      canonical: \`https://seotool.com/domain/\${domain}/\`
    }
  };
}

export default function Page({ params }: Props) {
  return <DomainOverviewView initialDomain={params.domain} />;
}`}
                        </pre>
                      </div>

                      {/* Benefits box */}
                      <div className="bg-white rounded-xl p-5 border border-gray-200 space-y-3 shadow-xs">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Dynamic Pre-rendering Performance Gain:</span>
                        <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                          <div className="p-3 bg-purple-50 rounded-lg text-purple-900 border border-purple-100">
                            <span className="text-lg font-bold block text-purple-800">100%</span>
                            <span>Crawler Search Visibility Index</span>
                          </div>
                          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 border border-emerald-100">
                            <span className="text-lg font-bold block text-emerald-800">0.2s</span>
                            <span>First Contentful Paint (FCP) Limit</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Checklist section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          Senior Architect Technical SEO Checklist & Implementation Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 font-medium">
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800">Canonical & Duplicate URL Prevention</h4>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>Strictly redirect all uppercase URLs to lowercase via middleware.</li>
              <li>Force unified trailing slash policies across server-side routing (redirect `/about` to `/about/`).</li>
              <li>Always self-reference standard paths using absolute canonical attributes.</li>
              <li>Prevent query fragmentation from dynamic tracking parameters by filtering search params in canonical URLs.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800">Structured Schema & Rich Snippets</h4>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>Compile correct <code>BreadcrumbList</code> schemas dynamically reflecting exact active site directories.</li>
              <li>Ensure <code>Article</code> schema publishes valid author links, dates, and safe high-res hero images.</li>
              <li>Inject correct, complete <code>Organization</code> parameters with contact details and verified social profiles.</li>
              <li>Optimize <code>FAQPage</code> markup to render structured Accordion cards inside Google SERP listings.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
