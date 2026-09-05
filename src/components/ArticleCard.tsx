'use client';

import React, { useState } from 'react';
import { Article } from '@/lib/types';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, BookOpen, Clock, User } from 'lucide-react';
import ArticleReaderModal from './ArticleReaderModal';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [showEli5, setShowEli5] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);

  return (
    <>
      <div className="paper-card rounded-lg p-5 flex flex-col justify-between h-full transition-all hover:shadow-paper-lg">
        
        <div>
          {/* Desk Header */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {article.category}
            </span>
            <span className="text-[11px] text-[var(--text-secondary)] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          {/* Headline */}
          <h3 
            onClick={() => setReaderOpen(true)}
            className="font-editorial text-lg sm:text-xl font-bold leading-snug text-[var(--text-primary)] mb-2 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            {article.headline}
          </h3>

          {/* Subheadline */}
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
            {article.subheadline}
          </p>

          {/* ELI5 Toggle Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowEli5(!showEli5)}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-slate-800 px-2.5 py-1.5 rounded border border-amber-200 dark:border-slate-700 hover:bg-amber-100 transition-colors w-full text-left justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>ELI5 Analogy</span>
              </span>
              {showEli5 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showEli5 && (
              <div className="mt-2 p-3 bg-[var(--bg-paper)] rounded border border-[var(--border-color)] text-xs text-[var(--text-secondary)] italic font-serif leading-relaxed animate-fadeIn">
                "{article.eli5}"
              </div>
            )}
          </div>

          {/* Key Takeaways */}
          <div className="space-y-1.5 mb-4 text-xs">
            {article.keyPoints.slice(0, 2).map((point, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[var(--text-secondary)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{point}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Card Footer with Read Full Story */}
        <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-[var(--text-secondary)] flex items-center gap-1 truncate max-w-[170px]">
            <User className="w-3 h-3 text-emerald-700 shrink-0" />
            <span className="truncate">{article.author.split(',')[0]}</span>
          </span>

          <button
            onClick={() => setReaderOpen(true)}
            className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 flex items-center gap-1 shrink-0 ml-2 bg-emerald-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-emerald-200 dark:border-slate-700 transition-colors shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Read Full Story</span>
          </button>
        </div>

      </div>

      {/* Full Article Reader Modal */}
      <ArticleReaderModal
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        article={article}
      />
    </>
  );
}
