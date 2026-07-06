import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Shield, Mail, Phone, RefreshCw, CheckCircle, AlertCircle, Users, Check, User as UserIcon } from 'lucide-react';

interface MyAccountProps {
  user: User;
  token: string;
  onUpdateUser: (updatedUser: User, token: string) => void;
  onLogout: () => void;
  onNavigateToTab: (tab: string) => void;
}

export default function MyAccount({ user, token, onUpdateUser, onLogout, onNavigateToTab }: MyAccountProps) {
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone || '');
  const [role, setRole] = useState<'USER' | 'ADMIN'>(user.role);
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<string | null>(null);
  
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setRole(user.role);
  }, [user]);

  // Fetch all accounts in the system to enable instant switching
  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users list", err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Name and email are required fields.');
      return;
    }

    setIsUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, phone, role })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Account details updated successfully!');
        onUpdateUser(data.user, data.token);
        fetchAllUsers(); // Refresh the list
      } else {
        setErrorMsg(data.error || 'Failed to update account details.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to connect to server.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInstantSwitch = async (targetUserId: string) => {
    setIsSwitching(targetUserId);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: targetUserId })
      });

      const data = await res.json();
      if (res.ok) {
        onUpdateUser(data.user, data.token);
        setSuccessMsg(`Switched account to ${data.user.name} successfully!`);
        
        // Redirect to appropriate dashboard based on role
        if (data.user.role === 'ADMIN') {
          onNavigateToTab('admin_dashboard');
        } else {
          onNavigateToTab('dashboard');
        }
      } else {
        setErrorMsg(data.error || 'Failed to switch user account.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to switch user account.');
      console.error(err);
    } finally {
      setIsSwitching(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans text-[#F8FAFC] space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-slate-100 tracking-tight flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-[#38BDF8]" />
          Account Management Centre
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl mx-auto text-xs sm:text-sm">
          Modify your current profile settings, switch roles, or instantly change to another registered demo account.
        </p>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="bg-emerald-950/40 border-l-4 border-emerald-500 p-4 rounded-xl text-xs text-emerald-300 flex items-center gap-2 max-w-4xl mx-auto">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/40 border-l-4 border-red-500 p-4 rounded-xl text-xs text-red-300 flex items-center gap-2 max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        
        {/* Left Column: Edit Active Account Profile */}
        <div className="lg:col-span-7 bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-slate-100 border-b border-white/10 pb-3">
            Active Profile Information
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Legal Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-medium"
                placeholder="Enter your legal name"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Corporate Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] transition font-medium"
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Security Role / Privileges
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`p-3 rounded-xl border text-xs font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer ${
                    role === 'USER'
                      ? 'bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8]'
                      : 'bg-[#020617] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Applicant Role (USER)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-3 rounded-xl border text-xs font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer ${
                    role === 'ADMIN'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-[#020617] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Underwriter (ADMIN)
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic">
                * Switching roles changes the accessible screens. ADMIN role gives you full underwriting dashboards to approve/reject files.
              </p>
            </div>

            <div className="flex gap-4 pt-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 py-3 px-4 bg-[#38BDF8] hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Updating details...
                  </>
                ) : (
                  'Save Profile Details'
                )}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-3 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Instant Account Switcher */}
        <div className="lg:col-span-5 bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
          <div className="border-b border-white/10 pb-3 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100">
              Instant Account Switcher
            </h3>
            <span className="bg-[#38BDF8]/10 text-[#38BDF8] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              {allUsers.length} profiles
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            Quickly switch to any registered or pre-seeded account profile in the AI- Loan Management Agent database instantly:
          </p>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {allUsers.map((u) => {
              const isActive = u.id === user.id;
              const isSw = isSwitching === u.id;
              
              return (
                <div
                  key={u.id}
                  onClick={() => !isActive && !isSw && handleInstantSwitch(u.id)}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#38BDF8]/10 border-[#38BDF8]/40 text-white cursor-default'
                      : 'bg-[#020617] border-white/10 text-slate-300 hover:bg-slate-800/80 hover:border-white/20 cursor-pointer'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      <span>{u.name}</span>
                      {isActive && (
                        <span className="bg-[#38BDF8]/20 text-[#38BDF8] text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
                          Active
                        </span>
                      )}
                      {u.role === 'ADMIN' && (
                        <span className="bg-amber-500/20 text-amber-400 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                  </div>

                  <div>
                    {isSw ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-[#38BDF8]" />
                    ) : isActive ? (
                      <Check className="h-5 w-5 text-[#38BDF8]" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider group-hover:underline">
                        Switch
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
