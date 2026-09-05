'use client';

import React, { useState, useEffect } from 'react';
import Masthead from '@/components/Masthead';
import EarningsScorecard from '@/components/EarningsScorecard';
import SubscribeModal from '@/components/SubscribeModal';
import { DailyEdition } from '@/lib/types';
import { Building2, Calendar, TrendingUp, Sparkles, BarChart3 } from 'lucide-react';

export default function EarningsPage() {
  const [edition, setEdition] = useState<DailyEdition | null>(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  useEffect(() => {
    fetch('/api/editions?latest=true')
      .then(res => res.json())
      .then(data => setEdition(data))
      .catch(console.error);
  }, []);

  const dummyEdition: DailyEdition = edition || {
    id: '2026-08-22',
    date: 'Saturday, August 22, 2026',
    volume: 48,
    issue: 234,
    quoteOfTheDay: { quote: '', author: '', context: '' },
    marketSummary: '',
    tickers: [],
    leadStory: { id: '', category: 'Markets', headline: '', subheadline: '', readTime: '', author: '', eli5: '', keyPoints: [], fullStory: [], walletImpact: { summary: '', borrowers: '', investors: '', savers: '', consumers: '', actionTip: '' }, tags: [] },
    topStories: [],
    jargonOfTheDay: { term: '', formalDefinition: '', plainEnglish: '', analogy: '', whyItMatters: '', example: '' },
    quickDecisionTip: '',
    audioBriefingSummary: '',
    generatedAt: ''
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-paper)]">
      <Masthead edition={dummyEdition} onOpenSubscribe={() => setSubscribeOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        
        {/* Intro Banner */}
        <div className="border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
            <Building2 className="w-4 h-4" />
            Corporate Scorecards & Financial Health
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Company Quarterly Results Hub
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl">
            Understand how major corporations perform without reading 100-page regulatory filings. Every quarterly report is translated into revenue beats/misses, plain-English executive verdicts, and direct portfolio takeaways.
          </p>
        </div>

        {/* Full Earnings Scorecard */}
        <EarningsScorecard showAllLink={false} />

        {/* Educational Guide for Earnings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="paper-card rounded-lg p-6 space-y-2">
            <div className="text-amber-700 font-bold text-xs uppercase tracking-wider">
              1. Revenue vs Net Profit
            </div>
            <h4 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
              Top Line vs Bottom Line
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Revenue is all the cash flowing in the front door. Net Profit (or EPS) is what remains after paying employee salaries, taxes, factory bills, and loan interest.
            </p>
          </div>

          <div className="paper-card rounded-lg p-6 space-y-2">
            <div className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
              2. The "Expectations" Game
            </div>
            <h4 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
              Why Good Results Sometimes Dip
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              If analysts expect a company to grow 50%, and it only grows 40%, the stock may fall despite record profits. Markets trade on future expectations rather than past achievements.
            </p>
          </div>

          <div className="paper-card rounded-lg p-6 space-y-2">
            <div className="text-blue-700 font-bold text-xs uppercase tracking-wider">
              3. Forward Guidance
            </div>
            <h4 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
              The CEO's Next Quarter Forecast
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              What the CEO predicts for the next 6 to 12 months matters more than the quarter that just ended. Strong guidance turns modest results into multi-month stock rallies.
            </p>
          </div>
        </div>

      </main>

      <SubscribeModal isOpen={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </div>
  );
}
