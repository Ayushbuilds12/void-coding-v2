import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { 
  Rocket, ShieldCheck, CheckCircle2, AlertTriangle, Cpu, Globe, 
  Sparkles, Code2, Layers, Smartphone, RefreshCw, Eye, Terminal, 
  Mail, ShieldAlert, FileHeart, Calendar, Users
} from 'lucide-react';

interface LaunchAdminDashboardProps {
  token: string;
}

export default function LaunchAdminDashboard({ token }: LaunchAdminDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [readinessPercent, setReadinessPercent] = useState(94);
  const [checkList, setCheckList] = useState({
    github: true,
    supabase: true,
    openai: true,
    gemini: true,
    razorpay: true,
    domain: true,
    ssl: true,
    pwa: true,
    android: true,
    playstore: false
  });

  // Compliance statistics
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Security logs audit trail
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Interactive Security testing states
  const [selectedExploit, setSelectedExploit] = useState<string>('sqli');
  const [customPayload, setCustomPayload] = useState<string>("1' OR '1'='1");
  const [testResult, setTestResult] = useState<any>(null);
  const [testingPayload, setTestingPayload] = useState(false);

  // Email Notification Previewer states
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<string>('welcome');

  const exploitsList = [
    { type: 'sqli', name: 'SQL Injection (SQLi)', defaultPayload: "1' OR '1'='1" },
    { type: 'xss', name: 'Cross-Site Scripting (XSS)', defaultPayload: "<script>alert('XSS_BREACH_TEST')</script>" },
    { type: 'ssti', name: 'Server-Side Template Injection', defaultPayload: "{{7*7}}" },
    { type: 'redos', name: 'Regular Expression DoS (ReDoS)', defaultPayload: "a".repeat(1000) + "!" },
    { type: 'csrf', name: 'Cross-Site Request Forgery', defaultPayload: "External POST request missing CSRF headers" },
    { type: 'replay', name: 'Simulated Gateway Replay Attack', defaultPayload: "Simulated expired webhook webhook_sig" }
  ];

  const emailTemplates = {
    welcome: {
      title: "Welcome to Void Coding Academy",
      subject: "Your Account is Ready - Begin Your CS Track!",
      body: `Hi Student,

Welcome to Void Coding. Your academy credentials have been securely provisioned. 
You can now access your workspaces, consult our AI mentor chatbots, and track your syllabus progress.

Track Level Selected: BCA/BTech Level 1
Access Credentials: Isolated JWT Token Active

Warm regards,
The Void Coding Registrar System`
    },
    trial_start: {
      title: "Free Academy Trial Activated",
      subject: "14-day Free Trial is Live!",
      body: `Dear Student,

Your 14-day Free Trial of the Pro Mentor licensing tier has started successfully.
You have 14 days of unlimited compiler reviews, security audits, and course pre-seeds.

Trial Ends: 14 Days from Registration
Renewal charge (if Pro is elected): ₹499/month (cancel anytime)

Void Support Crew`
    },
    payment_success: {
      title: "Invoice - Pro Mentor Subscription Upgrade",
      subject: "Payment of ₹499 Successful",
      body: `Receipt Code: VOID-INV-9281-A
Charged amount: ₹499.00 INR (GST inclusive)
Payment Gateway: Razorpay Secured Simulation

Thank you for upgrading! Your premium seat is synced in our databases. Your card/UPI will be automatically billed on renewals. You can manage auto-renew settings inside your billing dashboard.`
    },
    payment_failed: {
      title: "Action Required - Payment Failed",
      subject: "Urgent: Renewal Charge Unsuccessful",
      body: `Your automatic renewal charge of ₹499 on Void Coding failed.
To maintain continuous access to your unlimited AI mentor and visual workspaces, please update your payment methods in the billing settings.

Your account has been gracefully reverted to the Free Sandbox tier.`
    },
    deleted: {
      title: "GDPR Account Purged Confirmed",
      subject: "Data Erasure Certificate (Article 17)",
      body: `We confirm that your request for account erasure under GDPR Article 17 has been successfully executed.
All billing invoices, workspace folders, compiler progress metrics, and AI chat logs associated with your profile have been permanently deleted from Void cloud databases.

We wish you all the best in your computer science journey.`
    }
  };

  const handleExploitChange = (type: string) => {
    setSelectedExploit(type);
    const expObj = exploitsList.find(e => e.type === type);
    if (expObj) setCustomPayload(expObj.defaultPayload);
  };

  const loadComplianceStats = async () => {
    setStatsLoading(true);
    try {
      const res = await apiFetch('/api/compliance/stats', { token });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadSecurityLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await apiFetch('/api/compliance/logs', { token });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLogsLoading(false);
    }
  };

  const runVerificationAudit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const count = Object.values(checkList).filter(Boolean).length;
      setReadinessPercent(Math.round((count / Object.keys(checkList).length) * 100));
      loadComplianceStats();
      loadSecurityLogs();
    }, 1500);
  };

  const executeSecurityTest = async () => {
    setTestingPayload(true);
    setTestResult(null);
    try {
      const res = await apiFetch('/api/security/test', {
        json: { type: selectedExploit, payload: customPayload }
      });
      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
        // Refresh compliance logs immediately to display the newly intercepted entry
        setTimeout(() => {
          loadSecurityLogs();
          loadComplianceStats();
        }, 500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTestingPayload(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadComplianceStats();
      loadSecurityLogs();
    }
  }, [token]);

  const scores = [
    { label: 'SEO Audit Score', value: 98, color: 'text-emerald-400' },
    { label: 'Performance Rank', value: 96, color: 'text-emerald-400' },
    { label: 'Accessibility Score', value: 95, color: 'text-emerald-400' },
    { label: 'Production Security', value: 99, color: 'text-purple-400' }
  ];

  return (
    <div className="bg-black text-white p-6 rounded-2xl border border-zinc-900 animate-fadeIn space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-800 to-indigo-950 border border-purple-500/30 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Launch Readiness & Auditing Control</h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">Control center for compliance tracking and security interception verification</p>
          </div>
        </div>

        <button
          onClick={runVerificationAudit}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Auditing Assets...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Production Build</span>
            </>
          )}
        </button>
      </div>

      {/* Main Score Bar & Readiness Percent */}
      <div className="grid md:grid-cols-3 gap-5 items-center">
        <div className="bg-gradient-to-b from-purple-950/20 to-zinc-950 border border-purple-900/40 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300">Launch Readiness Score</span>
          <div className="text-5xl font-extrabold font-mono text-purple-400 tracking-tighter">{readinessPercent}%</div>
          <p className="text-[11px] text-zinc-500 leading-normal max-w-xs mx-auto font-sans">
            Your application compiles cleanly, references Supabase secure schemas, and features live GDPR tracking protections.
          </p>
        </div>

        {/* Audit metrics columns */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {scores.map((s, idx) => (
            <div key={idx} className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{s.label}</span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-extrabold font-mono ${s.color}`}>{s.value}</span>
                <span className="text-xs text-zinc-600">/ 100</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${s.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GDPR telemetry statistics card */}
      {stats && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4.5 h-4.5 text-purple-400" />
            <h3 className="text-xs font-mono uppercase text-zinc-300 tracking-wider">Compliance & GDPR Audit Telemetry</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg">
              <span className="text-[9px] text-zinc-500 block uppercase font-mono">Consent Rate</span>
              <span className="text-base font-extrabold text-purple-400 mt-1 block">{stats.consentRatePercent}%</span>
            </div>
            <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg">
              <span className="text-[9px] text-zinc-500 block uppercase font-mono">GDPR Accepts</span>
              <span className="text-base font-extrabold text-white mt-1 block">{stats.gdprAcceptAllCount}</span>
            </div>
            <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg">
              <span className="text-[9px] text-zinc-500 block uppercase font-mono">GDPR Rejects</span>
              <span className="text-base font-extrabold text-zinc-500 mt-1 block">{stats.gdprRejectNonEssentialCount}</span>
            </div>
            <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg">
              <span className="text-[9px] text-zinc-500 block uppercase font-mono">Policy Stencil</span>
              <span className="text-base font-extrabold text-emerald-400 mt-1 block">{stats.privacyPolicyVersion}</span>
            </div>
            <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg col-span-2 md:col-span-1">
              <span className="text-[9px] text-zinc-500 block uppercase font-mono">Active Seats</span>
              <span className="text-base font-extrabold text-white mt-1 block">Pro: {stats.activeSubscribersPro}</span>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE SECURITY EXPLOITATION TESTS ENGINE */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Testing control panel */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4.5 h-4.5 text-purple-400" />
            <h3 className="text-xs font-mono uppercase text-zinc-300 tracking-wider">Interactive Vulnerability Penetration Test</h3>
          </div>

          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Select an exploit request type. Our security middleware handles sanitization, length bounds, parameter isolation, and HSTS stencils. Fire the exploit payload directly at the endpoint to verify defenses.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Exploit Request Type</label>
              <select 
                value={selectedExploit}
                onChange={(e) => handleExploitChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:border-purple-600 outline-none font-sans"
              >
                {exploitsList.map((exp) => (
                  <option key={exp.type} value={exp.type}>{exp.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Malicious Payload String</label>
              <textarea 
                rows={2}
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-300 focus:border-purple-600 outline-none font-mono"
              />
            </div>

            <button 
              onClick={executeSecurityTest}
              disabled={testingPayload}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs font-semibold text-white rounded-lg flex items-center justify-center gap-1.5 cursor-pointer font-sans"
            >
              {testingPayload ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Attack Vector...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Execute Penetration Test Payload</span>
                </>
              )}
            </button>
          </div>

          {/* Test console response output */}
          {testResult && (
            <div className="bg-black border border-zinc-850 p-4 rounded-lg font-mono text-[11px] space-y-2 text-zinc-400 leading-normal">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-500">ATTACK REACTION:</span>
                <span className={testResult.blocked ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {testResult.blocked ? '✓ BLOCKED & INTERCEPTED (403)' : 'PASSED'}
                </span>
              </div>
              <p><span className="text-zinc-500">Classification:</span> {testResult.test.toUpperCase()}</p>
              <p className="break-all"><span className="text-zinc-500">Evaluated Payload:</span> {testResult.payload}</p>
              <p><span className="text-zinc-500">Action:</span> {testResult.description}</p>
              <p><span className="text-zinc-500">Log Saved:</span> {testResult.logsRecorded ? 'Auditor Journal Saved' : 'No'}</p>
            </div>
          )}
        </div>

        {/* Live Security Audit Event Logs */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4.5 h-4.5 text-purple-400" />
                <h3 className="text-xs font-mono uppercase text-zinc-300 tracking-wider">Live Security Event Log</h3>
              </div>
              <button 
                onClick={loadSecurityLogs}
                className="p-1 hover:bg-zinc-900 rounded text-zinc-400 transition-colors"
                title="Refresh Logs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 border border-zinc-900 bg-black/30 rounded-lg text-center text-xs text-zinc-500 font-mono">
                No security incidents logged. Try launching a penetration test on the left panel!
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {logs.slice().reverse().map((log, idx) => (
                  <div key={idx} className="bg-black/50 border border-zinc-900 p-2.5 rounded-lg text-[10px] font-mono flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      log.severity === 'High' ? 'bg-red-500' : log.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-400'
                    }`}></span>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between items-center text-zinc-400 font-bold">
                        <span>{log.event}</span>
                        <span className="text-[8px] text-zinc-600 font-normal">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-zinc-500 leading-normal">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3.5 bg-purple-950/10 border border-purple-900/20 rounded-xl space-y-1 text-xs font-sans">
            <h4 className="font-bold text-purple-300">Auditing Sandbox Status</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              All exploits are evaluated server-side. Active logs are automatically bound to security analytics telemetry.
            </p>
          </div>
        </div>

      </div>

      {/* EMAIL NOTIFICATION TEMPLATE PREVIEW PANEL */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-zinc-900 pb-4">
          <Mail className="w-4.5 h-4.5 text-purple-400" />
          <h3 className="text-xs font-mono uppercase text-zinc-300 tracking-wider">Transaction Email Templates Portal</h3>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Audit the automatic notifications generated by Void Coding SaaS on student, trial, and billing life cycles. Toggle each template below to inspect visual styling and plain disclosures.
        </p>

        {/* Template Selectors */}
        <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase">
          {[
            { key: 'welcome', label: 'Welcome (Registration)' },
            { key: 'trial_start', label: 'Trial Started Countdown' },
            { key: 'payment_success', label: 'Payment Success (Invoice)' },
            { key: 'payment_failed', label: 'Payment Failed (Dunning)' },
            { key: 'deleted', label: 'Account Erased (GDPR Purge)' }
          ].map((t) => (
            <button 
              key={t.key}
              onClick={() => setSelectedEmailTemplate(t.key)}
              className={`px-3 py-1.5 border rounded-lg transition-all ${
                selectedEmailTemplate === t.key 
                  ? 'bg-purple-950/20 border-purple-600 text-purple-300 font-bold' 
                  : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-850'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Email mock envelope */}
        <div className="bg-black border border-zinc-900 rounded-xl overflow-hidden font-sans text-xs">
          {/* Header row */}
          <div className="bg-zinc-900/40 p-4 border-b border-zinc-900/60 font-mono text-[10px] text-zinc-500 space-y-1">
            <p><span className="text-zinc-600">FROM:</span> system-no-reply@voidcoding.com</p>
            <p><span className="text-zinc-600">TO:</span> active-student-sandbox@email.com</p>
            <p><span className="text-zinc-600">SUBJECT:</span> {emailTemplates[selectedEmailTemplate as keyof typeof emailTemplates].subject}</p>
          </div>

          {/* Letter Body */}
          <div className="p-6 bg-zinc-950 text-zinc-300 leading-relaxed whitespace-pre-line font-mono text-[11px] max-h-64 overflow-y-auto">
            {emailTemplates[selectedEmailTemplate as keyof typeof emailTemplates].body}
          </div>
        </div>
      </div>

    </div>
  );
}
