import { useState } from 'react';
import { User, LoanApplication } from '../types';
import { ShieldCheck, Clock, FileWarning, Search, Filter, AlertOctagon, Check, X, FileText, BadgeCheck, FileStack, ShieldAlert } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  loans: LoanApplication[];
  token: string;
  onRefreshLoans: () => void;
  onViewReport: (loanId: string) => void;
}

export default function AdminDashboard({ user, loans, token, onRefreshLoans, onViewReport }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showHighRiskOnly, setShowHighRiskOnly] = useState<boolean>(false);
  
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Stats Counters
  const totalCount = loans.length;
  const approvedCount = loans.filter(l => l.status === 'APPROVED').length;
  const pendingCount = loans.filter(l => l.status === 'PENDING').length;
  const rejectedCount = loans.filter(l => l.status === 'REJECTED').length;

  // Handle Approve / Reject
  const handleStatusUpdate = async (loanId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    setActionLoading(loanId);
    setAlertMsg(null);

    try {
      const res = await fetch(`/api/loans/${loanId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setAlertMsg({
          type: 'success',
          text: `Application ${loanId} successfully updated to ${status}.`
        });
        onRefreshLoans();
      } else {
        const data = await res.json();
        setAlertMsg({
          type: 'error',
          text: data.error || 'Failed to update application status.'
        });
      }
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: 'Error connecting to the backend server.'
      });
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter and Search logic
  const filteredLoans = loans.filter(loan => {
    // 1. Search name
    const matchesSearch = loan.userName
      ? loan.userName.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    // 2. Filter loan type
    const matchesType = selectedType === 'All' || loan.loanType === selectedType;

    // 3. Filter high-risk only
    // Note: fraudRisk and riskLevel are enriched on the loan objects
    const enrichedLoan = loan as any;
    const isHighRisk = enrichedLoan.fraudRisk === 'High' || enrichedLoan.riskLevel === 'High';
    const matchesRisk = !showHighRiskOnly || isHighRisk;

    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans text-[#F8FAFC]">
      
      {/* Banner Board */}
      <div className="bg-gradient-to-r from-[#020617] to-[#1E293B] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-[#38BDF8] animate-pulse" />
            Underwriting Management Console
          </h2>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">
            Review applicant criteria, verify risk triggers, and execute loan approval actions.
          </p>
        </div>
        <div className="bg-[#020617] border border-white/10 rounded-xl px-4 py-2 text-xs text-right">
          <span className="text-slate-400 block font-bold">LOGGED IN ADMIN</span>
          <span className="font-semibold text-[#38BDF8]">{user.name}</span>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-[#1E293B] p-5 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Applications</span>
            <span className="text-3xl font-black text-slate-100 mt-1 block">{totalCount}</span>
          </div>
          <div className="p-3 bg-[#38BDF8]/10 text-[#38BDF8] rounded-xl">
            <FileStack className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Approved</span>
            <span className="text-3xl font-black text-emerald-400 mt-1 block">{approvedCount}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <BadgeCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Pending</span>
            <span className="text-3xl font-black text-amber-400 mt-1 block">{pendingCount}</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Rejected</span>
            <span className="text-3xl font-black text-red-400 mt-1 block">{rejectedCount}</span>
          </div>
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
            <FileWarning className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Alert Actions feedback */}
      {alertMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold leading-relaxed border-l-4 ${
          alertMsg.type === 'success' 
            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500' 
            : 'bg-red-950/40 text-red-300 border-red-500'
        }`}>
          {alertMsg.text}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="bg-[#1E293B] p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicant name..."
            className="block w-full pl-10 pr-4 py-2 bg-[#020617] border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#38BDF8] focus:bg-[#020617] text-[#F8FAFC] placeholder-slate-500 transition"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
          
          {/* Type filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-[#38BDF8]" />
              Purpose
            </span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 bg-[#020617] border border-white/10 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#38BDF8] text-[#F8FAFC] cursor-pointer"
            >
              <option value="All">All Purposes</option>
              <option value="Personal">Personal</option>
              <option value="Home">Home</option>
              <option value="Car">Car</option>
              <option value="Education">Education</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* High Risk View Toggle (Constraint-based filter) */}
          <button
            onClick={() => setShowHighRiskOnly(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              showHighRiskOnly 
                ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' 
                : 'bg-[#020617] border-white/10 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlertOctagon className={`h-4 w-4 ${showHighRiskOnly ? 'text-red-400 animate-bounce' : 'text-slate-400'}`} />
            High Risk Portfolio Filter
          </button>

        </div>

      </div>

      {/* Main Table */}
      <div className="bg-[#1E293B] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#020617] text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest border-b border-white/10">
                <th className="py-4 px-6">Applicant Name</th>
                <th className="py-4 px-4">Loan Details</th>
                <th className="py-4 px-4">Capital amount</th>
                <th className="py-4 px-4">Applied Date</th>
                <th className="py-4 px-4 text-center">Underwriter Status</th>
                <th className="py-4 px-4 text-center">Fraud scan</th>
                <th className="py-4 px-6 text-right">Verification actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium bg-[#1E293B]">
                    No credit application folders match active filters.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan: any) => (
                  <tr key={loan.id} className="hover:bg-slate-800/40 transition">
                    
                    {/* Applicant details */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-200 text-sm">{loan.userName || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">UID: {loan.userId}</div>
                    </td>

                    {/* Loan Details */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-200">{loan.loanType}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{loan.id}</div>
                    </td>

                    {/* Capital Amount */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#38BDF8]">${loan.loanAmount.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">{loan.tenure} Months Tenure</div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-4 text-slate-300 font-medium">
                      {new Date(loan.appliedDate).toLocaleDateString()}
                    </td>

                    {/* Underwriter Status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full tracking-wider ${
                        loan.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                        loan.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {loan.status}
                      </span>
                    </td>

                    {/* Fraud Risk scan */}
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full tracking-wider border ${
                        loan.fraudRisk === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        loan.fraudRisk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {loan.fraudRisk} Fraud Risk
                      </span>
                    </td>

                    {/* Verification Actions (Approve/Reject + AI report review) */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        
                        {/* Full AI Report view */}
                        <button
                          onClick={() => onViewReport(loan.id)}
                          className="p-1.5 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] rounded-lg border border-[#38BDF8]/20 transition cursor-pointer"
                          title="View Full AI Report Card"
                        >
                          <FileText className="h-4 w-4 text-[#38BDF8]" />
                        </button>

                        {/* Execute Decisions if Pending */}
                        {loan.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(loan.id, 'APPROVED')}
                              disabled={actionLoading === loan.id}
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition cursor-pointer animate-pulse"
                              title="Approve Portfolio"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(loan.id, 'REJECTED')}
                              disabled={actionLoading === loan.id}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition cursor-pointer"
                              title="Reject Portfolio"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          // Allow reset to pending if status is determined, for easy evaluation
                          <button
                            onClick={() => handleStatusUpdate(loan.id, 'PENDING')}
                            disabled={actionLoading === loan.id}
                            className="px-2 py-1 text-[10px] bg-[#020617] hover:bg-slate-800 text-slate-300 rounded border border-white/10 transition font-bold cursor-pointer"
                          >
                            Reset
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
