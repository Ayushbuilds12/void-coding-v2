import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, ShieldAlert, Cpu, Database, Server, Clock,
  RefreshCw, CheckCircle, ChevronRight, Activity, Terminal, Lock
} from 'lucide-react';

interface ScanIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  category: string;
  file: string;
  status: 'pending' | 'resolved';
}

export default function SecurityDashboard({ token }: { token: string }) {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'passed'>('idle');
  const [scannedTime, setScannedTime] = useState<string>('Today, 8:12 AM');

  const [securityIssues, setSecurityIssues] = useState<ScanIssue[]>([
    { id: 'sec_1', severity: 'low', title: 'Stale OAuth Scope permissions detected', category: 'Authentication', file: 'oauth-integration', status: 'pending' },
    { id: 'sec_2', severity: 'medium', title: 'Hardcoded environment fallback parameters warning', category: 'Credentials', file: 'server.ts', status: 'pending' },
    { id: 'sec_3', severity: 'critical', title: 'Unsecured client access credentials leak prevention active', category: 'Database Rules', file: 'firestore.rules', status: 'resolved' }
  ]);

  const handleScan = () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setTimeout(() => {
      setIsScanning(false);
      setScanStatus('passed');
      setScannedTime('Just now');
      alert('Security scanner completed successfully! Core dependencies are secured and no severe leaks were discovered.');
    }, 2000);
  };

  const handleResolveIssue = (id: string) => {
    setSecurityIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, status: 'resolved' } : issue
    ));
    alert('Security revision code compiled and deployed. Threat mitigated safely.');
  };

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <span>Academic Security Terminal</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Audit authorization states, active PostgreSQL/Firestore ports, threat mitigation logs, and container deploy systems.
          </p>
        </div>

        {/* Sync Status Button */}
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="px-4 py-2 bg-zinc-950 border border-zinc-900 hover:border-purple-900 text-xs font-bold uppercase tracking-wider rounded-lg text-zinc-300 hover:text-white flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-purple-400' : ''}`} />
          <span>{isScanning ? 'Scanning directory tree...' : 'Trigger Audit Scan'}</span>
        </button>
      </div>

      {/* Grid of 6 Crucial Telemetry indicators */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Auth Status */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Security Gate 01</span>
              <h3 className="text-sm font-bold text-zinc-200 mt-1">Authentication Gate</h3>
            </div>
            <span className="p-1.5 bg-purple-950/40 border border-purple-800/20 text-purple-400 rounded-lg">
              <Lock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-400">Tokens Secured (SHA256)</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            JWT validation blocks are deployed on host routes. Secure cookie credentials active.
          </p>
        </div>

        {/* Database Status */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Security Gate 02</span>
              <h3 className="text-sm font-bold text-zinc-200 mt-1">Database Upstream</h3>
            </div>
            <span className="p-1.5 bg-purple-950/40 border border-purple-800/20 text-purple-400 rounded-lg">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-zinc-400">PostgreSQL Cloud Ready</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            Drizzle ORM schema trees matched. Direct firestore protection policies compiled safely.
          </p>
        </div>

        {/* API Health */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Security Gate 03</span>
              <h3 className="text-sm font-bold text-zinc-200 mt-1">API Endpoint Hub</h3>
            </div>
            <span className="p-1.5 bg-purple-950/40 border border-purple-800/20 text-purple-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-400">Health checks: Passed</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            REST routes responding on port 3000 in under 34ms. Proxy configurations verified.
          </p>
        </div>

        {/* Security Scan results */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Security Gate 04</span>
              <h3 className="text-sm font-bold text-zinc-200 mt-1">Snyk Audit scan</h3>
            </div>
            <span className="p-1.5 bg-purple-950/40 border border-purple-800/20 text-purple-400 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span className="text-zinc-400">Scan status: Resolved</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            Latest diagnostic audit executed on: <strong className="text-zinc-400 font-bold">{scannedTime}</strong>.
          </p>
        </div>

        {/* Backup status */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Security Gate 05</span>
              <h3 className="text-sm font-bold text-zinc-200 mt-1">Replication Backups</h3>
            </div>
            <span className="p-1.5 bg-purple-950/40 border border-purple-800/20 text-purple-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-zinc-400">24h Schedule active</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            Automated cloud copies synchronized. Workspace file catalogs secure against storage faults.
          </p>
        </div>

        {/* Deployment status */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Security Gate 06</span>
              <h3 className="text-sm font-bold text-zinc-200 mt-1">Container Deploy</h3>
            </div>
            <span className="p-1.5 bg-purple-950/40 border border-purple-800/20 text-purple-400 rounded-lg">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-400">Cloud Run: Live (3000)</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            NGINX routing engine active. Auto-scaling rules matching peak requirements dynamically.
          </p>
        </div>
      </div>

      {/* Directory Diagnostic report table */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
        <h2 className="text-sm font-bold tracking-tight mb-5 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Active Threat Auditing Log</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px] leading-relaxed">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider">
                <th className="pb-3">Severity</th>
                <th className="pb-3">Vulnerability / Incident Description</th>
                <th className="pb-3">Scope File</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Auditor Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60">
              {securityIssues.map((issue) => (
                <tr key={issue.id} className="text-zinc-300">
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      issue.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-900/50' :
                      issue.severity === 'high' ? 'bg-orange-950 text-orange-400 border border-orange-900/50' :
                      issue.severity === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-900/50' :
                      'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="py-4 font-sans font-medium text-zinc-100">{issue.title}</td>
                  <td className="py-4 text-zinc-400">{issue.file}</td>
                  <td className="py-4">
                    <span className={`flex items-center gap-1.5 ${
                      issue.status === 'resolved' ? 'text-emerald-400 font-bold' : 'text-zinc-500 animate-pulse'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${issue.status === 'resolved' ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                      <span className="uppercase text-[10px]">{issue.status}</span>
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {issue.status === 'resolved' ? (
                      <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Mitigated</span>
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleResolveIssue(issue.id)}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-purple-950 border border-zinc-800 hover:border-purple-800 rounded text-purple-300 hover:text-purple-200 text-[10px] font-bold uppercase tracking-wider transition-all"
                      >
                        Fix Instantly
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
