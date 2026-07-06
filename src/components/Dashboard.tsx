import { User, LoanApplication } from '../types';
import { PlusCircle, MessageSquareCode, FileWarning, BadgeCheck, Clock, FileStack } from 'lucide-react';

interface DashboardProps {
  user: User;
  loans: LoanApplication[];
  onNavigateToTab: (tab: string) => void;
}

export default function Dashboard({ user, loans, onNavigateToTab }: DashboardProps) {
  // Stats
  const totalCount = loans.length;
  const approvedLoans = loans.filter(l => l.status === 'APPROVED');
  const pendingLoans = loans.filter(l => l.status === 'PENDING');
  const rejectedLoans = loans.filter(l => l.status === 'REJECTED');

  // Latest Application
  const latestLoan = loans.length > 0 
    ? [...loans].sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())[0]
    : null;

  const triggerChatOpen = () => {
    const btn = document.getElementById('chat-toggle-btn');
    if (btn) {
      btn.click();
    } else {
      alert("AI- Loan Management Agent Chat Advisor is already active or loading in the bottom-right corner!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans text-[#F8FAFC]">
      
      {/* Welcome Board */}
      <div className="bg-gradient-to-r from-[#020617] to-[#1E293B] text-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/10">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F8FAFC]">Good day, {user.name}</h2>
        <p className="text-slate-300 mt-1.5 text-sm sm:text-base">
          Welcome to your secure AI portal. Review active credit analysis and simulate underwriting rules instantly.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-[#1E293B] p-5 rounded-2xl border border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Submissions</span>
            <span className="text-3xl font-black text-slate-100 mt-1 block">{totalCount}</span>
          </div>
          <div className="p-3 bg-[#38BDF8]/10 text-[#38BDF8] rounded-xl">
            <FileStack className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Approved</span>
            <span className="text-3xl font-black text-emerald-400 mt-1 block">{approvedLoans.length}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <BadgeCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Analysis</span>
            <span className="text-3xl font-black text-amber-400 mt-1 block">{pendingLoans.length}</span>
          </div>
          <div className="p-3 bg-[#F59E0B]/10 text-amber-400 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Unsuccessful</span>
            <span className="text-3xl font-black text-red-400 mt-1 block">{rejectedLoans.length}</span>
          </div>
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
            <FileWarning className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Two-Column Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Latest Application Details */}
        <div className="lg:col-span-7 bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-slate-100">Latest Loan Assessment</h3>
            {latestLoan && (
              <span className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded-full uppercase ${
                latestLoan.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                latestLoan.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                'bg-amber-500/10 text-amber-400'
              }`}>
                {latestLoan.status}
              </span>
            )}
          </div>

          {latestLoan ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Loan ID</span>
                  <span className="text-sm font-mono text-slate-300 font-semibold">{latestLoan.id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Application Type</span>
                  <span className="text-sm text-slate-300 font-semibold">{latestLoan.loanType}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Requested Amount</span>
                  <span className="text-sm text-[#38BDF8] font-bold">${latestLoan.loanAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Monthly Tenure</span>
                  <span className="text-sm text-slate-300 font-semibold">{latestLoan.tenure} Months</span>
                </div>
              </div>

              <div className="bg-[#020617] p-4 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">SUBMISSION DATE</span>
                  <span className="text-xs text-slate-300 font-medium">
                    {new Date(latestLoan.appliedDate).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <button
                  onClick={() => onNavigateToTab('status')}
                  className="px-3 py-1.5 bg-[#38BDF8]/10 border border-[#38BDF8]/20 hover:bg-[#38BDF8]/20 text-[#38BDF8] text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  View Full Report
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <PlusCircle className="h-10 w-10 mx-auto text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-400">No Applications Filed Yet</p>
              <p className="text-[11px] mt-1 max-w-xs mx-auto text-slate-500">
                File your initial digital loan request to automatically trigger our AI scoring and risk-underwriting analysis.
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-5 bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 border-b border-white/10 pb-3 mb-4">Underwriter Shortcuts</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Interact directly with the loan officer application portals, or summon the virtual AI advisor to simulate EMI parameters or interest rate brackets.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onNavigateToTab('apply')}
              className="w-full py-3.5 px-4 bg-[#38BDF8] hover:bg-sky-400 text-slate-950 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-slate-950" />
              Apply For Digital Loan
            </button>

            <button
              onClick={triggerChatOpen}
              className="w-full py-3.5 px-4 bg-[#020617] hover:bg-slate-800 text-slate-100 rounded-xl text-sm font-bold border border-white/10 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquareCode className="h-4 w-4 text-[#38BDF8]" />
              Chat With AI Advisor
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
