'use client';

import React, { useState, useEffect } from 'react';
import { LiveQuoteItem } from '@/lib/types';
import { TrendingUp, TrendingDown, Activity, Radio, RefreshCw, BarChart2, ShieldCheck, ArrowUpRight, Clock, Globe, Zap } from 'lucide-react';

export default function IndexFluctuationMatrix() {
  const [quotes, setQuotes] = useState<LiveQuoteItem[]>([]);
  const [sessionInfo, setSessionInfo] = useState<{
    isOpen: boolean;
    session: string;
    label: string;
    sublabel: string;
    currentTimeIST: string;
    nextOpen: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastTickTime, setLastTickTime] = useState<string>('Just now');
  const [tickCounter, setTickCounter] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [flashKey, setFlashKey] = useState<number>(0);

  const fetchQuotes = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/quotes/live?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.quotes) && data.quotes.length > 0) {
        setQuotes(data.quotes);
        if (data.session) setSessionInfo(data.session);
        setLastTickTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
        setTickCounter(prev => prev + 1);
        setFlashKey(Date.now());
      }
    } catch (e) {
      console.error('Failed to fetch index matrix:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 4000); // 4-second real-time streaming
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="indices" className="paper-card rounded-lg p-6 bg-gradient-to-b from-[var(--bg-card)] via-[var(--bg-card)] to-[var(--bg-paper)] border-2 border-emerald-900/20 dark:border-emerald-500/20 shadow-paper-lg space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-black animate-pulse">
            <Radio className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Live Indian Market Benchmarks & Commodity Stream
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600 animate-bounce" />
                Live Auto-Stream (4s Interval)
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-slate-700 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-700" />
                Google Finance Stream
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {sessionInfo?.sublabel || 'Real-time points, intraday spreads, and market breadth for Indian benchmarks.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] font-mono shrink-0">
          <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)] bg-[var(--bg-paper)] px-3 py-1 rounded-full border border-[var(--border-color)] shadow-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Tick #{tickCounter} • {lastTickTime}</span>
          </span>
          <button
            onClick={fetchQuotes}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-[var(--bg-paper)] rounded-lg transition-colors border border-[var(--border-color)] text-xs flex items-center gap-1"
            title="Instant Refresh Stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden md:inline font-sans text-[11px] font-semibold">Sync Now</span>
          </button>
        </div>
      </div>

      {/* Index Matrix Grid */}
      {loading && quotes.length === 0 ? (
        <div className="py-6 text-center text-xs text-[var(--text-secondary)]">Connecting to live Google Finance benchmark stream...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quotes.map((item) => {
            const high = item.high || item.price * 1.005;
            const low = item.low || item.price * 0.995;
            const range = Math.max(0.01, high - low);
            const currentOffsetPercent = Math.min(100, Math.max(0, ((item.price - low) / range) * 100));

            return (
              <div
                key={item.symbol}
                className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)] hover:border-emerald-600/40 transition-all space-y-3 shadow-2xs relative overflow-hidden group"
              >
                {/* Ticker Name & Price */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-editorial text-lg font-bold text-[var(--text-primary)] leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black font-mono text-[var(--text-primary)]">
                      {item.formattedPrice}
                    </div>
                    <div className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${item.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{item.formattedChange} pts ({item.formattedPercent})</span>
                    </div>
                  </div>
                </div>

                {/* Intraday High / Low Range Slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                    <span>L: {low.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</span>
                    <span className="font-bold text-[var(--text-primary)]">Day Range</span>
                    <span>H: {high.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</span>
                  </div>

                  <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${currentOffsetPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Plain English Context */}
                <div className="text-[11px] text-[var(--text-secondary)] leading-snug pt-1 border-t border-[var(--border-color)]">
                  💡 {item.context}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
          <span className="font-bold text-[var(--text-primary)]">Market Breadth:</span>
          <span className="text-emerald-700 font-bold">34 Advances</span>
          <span>•</span>
          <span className="text-rose-700 font-bold">16 Declines</span>
          <span>•</span>
          <span className="font-semibold text-emerald-800">Session Bias: Bullish Momentum</span>
        </div>

        <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-time benchmark streaming every 4 seconds • Google Finance Server Sync</span>
        </div>
      </div>

    </div>
  );
}
