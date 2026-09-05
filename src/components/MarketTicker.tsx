'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LiveQuoteItem, MarketTickerItem } from '@/lib/types';
import { TrendingUp, TrendingDown, Info, X, RefreshCw, Radio, Clock, ShieldCheck } from 'lucide-react';

interface MarketTickerProps {
  initialTickers?: MarketTickerItem[];
}

export default function MarketTicker({ initialTickers }: MarketTickerProps) {
  const [quotes, setQuotes] = useState<LiveQuoteItem[]>([]);
  const [sessionInfo, setSessionInfo] = useState<{
    isOpen: boolean;
    session: string;
    label: string;
    sublabel: string;
    currentTimeIST: string;
    nextOpen: string;
  } | null>(null);
  const [activeContext, setActiveContext] = useState<LiveQuoteItem | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [changedSymbols, setChangedSymbols] = useState<Record<string, 'up' | 'down'>>({});
  const [countdown, setCountdown] = useState(8);
  const prevQuotesRef = useRef<Record<string, number>>({});

  const fetchLive = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/quotes/live?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.quotes) && data.quotes.length > 0) {
        const newChanged: Record<string, 'up' | 'down'> = {};
        data.quotes.forEach((q: LiveQuoteItem) => {
          const oldPrice = prevQuotesRef.current[q.symbol];
          if (oldPrice && Math.abs(oldPrice - q.price) > 0.001) {
            newChanged[q.symbol] = q.price > oldPrice ? 'up' : 'down';
          }
          prevQuotesRef.current[q.symbol] = q.price;
        });

        if (Object.keys(newChanged).length > 0) {
          setChangedSymbols(newChanged);
          setTimeout(() => setChangedSymbols({}), 2500);
        }

        setQuotes(data.quotes);
        if (data.session) setSessionInfo(data.session);
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
        setCountdown(8);
      }
    } catch (err) {
      console.error('Failed to fetch live quotes:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLive();
    const pollInterval = setInterval(fetchLive, 8000);
    const countInterval = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 8));
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(countInterval);
    };
  }, []);

  const displayQuotes = quotes.length > 0 ? quotes : (initialTickers || []).map(t => ({
    symbol: t.symbol,
    name: t.name,
    category: 'Index' as const,
    price: parseFloat(t.price.replace(/[$,₹]/g, '')) || 0,
    formattedPrice: t.price,
    change: parseFloat(t.change) || 0,
    formattedChange: t.change,
    changePercent: parseFloat(t.change) || 0,
    formattedPercent: t.change,
    isPositive: t.isPositive,
    context: t.context,
    lastUpdated: new Date().toISOString()
  }));

  return (
    <div className="w-full bg-[var(--bg-card)] border-b border-[var(--border-color)] relative transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center py-2 overflow-x-auto no-scrollbar gap-3 divide-x divide-[var(--border-color)]">
          
          {/* Live Market Status & Auto-Sync Pill */}
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider shrink-0 pr-3">
            <span 
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shadow-2xs ${
                sessionInfo?.isOpen 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 animate-pulse'
                  : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}
              title={sessionInfo?.sublabel || 'Indian Market Session'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sessionInfo?.isOpen ? 'bg-emerald-600 animate-ping' : 'bg-rose-600'}`}></span>
              <span>{sessionInfo?.label || 'REAL-TIME WIRE'}</span>
            </span>

            <span className="font-mono text-[10px] text-[var(--text-secondary)] hidden lg:inline">
              Sync: {countdown}s
            </span>

            <button
              onClick={fetchLive}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors p-1"
              title="Force Refresh Live Benchmark Quotes"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>

          {/* Ticker Items */}
          {displayQuotes.map((item) => {
            const tickAnim = changedSymbols[item.symbol];
            return (
              <button
                key={item.symbol}
                onClick={() => setActiveContext(activeContext?.symbol === item.symbol ? null : item)}
                className={`flex items-center gap-2 pl-3.5 shrink-0 text-left py-1 px-2 rounded transition-all group cursor-pointer ${
                  tickAnim === 'up'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 ring-1 ring-emerald-500 scale-105'
                    : tickAnim === 'down'
                    ? 'bg-rose-100 dark:bg-rose-950/80 ring-1 ring-rose-500 scale-105'
                    : 'hover:bg-[var(--bg-paper)]'
                }`}
                title="Click to view market context"
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                    {item.symbol.replace('%5E', '^')}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-medium truncate max-w-[85px]">
                    {item.name}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    {item.formattedPrice}
                  </div>
                  <div className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${item.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.formattedPercent}
                  </div>
                </div>

                <Info className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
              </button>
            );
          })}

        </div>
      </div>

      {/* Context Popover for Selected Ticker */}
      {activeContext && (
        <div className="bg-amber-50 dark:bg-slate-800 border-t border-b border-amber-200 dark:border-slate-700 py-2.5 px-4 sm:px-6 animate-fadeIn text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-amber-950 dark:text-amber-300">
                💡 Real-Time Context for {activeContext.name} ({activeContext.symbol}):
              </span>
              <span className="text-amber-900 dark:text-slate-200">
                {activeContext.context}
              </span>
              {activeContext.high && activeContext.low && (
                <span className="font-mono text-[11px] text-amber-800 dark:text-amber-400 bg-amber-100/80 dark:bg-slate-700 px-2 py-0.5 rounded">
                  Day Range: {activeContext.low.toFixed(2)} - {activeContext.high.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveContext(null)}
              className="text-amber-700 dark:text-slate-400 hover:text-amber-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
