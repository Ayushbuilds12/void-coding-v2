import { useState, useEffect } from 'react';
import { CheckSquare, Square, Trophy, Sparkles, ArrowRight, Check } from 'lucide-react';

interface OnboardingChecklistProps {
  projectsCount: number;
  hasGoogleConnected: boolean;
  isPro: boolean;
  onNavigate: (tab: string) => void;
}

export default function OnboardingChecklist({ projectsCount, hasGoogleConnected, isPro, onNavigate }: OnboardingChecklistProps) {
  // Let's track active checklist status from localStorage or compute dynamically
  const [checklist, setChecklist] = useState({
    createProject: false,
    startChat: false,
    uploadFile: false,
    generateWebsite: false,
    create3dScene: false,
    connectDrive: false,
    connectGmail: false,
    connectClassroom: false,
    upgradePro: false
  });

  useEffect(() => {
    // Dynamic checks
    setChecklist(prev => ({
      ...prev,
      createProject: projectsCount > 0,
      connectDrive: hasGoogleConnected,
      connectGmail: hasGoogleConnected,
      connectClassroom: hasGoogleConnected,
      upgradePro: isPro
    }));

    const saved = localStorage.getItem('void_onboarding_checklist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChecklist(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error(e);
      }
    }
  }, [projectsCount, hasGoogleConnected, isPro]);

  const toggleCheck = (key: keyof typeof checklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    localStorage.setItem('void_onboarding_checklist', JSON.stringify(updated));
  };

  const items = [
    { key: 'createProject' as const, label: 'Create first project', action: () => onNavigate('projects'), desc: 'Structure directories & boilerplate' },
    { key: 'startChat' as const, label: 'Start AI chat conversation', action: () => onNavigate('mentor'), desc: 'Ask about pointers or recursion' },
    { key: 'uploadFile' as const, label: 'Upload your first file sheet', action: () => onNavigate('mentor'), desc: 'Stash PDFs, py, or code structures' },
    { key: 'generateWebsite' as const, label: 'Generate first custom website', action: () => onNavigate('builder'), desc: 'Create HTML/CSS layouts via Void Studio' },
    { key: 'create3dScene' as const, label: 'Create first dynamic 3D scene', action: () => onNavigate('builder'), desc: 'Inspect pointer node networks' },
    { key: 'connectDrive' as const, label: 'Connect Google Drive storage', action: () => onNavigate('workspace'), desc: 'Sync files and lecture docs' },
    { key: 'connectGmail' as const, label: 'Connect Gmail classroom notifications', action: () => onNavigate('workspace'), desc: 'Fetch assignments updates' },
    { key: 'connectClassroom' as const, label: 'Connect Google Classroom hub', action: () => onNavigate('workspace'), desc: 'Analyze curriculum topics' },
    { key: 'upgradePro' as const, label: 'Upgrade to Pro Elite plan', action: () => onNavigate('billing'), desc: 'Unlock unlimited credits & GPU' }
  ];

  const total = items.length;
  const completedCount = items.filter(i => checklist[i.key]).length;
  const percentage = Math.round((completedCount / total) * 100);

  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-900/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900/80 pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-purple-950/40 border border-purple-900/40 flex items-center justify-center">
            <Trophy className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-zinc-100">SaaS Onboarding Tracker</h3>
            <p className="text-[10px] text-zinc-500 font-mono">Unlock full capabilities step-by-step</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-zinc-900/60 border border-zinc-850 px-3 py-1.5 rounded-lg">
          <span className="font-mono text-xs font-bold text-purple-400">{percentage}%</span>
          <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => {
          const isDone = checklist[it.key];

          return (
            <div 
              key={it.key}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isDone 
                  ? 'bg-purple-950/5 border-purple-900/20 text-zinc-300' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-850'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button 
                  onClick={() => toggleCheck(it.key)}
                  className="mt-0.5 text-purple-400 hover:text-purple-300 transition-colors focus:outline-none"
                >
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 fill-purple-950 text-purple-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <div className="flex-1">
                  <span className={`text-xs font-bold ${isDone ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {it.label}
                  </span>
                  <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">{it.desc}</p>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-zinc-900/60 flex justify-end">
                <button 
                  onClick={it.action}
                  className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-all"
                >
                  <span>Go to feature</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
