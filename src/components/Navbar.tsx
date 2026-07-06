import { User } from '../types';
import { Landmark, LogOut, LayoutDashboard, FileText, Calculator, ShieldAlert, Bot, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Navbar({ user, onLogout, currentTab, setCurrentTab }: NavbarProps) {
  return (
    <nav className="bg-[#020617] text-[#F8FAFC] sticky top-0 z-50 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentTab('home')}
              className="flex items-center space-x-2 text-[#F8FAFC] hover:text-[#38BDF8] transition"
            >
              <Landmark className="h-6 w-6 text-[#38BDF8]" />
              <span className="font-sans font-bold tracking-tight text-lg">AI- Loan Management Agent</span>
            </button>
            
            {user && (
              <div className="hidden md:flex ml-10 space-x-3">
                {user.role === 'USER' ? (
                  <>
                    <button
                      onClick={() => setCurrentTab('dashboard')}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        currentTab === 'dashboard' ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-b-2 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => setCurrentTab('apply')}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        currentTab === 'apply' ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-b-2 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Apply Loan</span>
                    </button>
                    <button
                      onClick={() => setCurrentTab('status')}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        currentTab === 'status' ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-b-2 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Bot className="h-4 w-4" />
                      <span>My Reports</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setCurrentTab('admin_dashboard')}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        currentTab === 'admin_dashboard' ? 'bg-[#1e293b] border-l-2 border-[#38BDF8] text-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <ShieldAlert className="h-4 w-4 text-amber-500 animate-pulse" />
                      <span>Admin Management</span>
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setCurrentTab('emi_calculator')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    currentTab === 'emi_calculator' ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-b-2 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Calculator className="h-4 w-4" />
                  <span>EMI Calculator</span>
                </button>

                <button
                  onClick={() => setCurrentTab('account')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    currentTab === 'account' ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-b-2 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>My Account</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentTab('account')}
                  className="flex items-center space-x-3 text-left hover:opacity-80 transition cursor-pointer"
                  title="Manage Account"
                >
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-100">{user.name}</div>
                    <div className="text-[10px] font-mono tracking-wider uppercase text-[#38BDF8]">
                      {user.role} Account
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[#1E293B] border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center font-bold uppercase text-sm">
                    {user.name.charAt(0)}
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentTab('register')}
                  className="px-4 py-2 text-sm text-[#020617] bg-[#38BDF8] hover:bg-sky-400 rounded-lg transition-all font-bold shadow-md shadow-[#38BDF8]/20"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
