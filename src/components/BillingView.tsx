/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CreditCard, 
  Check, 
  Award, 
  Sparkles, 
  HelpCircle, 
  Sliders, 
  ChevronRight,
  Shield,
  RefreshCw
} from "lucide-react";

export default function BillingView() {
  const [currentPlan, setCurrentPlan] = useState<"Trial" | "Pro" | "Enterprise">("Trial");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<"Pro" | "Enterprise" | null>(null);

  // Card form states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPlan) return;
    
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentSuccess(true);
      setCurrentPlan(checkoutPlan);
      setCheckoutPlan(null);
    }, 1500);
  };

  // Remaining usage progress trackers
  const isTrial = currentPlan === "Trial";
  const limitValues = {
    searchVolume: isTrial ? { used: 84, total: 100 } : currentPlan === "Pro" ? { used: 120, total: 2500 } : { used: 254, total: 99999 },
    crawlCredits: isTrial ? { used: 3, total: 5 } : currentPlan === "Pro" ? { used: 12, total: 200 } : { used: 22, total: 2000 },
    aiTokens: isTrial ? { used: 1540, total: 5000 } : currentPlan === "Pro" ? { used: 2200, total: 100000 } : { used: 8400, total: 9999999 },
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-purple-600" /> Billing & Workspace Subscription
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Monitor search quotas limits, manage secure transaction methods, or transition memberships
        </p>
      </div>

      {paymentSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-left flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" /> Account Premium Upgrade Successful!
            </h3>
            <p className="text-xs text-emerald-600 mt-1">
              Enjoy complete uncapped access to high domain authority indices, backlinks CSV generators, and live sitemaps auditing.
            </p>
          </div>
          <button 
            onClick={() => setPaymentSuccess(false)}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            Acknowledge
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Usage Credit Bars */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-left lg:col-span-1 space-y-5">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Membership Profile</span>
            <span className="text-lg font-black text-gray-850 mt-1 block flex items-center gap-1.5">
              <Award className="w-5 h-5 text-purple-600" /> SuiteRank {currentPlan} Tier
            </span>
          </div>

          <div className="space-y-4 pt-2 font-sans">
            
            {/* Search volume block */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-750 font-semibold">
                <span>Keyword Search Inquiries</span>
                <span className="font-mono text-gray-400 font-medium">
                  {limitValues.searchVolume.used} / {isTrial ? limitValues.searchVolume.total : limitValues.searchVolume.total.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-150 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-800 rounded-full" 
                  style={{ width: `${Math.min(100, (limitValues.searchVolume.used / limitValues.searchVolume.total) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-gray-400">Resets monthly following crawl indexing schedules.</p>
            </div>

            {/* Sitemap crawler block */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-750 font-semibold">
                <span>Domain Crawl Audits</span>
                <span className="font-mono text-gray-400 font-medium">
                  {limitValues.crawlCredits.used} / {limitValues.crawlCredits.total}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-150 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" 
                  style={{ width: `${Math.min(100, (limitValues.crawlCredits.used / limitValues.crawlCredits.total) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-gray-400">Total websites checked for link breaks and metas.</p>
            </div>

            {/* AI Generator words block */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-750 font-semibold">
                <span>AI Copywriter Tokens</span>
                <span className="font-mono text-gray-400 font-medium">
                  {limitValues.aiTokens.used.toLocaleString()} / {isTrial ? limitValues.aiTokens.total.toLocaleString() : "Uncapped"}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-150 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-800 rounded-full" 
                  style={{ width: `${Math.min(100, (limitValues.aiTokens.used / limitValues.aiTokens.total) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-gray-400">Generated brief outputs and clusters from Gemini.</p>
            </div>

          </div>
        </div>

        {/* Right Side: Plans Comparables Grid */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card checkout modal form */}
          {checkoutPlan && (
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl text-left space-y-4">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">Checkout Portal & secure transaction</span>
              <h3 className="text-base font-extrabold">Complete Upgrade to SuiteRank {checkoutPlan}</h3>
              
              <form onSubmit={handleCheckoutSubmit} className="space-y-3 font-sans">
                
                {/* Credit Card inputs */}
                <div>
                  <label className="text-[9px] uppercase text-gray-300 font-bold block mb-1">Card Number</label>
                  <input 
                    type="text" 
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    className="w-full bg-slate-800 border border-slate-700 py-1.5 px-3 text-xs text-white rounded-lg outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] uppercase text-gray-300 font-bold block mb-1">Expiration MM/YY</label>
                    <input 
                      type="text" 
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full bg-slate-800 border border-slate-700 py-1.5 px-3 text-xs text-white rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase text-gray-300 font-bold block mb-1">Secure CVC</label>
                    <input 
                      type="text" 
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      maxLength={3}
                      className="w-full bg-slate-800 border border-slate-700 py-1.5 px-3 text-xs text-white rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 text-xs font-semibold">
                  <button 
                    type="button"
                    onClick={() => setCheckoutPlan(null)}
                    className="py-1.5 px-3 hover:bg-white/10 rounded transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={paymentLoading}
                    className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:from-purple-700 hover:via-pink-600 hover:to-blue-600 py-1.5 px-5 text-white font-bold rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/15"
                  >
                    {paymentLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" /> Upgrading...
                      </>
                    ) : (
                      <>
                        Upgrade Membership
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Three Tier Plan boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            
            {/* Free plan box */}
            <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between border-gray-150">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Basic Sandbox</span>
                <span className="text-xl font-black text-gray-850 mt-1 block">Trial Sandbox</span>
                <div className="mt-2 text-2xl font-black text-gray-900 font-mono">
                  $0 <span className="text-xs text-gray-400 font-sans font-medium">/ mo</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                  Excellent entry sandbox to test search volume tables, crawl models and review metric clusters.
                </p>
              </div>
              <div className="pt-4">
                <span className="bg-slate-100 text-slate-750 text-xs font-bold py-1 px-3 rounded-md block text-center border border-slate-200">
                  Active Workspace Plan
                </span>
              </div>
            </div>

            {/* Pro Plan box */}
            <div className={`bg-white border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between ${currentPlan === "Pro" ? "border-purple-500" : "border-gray-150"}`}>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider block">Recommended</span>
                  <span className="bg-purple-100 text-purple-700 font-bold text-[9px] px-1.5 rounded uppercase">Hot</span>
                </div>
                <span className="text-xl font-black text-gray-850 mt-1 block">Professional</span>
                <div className="mt-2 text-2xl font-black text-gray-900 font-mono">
                  $129 <span className="text-xs text-gray-400 font-sans font-medium">/ mo</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                  For growing agencies seeking to analyze competitive gaps, export sitemap checks and build premium white label reports.
                </p>
              </div>
              <div className="pt-4">
                {currentPlan === "Pro" ? (
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold py-1 px-3 rounded-md block text-center border border-emerald-100">
                    🟢 Subscribed
                  </span>
                ) : (
                  <button 
                    onClick={() => { setCheckoutPlan("Pro"); setPaymentSuccess(false); }}
                    className="w-full bg-[#111827] hover:bg-gray-800 text-xs font-bold text-white py-1.5 px-3 rounded-md transition-all text-center cursor-pointer"
                  >
                    Select Plan
                  </button>
                )}
              </div>
            </div>

            {/* Enterprise Plan box */}
            <div className={`bg-white border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between ${currentPlan === "Enterprise" ? "border-emerald-500" : "border-gray-150"}`}>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Corporate Tier</span>
                <span className="text-xl font-black text-gray-850 mt-1 block">Corporate Premium</span>
                <div className="mt-2 text-2xl font-black text-gray-900 font-mono">
                  $449 <span className="text-xs text-gray-400 font-sans font-medium">/ mo</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                  Uncapped backlinks lists export limits, continuous deep crawls, and multi-user seat synchronization.
                </p>
              </div>
              <div className="pt-4">
                {currentPlan === "Enterprise" ? (
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold py-1 px-3 rounded-md block text-center border border-emerald-100">
                    🟢 Subscribed
                  </span>
                ) : (
                  <button 
                    onClick={() => { setCheckoutPlan("Enterprise"); setPaymentSuccess(false); }}
                    className="w-full bg-[#111827] hover:bg-gray-800 text-xs font-bold text-white py-1.5 px-3 rounded-md transition-all text-center cursor-pointer"
                  >
                    Select Plan
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
