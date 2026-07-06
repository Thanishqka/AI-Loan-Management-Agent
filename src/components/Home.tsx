import { Landmark, ArrowRight, Bot, ShieldCheck, Cpu, ChevronRight, Calculator } from 'lucide-react';
import { User } from '../types';

interface HomeProps {
  user: User | null;
  onNavigateToTab: (tab: string) => void;
}

export default function Home({ user, onNavigateToTab }: HomeProps) {
  return (
    <div className="bg-[#0F172A] text-[#F8FAFC] min-h-[85vh] font-sans">
      {/* Hero Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-full px-3 py-1 text-xs font-bold text-[#38BDF8]">
              <Cpu className="h-3.5 w-3.5 animate-pulse" />
              <span>Version 2.5 Active - Google Gemini Powered</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F8FAFC] tracking-tight leading-tight">
              AI-Powered Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-indigo-400">
                Loan Officer Platform
              </span>
            </h1>

            <p className="text-[#94A3B8] text-base sm:text-lg max-w-xl leading-relaxed">
              Experience the next generation of credit underwriting. Apply in seconds and let our advanced AI risk engine analyze salary patterns, debt-ratios, and employment indicators to simulate immediate decisions.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {user ? (
                <button
                  onClick={() => onNavigateToTab(user.role === 'ADMIN' ? 'admin_dashboard' : 'dashboard')}
                  className="px-6 py-3 bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  Enter User Dashboard
                  <ArrowRight className="h-4 w-4 text-slate-950" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigateToTab('login')}
                    className="px-6 py-3 bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    Get Started Now
                    <ChevronRight className="h-4 w-4 text-slate-950" />
                  </button>
                  <button
                    onClick={() => onNavigateToTab('emi_calculator')}
                    className="px-6 py-3 bg-[#1E293B] hover:bg-slate-800 border border-white/10 text-slate-200 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Calculator className="h-4 w-4 text-[#38BDF8]" />
                    Calculate EMI
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Interactive Feature Panel Card */}
          <div className="lg:col-span-5 bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-[#F8FAFC] border-b border-white/10 pb-3 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-[#38BDF8]" />
              Digital Underwriting Suite
            </h3>

            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="p-2.5 bg-[#38BDF8]/10 text-[#38BDF8] rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">One-Call Gemini Engine</h4>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Triggers a holistic loan report measuring eligibility scores, approval probabilities, fraud risk levels, and custom financial tips instantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-[#38BDF8]/10 text-[#38BDF8] rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">24/7 Virtual Chat Advisor</h4>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Interactive chat assistant present in bottom rails to resolve interest and EMI planning inquiries in multiple local languages.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-[#38BDF8]/10 text-[#38BDF8] rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Fraud Prevention Matrix</h4>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Undergoes complex scans mapping multiple application risks to secure banks against fraudulent requests, and alerts administrators.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#020617] rounded-xl p-4 text-xs text-[#94A3B8] leading-relaxed border border-white/10">
              <strong>Admin Credentials:</strong> login with <code className="font-mono bg-slate-800 border border-white/10 px-1 py-0.5 rounded text-[#38BDF8]">admin@loanagent.com</code> and password <code className="font-mono bg-slate-800 border border-white/10 px-1 py-0.5 rounded text-[#38BDF8]">admin123</code> to test back-office underwriting.
            </div>
          </div>

        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-[#020617]/40 py-12 border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-6">INTEGRATED BANK PARTNERS & ASSOCIATES</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 text-slate-500 text-lg font-bold font-mono">
            <span className="hover:text-[#38BDF8]/80 transition cursor-default">APEX CAPITAL</span>
            <span className="hover:text-[#38BDF8]/80 transition cursor-default">METRO PREMIER</span>
            <span className="hover:text-[#38BDF8]/80 transition cursor-default">STANDARD TRUST</span>
            <span className="hover:text-[#38BDF8]/80 transition cursor-default">AURACREDIT VENTURES</span>
          </div>
        </div>
      </div>
    </div>
  );
}
