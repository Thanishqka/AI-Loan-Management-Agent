import { LoanApplication } from '../types';
import { Calendar, CreditCard, ChevronRight, FileText, Ban } from 'lucide-react';

interface LoanStatusProps {
  loans: LoanApplication[];
  onViewReport: (loanId: string) => void;
}

export default function LoanStatus({ loans, onViewReport }: LoanStatusProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 font-sans text-[#F8FAFC]">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC] tracking-tight">Your Loan Portfolios</h1>
          <p className="text-[#94A3B8] text-xs mt-0.5 font-sans">Track real-time decisions, active balances, and retrieve interactive AI reports.</p>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl p-12 text-center border border-white/10 shadow-2xl max-w-xl mx-auto">
          <CreditCard className="h-12 w-12 text-[#38BDF8]/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Active Portfolios</h3>
          <p className="text-xs text-slate-400 mt-1">You do not have any credit applications registered on the AI- Loan Management Agent. Submit your first request to undergo AI risk scanning.</p>
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#020617] text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest border-b border-white/10">
                  <th className="py-4 px-6">Portfolio Info</th>
                  <th className="py-4 px-4">Capital Amount</th>
                  <th className="py-4 px-4">Tenure Duration</th>
                  <th className="py-4 px-4">Applied Date</th>
                  <th className="py-4 px-4 text-center">Underwriter Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#38BDF8] inline-block animate-pulse"></span>
                        {loan.loanType} Loan
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{loan.id}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#38BDF8]">
                      ${loan.loanAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-medium">
                      {loan.tenure} Months <span className="text-xs text-slate-400">({(loan.tenure / 12).toFixed(1)} yrs)</span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#38BDF8]" />
                      <span>{new Date(loan.appliedDate).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider inline-block ${
                        loan.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                        loan.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onViewReport(loan.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#38BDF8]/10 text-[#38BDF8] hover:bg-[#38BDF8]/20 rounded-lg text-xs font-bold transition border border-[#38BDF8]/20 cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#38BDF8]" />
                        AI Report
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
