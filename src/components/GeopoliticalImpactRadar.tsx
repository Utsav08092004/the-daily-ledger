'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe2, Flame, DollarSign, Ship, ShieldAlert, 
  TrendingUp, TrendingDown, ArrowRight, Sparkles, Wallet, 
  CheckCircle2, Info, ChevronRight, AlertTriangle, RefreshCw, Radio 
} from 'lucide-react';
import { LiveNewsItem, LiveQuoteItem } from '@/lib/types';

interface GeopoliticalRiskCard {
  id: string;
  category: 'Energy & Middle East' | 'US Fed & Dollar Flow' | 'Trade Tariffs & Supply Chain' | 'Sovereign Reserves & Gold';
  headline: string;
  threatLevel: 'High Impact' | 'Medium Impact' | 'Monitored';
  status: string;
  globalTrigger: string;
  indianMarketTransmission: string;
  beneficiarySectors: string[];
  vulnerableSectors: string[];
  householdWalletImpact: string;
  actionTip: string;
  eli5: string;
}

const DYNAMIC_GEOPOLITICAL_RADAR_PRESETS: GeopoliticalRiskCard[] = [
  {
    id: 'geo-live-1',
    category: 'Energy & Middle East',
    headline: 'US-Iran Military Strikes & Red Sea Escalation: Brent Crude Spikes to $89.31 / bbl',
    threatLevel: 'High Impact',
    status: 'Brent Crude active at $89.31 (+0.96%) • Hormuz Chokepoint Risk',
    globalTrigger: 'Restarted military exchanges between the US and Iran and renewed missile threats along Red Sea maritime transit corridors force international oil tankers to navigate 14-day reroutes around Africa.',
    indianMarketTransmission: 'India imports over 85% of its crude oil. A sustained crude rally above $88/barrel inflates India’s monthly trade deficit, pressures the Indian Rupee (USD/INR ₹95.39), and squeezes operating margins for aviation and paint companies.',
    beneficiarySectors: ['Upstream Explorers (ONGC, Oil India)', 'Domestic Green Energy & Solar', 'Coal India'],
    vulnerableSectors: ['Aviation Carriers (IndiGo, SpiceJet)', 'Oil Marketing Companies (IOCL, BPCL)', 'Paints & Specialty Polymers (Asian Paints)'],
    householdWalletImpact: 'High crude oil prices prevent retail petrol/diesel cuts and increase logistics costs for packaged FMCG food and grocery deliveries.',
    actionTip: 'Maintain a 10% portfolio allocation in MCX Gold ETFs to hedge against imported energy inflation.',
    eli5: 'Think of crude oil like the master fuel bill for the entire country: when international shipping routes get blocked by conflict, every taxi, truck delivery, and plastic container in India becomes more expensive.'
  },
  {
    id: 'geo-live-2',
    category: 'US Fed & Dollar Flow',
    headline: 'US Treasury Yields Surge & Federal Reserve Rate Path: Foreign Capital Flows to Dalal Street',
    threatLevel: 'High Impact',
    status: 'US 10-Year Bond Yields climb • USD/INR at ₹95.39',
    globalTrigger: 'Rising US Treasury yields attract global institutional capital back into US Dollar sovereign debt, prompting short-term Foreign Institutional Investor (FII) rebalancing across emerging markets.',
    indianMarketTransmission: 'While foreign institutional investors periodically rotate capital between global bonds and Dalal Street equities, India’s record ₹23,000+ Crore monthly domestic mutual fund SIP inflows provide a strong structural safety net for benchmark indices.',
    beneficiarySectors: ['IT Exporters (TCS, Infosys - High Dollar Cashflows)', 'Pharmaceutical Exporters (Sun Pharma, Cipla)', 'Large-Cap Private Banks'],
    vulnerableSectors: ['High-PE Mid-Cap Speculative Startups', 'Debt-Heavy Infrastructure Developers'],
    householdWalletImpact: 'A strengthening Dollar raises the cost of imported electronics, laptops, overseas travel, and foreign education tuition for Indian families.',
    actionTip: 'Do not pause mutual fund SIPs during global yield spikes; use foreign fund selling dips to accumulate broad-market index funds at attractive valuations.',
    eli5: 'When the biggest bank in America raises savings interest, wealthy global investors move money there. When rates stabilize, massive investment funds flow back into fast-growing Indian companies.'
  },
  {
    id: 'geo-live-3',
    category: 'Trade Tariffs & Supply Chain',
    headline: 'Global Supply Chain Realignment & China+1: India’s ₹70,000 Cr Primary Market & Electronics PLI Boom',
    threatLevel: 'Medium Impact',
    status: 'Global manufacturers expanding Indian semiconductor & mobile assembly plants',
    globalTrigger: 'Western trade tariff restrictions on Chinese manufacturing encourage multinational corporations (Apple, Google, electronics OEMs) to accelerate domestic factory operations in India.',
    indianMarketTransmission: 'Production-Linked Incentive (PLI) schemes in electronics, defense manufacturing, and renewable components attract billions in direct foreign investment, boosting domestic job creation and industrial real estate.',
    beneficiarySectors: ['Electronics Manufacturing Services (EMS)', 'Defense & Aerospace (HAL, BEL)', 'Commercial Industrial Real Estate'],
    vulnerableSectors: ['Low-End Unorganized Plastic & Hardware Importers'],
    householdWalletImpact: 'Local electronic component manufacturing stabilizes smartphone and appliance prices while creating high-paying engineering jobs across Indian cities.',
    actionTip: 'Allocate 15% to 20% of your equity portfolio to manufacturing and infrastructure thematic mutual funds.',
    eli5: 'Imagine a giant department store deciding to buy all its electronics from Indian factories instead of foreign suppliers: local manufacturers see their business grow ten times bigger.'
  },
  {
    id: 'geo-live-4',
    category: 'Sovereign Reserves & Gold',
    headline: 'De-Dollarization & Sovereign Gold Repatriation: RBI Gold Vaults Exceed 840 Metric Tonnes',
    threatLevel: 'Monitored',
    status: 'MCX Gold at ₹1,58,100 / 10g • RBI reserves at all-time high',
    globalTrigger: 'Global central banks continue diversifying sovereign foreign exchange reserves into physical gold to reduce dependence on single-currency international payment networks.',
    indianMarketTransmission: 'The Reserve Bank of India (RBI) has brought over 100 tonnes of physical gold back to domestic vaults, giving India a solid balance sheet reserve against foreign currency swings and external shocks.',
    beneficiarySectors: ['Gold Loan NBFCs (Muthoot, Manappuram)', 'Precious Metal Refiners', 'Jewelry Retailers (Titan, Kalyan)'],
    vulnerableSectors: ['Unhedged Foreign Currency Corporate Borrowers'],
    householdWalletImpact: 'Gold remains India’s time-tested multi-generational store of value, protecting household wealth against long-term currency depreciation.',
    actionTip: 'Accumulate sovereign gold through digital Gold ETFs or Sovereign Gold Bonds rather than paying heavy 20%+ jewelry making charges.',
    eli5: 'Central banks buying gold is like a family keeping a solid gold coin in the home locker: it provides guaranteed security and peace of mind no matter how volatile the outside world gets.'
  }
];

export default function GeopoliticalImpactRadar() {
  const [radarData, setRadarData] = useState<GeopoliticalRiskCard[]>(DYNAMIC_GEOPOLITICAL_RADAR_PRESETS);
  const [selectedRisk, setSelectedRisk] = useState<GeopoliticalRiskCard>(DYNAMIC_GEOPOLITICAL_RADAR_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [lastSync, setLastSync] = useState<string>('Just now');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchLiveGeopoliticalUpdates = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/news/live?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.news) && data.news.length > 0) {
        // Look for breaking geopolitical stories
        const geoStories = data.news.filter((n: LiveNewsItem) => 
          n.category.toLowerCase().includes('geopolitic') ||
          n.title.toLowerCase().includes('iran') ||
          n.title.toLowerCase().includes('crude') ||
          n.title.toLowerCase().includes('yield') ||
          n.title.toLowerCase().includes('treasury') ||
          n.title.toLowerCase().includes('us') ||
          n.title.toLowerCase().includes('trade')
        );

        if (geoStories.length > 0) {
          const updatedPresets = [...DYNAMIC_GEOPOLITICAL_RADAR_PRESETS];
          const topGeo = geoStories[0];
          
          updatedPresets[0] = {
            ...updatedPresets[0],
            headline: topGeo.title,
            status: `Live Wire Alert • Published ${topGeo.pubDate}`,
            globalTrigger: topGeo.summary,
            eli5: topGeo.eli5 || updatedPresets[0].eli5,
            indianMarketTransmission: topGeo.fullContent && topGeo.fullContent[1] ? topGeo.fullContent[1] : updatedPresets[0].indianMarketTransmission,
            householdWalletImpact: topGeo.fullContent && topGeo.fullContent[2] ? topGeo.fullContent[2] : updatedPresets[0].householdWalletImpact
          };

          setRadarData(updatedPresets);
          if (selectedRisk.id === updatedPresets[0].id) {
            setSelectedRisk(updatedPresets[0]);
          }
        }
      }
      setLastSync(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    } catch (e) {
      console.error('Failed to sync geopolitical radar:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLiveGeopoliticalUpdates();
    const interval = setInterval(fetchLiveGeopoliticalUpdates, 15000); // sync every 15s
    return () => clearInterval(interval);
  }, []);

  const filtered = radarData.filter(item => 
    activeTab === 'All' || item.category === activeTab
  );

  return (
    <div id="radar" className="paper-card rounded-xl p-6 sm:p-8 space-y-6 bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-paper)] to-slate-900/5 border-2 border-amber-500/30 shadow-lg">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
            <Globe2 className="w-4 h-4 text-amber-600 animate-spin-slow" />
            Global Geopolitics & Macro Intelligence Radar
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            How Global Wars, US Policy & Crude Shocks Impact Dalal Street
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Direct transmission channels explaining how global geopolitical tremors affect the Indian Rupee, corporate profit margins, and your household wealth.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 shadow-2xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Live Radar Active</span>
          </span>

          <button
            onClick={fetchLiveGeopoliticalUpdates}
            disabled={isSyncing}
            className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-paper)] transition-colors text-xs text-[var(--text-secondary)] flex items-center gap-1"
            title="Sync Live Geopolitical Feeds"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-600' : ''}`} />
            <span className="hidden sm:inline font-mono text-[10px]">{lastSync}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-semibold">
        {['All', 'Energy & Middle East', 'US Fed & Dollar Flow', 'Trade Tariffs & Supply Chain', 'Sovereign Reserves & Gold'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              activeTab === tab 
                ? 'bg-amber-700 text-white font-bold shadow-sm' 
                : 'bg-[var(--bg-paper)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Radar Layout: Interactive Selector + Deep Impact Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Threat Matrix List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.map((item) => {
            const isSelected = selectedRisk.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedRisk(item)}
                className={`p-4 rounded-lg border transition-all cursor-pointer text-left ${
                  isSelected 
                    ? 'bg-amber-50 dark:bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500/50' 
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.threatLevel === 'High Impact' 
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300' 
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                  }`}>
                    {item.threatLevel}
                  </span>
                </div>

                <h4 className="font-editorial text-sm font-bold text-[var(--text-primary)] mb-1 leading-snug line-clamp-2">
                  {item.headline}
                </h4>

                <div className="text-[11px] text-[var(--text-secondary)] flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]">
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 truncate max-w-[220px]">
                    {item.status}
                  </span>
                  <span className="font-bold flex items-center gap-0.5 text-amber-700">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Impact Analysis Dossier (7 Cols) */}
        <div className="lg:col-span-7 bg-[var(--bg-card)] p-6 sm:p-7 rounded-xl border border-[var(--border-color)] space-y-5 shadow-sm">
          
          {/* Active Card Title & Threat Badge */}
          <div className="space-y-2 border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-amber-800 text-white font-mono text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
                GEOPOLITICAL DOSSIER
              </span>
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                {selectedRisk.category}
              </span>
            </div>

            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-tight">
              {selectedRisk.headline}
            </h3>

            <div className="p-2.5 bg-slate-900 text-amber-300 rounded font-mono text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Current Status: {selectedRisk.status}</span>
            </div>
          </div>

          {/* ELI5 Everyday Analogy */}
          <div className="bg-amber-50 dark:bg-slate-800/90 border border-amber-300 dark:border-slate-700 p-4 rounded-lg">
            <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              The Everyday Analogy (ELI5)
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed">
              "{selectedRisk.eli5}"
            </p>
          </div>

          {/* Direct Transmission Mechanism to India */}
          <div className="space-y-2 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[var(--text-primary)] block">
              🇮🇳 Transmission Mechanism to Indian Markets:
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-paper)] p-3.5 rounded border border-[var(--border-color)] text-xs">
              {selectedRisk.indianMarketTransmission}
            </p>
          </div>

          {/* Sectoral Winners vs Losers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Sector Beneficiaries (Gains)</span>
              </div>
              <ul className="space-y-1 text-emerald-950 dark:text-emerald-200 text-[11px]">
                {selectedRisk.beneficiarySectors.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-2">
              <div className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <span>Vulnerable Sectors (Pressure)</span>
              </div>
              <ul className="space-y-1 text-rose-950 dark:text-rose-200 text-[11px]">
                {selectedRisk.vulnerableSectors.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Wallet Impact & Action Rule */}
          <div className="p-4 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-lg space-y-2 border border-emerald-700 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wide">
              <Wallet className="w-4 h-4" />
              <span>What This Means For Your Wallet & Investments</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {selectedRisk.householdWalletImpact}
            </p>
            <div className="pt-1.5 border-t border-emerald-700/60 font-bold text-amber-300 text-xs">
              💡 Prosperon Action Rule: {selectedRisk.actionTip}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
