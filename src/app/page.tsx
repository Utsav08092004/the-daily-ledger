'use client';

import React, { useState, useEffect } from 'react';
import { DailyEdition } from '@/lib/types';
import Masthead from '@/components/Masthead';
import MarketTicker from '@/components/MarketTicker';
import IndexFluctuationMatrix from '@/components/IndexFluctuationMatrix';
import GeopoliticalImpactRadar from '@/components/GeopoliticalImpactRadar';
import DailyMasterclassSection from '@/components/DailyMasterclassSection';
import AudioPlayer from '@/components/AudioPlayer';
import LeadStory from '@/components/LeadStory';
import ArticleCard from '@/components/ArticleCard';
import JargonBusterCard from '@/components/JargonBusterCard';
import DecisionCalculator from '@/components/DecisionCalculator';
import LiveNewsFeed from '@/components/LiveNewsFeed';
import EarningsScorecard from '@/components/EarningsScorecard';
import SubscribeModal from '@/components/SubscribeModal';
import EmailPreviewModal from '@/components/EmailPreviewModal';
import { 
  Sparkles, Mail, Send, Bell, 
  BookOpen, Calculator, ArrowRight, 
  Building2, Radio, CheckCircle2, ShieldCheck, Activity, RefreshCw, Globe2, GraduationCap 
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [edition, setEdition] = useState<DailyEdition | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSuccess, setFooterSuccess] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  const fetchLatestEdition = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch(`/api/editions?latest=true&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      const data = await res.json();
      if (data && data.date) {
        setEdition(data);
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to load edition:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLatestEdition();
    const interval = setInterval(() => {
      fetchLatestEdition(true);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail || !footerEmail.includes('@')) return;
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: footerEmail }),
      });
      setFooterSuccess(true);
      setFooterEmail('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !edition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-paper)]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="font-editorial text-2xl font-black text-[var(--text-primary)]">
            PROSPERON
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            Auto-generating today's fresh Indian & Geopolitical edition...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-paper)] transition-colors">
      
      {/* Newspaper Masthead */}
      <Masthead 
        edition={edition} 
        onOpenSubscribe={() => setSubscribeOpen(true)}
        onOpenDispatch={() => setDispatchOpen(true)}
      />

      {/* Real-time Streaming Market Ticker */}
      <MarketTicker initialTickers={edition.tickers} />

      {/* 3-Minute Voice Briefing Bar */}
      <AudioPlayer text={edition.audioBriefingSummary} date={edition.date} />

      {/* Main Newspaper Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-12">
        
        {/* Quote of the Day & Live Sync Status Banner */}
        <div className="bg-amber-50/80 dark:bg-slate-800/80 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-serif italic text-slate-800 dark:text-slate-200 text-sm">
              "{edition.quoteOfTheDay.quote}"
            </span>
            <span className="font-bold text-amber-900 dark:text-amber-300 ml-2">
              — {edition.quoteOfTheDay.author} ({edition.quoteOfTheDay.context})
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-full text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Auto-Updating: {lastSyncedTime}</span>
            </div>

            <button
              onClick={() => fetchLatestEdition(false)}
              disabled={refreshing}
              className="p-1 text-slate-600 hover:text-emerald-700 transition-colors"
              title="Force Refresh Today's Edition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Real-Time Live Index Rate Fluctuation Matrix */}
        <IndexFluctuationMatrix />

        {/* GEOPOLITICAL & GLOBAL MACRO IMPACT RADAR */}
        <GeopoliticalImpactRadar />

        {/* Top Split: Lead Story (65%) + Jargon / Side Column (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Front-Page Lead Story */}
          <div className="lg:col-span-8 space-y-6">
            <LeadStory article={edition.leadStory} />
          </div>

          {/* Side Column: Jargon Buster + Quick Decision Rules + Email Card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Jargon of the Day */}
            <JargonBusterCard jargon={edition.jargonOfTheDay} />

            {/* Daily Decision Rule Card */}
            <div className="paper-card rounded-lg p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-md border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 font-black text-[10px] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Today's Prosperon Wealth Rule
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                "{edition.quickDecisionTip}"
              </p>
            </div>

            {/* Morning Email Dispatch Prompt Box */}
            <div className="paper-card rounded-lg p-5 border-2 border-dashed border-emerald-600/40 bg-emerald-50/40 dark:bg-slate-800/40 text-center space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-sm">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-editorial text-sm font-bold text-[var(--text-primary)]">
                  Read In Your Inbox Every Morning
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  Delivered at 07:00 AM IST with complete audio briefing.
                </p>
              </div>
              <button
                onClick={() => setSubscribeOpen(true)}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-xs"
              >
                Join 45,000+ Readers
              </button>
            </div>

          </div>
        </div>

        {/* Section 2: Top Stories Desk Grid */}
        <section className="space-y-4 pt-4 border-t-2 border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-600 rounded-full"></span>
              Top Market & Macro Columns
            </h3>
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Curated by Editorial Desks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {edition.topStories.map((story) => (
              <ArticleCard key={story.id} article={story} />
            ))}
          </div>
        </section>

        {/* Section 3: TODAY'S COMPLEX FINANCE MASTERCLASS */}
        {edition.financeMasterclass && (
          <section id="masterclass" className="pt-4 border-t-2 border-[var(--border-color)]">
            <DailyMasterclassSection masterclass={edition.financeMasterclass} />
          </section>
        )}

        {/* Section 4: Live Automated Financial Wire (Livemint & Economic Times) */}
        <section className="pt-4 border-t-2 border-[var(--border-color)]">
          <LiveNewsFeed />
        </section>

        {/* Section 5: India Inc. Corporate Earnings Radar */}
        <section className="pt-4 border-t-2 border-[var(--border-color)]">
          <EarningsScorecard />
        </section>

        {/* Section 6: Wealth Decision Laboratory (Interactive SIP & Loan Calculator) */}
        <section className="pt-4 border-t-2 border-[var(--border-color)]">
          <DecisionCalculator />
        </section>

      </main>

      {/* Newspaper Footer */}
      <footer className="w-full bg-[var(--bg-card)] border-t-2 border-[var(--border-color)] mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[var(--border-color)]">
            
            <div className="space-y-3 md:col-span-2">
              <div className="font-editorial text-3xl font-black text-[var(--text-primary)]">
                PROSPERON
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md">
                India's daily financial intelligence platform and digital newspaper. Demystifying stock markets, RBI policy announcements, mutual fund compounding, and personal taxation with everyday analogies and zero financial jargon.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>SEBI-Aware Investor Education Initiative</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[11px]">
                Editorial Desks
              </div>
              <ul className="space-y-1.5 text-[var(--text-secondary)]">
                <li><Link href="/" className="hover:text-emerald-700">Front Page Lead</Link></li>
                <li><Link href="/#masterclass" className="hover:text-emerald-700">Daily Masterclass</Link></li>
                <li><Link href="/earnings" className="hover:text-emerald-700">India Inc. Earnings</Link></li>
                <li><Link href="/tools" className="hover:text-emerald-700">SIP & Wealth Decision Lab</Link></li>
                <li><Link href="/glossary" className="hover:text-emerald-700">Indian Jargon Buster</Link></li>
                <li><Link href="/archive" className="hover:text-emerald-700">Past Editions Archive</Link></li>
              </ul>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[11px]">
                Free Morning Dispatch
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Join 45,000+ Indian retail investors receiving our daily morning 7:00 AM briefing.
              </p>
              {footerSuccess ? (
                <div className="text-emerald-700 font-bold bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded border border-emerald-300 text-xs">
                  ✓ You are subscribed to Prosperon!
                </div>
              ) : (
                <form onSubmit={handleFooterSubscribe} className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[var(--bg-paper)] border border-[var(--border-color)] rounded focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-1.5 rounded transition-colors text-xs shadow-xs"
                  >
                    Subscribe Daily
                  </button>
                </form>
              )}
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
            <div>
              © 2026 PROSPERON Media Inc. • Vol. {edition.volume}, Issue {edition.issue} • Designed for Bharat.
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setSubscribeOpen(true)} className="hover:underline">Subscribe</button>
              <span>•</span>
              <Link href="/admin" className="hover:underline">Control Room</Link>
              <span>•</span>
              <Link href="/archive" className="hover:underline">Archives</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Subscribe Modal */}
      <SubscribeModal 
        isOpen={subscribeOpen} 
        onClose={() => setSubscribeOpen(false)} 
      />

      {/* Email Dispatch Preview Modal */}
      <EmailPreviewModal
        isOpen={dispatchOpen}
        onClose={() => setDispatchOpen(false)}
        edition={edition}
      />

    </div>
  );
}
