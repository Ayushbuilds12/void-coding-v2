import { useState, useEffect } from 'react';
import { ShieldAlert, Check, Settings, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [withdrawnMsg, setWithdrawnMsg] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('void_cookie_consent');
    if (!saved) {
      // Gentle delayed entrance
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (updatedPrefs: typeof preferences) => {
    const payload = {
      preferences: updatedPrefs,
      version: "v1.4.2",
      timestamp: new Date().toISOString(),
      countryCode: "EU-GDPR"
    };
    localStorage.setItem('void_cookie_consent', JSON.stringify(payload));
    setShow(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    const all = { essential: true, functional: true, analytics: true, marketing: true };
    setPreferences(all);
    saveConsent(all);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleRejectNonEssential = () => {
    const minimal = { essential: true, functional: false, analytics: false, marketing: false };
    setPreferences(minimal);
    saveConsent(minimal);
  };

  const handleWithdrawConsent = () => {
    localStorage.removeItem('void_cookie_consent');
    setWithdrawnMsg(true);
    setPreferences({ essential: true, functional: false, analytics: false, marketing: false });
    setTimeout(() => {
      setWithdrawnMsg(false);
      setShow(true);
    }, 2000);
  };

  // Allow trigger check via global event for testing withdrawal
  useEffect(() => {
    const checkWithdrawal = () => {
      setShow(true);
    };
    window.addEventListener('void-trigger-cookie-settings', checkWithdrawal);
    return () => window.removeEventListener('void-trigger-cookie-settings', checkWithdrawal);
  }, []);

  if (withdrawnMsg) {
    return (
      <div className="fixed bottom-5 left-5 right-5 md:left-auto md:max-w-md z-50 bg-zinc-950/95 backdrop-blur-md border border-red-900/40 rounded-2xl p-5 shadow-2xl text-white animate-fadeIn">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-red-400 animate-spin" />
          <div>
            <h4 className="font-sans font-bold text-xs text-red-300">Consent Withdrawn</h4>
            <p className="text-[10px] text-zinc-400 mt-0.5">Clearing local tracking identifiers. Re-establishing standard privacy blocks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!show) {
    // Hidden, but provide a tiny persistent "Privacy" icon in the bottom left to trigger withdrawal/customization!
    return (
      <button 
        onClick={() => setShow(true)}
        title="GDPR Cookie Preferences"
        id="cookie-settings-trigger"
        className="fixed bottom-4 left-4 z-40 p-2.5 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-900 text-zinc-500 hover:text-purple-400 rounded-full transition-all shadow-lg text-[10px] flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
      >
        <ShieldCheck className="w-4 h-4" />
        <span className="hidden sm:inline font-mono tracking-widest uppercase">GDPR Privacy</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 right-5 md:left-auto md:max-w-md z-50 bg-zinc-950/95 backdrop-blur-md border border-zinc-900 rounded-2xl p-5 shadow-2xl text-white animate-fadeIn">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-950/60 border border-purple-900/40 rounded-lg text-purple-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h4 className="font-sans font-bold text-sm text-zinc-100">GDPR Privacy Consent</h4>
              <span className="text-[9px] font-mono text-purple-400 border border-purple-900/50 bg-purple-950/30 px-1.5 py-0.5 rounded">v1.4.2</span>
            </div>
            <p className="text-xs text-zinc-400 leading-normal mt-1">
              Void uses cookie-analytical tokens to personalize prompts, maintain sandbox code sessions, and securely analyze line compilations.
            </p>
          </div>
        </div>

        {showPreferences ? (
          <div className="space-y-3 bg-black/40 border border-zinc-900 rounded-xl p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-300 block">Essential Cookies</span>
                <span className="text-[10px] text-zinc-500">Logins, account states & secure session keys</span>
              </div>
              <input type="checkbox" checked disabled className="accent-purple-500 rounded bg-zinc-900" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-300 block">Functional Presets</span>
                <span className="text-[10px] text-zinc-500">Remembers editor layout configs & font preferences</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.functional} 
                onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                className="accent-purple-500 rounded" 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-300 block">Analytical Telemetry</span>
                <span className="text-[10px] text-zinc-500">Tracks lesson speeds, compiler run histories, and error trends</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.analytics} 
                onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                className="accent-purple-500 rounded" 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-300 block">Marketing Promotion</span>
                <span className="text-[10px] text-zinc-500">Refines targeted discount announcements inside dashboard tabs</span>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.marketing} 
                onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                className="accent-purple-500 rounded" 
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleSavePreferences}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 font-bold text-[11px] rounded transition-all uppercase tracking-wider"
              >
                Save Preferences
              </button>
              <button 
                onClick={() => setShowPreferences(false)}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-[11px] rounded transition-all uppercase text-zinc-400"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex gap-2">
                <button 
                  onClick={handleAcceptAll}
                  className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-purple-950"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
                <button 
                  onClick={handleRejectNonEssential}
                  className="flex-1 py-2 px-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold transition-all"
                >
                  Reject Optional
                </button>
              </div>
              
              <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 mt-1">
                <button 
                  onClick={() => setShowPreferences(true)}
                  className="hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  <span>Configure Preferences</span>
                </button>
                
                {localStorage.getItem('void_cookie_consent') && (
                  <button 
                    onClick={handleWithdrawConsent}
                    className="hover:text-red-400 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>Withdraw Consent</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
