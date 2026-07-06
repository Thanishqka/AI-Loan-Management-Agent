import React, { useState, useEffect } from 'react';
import { Cpu, DollarSign, Calendar, Landmark, Sparkles, CheckCircle2, ListFilter, AlertTriangle } from 'lucide-react';
import { User, LoanApplication, AIReport } from '../types';

interface ApplyLoanProps {
  user: User;
  token: string;
  onApplicationSuccess: (loan: LoanApplication, report: AIReport, updatedUser?: User) => void;
  onUnauthorized?: () => void;
}

export default function ApplyLoan({ user, token, onApplicationSuccess, onUnauthorized }: ApplyLoanProps) {
  const [applicantName, setApplicantName] = useState<string>(user.name);
  const [loanType, setLoanType] = useState<string>('Personal');
  const [loanAmount, setLoanAmount] = useState<string>('25000');
  const [salary, setSalary] = useState<string>('5000');
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('1500');
  const [employmentType, setEmploymentType] = useState<string>('Salaried');
  const [existingEmi, setExistingEmi] = useState<string>('0');
  const [tenure, setTenure] = useState<string>('36');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setApplicantName(user.name);
  }, [user.name]);

  const loadingMessages = [
    "Uploading application factors to AI- Loan Management Agent data servers...",
    "Activating deep underwriting matrix...",
    "Connecting to Gemini AI digital underwriting proxy...",
    "Scanning liability-to-income limits and existing EMIs...",
    "Running address validations and looking up historical ratios...",
    "Finalizing visual report cards and compiling tips..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 2000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!applicantName || !applicantName.trim()) {
      setError('Please provide a valid applicant legal name.');
      return;
    }

    const amountNum = parseFloat(loanAmount);
    const salaryNum = parseFloat(salary);
    const expensesNum = parseFloat(monthlyExpenses);
    const emiNum = parseFloat(existingEmi || '0');
    const tenureNum = parseInt(tenure, 10);

    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please provide a valid, positive loan amount.');
      return;
    }
    if (isNaN(salaryNum) || salaryNum <= 0) {
      setError('Please provide a valid, positive monthly salary.');
      return;
    }
    if (isNaN(expensesNum) || expensesNum < 0) {
      setError('Monthly expenses cannot be negative.');
      return;
    }
    if (isNaN(emiNum) || emiNum < 0) {
      setError('Existing EMI liability cannot be negative.');
      return;
    }
    if (isNaN(tenureNum) || tenureNum < 6 || tenureNum > 180) {
      setError('Loan tenure must be between 6 and 180 months.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          loanType,
          loanAmount: amountNum,
          salary: salaryNum,
          monthlyExpenses: expensesNum,
          employmentType,
          existingEmi: emiNum,
          tenure: tenureNum,
          userName: applicantName
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Wait a small moment to let the user see the final step
        setTimeout(() => {
          onApplicationSuccess(data.loan, data.report, data.user);
        }, 800);
      } else if (res.status === 401 && onUnauthorized) {
        onUnauthorized();
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to file loan application.');
        setLoading(false);
      }
    } catch (err) {
      setError('Cannot establish a secure server connection to submit request.');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans">
      
      {/* Immersive Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white p-6">
          <div className="relative flex items-center justify-center mb-8">
            {/* Pulsing ring */}
            <div className="absolute h-24 w-24 rounded-full border-4 border-[#38BDF8]/30 animate-ping" />
            <div className="h-20 w-20 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center shadow-2xl">
              <Cpu className="h-10 w-10 text-[#38BDF8] animate-spin" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight mb-2 text-[#F8FAFC]">Analyzing Credit Framework</h3>
          
          <div className="h-1 w-48 bg-slate-800 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#38BDF8] animate-pulse w-2/3 rounded-full" />
          </div>

          <p className="text-sm text-slate-400 max-w-sm text-center font-medium min-h-[40px] animate-pulse">
            {loadingMessages[loadingStep]}
          </p>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-[#1E293B] rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-[#F8FAFC]">
        
        {/* Banner header */}
        <div className="bg-[#020617] p-6 sm:p-8 text-white flex justify-between items-center border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#F8FAFC]">Apply for AI-Powered Loan</h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Undergo automated digital scoring. Analysis triggered instantly on submission.
            </p>
          </div>
          <div className="hidden sm:flex bg-[#38BDF8]/10 border border-[#38BDF8]/20 p-2 rounded-xl text-[#38BDF8] items-center gap-1 text-xs font-bold">
            <Sparkles className="h-4 w-4" />
            <span>AI Risk Analyzer Ready</span>
          </div>
        </div>

        {/* Validation Errors */}
        {error && (
          <div className="p-4 bg-red-950/40 border-b border-red-900 text-xs text-red-300 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Validation Issue:</strong> {error}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Applicant Name (Enabled & Editable) */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Applicant Legal Name
              </label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="block w-full px-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-medium"
                placeholder="Enter your legal name"
                required
              />
            </div>

            {/* Loan Type Selector */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Loan Type Purpose
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Landmark className="h-4 w-4" />
                </span>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-medium cursor-pointer"
                >
                  <option value="Personal">Personal Loan</option>
                  <option value="Home">Home Loan</option>
                  <option value="Car">Car Loan</option>
                  <option value="Education">Education Loan</option>
                  <option value="Business">Business Expansion Loan</option>
                </select>
              </div>
            </div>

            {/* Loan Amount */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Requested Loan Capital ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <DollarSign className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="25000"
                  className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-semibold"
                  min="1000"
                  max="1000000"
                  required
                />
              </div>
            </div>

            {/* Tenure months */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Tenure Duration (Months)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Calendar className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  placeholder="36"
                  className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-semibold"
                  min="6"
                  max="180"
                  required
                />
              </div>
            </div>

            {/* Monthly Salary */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Net Monthly Salary ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <DollarSign className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="5000"
                  className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-semibold"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Monthly Expenses */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Average Monthly Expenses ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <DollarSign className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  placeholder="1500"
                  className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-semibold"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Employment Status Type
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <ListFilter className="h-4 w-4" />
                </span>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-medium cursor-pointer"
                >
                  <option value="Salaried">Salaried Employee</option>
                  <option value="Self-Employed">Self-Employed Professional</option>
                  <option value="Business Owner">Incorporated Business Owner</option>
                  <option value="Unemployed">Currently Unemployed</option>
                </select>
              </div>
            </div>

            {/* Existing EMI */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Active Monthly EMIs ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <DollarSign className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  value={existingEmi}
                  onChange={(e) => setExistingEmi(e.target.value)}
                  placeholder="0"
                  className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-semibold"
                  min="0"
                />
              </div>
            </div>

          </div>

          <div className="border-t border-white/10 pt-6 flex justify-end gap-3">
            <button
              type="submit"
              className="py-3 px-6 bg-[#38BDF8] hover:bg-sky-400 text-slate-950 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-slate-950" />
              File Application & Analyze
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
