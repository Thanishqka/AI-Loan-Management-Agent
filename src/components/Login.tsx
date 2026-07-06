import React, { useState } from 'react';
import { Landmark, Mail, Lock, Shield, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User, token: string) => void;
  onNavigateToRegister: () => void;
}

export default function Login({ onLoginSuccess, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password })
      });

      const responseText = await res.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        data = { error: 'The authorization server returned an unexpected response format.' };
      }

      if (res.ok) {
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('Cannot establish database connection. Please verify your internet connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setCredentials = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans bg-[#0F172A]">
      <div className="max-w-md w-full space-y-8 bg-[#1E293B] p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/10">
        
        {/* Header Branding */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center shadow-lg">
            <Landmark className="h-6 w-6 text-[#38BDF8]" />
          </div>
          <h2 className="mt-4 text-3xl font-black text-[#F8FAFC] tracking-tight">Welcome Back</h2>
          <p className="mt-1.5 text-sm text-[#94A3B8]">
            Access your secure AI- Loan Management Agent portal
          </p>
        </div>

        {/* Form Alerts */}
        {error && (
          <div className="bg-red-950/40 border-l-4 border-red-500 p-4 rounded-xl text-xs text-red-300 leading-relaxed">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wide mb-1.5">
              Corporate Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] placeholder-slate-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wide mb-1.5">
              Secure Account Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-3 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] placeholder-slate-500 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#38BDF8] hover:bg-sky-400 text-slate-950 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Authorizing Profile...' : 'Sign In To Account'}
            <ChevronRight className="h-4 w-4 text-slate-950" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#94A3B8]">
            Don't have an active account?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-[#38BDF8] font-bold hover:underline cursor-pointer"
            >
              Request Access
            </button>
          </p>
        </div>

        {/* Seed Credentials Panel (For Judge/User review) */}
        <div className="mt-6 border-t border-white/10 pt-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] uppercase tracking-wide">
            <Shield className="h-4 w-4 text-[#38BDF8]" />
            <span>Pre-seeded Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCredentials('admin@loanagent.com', 'admin123')}
              className="p-2 text-left bg-[#020617] hover:bg-slate-800 border border-white/10 rounded-lg text-xs transition cursor-pointer"
            >
              <div className="font-bold text-[#F8FAFC]">Demo Admin</div>
              <div className="text-[10px] text-[#94A3B8]">admin@loanagent.com / admin123</div>
            </button>
            <button
              onClick={() => setCredentials('john.doe@example.com', 'john123')}
              className="p-2 text-left bg-[#020617] hover:bg-slate-800 border border-white/10 rounded-lg text-xs transition cursor-pointer"
            >
              <div className="font-bold text-[#F8FAFC]">Demo User (John)</div>
              <div className="text-[10px] text-[#94A3B8]">john.doe@example.com / john123</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
