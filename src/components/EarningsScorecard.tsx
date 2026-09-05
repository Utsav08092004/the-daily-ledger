'use client';

import React, { useState, useEffect } from 'react';
import { CompanyEarningsReport } from '@/lib/types';
import { 
  Building2, TrendingUp, TrendingDown, CheckCircle2, 
  XCircle, Sparkles, Wallet, ChevronDown, ChevronUp, 
  ArrowUpRight, BarChart3, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

interface EarningsScorecardProps {
  initialReports?: CompanyEarningsReport[];
  limit?: number;
  showAllLink?: boolean;
}

export default function EarningsScorecard({ initialReports, limit, showAllLink = true }: EarningsScorecardProps) {
  const [reports, setReports] = useState<CompanyEarningsReport[]>(initialReports || []);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialReports || initialReports.length === 0);

  useEffect(() => {
    fetch('/api/earnings')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.reports)) {
          setReports(data.reports);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter(r => 
    selectedSector === 'All' || r.sector.toLowerCase() === selectedSector.toLowerCase()
  );

  const displayList = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="paper-card rounded-lg p-6 sm:p-8 bg-gradient-to-b from-[var(--bg-card)] via-[var(--bg-card)] to-[var(--bg-paper)]">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
            <Building2 className="w-4 h-4" />
            Indian Corporate Earnings & Results Desk
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            India Inc. Quarterly Scorecards (₹ Crores)
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Latest financial results from India's blue-chips, revenue beats, and plain-English verdicts on what they mean for your mutual funds & stock portfolios.
          </p>
        </div>

        {/* Sector Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
          {['All', 'Conglomerates & Energy', 'IT Services & AI', 'Banking & NBFC', 'Auto & EV', 'Quick Commerce & Tech', 'Consumer & FMCG'].map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                selectedSector === sec
                  ? 'bg-amber-700 text-white font-bold shadow-sm'
                  : 'bg-[var(--bg-paper)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Earnings Grid */}
      {loading ? (
        <div className="text-center py-8 text-xs text-[var(--text-secondary)]">Loading India Inc. earnings reports...</div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-8 text-xs text-[var(--text-secondary)]">No earnings reports found in this sector.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayList.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="paper-card rounded-lg p-5 border border-[var(--border-color)] flex flex-col justify-between hover:shadow-paper-lg transition-all"
              >
                <div>
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900 text-amber-400 font-mono font-black text-xs px-2 py-0.5 rounded">
                        {item.symbol}
                      </span>
                      <div>
                        <h4 className="font-editorial text-base font-bold text-[var(--text-primary)] leading-none">
                          {item.companyName}
                        </h4>
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          {item.quarter} • {item.sector}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
                        {item.stockReaction.currentPrice}
                      </div>
                      <div className={`text-[11px] font-mono font-bold flex items-center justify-end gap-0.5 ${item.stockReaction.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.stockReaction.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {item.stockReaction.changePercent}
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics Strip in ₹ Crores */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    
                    {/* Revenue Card */}
                    <div className="bg-[var(--bg-paper)] p-2.5 rounded border border-[var(--border-color)]">
                      <div className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Quarterly Revenue</div>
                      <div className="font-bold text-[var(--text-primary)] text-sm font-mono mt-0.5">
                        {item.revenue.reported}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mt-1">
                        <span>Exp: {item.revenue.expected}</span>
                        <span className={`font-bold px-1 rounded text-[9px] ${item.revenue.status === 'Beat' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {item.revenue.status} ({item.revenue.growthYoY})
                        </span>
                      </div>
                    </div>

                    {/* Net Profit / EPS Card */}
                    <div className="bg-[var(--bg-paper)] p-2.5 rounded border border-[var(--border-color)]">
                      <div className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Net Profit / PAT</div>
                      <div className="font-bold text-[var(--text-primary)] text-sm font-mono mt-0.5">
                        {item.netProfitOrEps.reported}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mt-1">
                        <span>Exp: {item.netProfitOrEps.expected}</span>
                        <span className={`font-bold px-1 rounded text-[9px] ${item.netProfitOrEps.status === 'Beat' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {item.netProfitOrEps.status}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Plain English Verdict */}
                  <div className="bg-amber-50/80 dark:bg-slate-800/80 p-3 rounded border border-amber-200 dark:border-slate-700 text-xs mb-3">
                    <div className="font-bold text-amber-950 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Executive Plain-English Verdict:
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                      {item.plainEnglishVerdict}
                    </p>
                  </div>

                  {/* ELI5 Analogy */}
                  <div className="bg-[var(--bg-paper)] p-3 rounded border border-[var(--border-color)] text-xs mb-3 italic font-serif text-[var(--text-secondary)]">
                    💡 <strong>ELI5:</strong> "{item.eli5Analogy}"
                  </div>

                  {/* Expanded Wallet & Portfolio Impact */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t border-[var(--border-color)] text-xs animate-fadeIn">
                      
                      <div className="bg-emerald-50 dark:bg-slate-800 p-3 rounded border border-emerald-200 dark:border-emerald-900">
                        <div className="font-bold text-emerald-950 dark:text-emerald-300 mb-1 flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                          What This Means For Your Mutual Funds & Portfolio:
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-emerald-900 dark:text-emerald-200">
                          <li>• <strong>Shareholders:</strong> {item.walletAndPortfolioImpact.forShareholders}</li>
                          <li>• <strong>Mutual Fund / SIP Holders:</strong> {item.walletAndPortfolioImpact.forMutualFundHolders}</li>
                          <li>• <strong>Indian Consumers:</strong> {item.walletAndPortfolioImpact.forConsumers}</li>
                        </ul>
                      </div>

                      <div className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                        <div className="font-bold text-[var(--text-primary)]">Key Quarterly Highlights:</div>
                        {item.keyHighlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs mt-3">
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[240px]">
                    💡 {item.walletAndPortfolioImpact.actionTip}
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="font-bold text-[var(--text-primary)] hover:text-amber-700 flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>{isExpanded ? 'Less' : 'Analysis'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Show All Link */}
      {showAllLink && (
        <div className="text-center pt-6 border-t border-[var(--border-color)] mt-6">
          <Link
            href="/earnings"
            className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-colors shadow-sm"
          >
            <span>Explore All India Inc. Company Scorecards</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
}
