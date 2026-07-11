import React, { useState } from 'react';
import { 
  GitFork, GitCommit, GitBranch, Github, Link2, RefreshCw, CheckCircle,
  Plus, AlertCircle, FileCode, Check, Send, ArrowUpRight, History
} from 'lucide-react';

interface Commit {
  hash: string;
  author: string;
  message: string;
  time: string;
  branch: string;
}

export default function GitHubConnect({ token }: { token: string }) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [repoName, setRepoName] = useState<string>('void-academic-sandbox');
  const [activeBranch, setActiveBranch] = useState<string>('main');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [commitInput, setCommitInput] = useState<string>('');
  
  const [commits, setCommits] = useState<Commit[]>([
    { hash: 'e82d1b0', author: 'Rawat Ayush', message: 'Optimize Three.js WebGL canvas and particle density multipliers', time: '12 mins ago', branch: 'main' },
    { hash: 'a1b2c3d', author: 'Rawat Ayush', message: 'Setup Google Drive reports sync structure', time: '4 hours ago', branch: 'main' },
    { hash: 'f4e3d2c', author: 'Alex Chen', message: 'Finalize university BCA/BTech semester template routing', time: '1 day ago', branch: 'main' },
    { hash: 'bc90a12', author: 'System Bot', message: 'Initial academic repository commit structures compiled', time: '3 days ago', branch: 'main' }
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Workspace folders fully synchronized with GitHub remote upstream. Code modifications updated safely!');
    }, 1800);
  };

  const handleCreateCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitInput.trim()) return;

    const newCommit: Commit = {
      hash: Math.random().toString(16).substring(2, 9),
      author: 'You (SaaS Admin)',
      message: commitInput,
      time: 'Just now',
      branch: activeBranch
    };

    setCommits([newCommit, ...commits]);
    setCommitInput('');
    
    // Simulate push notification trigger
    setTimeout(() => {
      alert(`Commit "${commitInput}" compiled and pushed to upstream branch ${activeBranch} safely.`);
    }, 400);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Github className="w-6 h-6 text-purple-400" />
            <span>GitHub Sync Gateway</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Publish academic assignments, code modules, and 3D landing pages directly into Git repositories.
          </p>
        </div>

        {/* Sync Status Button */}
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-zinc-950 border border-zinc-900 hover:border-purple-900 text-xs font-bold uppercase tracking-wider rounded-lg text-zinc-300 hover:text-white flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-purple-400' : ''}`} />
          <span>{isSyncing ? 'Synchronizing upstream...' : 'Sync Repository'}</span>
        </button>
      </div>

      {/* Connection Indicator Card */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Status Widget */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Service Status</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="flex items-center space-x-3 bg-zinc-900/40 p-3.5 border border-zinc-850 rounded-lg">
            <Github className="w-9 h-9 text-white bg-zinc-950 p-2 rounded-lg border border-zinc-800" />
            <div>
              <p className="text-xs font-bold text-zinc-300">GitHub Verified</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">oauth_token: active_sha256</p>
            </div>
          </div>

          {/* Repo specs details */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-500">Repository Name:</span>
              <span className="text-zinc-300 font-bold">{repoName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Scope Type:</span>
              <span className="text-purple-400 font-bold uppercase">Academic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Visibility:</span>
              <span className="text-emerald-400 font-bold uppercase">Private</span>
            </div>
          </div>
        </div>

        {/* Branch Widget */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Git Branches</span>
            <span className="text-[10px] text-zinc-400 font-mono">1 active branch</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Active Workspace branch</label>
            <div className="relative">
              <GitBranch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <select 
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 text-xs rounded-lg pl-10 pr-4 py-2.5 text-zinc-200 outline-none focus:border-purple-800"
              >
                <option value="main">main (production upstream)</option>
                <option value="beta-feature">beta-feature (staging sandbox)</option>
                <option value="docs-patch">docs-patch (revision block)</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 leading-normal">
            Your active codebase is compiled instantly on port 3000. Changes pushed upstream deploy directly to your production host server.
          </p>
        </div>

        {/* Commit Sandbox */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Commit Sandbox</span>
            <span className="text-[10px] text-zinc-400 font-mono">Push to GitHub</span>
          </div>

          <form onSubmit={handleCreateCommit} className="space-y-2">
            <input 
              type="text"
              placeholder="Input commit explanation message..."
              value={commitInput}
              onChange={(e) => setCommitInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-850 rounded px-3 py-2 text-xs text-zinc-200 outline-none focus:border-purple-800 placeholder-zinc-500"
            />
            <button 
              type="submit"
              disabled={!commitInput.trim()}
              className="w-full py-2 bg-purple-650 hover:bg-purple-700 disabled:opacity-40 text-xs font-bold uppercase tracking-wider text-white rounded flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compile & Push Commit</span>
            </button>
          </form>
        </div>
      </div>

      {/* History Timeline Logs list */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
        <h2 className="text-sm font-bold tracking-tight mb-5 flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <span>Commit Chronology History</span>
        </h2>

        <div className="relative border-l border-zinc-900 pl-4 space-y-6">
          {commits.map((commit, idx) => (
            <div key={idx} className="relative">
              {/* Timeline circle */}
              <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-650 border-2 border-black"></span>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-zinc-900/20 hover:bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-900 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">{commit.message}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono flex items-center gap-2">
                    <span>Author: <strong>{commit.author}</strong></span>
                    <span>•</span>
                    <span className="text-purple-400 flex items-center gap-0.5">
                      <GitBranch className="w-3 h-3" />
                      <span>{commit.branch}</span>
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[9px] text-zinc-500">{commit.time}</span>
                  <span className="font-mono text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {commit.hash}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
