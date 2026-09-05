'use client';

import React, { useState, useEffect } from 'react';
import Masthead from '@/components/Masthead';
import DecisionCalculator from '@/components/DecisionCalculator';
import SubscribeModal from '@/components/SubscribeModal';
import { DailyEdition } from '@/lib/types';
import { Calculator, ShieldCheck, TrendingUp, Lightbulb, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ToolsPage() {
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
        
        {/* Intro */}
        <div className="border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
            <Calculator className="w-4 h-4" />
            Financial Decision Laboratory
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Interactive Financial Simulators
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl">
            Don't let news remain abstract headlines. Use these mathematical visualizers to test how loan rate hikes, inflation, and compound investing affect your bank accounts and future wealth.
          </p>
        </div>

        {/* Embedded Calculator */}
        <DecisionCalculator />

        {/* Action Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="paper-card rounded-lg p-6 space-y-3">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
              Rule 1: Debt Hygiene First
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Paying off a 24% APR credit card balance is identical to earning a guaranteed, risk-free 24% after-tax return on an investment. Always prioritize toxic debt before speculative bets.
            </p>
          </div>

          <div className="paper-card rounded-lg p-6 space-y-3">
            <div className="w-8 h-8 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
              Rule 2: Time In The Market
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Missing just the 10 best trading days over a 20-year period cuts your ultimate investment returns in half. Consistent automated monthly investing always outperforms nervous market timing.
            </p>
          </div>

          <div className="paper-card rounded-lg p-6 space-y-3">
            <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
              Rule 3: The 5-Year Horizon
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Never invest money in the stock market that you will need within the next 3 to 5 years (like a home down payment). Keep short-term money in safe fixed deposits or high-yield liquid funds.
            </p>
          </div>

        </div>

      </main>

      <SubscribeModal isOpen={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </div>
  );
}
