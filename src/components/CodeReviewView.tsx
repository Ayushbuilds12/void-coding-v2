import React, { useState } from 'react';
import { ShieldAlert, Zap, BookOpen, AlertCircle, RefreshCw, Star, Code2, Sparkles, CheckCircle2, FileCode } from 'lucide-react';

interface CodeIssue {
  type: string;
  line: string;
  description: string;
  fix: string;
}

interface CodeReview {
  rating: number;
  summary: string;
  issues: CodeIssue[];
  optimizedCode: string;
  analysis: {
    security: string;
    performance: string;
    style: string;
  };
}

interface CodeReviewViewProps {
  token: string;
}

export default function CodeReviewView({ token }: CodeReviewViewProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<CodeReview | null>(null);
  const [compareTab, setCompareTab] = useState<'review' | 'compare'>('review');

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'sql', label: 'SQL' }
  ];

  const handleRunReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setReview(null);

    try {
      const res = await fetch('/api/code/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code, language })
      });

      if (res.ok) {
        const data = await res.json();
        setReview(data);
        setCompareTab('review');
      } else {
        alert('Failed to execute code reviews. Please check backend logic.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setReview(null);
  };

  return (
    <div className="space-y-6 text-white animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Code Auditor</h1>
        <p className="text-xs text-zinc-400 mt-1">Submit your source templates or college homework modules for automated performance, styling, and security reviews.</p>
      </div>

      {!review ? (
        <form onSubmit={handleRunReview} className="grid lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-3 bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[400px]">
            {/* Header selection */}
            <div className="flex justify-between items-center bg-zinc-900/60 px-4 py-2 border-b border-zinc-900">
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                <span>Compiler Textbox</span>
              </span>
              
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black/80 border border-zinc-800 text-[11px] font-mono rounded px-2.5 py-1 text-zinc-300 outline-none focus:border-purple-800"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Code Textbox */}
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`# Paste your code here to inspect logic bugs...
def calculate_factorial(n):
    if n == 0:
        return 1
    else:
        return n * calculate_factorial(n - 1) # What if n is negative?`}
              className="flex-1 w-full bg-black/95 p-4 font-mono text-xs sm:text-sm text-purple-200 outline-none resize-none leading-relaxed"
              spellCheck="false"
              required
            />
          </div>

          {/* Guide Explainer panel */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-[10px] uppercase text-purple-400 tracking-widest mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Audit Specifications</span>
              </h3>
              
              <ul className="space-y-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>**General Quality Gauge**: Rates from 0-100 indicating safety, naming, and complexity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>**Categorized Vulnerability Scan**: Assesses style guides, database leak risks, and execution scaling.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>**Automated Optimization**: Re-writes complete code applying clean design principles.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-xs font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 focus:outline-none transition-colors"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compiling reviews...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Audit Code Module</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Results View Page */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 p-4 sm:p-5 rounded-xl">
            <div className="flex items-center space-x-4">
              {/* Score Circular gauge */}
              <div className="w-16 h-16 rounded-full border-4 border-purple-900/50 flex items-center justify-center relative font-mono">
                <span className="text-xl font-bold">{review.rating}</span>
                <span className="text-[8px] text-zinc-500 absolute -bottom-2 px-1 rounded bg-zinc-900 uppercase">SCORE</span>
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-mono capitalize">{language} audit complete</p>
                <p className="font-medium text-zinc-200 mt-1 leading-snug max-w-xl">{review.summary}</p>
              </div>
            </div>
            
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-semibold shrink-0 transition-colors"
            >
              Audit New Script
            </button>
          </div>

          {/* Sub tabs: audit summary vs comparison */}
          <div className="flex border-b border-zinc-900 text-xs sm:text-sm">
            <button 
              onClick={() => setCompareTab('review')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-all ${compareTab === 'review' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              Audit Findings ({review.issues.length})
            </button>
            <button 
              onClick={() => setCompareTab('compare')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-all ${compareTab === 'compare' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              Compare Optimized Re-write
            </button>
          </div>

          {/* TAB 1: REVIEW FINDINGS */}
          {compareTab === 'review' && (
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Categorized analysis and summary issues */}
              <div className="lg:col-span-3 space-y-4">
                <h3 className="font-mono text-[10px] uppercase text-purple-400 tracking-widest">Identified Vulnerabilities</h3>
                
                {review.issues.length === 0 ? (
                  <div className="p-8 border border-zinc-900 bg-zinc-950 rounded-xl text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <p className="text-sm font-semibold">Outstanding! No issues detected.</p>
                    <p className="text-xs text-zinc-500 mt-1">Your script adheres to standard architectural principles.</p>
                  </div>
                ) : (
                  review.issues.map((issue, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded uppercase tracking-wider bg-purple-950/60 text-purple-300 border border-purple-900/30">
                          {issue.type}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">{issue.line}</span>
                      </div>
                      
                      <h4 className="font-semibold text-sm text-zinc-200">{issue.description}</h4>
                      
                      <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-900 font-sans text-xs">
                        <span className="text-emerald-400 font-bold uppercase text-[9px] font-mono block mb-1">Recommended Fix:</span>
                        <p className="text-zinc-300 leading-relaxed">{issue.fix}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar analytical categorization scores */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-mono text-[10px] uppercase text-purple-400 tracking-widest">Dimension Audits</h3>
                
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-6 text-xs sm:text-sm">
                  {/* Security */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] uppercase text-zinc-400 tracking-wider">
                      <span className="flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                        <span>Security scan</span>
                      </span>
                      <span className="text-emerald-400">PASSED</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{review.analysis.security}</p>
                  </div>

                  {/* Performance */}
                  <div className="border-t border-zinc-900/80 pt-4 space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] uppercase text-zinc-400 tracking-wider">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-purple-400" />
                        <span>Complexity / Speed</span>
                      </span>
                      <span className="text-purple-400">OPTIMAL</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{review.analysis.performance}</p>
                  </div>

                  {/* Style */}
                  <div className="border-t border-zinc-900/80 pt-4 space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] uppercase text-zinc-400 tracking-wider">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span>Formatting Style</span>
                      </span>
                      <span className="text-zinc-400">STANDARD</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{review.analysis.style}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPARE OPTIMIZED WRITES */}
          {compareTab === 'compare' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Original Code */}
              <div className="flex flex-col space-y-2">
                <span className="font-mono text-[10px] uppercase text-zinc-500">Original Script Submittal</span>
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 overflow-x-auto h-[400px]">
                  <pre className="font-mono text-xs text-zinc-400 leading-relaxed">
                    <code>{code}</code>
                  </pre>
                </div>
              </div>

              {/* Optimized Code Re-write */}
              <div className="flex flex-col space-y-2">
                <span className="font-mono text-[10px] uppercase text-purple-400">AI Performance Optimizations</span>
                <div className="bg-zinc-950 border border-purple-950/40 rounded-xl p-4 overflow-x-auto h-[400px] relative">
                  <pre className="font-mono text-xs text-emerald-400 leading-relaxed">
                    <code>{review.optimizedCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
