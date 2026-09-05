'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, RotateCcw, FastForward, 
  Sparkles, FileText, ChevronDown, ChevronUp, Radio, CheckCircle2 
} from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  date: string;
}

export default function AudioPlayer({ text, date }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [rate, setRate] = useState(1.0);
  const [showScript, setShowScript] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(-1);
  const sentencesRef = useRef<string[]>([]);
  const currentIndexRef = useRef<number>(0);
  const resumeIntervalRef = useRef<any>(null);

  // Split text into distinct sentences for reliable browser SpeechSynthesis
  useEffect(() => {
    if (!text) return;
    const split = text
      .replace(/([.?!])\s*(?=[A-Z0-9])/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    sentencesRef.current = split.length > 0 ? split : [text];

    // If currently playing when text changes, cancel and reset
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setActiveSentenceIndex(-1);
      }
    }
  }, [text]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (resumeIntervalRef.current) {
        clearInterval(resumeIntervalRef.current);
      }
    };
  }, []);

  const playSentenceAtIndex = (idx: number, currentRate: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const sentences = sentencesRef.current;

    if (idx >= sentences.length) {
      setIsPlaying(false);
      setActiveSentenceIndex(-1);
      if (resumeIntervalRef.current) clearInterval(resumeIntervalRef.current);
      return;
    }

    currentIndexRef.current = idx;
    setActiveSentenceIndex(idx);

    const utterance = new SpeechSynthesisUtterance(sentences[idx]);
    utterance.rate = currentRate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('India'))
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      playSentenceAtIndex(idx + 1, currentRate);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      // Attempt next sentence on non-fatal error
      if (idx + 1 < sentences.length) {
        playSentenceAtIndex(idx + 1, currentRate);
      } else {
        setIsPlaying(false);
        setActiveSentenceIndex(-1);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      if (resumeIntervalRef.current) clearInterval(resumeIntervalRef.current);
    } else {
      window.speechSynthesis.cancel();
      setIsPlaying(true);

      // Heartbeat to prevent Chrome SpeechSynthesis 15s pause bug
      if (resumeIntervalRef.current) clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }
      }, 7000);

      const startIndex = activeSentenceIndex >= 0 ? activeSentenceIndex : 0;
      playSentenceAtIndex(startIndex, rate);
    }
  };

  const handleRateChange = () => {
    const nextRate = rate === 1.0 ? 1.25 : rate === 1.25 ? 1.5 : 1.0;
    setRate(nextRate);
    if (isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      playSentenceAtIndex(currentIndexRef.current, nextRate);
    }
  };

  const handleRestart = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setActiveSentenceIndex(0);
    currentIndexRef.current = 0;
    setIsPlaying(true);
    playSentenceAtIndex(0, rate);
  };

  if (!isSupported) return null;

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-slate-900 to-ink-900 text-white shadow-md border-b border-emerald-900/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        
        {/* Main Audio Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-inner transition-colors ${
              isPlaying ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-emerald-700/80 text-emerald-200'
            }`}>
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Prosperon Daily Audio Brief
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Live News Narrated
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1">
                {isPlaying && activeSentenceIndex >= 0
                  ? `Now speaking: "${sentencesRef.current[activeSentenceIndex]?.substring(0, 60)}..."`
                  : "Listen to today's breaking stories & benchmark movements in plain English."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={() => setShowScript(prev => !prev)}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 transition-colors text-xs flex items-center gap-1 border border-white/10"
              title="View or hide the narration script"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden sm:inline">
                {showScript ? 'Hide Script' : 'View Script'}
              </span>
              {showScript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
              title="Restart briefing from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRateChange}
              className="px-2 py-1 text-slate-300 hover:text-white rounded hover:bg-white/10 transition-colors text-xs font-mono font-bold border border-white/10"
              title="Change playback speed"
            >
              {rate}x
            </button>

            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${
                isPlaying
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Briefing</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen Now</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Expandable Live Narration Script Drawer */}
        {showScript && (
          <div className="mt-3 pt-3 border-t border-emerald-900/60 text-xs animate-fadeIn space-y-2">
            <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              <span>🎙️ Live Narration Script (Updated with Today's News):</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {sentencesRef.current.length} Sentences
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-lg border border-emerald-900/40 text-slate-200 text-xs leading-relaxed font-serif space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {sentencesRef.current.map((sentence, idx) => {
                const isActive = activeSentenceIndex === idx;
                return (
                  <span
                    key={idx}
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        setIsPlaying(true);
                        playSentenceAtIndex(idx, rate);
                      }
                    }}
                    className={`inline cursor-pointer transition-colors px-1 py-0.5 rounded mr-1 ${
                      isActive 
                        ? 'bg-amber-400 text-slate-950 font-bold font-sans shadow-xs' 
                        : 'hover:bg-white/10'
                    }`}
                    title="Click sentence to play from here"
                  >
                    {sentence}{' '}
                  </span>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
