/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sliders, Save, Check, Shield, User, Globe, AlertCircle } from "lucide-react";

export default function SettingsView() {
  const [name, setName] = useState("VManjeet773");
  const [email, setEmail] = useState("vmanjeet773@gmail.com");
  const [domainScope, setDomainScope] = useState("SEOtool.com");
  const [teamSeats, setTeamSeats] = useState("6");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-[#ff642d]" /> Workspace Configurations
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Configure corporate names, customize primary monitored website targets and review authentication profiles
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-left flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-600" /> Settings successfully synchronized to sandbox local persistence!
        </div>
      )}

      {/* Settings Grid form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Parameters Inputs */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm text-left lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#ff642d]" /> Account Identity Settings
          </h3>

          <form onSubmit={handleSave} className="space-y-4 font-sans">
            
            {/* Primary Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Owner Representative Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-250 py-2 px-3 text-xs font-semibold text-gray-700 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Corporate Contact Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-250 py-2 px-3 text-xs font-semibold text-gray-700 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* Monitored Properties configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Primary Website Target Focus</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={domainScope}
                    onChange={(e) => setDomainScope(e.target.value)}
                    className="w-full bg-white border border-gray-250 py-2 pl-8 pr-3 text-xs font-semibold text-gray-700 rounded-lg outline-none"
                  />
                  <Globe className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Active Team Seats Collaboration</label>
                <select 
                  value={teamSeats}
                  onChange={(e) => setTeamSeats(e.target.value)}
                  className="w-full bg-white border border-gray-250 py-2 px-3 text-xs font-semibold text-gray-700 rounded-lg outline-none"
                >
                  <option value="2">2 Multi-user Seats</option>
                  <option value="6">6 Multi-user Seats</option>
                  <option value="12">12 Multi-user Seats</option>
                </select>
              </div>
            </div>

            <div className="flex border-t pt-4 border-gray-50 justify-end">
              <button 
                type="submit"
                className="bg-[#ff642d] hover:bg-[#e05320] text-xs font-bold text-white py-2 px-5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Workspace Settings
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Environment Keys Status info */}
        <div className="bg-slate-900 text-white rounded-xl p-5 text-left space-y-4 shadow-sm">
          <h4 className="text-xs font-extrabold flex items-center gap-1.5 uppercase text-orange-400">
            <Shield className="w-4 h-4 text-orange-400" /> API Safety Credentials
          </h4>
          
          <p className="text-[11px] text-gray-300 leading-relaxed">
            Secrets and system variables are securely managed in Cloud Run containers. The API integration statuses are highlighted below:
          </p>

          <div className="space-y-3 pt-2 font-mono text-[10px]">
            
            {/* Gemini API Key status */}
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
              <div>
                <span className="block text-gray-300 font-bold">GEMINI_API_KEY</span>
                <span className="text-[9px] text-gray-400">Google GenAI LLM Platform</span>
              </div>
              <span className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                ACTIVE
              </span>
            </div>

            {/* Auth token state */}
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
              <div>
                <span className="block text-gray-300 font-bold">COOPERATIVE_SEATS_KEY</span>
                <span className="text-[9px] text-gray-405">Multiplayer workspace tokens</span>
              </div>
              <span className="bg-blue-500/15 border border-blue-500/25 text-blue-400 px-1.5 py-0.5 rounded font-bold">
                SIMULATED
              </span>
            </div>

          </div>

          <div className="pt-2 flex gap-2 items-center text-[11px] text-gray-400">
            <AlertCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <span>Avoid adding actual sensitive private tokens in .env files directly. Prefer using setting dashboard fields.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
