'use client';

import React, { useState } from 'react';
import { Mail, Check, X, Bell, ShieldCheck, Sparkles, Send } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Daily Morning Brief',
    'Personal Finance & Decisions',
    'Markets & Equities'
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleTopicToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, topics: selectedTopics }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            
            <h3 className="font-editorial text-2xl font-black text-[var(--text-primary)]">
              You're On The Morning List!
            </h3>
            
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
              We have scheduled your daily financial briefing. Every morning, you'll receive the day's essential economic news in plain English directly to <strong>{email}</strong>.
            </p>

            <div className="bg-amber-50 dark:bg-slate-800 p-3.5 rounded-lg border border-amber-200 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-300">
              💡 <strong>Pro-tip:</strong> You can test an instant sample email delivery anytime in the Admin & Dispatch room.
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Back to Today's Newspaper
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4" />
              Daily Morning Dispatch
            </div>

            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
              Never Miss A Financial Move
            </h3>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6">
              Get today's top markets, rate decisions, and wallet action tips delivered to your inbox every morning at 6:00 AM. 100% free, 0% jargon.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[var(--bg-paper)] border border-[var(--border-color)] px-3 py-2 rounded text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg-paper)] border border-[var(--border-color)] px-3 py-2 rounded text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Topic Preferences */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Select Desks You Care About:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Daily Morning Brief',
                    'Personal Finance & Decisions',
                    'Markets & Equities',
                    'Central Bank & Rates',
                    'Real Estate & Loans',
                    'Startups & Tech'
                  ].map(topic => (
                    <label
                      key={topic}
                      onClick={() => handleTopicToggle(topic)}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                        selectedTopics.includes(topic)
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-semibold'
                          : 'bg-[var(--bg-paper)] border-[var(--border-color)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic)}
                        onChange={() => {}}
                        className="accent-emerald-600"
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-lg shadow-md text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Subscribing...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Join Free & Get Tomorrow's Issue</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-secondary)] text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>No spam, strictly financial knowledge. One-click unsubscribe anytime.</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
