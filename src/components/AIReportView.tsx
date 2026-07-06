import { AIReport, LoanApplication } from '../types';
import { Bot, Landmark, Percent, Lightbulb, ShieldAlert, Award, Calendar, ChevronLeft, CalendarClock, Coins } from 'lucide-react';

interface AIReportViewProps {
  report: AIReport | null;
  loan: LoanApplication | null;
  onBack: () => void;
}

export default function AIReportView({ report, loan, onBack }: AIReportViewProps) {
  if (!report || !loan) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-[#1E293B] text-white border border-white/10 shadow-2xl rounded-3xl">
        <Bot className="h-12 w-12 text-[#38BDF8]/60 mx-auto mb-2 animate-bounce" />
        <h3 className="font-bold text-slate-200">Retrieving Digital Scorecard</h3>
        <p className="text-xs text-slate-400 mt-1">Please wait while we sync active databases.</p>
      </div>
    );
  }

  // Score Progress Color Finder
  const getScoreColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score <= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getScoreBg = (score: number) => {
    if (score < 40) return 'bg-red-500/10 text-red-400';
    if (score <= 70) return 'bg-amber-500/10 text-amber-400';
    return 'bg-emerald-500/10 text-emerald-400';
  };

  // Badge Color Finders
  const getRiskBadge = (level: 'Low' | 'Medium' | 'High') => {
    if (level === 'Low') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (level === 'Medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-sans text-[#F8FAFC]">
      
      {/* Back CTA Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#020617] hover:bg-slate-800 text-slate-200 border border-white/10 rounded-lg text-xs font-bold transition cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4 text-[#38BDF8]" />
        Back to Dashboard
      </button>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Core Scores & Indicators */}
        <div className="lg:col-span-7 bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#38BDF8] uppercase tracking-widest">
                <Bot className="h-4 w-4" />
                <span>Gemini Core Assessment</span>
              </div>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight mt-1">Loan Underwriting Report</h2>
              <span className="text-[10px] text-slate-400 font-mono block mt-1">PORTFOLIO REFERENCE: {loan.id}</span>
            </div>

            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
              loan.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
              loan.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
              'bg-amber-500/10 text-amber-400'
            }`}>
              {loan.status}
            </span>
          </div>

          {/* Probability & Overall Score */}
          <div className="grid grid-cols-2 gap-4 bg-[#020617] p-4 rounded-2xl border border-white/10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Approval Probability</span>
              <span className="text-3xl font-black text-[#38BDF8] mt-1 block">{report.approvalProbability}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Eligibility Code</span>
              <span className="text-sm font-semibold text-slate-200 mt-2 block truncate">{report.eligibility}</span>
            </div>
          </div>

          {/* Visual Progress Sub-Scores */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
              <Award className="h-4 w-4 text-[#38BDF8]" />
              AI Factor Breakdown (0-100)
            </h3>

            {/* Sub-Score items */}
            {[
              { label: 'Income Stability', score: report.incomeStabilityScore },
              { label: 'Expense Control', score: report.expenseControlScore },
              { label: 'Debt-to-Income Ratio', score: report.debtRatioScore },
              { label: 'Repayment Capacity', score: report.repaymentCapacityScore },
              { label: 'Employment Stability', score: report.employmentStabilityScore },
            ].map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>{sub.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getScoreBg(sub.score)}`}>
                    {sub.score}/100
                  </span>
                </div>
                <div className="w-full h-2 bg-[#020617] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(sub.score)}`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Overall Success Score */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-sm font-black text-slate-100">
                <span>Overall AI Underwriting Score</span>
                <span className={`px-2 py-0.5 rounded text-xs font-black ${getScoreBg(report.overallSuccessScore)}`}>
                  {report.overallSuccessScore}/100
                </span>
              </div>
              <div className="w-full h-3 bg-[#020617] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(report.overallSuccessScore)}`}
                  style={{ width: `${report.overallSuccessScore}%` }}
                />
              </div>
            </div>

          </div>

          {/* Underwriter Reasoning Paragraph */}
          <div className="border-t border-white/10 pt-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">AI Assessment Reasoning</h4>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed bg-[#020617] p-4 rounded-xl border border-white/10">
              {report.reason}
            </p>
          </div>

        </div>

        {/* Right Hand: Risk Matrix & Tips */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Risks & Fraud Badges */}
          <div className="bg-[#1E293B] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 border-b border-white/10 pb-3 flex items-center gap-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-amber-400" />
              Underwriter Risk Matrix
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#020617] border border-white/10 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Default Risk</span>
                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border mt-1.5 ${getRiskBadge(report.riskLevel)}`}>
                  {report.riskLevel} Risk
                </span>
              </div>
              <div className="p-3 bg-[#020617] border border-white/10 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Fraud Risk</span>
                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border mt-1.5 ${getRiskBadge(report.fraudRisk)}`}>
                  {report.fraudRisk} Risk
                </span>
              </div>
            </div>

            {/* Fraud Reason */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Verification Diagnostics</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-[#020617] p-3 rounded-lg border border-white/10 font-medium">
                {report.fraudReason}
              </p>
            </div>
          </div>

          {/* Bank Recommendation Card */}
          <div className="bg-gradient-to-br from-[#020617] to-[#1E293B] text-white p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <div className="p-1.5 bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] rounded-lg">
                <Landmark className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Recommended Bank Lender</h3>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">PARTNER INSTITUTION</span>
                <span className="text-lg font-black tracking-tight text-[#38BDF8]">{report.recommendedBank}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">INTEREST RATE</span>
                  <span className="text-sm font-bold flex items-center gap-1 mt-0.5 text-slate-200">
                    <Percent className="h-3.5 w-3.5 text-[#38BDF8]" />
                    {report.estimatedInterestRange}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">SUGGESTED EMI</span>
                  <span className="text-sm font-black flex items-center gap-1 mt-0.5 text-[#38BDF8]">
                    <Coins className="h-3.5 w-3.5 text-[#38BDF8]" />
                    ${report.suggestedEmi}/mo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Tips Bulleted List */}
          <div className="bg-[#1E293B] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 border-b border-white/10 pb-3 flex items-center gap-1.5">
              <Lightbulb className="h-4.5 w-4.5 text-[#38BDF8]" />
              Underwriter Actionable Tips
            </h3>

            <ul className="space-y-3">
              {report.financialTips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 text-xs text-slate-300 leading-relaxed font-medium">
                  <span className="text-[#38BDF8] font-bold mt-0.5 shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timestamp Footer info */}
          <div className="text-center text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5 text-slate-500" />
            <span>AI report generated at: {new Date(report.generatedTime).toLocaleString()}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
