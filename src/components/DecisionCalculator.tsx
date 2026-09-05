'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertTriangle, Sparkles, DollarSign, Percent, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';

export default function DecisionCalculator() {
  const [activeTool, setActiveTool] = useState<'emi' | 'sip' | 'inflation'>('emi');

  // Indian Home Loan EMI & Prepayment States (in ₹)
  const [loanAmountLakhs, setLoanAmountLakhs] = useState<number>(50); // ₹50 Lakhs
  const [baseRate, setBaseRate] = useState<number>(8.5); // 8.5% p.a.
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [rateDelta, setRateDelta] = useState<number>(0.25); // +0.25% RBI Repo hike
  const [extraPrepaymentMonthly, setExtraPrepaymentMonthly] = useState<number>(2500); // ₹2,500 extra/month

  // Indian Mutual Fund SIP & 12.5% LTCG Tax Compounding States
  const [monthlySip, setMonthlySip] = useState<number>(10000); // ₹10,000/month
  const [sipReturnRate, setSipReturnRate] = useState<number>(13.0); // 13% Nifty CAGR
  const [sipYears, setSipYears] = useState<number>(15);
  const [annualStepUpPercent, setAnnualStepUpPercent] = useState<number>(10); // 10% annual step-up

  // Indian Inflation vs FD vs PPF vs Equity Comparison States
  const [cashAmountLakhs, setCashAmountLakhs] = useState<number>(10); // ₹10 Lakhs
  const [inflationRate, setInflationRate] = useState<number>(6.0); // 6% Indian CPI
  const [yearsAhead, setYearsAhead] = useState<number>(10);

  // Helper EMI formula
  const principal = loanAmountLakhs * 100000;
  const calculateEmi = (p: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    if (monthlyRate === 0) return p / totalMonths;
    const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(emi);
  };

  const currentEmi = calculateEmi(principal, baseRate, tenureYears);
  const newEmi = calculateEmi(principal, baseRate + rateDelta, tenureYears);
  const emiDiff = newEmi - currentEmi;
  const totalInterestOriginal = (currentEmi * tenureYears * 12) - principal;
  const totalInterestNew = (newEmi * tenureYears * 12) - principal;
  const totalInterestDiff = totalInterestNew - totalInterestOriginal;

  // SIP calculation with Step-Up option
  let totalInvestedSip = 0;
  let totalCorpusSip = 0;
  let currentMonthlyInvestment = monthlySip;

  for (let year = 1; year <= sipYears; year++) {
    for (let month = 1; month <= 12; month++) {
      totalInvestedSip += currentMonthlyInvestment;
      const monthsRemaining = (sipYears * 12) - ((year - 1) * 12 + month);
      const monthlyRate = sipReturnRate / 12 / 100;
      totalCorpusSip += currentMonthlyInvestment * Math.pow(1 + monthlyRate, monthsRemaining + 1);
    }
    if (annualStepUpPercent > 0) {
      currentMonthlyInvestment = Math.round(currentMonthlyInvestment * (1 + annualStepUpPercent / 100));
    }
  }
  totalCorpusSip = Math.round(totalCorpusSip);
  const totalGainsSip = Math.max(0, totalCorpusSip - totalInvestedSip);

  // Post-budget Indian LTCG calculation (First ₹1.25 Lakh exempt, 12.5% tax above that)
  const taxableGains = Math.max(0, totalGainsSip - 125000);
  const ltcgTaxAmount = Math.round(taxableGains * 0.125);
  const netTakeHomeWealth = totalCorpusSip - ltcgTaxAmount;

  // Inflation calculations in ₹
  const principalCash = cashAmountLakhs * 100000;
  const futurePurchasingPower = Math.round(principalCash / Math.pow(1 + inflationRate / 100, yearsAhead));
  const fdValue7pct = Math.round(principalCash * Math.pow(1 + 0.07, yearsAhead));
  const ppfValue71pct = Math.round(principalCash * Math.pow(1 + 0.071, yearsAhead));
  const equityValue13pct = Math.round(principalCash * Math.pow(1 + 0.13, yearsAhead));

  const formatLakhCrore = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="paper-card rounded-lg p-6 sm:p-8 bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-paper)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            Indian Financial Decision Lab (₹)
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Everyday Indian Wealth Simulators
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Translate RBI repo rates, mutual fund SIP compounding (with 12.5% LTCG tax), and Indian inflation into exact Rupee outcomes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[var(--bg-paper)] p-1 rounded-lg border border-[var(--border-color)] text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTool('emi')}
            className={`px-3 py-1.5 rounded-md transition-all ${activeTool === 'emi' ? 'bg-emerald-700 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            🏠 Home Loan / RBI Rate Hike
          </button>
          <button
            onClick={() => setActiveTool('sip')}
            className={`px-3 py-1.5 rounded-md transition-all ${activeTool === 'sip' ? 'bg-emerald-700 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            🌱 Mutual Fund SIP & LTCG
          </button>
          <button
            onClick={() => setActiveTool('inflation')}
            className={`px-3 py-1.5 rounded-md transition-all ${activeTool === 'inflation' ? 'bg-emerald-700 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            🔥 Inflation vs FD vs PPF vs Nifty
          </button>
        </div>
      </div>

      {/* 1. INDIAN HOME LOAN & RBI REPO RATE SIMULATOR */}
      {activeTool === 'emi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Home Loan Amount (₹ Lakhs)
              </label>
              <input
                type="number"
                value={loanAmountLakhs}
                onChange={e => setLoanAmountLakhs(Math.max(5, Number(e.target.value)))}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 rounded text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                = ₹{(loanAmountLakhs * 100000).toLocaleString('en-IN')} (e.g. SBI/HDFC home loan)
              </span>
            </div>

            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Current Interest Rate ({baseRate}% p.a.)
              </label>
              <input
                type="range"
                min="7.5"
                max="12.0"
                step="0.05"
                value={baseRate}
                onChange={e => setBaseRate(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono mt-1">
                <span>7.5%</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{baseRate}% EBLR</span>
                <span>12.0%</span>
              </div>
            </div>

            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Loan Tenure ({tenureYears} Years)
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={tenureYears}
                onChange={e => setTenureYears(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono mt-1">
                <span>5 yrs</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{tenureYears} Years ({tenureYears * 12} EMIs)</span>
                <span>30 yrs</span>
              </div>
            </div>

          </div>

          {/* RBI Rate Shift Scenario Buttons */}
          <div className="bg-emerald-50/70 dark:bg-slate-800/80 p-4 rounded-lg border border-emerald-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
              Select RBI Monetary Policy Rate Scenario:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '-0.50% RBI Rate Cut', val: -0.5 },
                { label: '-0.25% RBI Rate Cut', val: -0.25 },
                { label: '0.00% RBI Repo Pause', val: 0 },
                { label: '+0.25% RBI Repo Hike', val: 0.25 },
                { label: '+0.50% RBI Repo Hike', val: 0.5 },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={() => setRateDelta(btn.val)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${rateDelta === btn.val ? 'bg-emerald-800 text-white font-bold shadow' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-100'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Box in ₹ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="paper-card p-4 rounded border-emerald-300 dark:border-emerald-800">
              <div className="text-[11px] uppercase font-bold text-[var(--text-secondary)]">Current Monthly EMI</div>
              <div className="text-2xl font-black font-mono text-[var(--text-primary)] mt-1">
                ₹{currentEmi.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">At {baseRate}% on ₹{loanAmountLakhs} Lakh</div>
            </div>

            <div className="paper-card p-4 rounded border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-slate-800">
              <div className="text-[11px] uppercase font-bold text-[var(--text-secondary)]">New Monthly EMI</div>
              <div className="text-2xl font-black font-mono text-[var(--text-primary)] mt-1">
                ₹{newEmi.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                At {(baseRate + rateDelta).toFixed(2)}% ({rateDelta >= 0 ? '+' : ''}₹{Math.abs(emiDiff).toLocaleString('en-IN')}/mo)
              </div>
            </div>

            <div className="paper-card p-4 rounded border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-slate-800">
              <div className="text-[11px] uppercase font-bold text-[var(--text-secondary)]">Lifetime Interest Impact</div>
              <div className={`text-2xl font-black font-mono mt-1 ${totalInterestDiff >= 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {totalInterestDiff >= 0 ? '+' : '-'}₹{Math.abs(totalInterestDiff).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {totalInterestDiff >= 0 ? 'Extra interest over loan tenure' : 'Total money saved on rate cut'}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-[var(--border-color)] text-xs text-[var(--text-secondary)] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Smart Indian Home Buyer Hack:</strong> Paying just <strong>1 extra EMI every calendar year</strong> or increasing your monthly EMI by 5% every time your salary increases will shave <strong>4.5 to 6 years</strong> off your 20-year home loan and save you ₹12 to ₹18 Lakhs in interest!
            </span>
          </div>
        </div>
      )}

      {/* 2. INDIAN MUTUAL FUND SIP & 12.5% LTCG TAX COMPRESSION CALCULATOR */}
      {activeTool === 'sip' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Monthly SIP (₹)
              </label>
              <input
                type="number"
                value={monthlySip}
                onChange={e => setMonthlySip(Math.max(500, Number(e.target.value)))}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 rounded text-sm font-bold text-[var(--text-primary)]"
              />
              <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">e.g. ₹5,000 or ₹25,000/mo</span>
            </div>

            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Expected Nifty CAGR ({sipReturnRate}%)
              </label>
              <input
                type="range"
                min="8"
                max="16"
                step="0.5"
                value={sipReturnRate}
                onChange={e => setSipReturnRate(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono mt-1">
                <span>8% (Conservative)</span>
                <span className="font-bold text-emerald-700">{sipReturnRate}% (Nifty 50)</span>
                <span>16%</span>
              </div>
            </div>

            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                SIP Tenure ({sipYears} Years)
              </label>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={sipYears}
                onChange={e => setSipYears(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono mt-1">
                <span>3 yrs</span>
                <span className="font-bold text-emerald-700">{sipYears} Years</span>
                <span>30 yrs</span>
              </div>
            </div>

            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Annual Step-Up ({annualStepUpPercent}%)
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="5"
                value={annualStepUpPercent}
                onChange={e => setAnnualStepUpPercent(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono mt-1">
                <span>0% (Flat)</span>
                <span className="font-bold text-emerald-700">+{annualStepUpPercent}% Yearly</span>
                <span>20%</span>
              </div>
            </div>

          </div>

          {/* SIP Results Card with LTCG Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="paper-card p-4 rounded">
              <div className="text-[11px] uppercase font-bold text-[var(--text-secondary)]">Your Out-Of-Pocket Investment</div>
              <div className="text-xl font-black font-mono text-[var(--text-primary)] mt-1">
                {formatLakhCrore(totalInvestedSip)}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">Total capital deposited</div>
            </div>

            <div className="paper-card p-4 rounded bg-emerald-50/60 dark:bg-slate-800 border-emerald-200 dark:border-emerald-800">
              <div className="text-[11px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Pure Compound Gains</div>
              <div className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                +{formatLakhCrore(totalGainsSip)}
              </div>
              <div className="text-[10px] text-emerald-800 dark:text-emerald-400 mt-0.5">Free money created by Nifty growth</div>
            </div>

            <div className="paper-card p-4 rounded bg-amber-50 dark:bg-slate-800 border-amber-200">
              <div className="text-[11px] uppercase font-bold text-amber-900 dark:text-amber-300">12.5% LTCG Tax</div>
              <div className="text-xl font-black font-mono text-amber-800 dark:text-amber-400 mt-1">
                {formatLakhCrore(ltcgTaxAmount)}
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">After ₹1.25L annual exemption</div>
            </div>

            <div className="paper-card p-4 rounded bg-slate-900 text-white dark:bg-emerald-950">
              <div className="text-[11px] uppercase font-bold text-amber-400">Net Take-Home Wealth</div>
              <div className="text-2xl font-black font-mono text-amber-300 mt-1">
                {formatLakhCrore(netTakeHomeWealth)}
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">100% clean post-tax retirement corpus</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. INFLATION VS FD VS PPF VS NIFTY 50 */}
      {activeTool === 'inflation' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Cash Savings (₹ Lakhs)
              </label>
              <input
                type="number"
                value={cashAmountLakhs}
                onChange={e => setCashAmountLakhs(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 rounded text-sm font-bold text-[var(--text-primary)]"
              />
              <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                = ₹{(cashAmountLakhs * 100000).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Indian CPI Inflation Rate ({inflationRate}%)
              </label>
              <input
                type="range"
                min="4"
                max="9"
                step="0.5"
                value={inflationRate}
                onChange={e => setInflationRate(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono mt-1">
                <span>4% (RBI Target)</span>
                <span className="font-bold text-amber-700">{inflationRate}%</span>
                <span>9% (High)</span>
              </div>
            </div>

            <div className="bg-[var(--bg-paper)] p-4 rounded-lg border border-[var(--border-color)]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Time Horizon ({yearsAhead} Years)
              </label>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={yearsAhead}
                onChange={e => setYearsAhead(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono mt-1">
                <span>3 yrs</span>
                <span className="font-bold text-amber-700">{yearsAhead} Years</span>
                <span>25 yrs</span>
              </div>
            </div>

          </div>

          {/* Asset Class Comparison Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            <div className="bg-rose-50 dark:bg-rose-950/40 p-4 rounded-lg border border-rose-200 dark:border-rose-900">
              <div className="text-[11px] uppercase font-black text-rose-800 dark:text-rose-300">
                🔥 Idle Cash at 0%
              </div>
              <div className="text-xl font-black font-mono text-rose-700 dark:text-rose-400 mt-1">
                {formatLakhCrore(futurePurchasingPower)}
              </div>
              <p className="text-[10px] text-rose-900/80 dark:text-rose-300 mt-1">
                Loses <strong>{Math.round(((principalCash - futurePurchasingPower) / principalCash) * 100)}%</strong> real buying power to Indian inflation.
              </p>
            </div>

            <div className="paper-card p-4 rounded border-blue-200">
              <div className="text-[11px] uppercase font-bold text-blue-800 dark:text-blue-300">
                🏦 Bank FD at 7.0% p.a.
              </div>
              <div className="text-xl font-black font-mono text-blue-700 dark:text-blue-400 mt-1">
                {formatLakhCrore(fdValue7pct)}
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                Breaks even with inflation after paying tax on interest as per slab.
              </p>
            </div>

            <div className="paper-card p-4 rounded border-emerald-200 bg-emerald-50/40 dark:bg-slate-800">
              <div className="text-[11px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
                🛡️ PPF (100% Tax-Free) at 7.1%
              </div>
              <div className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                {formatLakhCrore(ppfValue71pct)}
              </div>
              <p className="text-[10px] text-emerald-800 dark:text-emerald-400 mt-1">
                Zero tax on interest. Guaranteed sovereign safety.
              </p>
            </div>

            <div className="paper-card p-4 rounded border-emerald-500 bg-emerald-100/60 dark:bg-emerald-950">
              <div className="text-[11px] uppercase font-black text-emerald-950 dark:text-emerald-200">
                📈 Nifty 50 SIP at 13.0%
              </div>
              <div className="text-2xl font-black font-mono text-emerald-800 dark:text-emerald-300 mt-1">
                {formatLakhCrore(equityValue13pct)}
              </div>
              <p className="text-[10px] text-emerald-950 dark:text-emerald-200 mt-1 font-semibold">
                Beats inflation by 7% annually. Multiplies real purchasing power.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
