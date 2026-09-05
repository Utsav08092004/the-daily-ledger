'use client';

import React from 'react';
import { JargonTerm } from '@/lib/types';
import { BookOpen, Lightbulb, HelpCircle, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface JargonBusterCardProps {
  jargon: JargonTerm;
}

export default function JargonBusterCard({ jargon }: JargonBusterCardProps) {
  return (
    <div className="paper-card rounded-lg p-6 bg-gradient-to-br from-amber-50/60 via-[var(--bg-card)] to-amber-100/30 dark:from-slate-900 dark:to-slate-800 border-2 border-amber-300 dark:border-slate-700 relative overflow-hidden">
      
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 dark:text-amber-400">
              Financial Jargon Buster
            </span>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Demystifying complex Wall Street words
            </div>
          </div>
        </div>

        <Link
          href="/glossary"
          className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>All Terms</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mb-3">
        <h4 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
          {jargon.term}
        </h4>
        {jargon.pronunciation && (
          <span className="text-xs font-mono text-[var(--text-secondary)] italic">
            /{jargon.pronunciation}/
          </span>
        )}
      </div>

      {/* Plain English & Analogy */}
      <div className="space-y-3 text-xs mb-4">
        <div className="bg-[var(--bg-paper)] p-3 rounded border border-[var(--border-color)]">
          <div className="font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
            <Check className="w-3.5 h-3.5" /> Plain English Meaning:
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {jargon.plainEnglish}
          </p>
        </div>

        <div className="bg-amber-100/70 dark:bg-slate-800/90 p-3 rounded border border-amber-200 dark:border-slate-700">
          <div className="font-bold text-amber-950 dark:text-amber-300 mb-1 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Real-World Analogy:
          </div>
          <p className="text-amber-900 dark:text-slate-300 italic font-serif leading-relaxed">
            "{jargon.analogy}"
          </p>
        </div>
      </div>

      <div className="text-[11px] text-[var(--text-secondary)] flex items-start gap-1.5 pt-2 border-t border-[var(--border-color)]">
        <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <span><strong>Why you should care:</strong> {jargon.whyItMatters}</span>
      </div>

    </div>
  );
}
