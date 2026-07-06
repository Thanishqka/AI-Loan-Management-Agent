import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ApplyLoan from './components/ApplyLoan';
import LoanStatus from './components/LoanStatus';
import AIReportView from './components/AIReportView';
import EMICalculator from './components/EMICalculator';
import AdminDashboard from './components/AdminDashboard';
import ChatWidget from './components/ChatWidget';
import MyAccount from './components/MyAccount';
import { User, LoanApplication, AIReport } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeLoanId, setActiveLoanId] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<AIReport | null>(null);
  const [activeLoan, setActiveLoan] = useState<LoanApplication | null>(null);

  // Initialize and check LocalStorage session tokens
  useEffect(() => {
    const savedUser = localStorage.getItem('auracredit_user');
    const savedToken = localStorage.getItem('auracredit_token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        
        // Redirect based on role
        if (parsedUser.role === 'ADMIN') {
          setCurrentTab('admin_dashboard');
        } else {
          setCurrentTab('dashboard');
        }
      } catch (err) {
        console.error("Session re-auth failed, clearing parameters.", err);
        handleLogout();
      }
    }
  }, []);

  // Sync loan lists when credentials or tabs alter
  useEffect(() => {
    if (user && token) {
      fetchLoans();
    }
  }, [user, token, currentTab]);

  const fetchLoans = async () => {
    try {
      const res = await fetch('/api/loans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLoans(data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to load applications list", err);
    }
  };

  const handleLoginSuccess = (loggedInUser: User, sessionToken: string) => {
    setUser(loggedInUser);
    setToken(sessionToken);
    localStorage.setItem('auracredit_user', JSON.stringify(loggedInUser));
    localStorage.setItem('auracredit_token', sessionToken);
    
    if (loggedInUser.role === 'ADMIN') {
      setCurrentTab('admin_dashboard');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setLoans([]);
    localStorage.removeItem('auracredit_user');
    localStorage.removeItem('auracredit_token');
    setCurrentTab('home');
  };

  // Immediate route to custom AI report view card
  const handleViewReport = async (loanId: string) => {
    try {
      const res = await fetch(`/api/loans/${loanId}/report`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const reportData = await res.json();
        const correspondingLoan = loans.find(l => l.id === loanId) || null;
        
        setActiveReport(reportData);
        setActiveLoan(correspondingLoan);
        setCurrentTab('report');
      } else {
        alert("Failed to retrieve the corresponding AI report file.");
      }
    } catch (err) {
      console.error("Error loading AI Report", err);
      alert("Database lookup error.");
    }
  };

  const handleApplicationSuccess = (createdLoan: LoanApplication, generatedReport: AIReport, updatedUser?: User) => {
    // Force refresh and route directly to the generated report page as strictly requested
    setLoans(prev => [...prev, createdLoan]);
    setActiveLoan(createdLoan);
    setActiveReport(generatedReport);
    setCurrentTab('report');
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('auracredit_user', JSON.stringify(updatedUser));
    }
  };

  const handleBackFromReport = () => {
    if (user?.role === 'ADMIN') {
      setCurrentTab('admin_dashboard');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Home user={user} onNavigateToTab={(tab) => setCurrentTab(tab)} />;
      case 'login':
        return (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => setCurrentTab('register')} 
          />
        );
      case 'register':
        return (
          <Register 
            onRegisterSuccess={handleLoginSuccess} 
            onNavigateToLogin={() => setCurrentTab('login')} 
          />
        );
      case 'dashboard':
        return user ? (
          <Dashboard 
            user={user} 
            loans={loans} 
            onNavigateToTab={(tab) => setCurrentTab(tab)} 
          />
        ) : (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => setCurrentTab('register')} 
          />
        );
      case 'apply':
        return user ? (
          <ApplyLoan 
            user={user} 
            token={token} 
            onApplicationSuccess={handleApplicationSuccess} 
            onUnauthorized={handleLogout}
          />
        ) : (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => setCurrentTab('register')} 
          />
        );
      case 'status':
        return user ? (
          <LoanStatus 
            loans={loans} 
            onViewReport={handleViewReport} 
          />
        ) : (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => setCurrentTab('register')} 
          />
        );
      case 'emi_calculator':
        return <EMICalculator user={user} loans={loans} />;
      case 'account':
        return user ? (
          <MyAccount 
            user={user} 
            token={token}
            onUpdateUser={(updatedUser, newToken) => {
              setUser(updatedUser);
              setToken(newToken);
              localStorage.setItem('auracredit_user', JSON.stringify(updatedUser));
              localStorage.setItem('auracredit_token', newToken);
            }}
            onLogout={handleLogout}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        ) : (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => setCurrentTab('register')} 
          />
        );
      case 'report':
        return (
          <AIReportView 
            report={activeReport} 
            loan={activeLoan} 
            onBack={handleBackFromReport} 
          />
        );
      case 'admin_dashboard':
        return user && user.role === 'ADMIN' ? (
          <AdminDashboard 
            user={user} 
            loans={loans} 
            token={token} 
            onRefreshLoans={fetchLoans} 
            onViewReport={handleViewReport} 
          />
        ) : (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => setCurrentTab('register')} 
          />
        );
      default:
        return <Home user={user} onNavigateToTab={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col justify-between">
      <div>
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
        />
        
        {/* Dynamic page render */}
        <main className="pb-16 animate-fade-in">
          {renderContent()}
        </main>
      </div>

      {/* Floating Chat Widget - Globally accessible on all logged-in views */}
      {user && token && <ChatWidget token={token} />}

      {/* Corporate footer info */}
      <footer className="bg-[#020617] text-slate-400 py-6 border-t border-white/10 text-center text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 AI- Loan Management Agent. All Rights Reserved. AI-Assisted Credit Underwriter System.</p>
        </div>
      </footer>
    </div>
  );
}
