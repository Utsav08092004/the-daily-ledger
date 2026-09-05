'use client';

import React, { useState } from 'react';
import { DailyFinanceMasterclass } from '@/lib/types';
import { 
  GraduationCap, Sparkles, Lightbulb, Wallet, 
  HelpCircle, CheckCircle2, XCircle, AlertOctagon, 
  ArrowRight, BookOpen, Clock, ShieldCheck, ChevronRight,
  Layers, RefreshCw
} from 'lucide-react';

interface DailyMasterclassSectionProps {
  masterclass?: DailyFinanceMasterclass;
}

export default function DailyMasterclassSection({ masterclass: initialMasterclass }: DailyMasterclassSectionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [activeTopicId, setActiveTopicId] = useState<string>(initialMasterclass?.id || '');

  if (!initialMasterclass) return null;

  const isCorrect = selectedOption === initialMasterclass.quickQuiz.correctIndex;

  return (
    <section id="masterclass" className="paper-card rounded-xl p-6 sm:p-8 space-y-7 bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-paper)] to-amber-500/5 border-2 border-emerald-500/40 shadow-xl relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1">
            <GraduationCap className="w-4 h-4 text-emerald-600 animate-bounce" />
            Prosperon Daily Masterclass • Complex Finance Made Crystal Clear
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            Finance Demystified: Today's Complex Topic
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            One notoriously difficult financial concept explained in ultra-simple, jargon-free plain English every morning.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 text-[11px] font-bold rounded-full flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span>Level: {initialMasterclass.level}</span>
          </span>

          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-[11px] font-bold rounded-full">
            {initialMasterclass.category}
          </span>
        </div>
      </div>

      {/* Main Topic Headline & Two-Column Translation Grid */}
      <div className="space-y-4">
        
        {/* Topic Title */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-editorial text-xl sm:text-2xl font-black text-[var(--text-primary)] text-emerald-950 dark:text-emerald-200">
            🎓 {initialMasterclass.topic}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-white px-2.5 py-0.5 rounded">
            Featured Daily Topic
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Box 1: The Intimidating Wall Street Textbook Definition */}
          <div className="p-4 sm:p-5 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>The Intimidating Textbook Jargon:</span>
            </div>
            <p className="text-xs text-rose-950 dark:text-rose-200 italic font-mono leading-relaxed">
              "{initialMasterclass.theIntimidatingJargon}"
            </p>
          </div>

          {/* Box 2: The Crystal Clear Plain English Reality */}
          <div className="p-4 sm:p-5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 space-y-2 shadow-xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>The Plain English Reality:</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-medium leading-relaxed">
              {initialMasterclass.plainEnglishBreakdown}
            </p>
          </div>

        </div>

      </div>

      {/* The Breakthrough Everyday Analogy (ELI5) */}
      <div className="bg-amber-50/90 dark:bg-slate-800/90 border-2 border-amber-300 dark:border-slate-700 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          The Breakthrough Everyday Analogy (ELI5)
        </div>
        <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed font-serif italic">
          "{initialMasterclass.breakthroughAnalogy}"
        </p>
      </div>

      {/* Step-by-Step Architecture (How It Actually Works) */}
      <div className="space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Step-by-Step Mechanics: How It Actually Works</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {initialMasterclass.howItWorksStepByStep.map((step, idx) => (
            <div key={idx} className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)] space-y-1.5 relative shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-mono text-[10px] font-black flex items-center justify-center">
                {idx + 1}
              </span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transmission to Indian Markets & Wallet Action Rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Transmission to Dalal Street */}
        <div className="bg-[var(--bg-card)] p-5 rounded-lg border border-[var(--border-color)] space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wide text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <span>🇮🇳</span> Transmission to Dalal Street & Indian Banking
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {initialMasterclass.transmissionToIndianMarkets}
          </p>
        </div>

        {/* Action Rule for Your Wallet */}
        <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-5 rounded-lg space-y-2 border border-emerald-700">
          <div className="text-xs font-bold uppercase tracking-wide text-amber-300 flex items-center gap-1.5">
            <Wallet className="w-4 h-4" />
            <span>Prosperon Action Rule for Your Portfolio</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {initialMasterclass.walletActionRule}
          </p>
          <div className="text-[11px] text-rose-300 font-semibold pt-1 border-t border-emerald-800/60 flex items-start gap-1">
            <AlertOctagon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Trap to avoid: {initialMasterclass.commonMistakeToAvoid}</span>
          </div>
        </div>

      </div>

      {/* Interactive 1-Minute Concept Quiz */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 border-2 border-amber-400/40 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h4 className="font-editorial text-base sm:text-lg font-bold text-white">
              1-Minute Knowledge Check: Did You Grasp the Concept?
            </h4>
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded">
            Interactive Quiz
          </span>
        </div>

        <p className="text-sm font-semibold text-slate-200">
          {initialMasterclass.quickQuiz.question}
        </p>

        {/* Options List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {initialMasterclass.quickQuiz.options.map((opt, optIdx) => {
            const isSelected = selectedOption === optIdx;
            let btnClass = 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700/80';

            if (quizSubmitted) {
              if (optIdx === initialMasterclass.quickQuiz.correctIndex) {
                btnClass = 'bg-emerald-900/90 text-emerald-200 border-emerald-400 ring-2 ring-emerald-400';
              } else if (isSelected) {
                btnClass = 'bg-rose-900/90 text-rose-200 border-rose-500';
              }
            } else if (isSelected) {
              btnClass = 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow';
            }

            return (
              <button
                key={optIdx}
                onClick={() => {
                  setSelectedOption(optIdx);
                  setQuizSubmitted(true);
                }}
                className={`p-3 rounded-lg border text-left text-xs font-medium transition-all flex items-start gap-2 ${btnClass}`}
              >
                <span className="w-4 h-4 rounded-full border border-current shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation Alert */}
        {quizSubmitted && (
          <div className={`p-4 rounded-lg text-xs leading-relaxed animate-fadeIn ${
            isCorrect ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200' : 'bg-rose-950/80 border border-rose-500 text-rose-200'
          }`}>
            <div className="font-bold flex items-center gap-1.5 mb-1">
              {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
              <span>{isCorrect ? 'Outstanding! You got it right.' : 'Not quite right. Here is the breakdown:'}</span>
            </div>
            <p>{initialMasterclass.quickQuiz.explanation}</p>
          </div>
        )}

      </div>

      {/* Auto-Rotation Footer Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>New complex topic unlocks automatically every day at 00:00 IST.</span>
        </div>

        <span className="font-semibold text-emerald-800 dark:text-emerald-400">
          Prosperon Financial Literacy Engine
        </span>
      </div>

    </section>
  );
}
