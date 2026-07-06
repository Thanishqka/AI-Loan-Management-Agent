import React, { useState } from 'react';
import { Landmark, User as UserIcon, Mail, Lock, Phone, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface RegisterProps {
  onRegisterSuccess: (user: User, token: string) => void;
  onNavigateToLogin: () => void;
}

export default function Register({ onRegisterSuccess, onNavigateToLogin }: RegisterProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please provide all requested registration details.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify inputs.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim(), 
          password, 
          phone: phone.trim() 
        })
      });

      const responseText = await res.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        data = { error: 'The registration server returned an unexpected response format.' };
      }

      if (res.ok) {
        onRegisterSuccess(data.user, data.token);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to AI- Loan Management Agent database. Verify connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans bg-[#0F172A]">
      <div className="max-w-md w-full space-y-8 bg-[#1E293B] p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/10">
        
        {/* Branding Title */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center shadow-lg">
            <Landmark className="h-6 w-6 text-[#38BDF8]" />
          </div>
          <h2 className="mt-4 text-3xl font-black text-[#F8FAFC] tracking-tight">Create Account</h2>
          <p className="mt-1.5 text-sm text-[#94A3B8]">
            Open a secure individual loan profile
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-950/40 border-l-4 border-red-500 p-4 rounded-xl text-xs text-red-300 leading-relaxed">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wide mb-1">
              Full Legal Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <UserIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="block w-full pl-10 pr-4 py-2.5 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] placeholder-slate-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wide mb-1">
              Primary Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="block w-full pl-10 pr-4 py-2.5 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] placeholder-slate-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wide mb-1">
              Mobile Contact Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="123-456-7890"
                className="block w-full pl-10 pr-4 py-2.5 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] placeholder-slate-500 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wide mb-1">
                Password
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
                  className="block w-full pl-10 pr-4 py-2.5 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] placeholder-slate-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wide mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 bg-[#020617] border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#F8FAFC] placeholder-slate-500 transition"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#38BDF8] hover:bg-sky-400 text-slate-950 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Submitting Registration...' : 'Request Agent Access'}
            <ChevronRight className="h-4 w-4 text-slate-950" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#94A3B8]">
            Already registered?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-[#38BDF8] font-bold hover:underline cursor-pointer"
            >
              Sign In Instead
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
