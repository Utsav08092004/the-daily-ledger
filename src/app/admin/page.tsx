'use client';

import React, { useState, useEffect } from 'react';
import Masthead from '@/components/Masthead';
import EmailPreviewModal from '@/components/EmailPreviewModal';
import SubscribeModal from '@/components/SubscribeModal';
import { DailyEdition, Subscriber } from '@/lib/types';
import { 
  Sparkles, Mail, Send, RefreshCw, 
  Users, Calendar, CheckCircle2, AlertCircle, 
  Settings, Clock, ArrowRight, Eye, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [edition, setEdition] = useState<DailyEdition | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<string>('');
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [edRes, subRes] = await Promise.all([
        fetch('/api/editions?latest=true'),
        fetch('/api/subscribe')
      ]);
      const edData = await edRes.json();
      const subData = await subRes.json();
      setEdition(edData);
      if (subData.subscribers) setSubscribers(subData.subscribers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEdition = async (dateOverride?: string) => {
    setGenerating(true);
    setDispatchResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDate: dateOverride || targetDate || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setEdition(data.edition);
      setDispatchResult(`Successfully generated fresh edition for ${data.edition.date}!`);
    } catch (err: any) {
      setDispatchResult(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleBroadcastNewsletter = async () => {
    if (!edition) return;
    setDispatching(true);
    setDispatchResult(null);
    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editionId: edition.id, sendToAll: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Dispatch failed');
      setDispatchResult(`Dispatched newsletter for ${edition.date} to all active subscribers!`);
      loadData();
    } catch (err: any) {
      setDispatchResult(`Dispatch error: ${err.message}`);
    } finally {
      setDispatching(false);
    }
  };

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        
        {/* Header */}
        <div className="border-b border-[var(--border-color)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              <Settings className="w-4 h-4" />
              Editor-in-Chief Control Room
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Automated News & Email Dispatch Engine
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Manage daily edition automation, trigger instant AI pipeline updates, inspect rendered HTML newsletters, and monitor subscriber delivery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              View Live Newspaper
            </Link>
          </div>
        </div>

        {/* Status Notification */}
        {dispatchResult && (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{dispatchResult}</span>
          </div>
        )}

        {/* 2-Column Grid: Automated Generation & Email Dispatch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Automated Daily Edition Pipeline */}
          <div className="paper-card rounded-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-amber-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                    Daily Edition Pipeline
                  </h3>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    Current active: {edition?.date || 'Loading...'}
                  </span>
                </div>
              </div>

              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold px-2 py-0.5 rounded">
                Live Auto-Sync
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              The automated pipeline gathers financial market data, translates economic policy into plain-English analogies, synthesizes the <strong>"Wallet Impact"</strong> matrix, and prepares the 3-minute voice briefing.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleGenerateEdition()}
                disabled={generating}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded text-xs transition-all flex items-center justify-center gap-2 shadow disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                <span>{generating ? 'Compiling Today\'s Edition...' : 'Generate Today\'s Fresh Edition Now'}</span>
              </button>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="date"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="bg-[var(--bg-paper)] border border-[var(--border-color)] rounded px-3 py-1.5 text-xs text-[var(--text-primary)] flex-1 focus:outline-none focus:border-emerald-600"
                />
                <button
                  onClick={() => handleGenerateEdition(targetDate)}
                  disabled={generating || !targetDate}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded text-xs transition-colors disabled:opacity-40 shrink-0"
                >
                  Generate Specific Date
                </button>
              </div>
            </div>

            {/* Cron / Automated Schedule Instructions */}
            <div className="bg-amber-50/70 dark:bg-slate-800/80 p-4 rounded-lg border border-amber-200 dark:border-slate-700 text-[11px] space-y-2 text-slate-700 dark:text-slate-300">
              <div className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Automated Daily Schedule:
              </div>
              <p>
                To trigger automatic updates daily at 6:00 AM, set a cron job or scheduled task:
              </p>
              <code className="block bg-black/10 dark:bg-black/40 p-2 rounded text-[10px] font-mono text-emerald-800 dark:text-emerald-400 select-all">
                curl -X POST http://localhost:3000/api/generate
              </code>
            </div>
          </div>

          {/* Card 2: Email Dispatch & Newsletter Control */}
          <div className="paper-card rounded-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                    Email Dispatch Center
                  </h3>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {subscribers.length} Active Subscribers
                  </span>
                </div>
              </div>

              <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold px-2 py-0.5 rounded">
                HTML Ready
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every morning, an editorial HTML newsletter containing the day's market ticker, front-page ELI5 story, jargon buster, and wallet action tip is dispatched to all subscribers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setEmailPreviewOpen(true)}
                className="bg-[var(--bg-paper)] hover:bg-[var(--border-color)] text-[var(--text-primary)] font-bold py-2.5 px-4 rounded text-xs transition-colors border border-[var(--border-color)] flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Live Email Inspector</span>
              </button>

              <button
                onClick={handleBroadcastNewsletter}
                disabled={dispatching}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-2 shadow disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{dispatching ? 'Broadcasting...' : 'Broadcast Daily Email'}</span>
              </button>
            </div>

            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)] text-[11px] space-y-1 text-[var(--text-secondary)]">
              <div className="font-bold text-[var(--text-primary)]">Automated Morning Broadcast Endpoint:</div>
              <code className="block bg-black/5 dark:bg-black/30 p-2 rounded text-[10px] font-mono text-emerald-800 dark:text-emerald-400 select-all">
                curl -X POST http://localhost:3000/api/dispatch -d '{`"sendToAll": true`}'
              </code>
            </div>
          </div>

        </div>

        {/* Subscriber List Table */}
        <div className="paper-card rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                Subscriber Registry ({subscribers.length})
              </h3>
            </div>

            <button
              onClick={() => setSubscribeOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              + Add Subscriber Manually
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Subscriber Email</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Topics</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[var(--bg-paper)]">
                    <td className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">
                      {sub.email}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-secondary)]">
                      {sub.name || '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {sub.topics.map(t => (
                          <span key={t} className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-secondary)]">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {edition && (
        <EmailPreviewModal
          isOpen={emailPreviewOpen}
          onClose={() => setEmailPreviewOpen(false)}
          edition={edition}
        />
      )}

      <SubscribeModal
        isOpen={subscribeOpen}
        onClose={() => {
          setSubscribeOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
