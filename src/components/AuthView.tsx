import React, { useState } from 'react';
import { Sparkles, Terminal, LogIn, UserPlus, AlertCircle, RefreshCw } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface AuthViewProps {
  onAuthSuccess: (token: string, profile: any) => void;
  onBackToLanding: () => void;
}

export default function AuthView({ onAuthSuccess, onBackToLanding }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forms inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [educationLevel, setEducationLevel] = useState('BTech Student');

  const levels = [
    'Beginner', 'School Student', 'College Student', 'BCA Student', 'BTech Student', 'University Student', 'Self-Taught Developer'
  ];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (activeTab === 'signup' && !fullName)) return;

    setLoading(true);
    setErrorMsg(null);

    const url = activeTab === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const payload = activeTab === 'login' 
      ? { email, password } 
      : { email, password, fullName, educationLevel };

    try {
      const res = await apiFetch(url, { json: payload });

      if (res.ok) {
        const data = await res.json();
        onAuthSuccess(data.token, data.profile);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('API Connection error. Ensure backend is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 selection:bg-purple-900 selection:text-white">
      {/* Glow background effects */}
      <div className="absolute w-80 h-80 bg-purple-900/10 rounded-full blur-3xl top-1/4 pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Back and Brand Logo */}
        <div className="text-center space-y-3">
          <button 
            onClick={onBackToLanding}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-800 to-indigo-950 border border-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-950/25 mx-auto focus:outline-none"
          >
            <span className="font-mono text-xl font-bold text-white tracking-widest">V</span>
          </button>
          
          <div>
            <h1 className="font-sans font-extrabold text-xl tracking-wider uppercase">VOID CODING</h1>
            <p className="text-zinc-500 text-xs font-mono mt-1">Learn, Build, and Master Coding With AI.</p>
          </div>
        </div>

        {/* Outer Form Card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          
          {/* Tab selectors */}
          <div className="flex border-b border-zinc-900 text-xs font-mono">
            <button 
              onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
              disabled={loading}
              className={`flex-1 py-2.5 border-b-2 text-center font-bold flex items-center justify-center gap-2 transition-all focus:outline-none ${activeTab === 'login' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>LOG IN</span>
            </button>
            <button 
              onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
              disabled={loading}
              className={`flex-1 py-2.5 border-b-2 text-center font-bold flex items-center justify-center gap-2 transition-all focus:outline-none ${activeTab === 'signup' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>SIGN UP</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs sm:text-sm font-sans">
            {activeTab === 'signup' && (
              <>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Full Student Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Alice Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-purple-800 rounded-lg px-3.5 py-2.5 text-white outline-none font-medium placeholder-zinc-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Education Level Track</label>
                  <select 
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-purple-800 rounded-lg px-3.5 py-2.5 text-white outline-none font-medium font-sans"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 focus:border-purple-800 rounded-lg px-3.5 py-2.5 text-white outline-none font-medium placeholder-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 focus:border-purple-800 rounded-lg px-3.5 py-2.5 text-white outline-none font-medium placeholder-zinc-600"
                required
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 font-semibold text-white rounded-lg flex items-center justify-center gap-1.5 shadow-lg focus:outline-none transition-colors"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : activeTab === 'login' ? (
                  <span>Access Platform</span>
                ) : (
                  <span>Register Track</span>
                )}
              </button>
            </div>
          </form>

          {/* Errors panel */}
          {errorMsg && (
            <div className="p-3.5 bg-red-950/15 border border-red-950 rounded-lg text-red-400 text-xs flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Bottom Navigation back */}
        <div className="text-center">
          <button 
            onClick={onBackToLanding}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
          >
            ← Back to marketing
          </button>
        </div>

      </div>
    </div>
  );
}
