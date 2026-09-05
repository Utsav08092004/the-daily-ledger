'use client';

import React, { useState } from 'react';
import { Article } from '@/lib/types';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Clock, User } from 'lucide-react';

interface LeadStoryProps {
  article: Article;
  onOpenCalculator?: () => void;
}

export default function LeadStory({ article, onOpenCalculator }: LeadStoryProps) {
  const [showFullStory, setShowFullStory] = useState(false);

  return (
    <article className="paper-card rounded-lg p-6 sm:p-8 relative overflow-hidden">
      
      {/* Editorial Category & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-amber-400 dark:bg-amber-400 dark:text-slate-950 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded">
            {article.badge || 'Front Page Lead'}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {article.category}
          </span>
        </div>

        <div className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-2">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> By {article.author}</span>
        </div>
      </div>

      {/* Main Headline */}
      <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[var(--text-primary)] mb-3">
        {article.headline}
      </h2>

      {/* Subheadline */}
      <p className="text-base sm:text-lg text-[var(--text-secondary)] font-normal leading-relaxed mb-6">
        {article.subheadline}
      </p>

      {/* ELI5 / Everyday Analogy Card */}
      <div className="bg-amber-50/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 rounded-lg p-5 mb-6 relative">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Explain It Like I'm 5 (The Everyday Analogy)
        </div>
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic">
          "{article.eli5}"
        </p>
      </div>

      {/* Key Takeaways Grid */}
      <div className="mb-6">
        <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
          ⚡ 60-Second Essential Briefing
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {article.keyPoints.map((point, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-[var(--bg-paper)] p-3 rounded border border-[var(--border-color)] text-xs text-[var(--text-primary)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Full Story */}
      <div>
        <button
          onClick={() => setShowFullStory(!showFullStory)}
          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 mb-2"
        >
          {showFullStory ? (
            <>
              <span>Collapse Full Story</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Read Complete Economic Dispatch ({article.fullStory.length} Paragraphs)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {showFullStory && (
          <div className="bg-[var(--bg-paper)] p-5 rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-secondary)] space-y-3 animate-fadeIn mt-3">
            {article.fullStory.map((para, i) => (
              <p key={i} className={i === 0 ? "lead-dropcap leading-relaxed" : "leading-relaxed"}>
                {para}
              </p>
            ))}
          </div>
        )}
      </div>

    </article>
  );
}
