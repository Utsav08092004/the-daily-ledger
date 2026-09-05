'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun, Moon, Coffee, Bell, 
  Calendar, Printer, Share2, 
  Search, ShieldCheck, TrendingUp, Sparkles, BookOpen, Calculator, Building2, Radio, Award, GraduationCap
} from 'lucide-react';
import { DailyEdition } from '@/lib/types';

interface MastheadProps {
  edition: DailyEdition;
  onOpenSubscribe: () => void;
  onOpenDispatch?: () => void;
}

export default function Masthead({ edition, onOpenSubscribe, onOpenDispatch }: MastheadProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'paper' | 'sepia' | 'dark'>('paper');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('prosperon_theme') as 'paper' | 'sepia' | 'dark';
    if (saved) {
      applyTheme(saved);
    }
  }, []);

  const applyTheme = (mode: 'paper' | 'sepia' | 'dark') => {
    setTheme(mode);
    localStorage.setItem('prosperon_theme', mode);
    document.body.classList.remove('theme-sepia', 'theme-dark');
    if (mode === 'sepia') document.body.classList.add('theme-sepia');
    if (mode === 'dark') document.body.classList.add('theme-dark');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Prosperon — Indian Financial Intelligence (${edition.date})`,
        text: `Today's Prosperon Indian Economic Lead: ${edition.leadStory.headline}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <header className="w-full bg-[var(--bg-card)] border-b border-[var(--border-color)] transition-colors">
      
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 border-b border-[var(--border-color)] text-xs text-[var(--text-secondary)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Vol. {edition.volume} • Issue {edition.issue} (Bharat Edition)
          </span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            {edition.date}
          </span>
          <span className="hidden md:inline opacity-40">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            NSE / BSE Live Real-Time Stream
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Reading Mode Selector */}
          <div className="flex items-center bg-[var(--bg-paper)] rounded-full p-0.5 border border-[var(--border-color)]">
            <button 
              onClick={() => applyTheme('paper')}
              title="Classic Ivory Paper Mode"
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${theme === 'paper' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Ivory
            </button>
            <button 
              onClick={() => applyTheme('sepia')}
              title="Warm Sepia Mode"
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${theme === 'sepia' ? 'bg-[#EAE0D0] text-amber-950 font-bold shadow-sm' : 'text-amber-800/70 hover:text-amber-900'}`}
            >
              Sepia
            </button>
            <button 
              onClick={() => applyTheme('dark')}
              title="Midnight Obsidian Mode"
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-100 font-bold shadow-sm' : 'text-gray-400 hover:text-slate-200'}`}
            >
              Midnight
            </button>
          </div>

          <button 
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors p-1"
            title="Share Today's Issue"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button 
            onClick={() => window.print()}
            className="hidden lg:flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors p-1"
            title="Print Newspaper Edition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={onOpenSubscribe}
            className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-3 py-1 rounded shadow-sm text-xs transition-all active:scale-95"
          >
            <Bell className="w-3.5 h-3.5 text-amber-300" />
            <span>Get Daily Morning Dispatch</span>
          </button>
        </div>
      </div>

      {/* Main Masthead Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-[11px] font-black tracking-widest uppercase mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Indian Financial & Economic Intelligence In Plain English
        </div>

        <Link href="/" className="group block">
          <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[var(--text-primary)] group-hover:opacity-95 transition-opacity">
            PROSPERON
          </h1>
        </Link>

        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="h-px w-12 bg-amber-500/50"></span>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] italic font-serif">
            "Empowering Indian households with clear stock markets, RBI policy insights, and wealth-building intelligence."
          </p>
          <span className="h-px w-12 bg-amber-500/50"></span>
        </div>

        {/* Prosperity Double Line Accent */}
        <div className="mt-4 pt-1 border-t-2 border-b border-[var(--border-color)]"></div>
      </div>

      {/* Navigation Desks */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2 text-xs uppercase tracking-wider font-semibold border-b border-[var(--border-color)]">
          <div className="flex items-center gap-6 sm:gap-8 whitespace-nowrap">
            <Link 
              href="/" 
              className={`transition-colors py-1 ${pathname === '/' ? 'text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-700 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Today's Edition
            </Link>

            <Link 
              href="/#masterclass" 
              className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold hover:text-emerald-950 transition-colors py-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              Daily Masterclass
            </Link>

            <Link 
              href="/earnings" 
              className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/earnings' ? 'text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-700 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              India Inc. Earnings
            </Link>

            <Link 
              href="/tools" 
              className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/tools' ? 'text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-700 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              Wealth Decision Lab (₹)
            </Link>

            <Link 
              href="/glossary" 
              className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/glossary' ? 'text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-700 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Jargon Buster
            </Link>

            <Link 
              href="/archive" 
              className={`transition-colors py-1 ${pathname === '/archive' ? 'text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-700 font-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Past Archives
            </Link>
          </div>

          <div className="flex items-center gap-3 pl-4">
            <Link
              href="/admin"
              className="text-[11px] font-bold text-amber-900 dark:text-amber-300 hover:underline flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded border border-amber-300 dark:border-amber-800"
            >
              ⚙️ Control Room
            </Link>
          </div>
        </div>
      </nav>

    </header>
  );
}
