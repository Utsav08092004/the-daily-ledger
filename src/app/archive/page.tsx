'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DailyEdition } from '@/lib/types';
import Masthead from '@/components/Masthead';
import SubscribeModal from '@/components/SubscribeModal';
import { Calendar, ArrowRight, Search, BookOpen, Clock, Tag } from 'lucide-react';

export default function ArchivePage() {
  const [editions, setEditions] = useState<DailyEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  useEffect(() => {
    fetch('/api/editions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEditions(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dummyEdition: DailyEdition = editions[0] || {
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

  const filteredEditions = editions.filter(ed => {
    const matchesSearch = 
      ed.leadStory.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ed.leadStory.subheadline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ed.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ed.topStories.some(s => s.headline.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' ||
      ed.leadStory.category === selectedCategory ||
      ed.topStories.some(s => s.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-paper)]">
      <Masthead edition={dummyEdition} onOpenSubscribe={() => setSubscribeOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        
        {/* Header */}
        <div className="border-b border-[var(--border-color)] pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4" />
            Historical Archive
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Prosperon Vault
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Explore past daily editions and track how economic shifts unfolded day by day.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="paper-card rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search past headlines, topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-paper)] border border-[var(--border-color)] pl-9 pr-3 py-1.5 rounded text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto text-xs font-medium">
            {['All', 'Markets', 'Economy & Central Banks', 'Personal Finance', 'Real Estate & Mortgages', 'Global & Commodities'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-emerald-700 text-white font-bold' : 'bg-[var(--bg-paper)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editions List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-secondary)]">Loading archive...</div>
        ) : filteredEditions.length === 0 ? (
          <div className="paper-card p-12 text-center rounded-lg text-xs text-[var(--text-secondary)]">
            No past editions found matching your search.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEditions.map((ed) => (
              <div key={ed.id} className="paper-card rounded-lg p-6 hover:shadow-paper-lg transition-all">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {ed.date}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      • Vol. {ed.volume}, Issue {ed.issue}
                    </span>
                  </div>

                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                    {ed.leadStory.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-8">
                    <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
                      {ed.leadStory.headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-3">
                      {ed.leadStory.subheadline}
                    </p>
                    
                    <div className="bg-amber-50 dark:bg-slate-800 p-2.5 rounded border border-amber-200 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-300 italic font-serif">
                      💡 <strong>ELI5:</strong> {ed.leadStory.eli5}
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[var(--border-color)] pt-4 lg:pt-0 lg:pl-6 space-y-3">
                    <div className="text-xs">
                      <span className="font-bold text-[var(--text-primary)]">Dispatches in this issue:</span>
                      <ul className="mt-1 space-y-1 text-[11px] text-[var(--text-secondary)] list-disc list-inside">
                        {ed.topStories.slice(0, 2).map((s, i) => (
                          <li key={i} className="truncate">{s.headline}</li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/?date=${ed.id}`}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Read Full Edition</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      <SubscribeModal isOpen={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </div>
  );
}
