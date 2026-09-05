'use client';

import React, { useState, useEffect } from 'react';
import { LiveNewsItem } from '@/lib/types';
import { 
  Radio, ExternalLink, Sparkles, 
  RefreshCw, ChevronDown, ChevronUp, Clock, Globe, BellRing, BookOpen, CheckCircle2 
} from 'lucide-react';
import ArticleReaderModal from './ArticleReaderModal';

export default function LiveNewsFeed() {
  const [news, setNews] = useState<LiveNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedStoryForModal, setSelectedStoryForModal] = useState<LiveNewsItem | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [hasNewAlert, setHasNewAlert] = useState(false);

  const fetchLiveNews = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/news/live', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.news)) {
        if (news.length > 0 && data.news[0]?.title !== news[0]?.title) {
          setHasNewAlert(true);
          setTimeout(() => setHasNewAlert(false), 4000);
        }
        setNews(data.news);
        setSecondsAgo(0);
      }
    } catch (err) {
      console.error('Failed to load live Indian news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
    const interval = setInterval(fetchLiveNews, 25000);
    const timer = setInterval(() => setSecondsAgo(prev => prev + 1), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const categories = [
    { id: 'All', label: 'All Dispatches' },
    { id: 'Geopolitics', label: '🌍 Geopolitics & Global' },
    { id: 'Markets', label: '📈 Markets & FII' },
    { id: 'Commodities', label: '🛢️ Energy & Commodities' },
    { id: 'Industry', label: '🏢 India Inc. Deals' },
    { id: 'Personal Finance', label: '👛 Personal Finance & Tax' }
  ];

  const filtered = news.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
           item.title.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <>
      <div className="paper-card rounded-lg p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-1">
              <Radio className="w-4 h-4 animate-pulse text-rose-600" />
              Live Indian & Global Financial Wire (Livemint • Economic Times • Global Macro)
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Breaking Geopolitical & Market Dispatches
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Multi-source automated financial wire covering global macro shocks, Middle East tensions, US Fed shifts, and Dalal Street market catalysts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-full text-[11px] font-bold text-rose-700 dark:text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              <span>Auto-Sync: {secondsAgo}s ago</span>
            </div>

            <button
              onClick={fetchLiveNews}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-paper)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-lg text-xs font-bold text-[var(--text-primary)] transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync Wire'}</span>
            </button>
          </div>
        </div>

        {/* New News Alert Toast */}
        {hasNewAlert && (
          <div className="bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <BellRing className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>Fresh breaking news dispatch just arrived on the wire!</span>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-rose-700 text-white font-bold shadow-sm'
                  : 'bg-[var(--bg-paper)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* News Feed List */}
        {loading ? (
          <div className="text-center py-8 text-xs text-[var(--text-secondary)]">Connecting to live financial and geopolitical feeds...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-[var(--text-secondary)]">No live stories available in this category right now. Select 'All Dispatches' to view the entire wire.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((story) => {
              const isExpanded = expandedId === story.id;
              const displayDesc = story.description || story.summary;
              const isGeopolitics = story.category.toLowerCase().includes('geopolitic') || story.title.toLowerCase().includes('iran') || story.title.toLowerCase().includes('trump');

              return (
                <div
                  key={story.id}
                  className={`paper-card rounded-lg p-5 border flex flex-col justify-between hover:shadow-paper-lg transition-all ${
                    isGeopolitics ? 'border-amber-400/80 bg-amber-50/10' : 'border-[var(--border-color)]'
                  }`}
                >
                  <div>
                    
                    {/* Top Metadata */}
                    <div className="flex items-center justify-between gap-2 text-[10px] text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2.5 mb-2.5">
                      <span className="font-extrabold uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1 truncate max-w-[170px]">
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{story.source}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono shrink-0">
                        <Clock className="w-3 h-3" />
                        {story.pubDate}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 
                      onClick={() => setSelectedStoryForModal(story)}
                      className="font-editorial text-base sm:text-lg font-bold leading-snug text-[var(--text-primary)] mb-2 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      {story.title}
                    </h3>

                    {/* Real Extracted Story Description */}
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-3">
                      {displayDesc}
                    </p>

                    {/* ELI5 Box */}
                    <div className="bg-amber-50/80 dark:bg-slate-800/80 p-2.5 rounded border border-amber-200 dark:border-slate-700 text-xs italic font-serif text-slate-800 dark:text-slate-200 mb-3">
                      💡 <strong>ELI5:</strong> "{story.eli5}"
                    </div>

                    {/* Expanded Key Points */}
                    {isExpanded && story.keyTakeaways && (
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 mb-3 animate-fadeIn">
                        {story.keyTakeaways.map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs gap-2">
                    
                    {/* Read Full In-App Button */}
                    <button
                      onClick={() => setSelectedStoryForModal(story)}
                      className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-emerald-200 dark:border-slate-700 transition-colors"
                    >
                      <BookOpen className="w-3 h-3 text-emerald-600" />
                      <span>Read Story</span>
                    </button>

                    {/* Direct External Source Link */}
                    {story.link && (
                      <a
                        href={story.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--bg-paper)] transition-colors"
                        title={`Open original article on ${story.source}`}
                      >
                        <span>Source</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    )}

                    {/* Toggle quick preview */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : story.id)}
                      className="font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
                      title={isExpanded ? 'Collapse' : 'Expand Details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Reader Modal for Live Stories */}
      <ArticleReaderModal
        isOpen={Boolean(selectedStoryForModal)}
        onClose={() => setSelectedStoryForModal(null)}
        article={selectedStoryForModal}
      />
    </>
  );
}
