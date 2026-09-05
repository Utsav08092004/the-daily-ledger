'use client';

import React, { useState } from 'react';
import { Mail, Send, X, Smartphone, Monitor, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { DailyEdition } from '@/lib/types';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition: DailyEdition;
}

export default function EmailPreviewModal({ isOpen, onClose, edition }: EmailPreviewModalProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSendTest = async (sendToAll: boolean = false) => {
    if (!sendToAll && (!testEmail || !testEmail.includes('@'))) {
      setStatusMessage({ text: 'Please enter a valid test email address.', success: false });
      return;
    }

    setSending(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editionId: edition.id,
          testEmail: sendToAll ? undefined : testEmail,
          sendToAll
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch email');
      }

      setStatusMessage({
        text: data.message || 'Dispatch completed successfully!',
        success: true
      });
    } catch (err: any) {
      setStatusMessage({
        text: err.message || 'Failed to dispatch email.',
        success: false
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-paper)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                Email Dispatch & Live Newsletter Inspector
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Edition: {edition.date} (Vol. {edition.volume} • Issue {edition.issue})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Viewport toggle */}
            <div className="flex items-center bg-[var(--bg-card)] rounded-lg p-0.5 border border-[var(--border-color)]">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 font-semibold ${viewport === 'desktop' ? 'bg-emerald-700 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 font-semibold ${viewport === 'mobile' ? 'bg-emerald-700 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action / Dispatch Bar */}
        <div className="px-6 py-3 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="email"
              placeholder="Send test copy to (e.g. your email)..."
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              className="w-full bg-[var(--bg-paper)] border border-[var(--border-color)] px-3 py-1.5 rounded text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-600"
            />
            <button
              onClick={() => handleSendTest(false)}
              disabled={sending}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded shrink-0 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>Send Test</span>
            </button>
          </div>

          <button
            onClick={() => handleSendTest(true)}
            disabled={sending}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-1.5 rounded border border-amber-400/40 flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${sending ? 'animate-spin' : ''}`} />
            <span>Broadcast To All Active Subscribers</span>
          </button>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div className={`px-6 py-2 text-xs flex items-center gap-2 border-b ${statusMessage.success ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'}`}>
            {statusMessage.success ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Live Email Iframe Container */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-950 p-4 overflow-y-auto flex items-center justify-center">
          <div
            className={`transition-all duration-300 h-full bg-white rounded-lg shadow-xl overflow-hidden ${
              viewport === 'mobile' ? 'w-[375px]' : 'w-full max-w-[680px]'
            }`}
          >
            <iframe
              src={`/api/dispatch?editionId=${edition.id}`}
              className="w-full h-full border-0"
              title="Daily Ledger Email Preview"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
