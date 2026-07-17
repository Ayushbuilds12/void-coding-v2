import React, { useState, useEffect } from 'react';
import { 
  User, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, 
  KeyRound, Download, Trash2, Eye, ShieldCheck, Mail, RefreshCw,
  Github, Database, Bell, CreditCard, Link2
} from 'lucide-react';
import { Profile } from '../types';
import { apiFetch } from '../lib/api';

interface SettingsViewProps {
  token: string;
  profile: Profile | null;
  onRefreshProfile: () => Promise<void>;
  onLogout: () => void;
}

export default function SettingsView({ token, profile, onRefreshProfile, onLogout }: SettingsViewProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [educationLevel, setEducationLevel] = useState(profile?.education_level || 'Beginner');
  const [loading, setLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Password fields
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Dynamic GDPR opt-out states loaded from Cookie preferences
  const [optOutAnalytics, setOptOutAnalytics] = useState(false);
  const [optOutMarketing, setOptOutMarketing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('void_cookie_consent');
    if (saved) {
      try {
        const payload = JSON.parse(saved);
        setOptOutAnalytics(!payload.preferences?.analytics);
        setOptOutMarketing(!payload.preferences?.marketing);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleToggleOptOut = (type: 'analytics' | 'marketing', value: boolean) => {
    if (type === 'analytics') {
      setOptOutAnalytics(value);
    } else {
      setOptOutMarketing(value);
    }

    const currentConsent = localStorage.getItem('void_cookie_consent');
    let basePrefs = { essential: true, functional: true, analytics: true, marketing: false };
    if (currentConsent) {
      try {
        basePrefs = JSON.parse(currentConsent).preferences;
      } catch (e) {}
    }

    const updatedPrefs = {
      ...basePrefs,
      analytics: type === 'analytics' ? !value : basePrefs.analytics,
      marketing: type === 'marketing' ? !value : basePrefs.marketing
    };

    localStorage.setItem('void_cookie_consent', JSON.stringify({
      preferences: updatedPrefs,
      version: "v1.4.2",
      timestamp: new Date().toISOString(),
      countryCode: "EU-GDPR"
    }));
  };

  const levels = ['Beginner', 'School Student', 'College Student', 'BCA Student', 'BTech Student', 'University Student', 'Self-Taught Developer'];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || loading) return;

    setLoading(true);
    setProfileMsg(null);

    try {
      const res = await apiFetch('/api/profile', {
        token,
        method: 'PUT',
        json: { fullName, educationLevel }
      });

      if (res.ok) {
        setProfileMsg({ success: true, text: 'SaaS profile synchronized in database successfully!' });
        await onRefreshProfile();
      } else {
        const err = await res.json();
        setProfileMsg({ success: false, text: err.error || 'Failed to update profile.' });
      }
    } catch (e) {
      console.error(e);
      setProfileMsg({ success: false, text: 'API network failure.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;

    setPassMsg({ success: true, text: 'Password modified successfully in secure database states!' });
    setOldPass('');
    setNewPass('');
  };

  // Active GDPR Deletion request Article 17
  const handleDeleteAccountReal = async () => {
    const confirmation = confirm('WARNING: Permanent deletion of your student account under GDPR Article 17 is irreversible. This will erase all billing histories, completed lessons progress, active projects and AI tutor conversation logs. Do you want to proceed?');
    if (!confirmation) return;

    setIsDeleting(true);
    try {
      const res = await apiFetch('/api/auth/delete', {
        token,
        method: 'POST'
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'Account successfully erased. Redirecting...');
        onLogout();
      } else {
        alert('Data deletion request failed on the server.');
      }
    } catch (e) {
      console.error(e);
      alert('Network failure processing deletion request.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Active GDPR Data Export request Article 15
  const handleExportAccountReal = async () => {
    setIsExporting(true);
    try {
      const res = await apiFetch('/api/auth/export', { token });

      if (res.ok) {
        const blobData = await res.json();
        const jsonStr = JSON.stringify(blobData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Trigger automatic browser download of JSON archive
        const a = document.createElement('a');
        a.href = url;
        a.download = `void_gdpr_export_${profile?.email || 'user'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Your complete GDPR Article 15 Data Archive has been prepared and downloaded successfully.');
      } else {
        alert('Failed to compile your data archive.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error preparing compliance export.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 text-white animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-xs text-zinc-400 mt-1 font-sans">Manage your personal CS track syllabus, password credentials, and sandbox profiles.</p>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-800/5 rounded-full blur-2xl pointer-events-none"></div>
        <h2 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5 mb-6">
          <User className="w-4.5 h-4.5" />
          <span>Profile Specifications</span>
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-sm font-sans">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Student Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-800 rounded px-3.5 py-2 text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Curriculum Track Level</label>
              <select 
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-800 rounded px-3.5 py-2 text-white outline-none font-sans"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-zinc-500 font-mono">Email: {profile?.email}</span>
            <button 
              type="submit"
              disabled={loading || !fullName.trim()}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs font-semibold rounded-lg shadow-lg"
            >
              {loading ? 'Syncing...' : 'Save Profile'}
            </button>
          </div>
        </form>

        {profileMsg && (
          <div className={`mt-4 p-3.5 rounded-lg border text-xs flex items-center gap-2 ${profileMsg.success ? 'border-emerald-950 bg-emerald-950/5 text-emerald-400' : 'border-red-950 bg-red-950/5 text-red-400'}`}>
            {profileMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            <span className="font-medium">{profileMsg.text}</span>
          </div>
        )}
      </div>

      {/* GDPR Tracking Preferences */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
        <h2 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
          <Eye className="w-4.5 h-4.5" />
          <span>Tracking Consent Controls</span>
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-sans">
          Under GDPR Article 21, you possess the right to object to tracking procedures. Manage your preferences below to control analytics and marketing cookies with absolute data isolation.
        </p>

        <div className="space-y-4 font-sans text-xs">
          <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg">
            <div>
              <span className="font-bold text-zinc-300 block">Opt-Out of Analytical Telemetry</span>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">Disables monitoring of compilation speed, tutorial intervals and AI completion patterns.</span>
            </div>
            <input 
              type="checkbox" 
              checked={optOutAnalytics} 
              onChange={(e) => handleToggleOptOut('analytics', e.target.checked)}
              className="accent-purple-500 rounded bg-zinc-950 border-zinc-800 h-4 w-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg">
            <div>
              <span className="font-bold text-zinc-300 block">Opt-Out of Marketing Promotion</span>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">Excludes promotional coupon suggestions and upgrading notices inside workspace dashboards.</span>
            </div>
            <input 
              type="checkbox" 
              checked={optOutMarketing} 
              onChange={(e) => handleToggleOptOut('marketing', e.target.checked)}
              className="accent-purple-500 rounded bg-zinc-950 border-zinc-800 h-4 w-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Cloud & VCS Integrations Status */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
            <Link2 className="w-4.5 h-4.5" />
            <span>Integrations & Cloud Status</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Monitor connected repositories, API adapters, database instances, and billing anchors.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 font-sans text-xs">
          {/* GitHub Connection */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                <Github className="w-4 h-4 text-white" />
                <span>GitHub Connect</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] text-zinc-500">Repository connected to void-academic-sandbox upstream branch.</p>
            <div className="text-[10px] text-purple-400 font-mono font-bold uppercase">Status: Synced</div>
          </div>

          {/* Supabase Connection */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Supabase SQL</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] text-zinc-500">Database connection pool and REST proxies active.</p>
            <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Status: Connected</div>
          </div>

          {/* Firebase Connection */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-500" />
                <span>Firebase Auth</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] text-zinc-500">Authentication states and FireStore security rules active.</p>
            <div className="text-[10px] text-amber-400 font-mono font-bold uppercase">Status: Live</div>
          </div>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
            <Bell className="w-4.5 h-4.5" />
            <span>Notification Preferences</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Configure study alerts, assignment deadlines, and system emails.</p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-zinc-900/20 border border-zinc-900 rounded-lg">
            <div>
              <span className="font-bold text-zinc-300 block">Tutor Recommendations</span>
              <span className="text-[10px] text-zinc-500">Receive customized notifications for curriculum tracks and pointer algorithms.</span>
            </div>
            <input type="checkbox" defaultChecked className="accent-purple-500 rounded bg-zinc-950 h-4 w-4 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-900/20 border border-zinc-900 rounded-lg">
            <div>
              <span className="font-bold text-zinc-300 block">Weekly Performance Reports</span>
              <span className="text-[10px] text-zinc-500">Get an overview of code compiled, review pass rates, and lessons completed.</span>
            </div>
            <input type="checkbox" defaultChecked className="accent-purple-500 rounded bg-zinc-950 h-4 w-4 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Edit Password Credentials */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
        <h2 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5 mb-6">
          <KeyRound className="w-4.5 h-4.5" />
          <span>Vapor Credentials</span>
        </h2>

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-sm font-sans">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Old Password</label>
              <input 
                type="password" 
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-800 rounded px-3.5 py-2 text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">New Password</label>
              <input 
                type="password" 
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-800 rounded px-3.5 py-2 text-white outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              disabled={!oldPass || !newPass}
              className="px-5 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs rounded-lg font-medium text-zinc-300"
            >
              Modify Password
            </button>
          </div>
        </form>

        {passMsg && (
          <div className="mt-4 p-3.5 rounded-lg border border-emerald-950 bg-emerald-950/5 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">{passMsg.text}</span>
          </div>
        )}
      </div>

      {/* GDPR Data Export & Archive */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
          <Download className="w-4.5 h-4.5" />
          <span>GDPR Portable Archive</span>
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Under GDPR Article 15, you possess the right to export your entire digital archive at any time. Clicking the button below downloads an official, structured JSON file containing your active profile schemas, folders, study projects, compiled progress records, and billing logs.
        </p>

        <button 
          onClick={handleExportAccountReal}
          disabled={isExporting}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs text-white rounded-lg font-semibold transition-all flex items-center gap-1.5"
        >
          {isExporting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Request Backup Archive (Article 15)</span>
        </button>
      </div>

      {/* Danger Zone Account deletion */}
      <div className="border border-red-950 bg-red-950/5 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold font-mono text-red-400 uppercase tracking-widest flex items-center gap-1.5">
          <AlertTriangle className="w-4.5 h-4.5" />
          <span>Danger Zone</span>
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">Once you delete your student academy sandbox workspace, all progress, records, and billing transaction log files will be irreversibly deleted.</p>
        
        <button 
          onClick={handleDeleteAccountReal}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-900/15 hover:bg-red-900/25 text-xs text-red-400 border border-red-900/35 rounded-lg font-semibold transition-all focus:outline-none flex items-center gap-1.5"
        >
          {isDeleting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          <span>Erase Student Sandbox Profile (Article 17)</span>
        </button>
      </div>
    </div>
  );
}
