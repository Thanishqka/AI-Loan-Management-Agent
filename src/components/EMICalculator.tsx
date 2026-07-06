import { useState, useEffect } from 'react';
import { Calculator, Landmark, RefreshCw, DollarSign, Calendar, Percent, Sparkles, AlertTriangle, CheckCircle, HelpCircle, Shield } from 'lucide-react';
import { User, LoanApplication } from '../types';

interface EMICalculatorProps {
  user?: User | null;
  loans?: LoanApplication[];
}

export default function EMICalculator({ user, loans }: EMICalculatorProps) {
  // 1. Core Loan Parameters
  const [amount, setAmount] = useState<number>(50000);
  const [interest, setInterest] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(36); // in months

  // 2. Personal Financial Profile
  const [salary, setSalary] = useState<number>(5000);
  const [expenses, setExpenses] = useState<number>(2000);
  const [existingEmi, setExistingEmi] = useState<number>(0);
  const [isPersonalized, setIsPersonalized] = useState<boolean>(false);
  const [autoLoaded, setAutoLoaded] = useState<boolean>(false);

  // Load user data from latest loan application if available
  useEffect(() => {
    if (user && loans && loans.length > 0) {
      const userLoans = loans.filter(l => l.userId === user.id);
      if (userLoans.length > 0) {
        // Sort by applied date descending or just get the latest
        const latest = userLoans[userLoans.length - 1];
        setSalary(latest.salary);
        setExpenses(latest.monthlyExpenses);
        setExistingEmi(latest.existingEmi);
        setIsPersonalized(true);
        setAutoLoaded(true);
      }
    }
  }, [user, loans]);

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEMI = (pAmount: number, pInterest: number, pTenure: number) => {
    const P = pAmount;
    const r = (pInterest / 100) / 12;
    const n = pTenure;

    if (r === 0) return P / n;

    const emiVal = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emiVal;
  };

  const emi = calculateEMI(amount, interest, tenure);
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - amount;

  const principalPercent = totalPayment > 0 ? (amount / totalPayment) * 100 : 100;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  // Affordability metrics:
  // FOIR (Fixed Obligation to Income Ratio) Limit: Standard bank threshold is 45% of net monthly salary
  const foirLimit = salary * 0.45;
  // Maximum affordable monthly EMI amount taking existing EMI into account
  const maxAffordableEMI = Math.max(100, foirLimit - existingEmi);
  // Disposable Income based limit (Salary - Living Expenses - Existing EMI) * 50%
  const disposableLimit = Math.max(100, (salary - expenses - existingEmi) * 0.50);
  // Recommended affordable EMI is the conservative minimum of FOIR & Disposable limits
  const recommendedAffordableEmi = Math.round(Math.min(maxAffordableEMI, disposableLimit));

  // Affordability Rating
  let rating: 'SAFE' | 'MODERATE' | 'RISKY' = 'SAFE';
  let affordabilityScore = 100;

  if (emi > recommendedAffordableEmi) {
    rating = 'RISKY';
    const ratio = emi / recommendedAffordableEmi;
    affordabilityScore = Math.max(15, Math.round(100 - (ratio - 1) * 120));
  } else if (emi > recommendedAffordableEmi * 0.75) {
    rating = 'MODERATE';
    const ratio = (emi - recommendedAffordableEmi * 0.75) / (recommendedAffordableEmi * 0.25);
    affordabilityScore = Math.round(100 - ratio * 30); // 70-100 range
  } else {
    rating = 'SAFE';
    affordabilityScore = 100;
  }

  // Handle parameter resets
  const handleReset = () => {
    setAmount(50000);
    setInterest(8.5);
    setTenure(36);

    if (user && loans && loans.length > 0) {
      const userLoans = loans.filter(l => l.userId === user.id);
      if (userLoans.length > 0) {
        const latest = userLoans[userLoans.length - 1];
        setSalary(latest.salary);
        setExpenses(latest.monthlyExpenses);
        setExistingEmi(latest.existingEmi);
        setIsPersonalized(true);
        setAutoLoaded(true);
        return;
      }
    }

    setSalary(5000);
    setExpenses(2000);
    setExistingEmi(0);
    setIsPersonalized(false);
    setAutoLoaded(false);
  };

  // Automatically adjust tenure and loan amount to find an affordable combination
  const handleOptimize = () => {
    if (emi <= recommendedAffordableEmi) {
      return; // Already affordable
    }

    let optimalTenure = tenure;
    let optimalAmount = amount;
    let found = false;

    // Try extending the tenure to reduce monthly EMI (max 180 months)
    for (let t = tenure; t <= 180; t += 6) {
      const testEmi = calculateEMI(amount, interest, t);
      if (testEmi <= recommendedAffordableEmi) {
        optimalTenure = t;
        found = true;
        break;
      }
    }

    // If extending tenure is not enough, we reduce the loan principal
    if (!found) {
      optimalTenure = 180; // set tenure to max to allow largest possible principal
      const r = (interest / 100) / 12;
      const n = 180;
      if (r > 0) {
        const factor = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const maxP = recommendedAffordableEmi / factor;
        optimalAmount = Math.max(5000, Math.floor(maxP / 5000) * 5000);
      } else {
        optimalAmount = Math.max(5000, Math.floor((recommendedAffordableEmi * n) / 5000) * 5000);
      }
    }

    setTenure(optimalTenure);
    setAmount(optimalAmount);
    setIsPersonalized(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-100 tracking-tight flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8 text-[#38BDF8]" />
          AI- Loan Management Agent Smart EMI Advisor
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl mx-auto text-xs sm:text-sm">
          Simulate monthly loan installments, receive personalized budget recommendations, and analyze debt stress profiles live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Inputs & Parameters (7 Columns) */}
        <div className="lg:col-span-7 space-y-6 bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10">
          
          <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-200">1. Loan Configuration</h2>
            <button
              onClick={handleReset}
              className="text-[10px] flex items-center gap-1 bg-slate-800 hover:bg-slate-700 hover:text-white px-2 py-1 rounded-md text-slate-400 transition"
              title="Reset all fields to defaults"
            >
              <RefreshCw className="h-3 w-3" />
              Reset All
            </button>
          </div>

          {/* Amount Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-slate-400" />
                Loan Amount
              </label>
              <span className="text-lg font-black text-[#38BDF8]">${amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#38BDF8] focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>$5,000</span>
              <span>$250,000</span>
              <span>$500,000</span>
            </div>
          </div>

          {/* Interest rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-slate-400" />
                Interest Rate (p.a.)
              </label>
              <span className="text-lg font-black text-[#38BDF8]">{interest}%</span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="0.1"
              value={interest}
              onChange={(e) => setInterest(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#38BDF8] focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>3%</span>
              <span>11.5%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                Tenure Duration
              </label>
              <span className="text-lg font-black text-[#38BDF8]">
                {tenure} Months <span className="text-xs text-slate-400 font-normal">({(tenure/12).toFixed(1)} yrs)</span>
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="180"
              step="6"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#38BDF8] focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>6 mos</span>
              <span>90 mos</span>
              <span>180 mos</span>
            </div>
          </div>

          {/* Part 2: Personalize with Financial Details */}
          <div className="pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                2. Personal Financial Profile
              </h3>
              {autoLoaded && (
                <span className="text-[9px] font-mono tracking-wide text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ✓ Profile Loaded
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs leading-normal mb-4">
              Enter your income and expenses to check budget affordability. We will calculate a recommended EMI safety envelope tailored for you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Monthly Salary Input */}
              <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Monthly Salary
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                    <span className="text-slate-500 text-xs">$</span>
                  </div>
                  <input
                    type="number"
                    value={salary || ''}
                    onChange={(e) => {
                      setSalary(Math.max(0, Number(e.target.value)));
                      setIsPersonalized(true);
                    }}
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-6 pr-2 py-1.5 text-xs text-slate-200 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] focus:outline-none font-semibold"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              {/* Living Expenses Input */}
              <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Living Expenses
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                    <span className="text-slate-500 text-xs">$</span>
                  </div>
                  <input
                    type="number"
                    value={expenses || ''}
                    onChange={(e) => {
                      setExpenses(Math.max(0, Number(e.target.value)));
                      setIsPersonalized(true);
                    }}
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-6 pr-2 py-1.5 text-xs text-slate-200 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] focus:outline-none font-semibold"
                    placeholder="e.g. 2000"
                  />
                </div>
              </div>

              {/* Existing EMIs Input */}
              <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Existing EMIs
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                    <span className="text-slate-500 text-xs">$</span>
                  </div>
                  <input
                    type="number"
                    value={existingEmi || ''}
                    onChange={(e) => {
                      setExistingEmi(Math.max(0, Number(e.target.value)));
                      setIsPersonalized(true);
                    }}
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-6 pr-2 py-1.5 text-xs text-slate-200 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] focus:outline-none font-semibold"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Section: Output Results & Budget Safety Advisory (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Calculation Output Box */}
          <div className="bg-[#020617] p-6 rounded-3xl border border-white/10 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#38BDF8]">3. Calculation Summary</h3>
              
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">MONTHLY ESTIMATED EMI</span>
                <span className="text-4xl font-black text-slate-100">${Math.round(emi).toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PRINCIPAL AMOUNT</span>
                  <span className="text-lg font-bold text-slate-200">${amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">TOTAL INTEREST</span>
                  <span className="text-lg font-bold text-slate-200">${Math.round(totalInterest).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">TOTAL PAYABLE LIABILITY</span>
                <span className="text-xl font-extrabold text-[#38BDF8]">${Math.round(totalPayment).toLocaleString()}</span>
              </div>
            </div>

            {/* Graphical representation of Principal vs Interest breakdown */}
            <div className="mt-6">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1.5 font-mono">
                <span>Principal: {principalPercent.toFixed(1)}%</span>
                <span>Interest: {interestPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="bg-[#38BDF8] h-full transition-all duration-300" 
                  style={{ width: `${principalPercent}%` }} 
                  title="Principal Component"
                />
                <div 
                  className="bg-amber-400 h-full transition-all duration-300" 
                  style={{ width: `${interestPercent}%` }} 
                  title="Interest Component"
                />
              </div>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400 justify-center font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] inline-block"></span>
                  <span>Principal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                  <span>Interest</span>
                </div>
              </div>
            </div>
          </div>

          {/* Affordability Advisory Card */}
          <div className="bg-[#020617] p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#38BDF8] flex items-center justify-between">
              <span>Budget Safety Advisory</span>
              <span className="text-[10px] font-mono font-medium text-slate-400 tracking-normal">
                Score: {affordabilityScore}%
              </span>
            </h3>

            {/* Status gauge / meter */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                <span>Household Affordability Index</span>
                {rating === 'SAFE' && <span className="text-emerald-400 font-black">✓ SAFE & COMFORTABLE</span>}
                {rating === 'MODERATE' && <span className="text-amber-400 font-black">⚠ MODERATE BURDEN</span>}
                {rating === 'RISKY' && <span className="text-red-400 font-black">⚡ HIGH BUDGET STRAIN</span>}
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-500 ${
                    rating === 'SAFE' ? 'bg-emerald-500' :
                    rating === 'MODERATE' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${affordabilityScore}%` }}
                />
              </div>
            </div>

            {/* Safety metrics breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
              <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40">
                <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Recommended Max EMI</span>
                <span className="text-sm font-extrabold text-slate-200">${recommendedAffordableEmi.toLocaleString()}/mo</span>
              </div>
              <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40">
                <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Current Estimated EMI</span>
                <span className={`text-sm font-extrabold ${
                  rating === 'SAFE' ? 'text-emerald-400' :
                  rating === 'MODERATE' ? 'text-amber-400' : 'text-red-400'
                }`}>${Math.round(emi).toLocaleString()}/mo</span>
              </div>
            </div>

            {/* Dynamic Advice description */}
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
              {rating === 'SAFE' ? (
                <p>
                  <strong>Excellent!</strong> This monthly installment of <span className="text-emerald-400 font-semibold">${Math.round(emi)}</span> is well below your personalized budget threshold of <strong>${recommendedAffordableEmi}</strong>. You have high disposable income margin left over to easily absorb this loan obligation.
                </p>
              ) : rating === 'MODERATE' ? (
                <p>
                  <strong>Manageable with caution.</strong> This EMI of <span className="text-amber-400 font-semibold">${Math.round(emi)}</span> represents a moderately tight debt obligation relative to your income and household expenses. Keep a close eye on discretionary spending to maintain solid payment buffer space.
                </p>
              ) : (
                <p>
                  <strong>High Debt Burden!</strong> An installment of <span className="text-red-400 font-semibold">${Math.round(emi)}</span> exceeds your recommended safety threshold of <strong>${recommendedAffordableEmi}</strong>. Taking this loan as-is places extreme stress on your disposable household income.
                </p>
              )}
            </div>

            {/* Smart Optimization Button */}
            {rating !== 'SAFE' && (
              <button
                onClick={handleOptimize}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-[#38BDF8]/30 hover:border-[#38BDF8] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-xl cursor-pointer shadow-md"
              >
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                Optimize Loan Parameters
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Advisory Footer info */}
      <div className="mt-8 p-4 rounded-2xl bg-[#020617] border border-[#38BDF8]/15 flex items-start gap-3">
        <Landmark className="h-5 w-5 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <strong>Advisor Methodology:</strong> AI- Loan Management Agent EMI Calculator utilizes standard mathematical reducing-balance installment calculations. Live bank interest offers fluctuate dynamically depending on your employment duration, credit stability, and overall digital scoring compiled by our AI officer. We recommend keeping total EMI obligations under 45% of your net monthly salary.
        </div>
      </div>
    </div>
  );
}
