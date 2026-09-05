'use client';

import React, { useState, useEffect } from 'react';
import Masthead from '@/components/Masthead';
import SubscribeModal from '@/components/SubscribeModal';
import { JargonTerm, DailyEdition } from '@/lib/types';
import { BookOpen, Search, Lightbulb, Check, HelpCircle, Sparkles } from 'lucide-react';

export default function GlossaryPage() {
  const [terms, setTerms] = useState<JargonTerm[]>([]);
  const [search, setSearch] = useState('');
  const [edition, setEdition] = useState<DailyEdition | null>(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  useEffect(() => {
    fetch('/api/editions?latest=true')
      .then(res => res.json())
      .then(data => setEdition(data))
      .catch(console.error);

    // Fetch initial dictionary
    import('@/../data/dictionary.json')
      .then(mod => setTerms(mod.default as JargonTerm[]))
      .catch(() => {
        // Fallback
      });
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

  const filtered = terms.filter(t => 
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.plainEnglish.toLowerCase().includes(search.toLowerCase()) ||
    t.formalDefinition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-paper)]">
      <Masthead edition={dummyEdition} onOpenSubscribe={() => setSubscribeOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        
        {/* Header */}
        <div className="border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
            <BookOpen className="w-4 h-4" />
            Plain English Dictionary
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
            The Financial Jargon Buster
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl">
            Financial news is notorious for heavy acronyms and Wall Street jargon. We translate intimidating terms into clear, memorable everyday analogies.
          </p>
        </div>

        {/* Search Bar */}
        <div className="paper-card rounded-lg p-4 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search terms (e.g. Repo Rate, Inflation, P/E Ratio)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-paper)] border border-[var(--border-color)] pl-9 pr-3 py-2 rounded text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item, idx) => (
            <div key={idx} className="paper-card rounded-lg p-6 flex flex-col justify-between hover:shadow-paper-lg transition-all space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3 mb-3">
                  <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                    {item.term}
                  </h3>
                  {item.pronunciation && (
                    <span className="text-xs font-mono text-[var(--text-secondary)] italic">
                      /{item.pronunciation}/
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-[var(--bg-paper)] p-3 rounded border border-[var(--border-color)]">
                    <div className="font-bold text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Plain English Definition:
                    </div>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {item.plainEnglish}
                    </p>
                  </div>

                  <div className="bg-amber-50/80 dark:bg-slate-800/80 p-3.5 rounded border border-amber-200 dark:border-slate-700">
                    <div className="font-bold text-amber-950 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Real-World Analogy:
                    </div>
                    <p className="text-amber-900 dark:text-slate-200 italic font-serif leading-relaxed">
                      "{item.analogy}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] space-y-1.5 text-[11px] text-[var(--text-secondary)]">
                <div>
                  <strong>Why it matters:</strong> {item.whyItMatters}
                </div>
                {item.example && (
                  <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                    <strong>Real Example:</strong> {item.example}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>

      <SubscribeModal isOpen={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </div>
  );
}
