'use client';

import React, { useState } from 'react';
import { Article, LiveNewsItem } from '@/lib/types';
import { 
  X, Sparkles, Volume2, VolumeX, 
  Share2, CheckCircle2, Clock, User, 
  ExternalLink, ShieldCheck, BookOpen, Globe 
} from 'lucide-react';

interface ArticleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | LiveNewsItem | null;
}

export default function ArticleReaderModal({ isOpen, onClose, article }: ArticleReaderModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  // Determine whether this is a full Article or a LiveNewsItem
  const isFullArticle = 'headline' in article;
  const title = isFullArticle ? (article as Article).headline : (article as LiveNewsItem).title;
  const subheadline = isFullArticle ? (article as Article).subheadline : ((article as LiveNewsItem).description || (article as LiveNewsItem).summary);
  const category = isFullArticle ? (article as Article).category : (article as LiveNewsItem).category;
  const author = isFullArticle ? (article as Article).author : (article as LiveNewsItem).source;
  const readTime = isFullArticle ? (article as Article).readTime : (article as LiveNewsItem).pubDate;
  const eli5 = article.eli5;
  const sourceLink = !isFullArticle ? (article as LiveNewsItem).link : null;
  const sourceName = !isFullArticle ? (article as LiveNewsItem).source : 'Prosperon Editorial Desk';

  // Story paragraphs
  const fullStoryParas: string[] = isFullArticle
    ? (article as Article).fullStory
    : (article as LiveNewsItem).fullContent && (article as LiveNewsItem).fullContent.length > 0
    ? (article as LiveNewsItem).fullContent
    : [(article as LiveNewsItem).summary];

  const keyPoints: string[] = isFullArticle
    ? (article as Article).keyPoints
    : (article as LiveNewsItem).keyTakeaways && (article as LiveNewsItem).keyTakeaways.length > 0
    ? (article as LiveNewsItem).keyTakeaways
    : [`Key Factor: ${title}`, `Takeaway: ${subheadline}`];

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const textToRead = `${title}. ${subheadline}. In plain English: ${eli5}. Full story: ${fullStoryParas.join(' ')}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(sourceLink || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-paper)]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-800 text-white font-mono font-black text-[10px] uppercase px-2 py-0.5 rounded">
              PROSPERON READER
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {sourceLink && (
              <a
                href={sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-300 transition-colors"
              >
                <span>Open on {sourceName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={handleSpeak}
              className={`p-1.5 sm:px-3 sm:py-1 rounded-lg border border-[var(--border-color)] text-xs font-bold flex items-center gap-1.5 transition-colors ${isPlaying ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-emerald-50'}`}
              title={isPlaying ? 'Stop Audio' : 'Listen to Full Story'}
            >
              {isPlaying ? <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              <span className="hidden sm:inline">{isPlaying ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 sm:px-3 sm:py-1 rounded-lg border border-[var(--border-color)] text-xs font-bold bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-emerald-50 transition-colors flex items-center gap-1"
              title="Share Story Link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => {
                if (isPlaying) window.speechSynthesis?.cancel();
                onClose();
              }}
              className="p-1.5 rounded-lg border border-[var(--border-color)] text-gray-500 hover:text-gray-900 dark:hover:text-white bg-[var(--bg-card)] hover:bg-rose-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1 font-bold text-[var(--text-primary)]">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              {author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight">
            {title}
          </h1>

          {/* Subheadline / Real Description */}
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal leading-relaxed border-l-4 border-amber-500 pl-3.5 bg-amber-50/40 dark:bg-slate-800/40 py-1.5 rounded-r">
            {subheadline}
          </p>

          {/* ELI5 Everyday Analogy Card */}
          <div className="bg-amber-50/90 dark:bg-slate-800/90 border border-amber-300 dark:border-slate-700 rounded-lg p-5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              The 60-Second Everyday Analogy (ELI5)
            </div>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic">
              "{eli5}"
            </p>
          </div>

          {/* Full Story Paragraphs */}
          <div className="space-y-4 text-[var(--text-primary)] leading-relaxed text-sm sm:text-base border-t border-[var(--border-color)] pt-5">
            <div className="font-editorial text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              Complete Financial Dispatch:
            </div>
            {fullStoryParas.map((para, idx) => (
              <p key={idx} className={idx === 0 ? "font-serif text-base sm:text-lg leading-relaxed text-[var(--text-primary)]" : "leading-relaxed text-[var(--text-secondary)]"}>
                {para}
              </p>
            ))}
          </div>

          {/* Key Bullet Highlights */}
          {keyPoints && keyPoints.length > 0 && (
            <div className="space-y-2 bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)] text-xs">
              <div className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[11px]">
                Key Takeaways & Points to Note:
              </div>
              {keyPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          )}

          {/* Direct Working Third-Party Publisher Link */}
          {sourceLink && (
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[var(--text-primary)] block">Read Original Journalistic Dispatch:</span>
                <span className="text-[11px] text-[var(--text-secondary)]">Published by {sourceName}</span>
              </div>

              <a
                href={sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 font-bold rounded-lg text-xs transition-colors shadow-sm"
              >
                <span>Open Story on {sourceName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-paper)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">PROSPERON Indian Financial Intelligence</span>
          </div>

          <button
            onClick={() => {
              if (isPlaying) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-1.5 rounded-lg transition-colors"
          >
            Close Reader
          </button>
        </div>

      </div>
    </div>
  );
}
