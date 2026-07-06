import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, MessageCircle, HelpCircle, Globe } from 'lucide-react';

interface ChatMessage {
  id: string;
  question: string;
  response: string;
  createdTime: string;
}

interface ChatWidgetProps {
  token: string;
}

export default function ChatWidget({ token }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [language, setLanguage] = useState<string>('English');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { name: 'English', label: 'English 🇺🇸' },
    { name: 'Hindi', label: 'Hindi 🇮🇳' },
    { name: 'Tamil', label: 'Tamil 🇮🇳' },
    { name: 'Spanish', label: 'Spanish 🇪🇸' },
    { name: 'French', label: 'French 🇫🇷' }
  ];

  useEffect(() => {
    if (isOpen && token) {
      fetchChatHistory();
    }
  }, [isOpen, token]);

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch('/api/chat/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: userQuestion, language })
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(prev => [...prev, data]);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to communicate with AI Advisor');
      }
    } catch (err) {
      console.error("Chatbot connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#38BDF8] hover:bg-sky-400 text-slate-950 rounded-full p-4 shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Chat with AI Advisor"
          id="chat-toggle-btn"
        >
          <MessageCircle className="h-6 w-6 text-slate-950" />
          <span className="absolute -top-1 -right-1 bg-emerald-400 w-3.5 h-3.5 rounded-full border-2 border-[#020617] animate-pulse" />
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="bg-[#1E293B] rounded-2xl shadow-2xl border border-white/10 w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-[#020617] p-4 text-white flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#38BDF8]/10 border border-[#38BDF8]/20 p-1.5 rounded-lg text-[#38BDF8]">
                <Bot className="h-5 w-5 text-[#38BDF8]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">AI- Loan Management Agent Chat Advisor</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  <span className="text-[10px] text-slate-400">Gemini-Powered Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative inline-block text-left">
                <div className="flex items-center gap-1 bg-[#1E293B] border border-white/10 hover:bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 font-medium transition cursor-pointer">
                  <Globe className="h-3 w-3 text-[#38BDF8]" />
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent border-none text-slate-100 focus:outline-none cursor-pointer pr-1"
                  >
                    {languages.map(lang => (
                      <option key={lang.name} value={lang.name} className="text-slate-200 bg-[#020617]">
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Help Guide / Notice */}
          <div className="bg-[#020617] border-b border-white/10 px-4 py-2 text-[11px] text-[#38BDF8] flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
            <span>Ask me about loan eligibility, interest rates, or EMIs!</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#020617]/40">
            {history.length === 0 && !loading && (
              <div className="text-center py-8 text-slate-400">
                <Bot className="h-10 w-10 mx-auto text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-400">Welcome to AI- Loan Management Agent Chat!</p>
                <p className="text-[11px] mt-1 px-4 text-slate-500">
                  I can analyze your credit scenarios, interest benchmarks, and eligibility rules. Type your query below.
                </p>
              </div>
            )}

            {history.map((msg) => (
              <div key={msg.id} className="space-y-2">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-[#38BDF8] text-slate-950 rounded-2xl rounded-tr-none px-3.5 py-2 text-xs max-w-[85%] shadow-md leading-relaxed font-semibold">
                    {msg.question}
                  </div>
                </div>

                {/* AI response */}
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#020617] text-[#38BDF8] border border-white/10 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-sm">
                    AI
                  </div>
                  <div className="bg-[#1E293B] border border-white/10 text-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2 text-xs max-w-[85%] shadow-md leading-relaxed whitespace-pre-wrap">
                    {msg.response}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center">
                <div className="h-6 w-6 rounded-full bg-[#020617] text-[#38BDF8] border border-white/10 flex items-center justify-center font-bold text-[10px] shrink-0 shadow-sm animate-pulse">
                  AI
                </div>
                <div className="bg-[#1E293B] border border-white/10 text-[#38BDF8] rounded-2xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-[#1E293B] flex gap-2 items-center">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`Ask in ${language}...`}
              className="flex-1 bg-[#020617] border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#38BDF8] focus:bg-[#020617] text-slate-200 placeholder-slate-500"
              disabled={loading}
              maxLength={300}
            />
            <button
              type="submit"
              className="bg-[#38BDF8] hover:bg-sky-400 text-slate-950 rounded-xl p-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
              disabled={loading || !question.trim()}
            >
              <Send className="h-4 w-4 text-slate-950" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
