import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FolderDot, BookOpen, Sparkles, Cpu, CreditCard, Settings, 
  LogOut, Menu, X, Award, Download, Cloud, Activity, BookText, FileHeart, ShieldCheck,
  Github, Layers
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import AuthView from './components/AuthView';
import DashboardHome from './components/DashboardHome';
import ProjectsView from './components/ProjectsView';
import LearnView from './components/LearnView';
import CodeReviewView from './components/CodeReviewView';
import MentorView from './components/MentorView';
import BillingView from './components/BillingView';
import SettingsView from './components/SettingsView';
import WorkspaceView from './components/WorkspaceView';
import VoidStudio from './components/VoidStudio';

// Academic Sync modules
import Templates from './components/Templates';
import GitHubConnect from './components/GitHubConnect';
import SecurityDashboard from './components/SecurityDashboard';

// Launch Prep Systems
import OnboardingFlow from './components/OnboardingFlow';
import ProductAnalytics, { logAnalyticsEvent } from './components/ProductAnalytics';
import BlogSystem from './components/BlogSystem';
import DocSystem from './components/DocSystem';
import LaunchAdminDashboard from './components/LaunchAdminDashboard';
import CookieConsent from './components/CookieConsent';

import { Profile, Subscription, Project, Lesson, Progress } from './types';

type ScreenState = 'landing' | 'auth' | 'app';
type TabState = 'dashboard' | 'projects' | 'learn' | 'review' | 'mentor' | 'workspace' | 'billing' | 'settings' | 'builder' | 'analytics' | 'blog' | 'docs' | 'launch' | 'templates' | 'github' | 'security';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('landing');
  const [tab, setTab] = useState<TabState>('dashboard');
  const [subdomain, setSubdomain] = useState<'www' | 'app'>('www');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Auth states
  const [token, setToken] = useState<string>('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [trialStatus, setTrialStatus] = useState<any>(null);

  // Data catalogs states
  const [projects, setProjects] = useState<Project[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);

  // Navigation argument passes (like clicking 'Open Project' in home)
  const [navArg, setNavArg] = useState<any>(null);

  // Responsive sidebar toggles
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // PWA Install Prompt State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Auto auth check on mount & PWA setup
  useEffect(() => {
    const storedToken = localStorage.getItem('void_auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchInitialData(storedToken);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Fetch active SaaS trial status on token change
  useEffect(() => {
    if (token) {
      fetch('/api/trial/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (!data.error) setTrialStatus(data);
        })
        .catch(console.error);
    } else {
      setTrialStatus(null);
    }
  }, [token, subscription]);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const fetchInitialData = async (authToken: string) => {
    try {
      // Sync profile & subscription
      const profileRes = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!profileRes.ok) {
        // Token stale
        handleLogout();
        return;
      }
      const profileData = await profileRes.json();
      setProfile(profileData);

      const subRes = await fetch('/api/billing/subscription', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData);
      }

      // Sync curriculum lessons catalog
      const lessonsRes = await fetch('/api/lessons');
      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData);
      }

      // Sync completed progress list
      const progressRes = await fetch('/api/progress', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }

      // Sync folders/projects
      const projRes = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }

      // Everything loaded correctly, switch to dashboard app
      setScreen('app');
      setSubdomain('app');
    } catch (e) {
      console.error(e);
      handleLogout();
    }
  };

  const handleAuthSuccess = (newToken: string, newProfile: Profile) => {
    localStorage.setItem('void_auth_token', newToken);
    setToken(newToken);
    setProfile(newProfile);
    
    const onboardingDone = localStorage.getItem('void_onboarding_completed') === 'true';
    if (!onboardingDone) {
      setShowOnboarding(true);
    }
    
    fetchInitialData(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('void_auth_token');
    setToken('');
    setProfile(null);
    setSubscription(null);
    setProjects([]);
    setProgress([]);
    setScreen('landing');
    setTab('dashboard');
  };

  // Callback to sync folder list updates
  const handleRefreshProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        return data;
      }
    } catch (e) {
      console.error(e);
    }
    return projects;
  };

  // Callback to sync lesson progress
  const handleRefreshProgress = async () => {
    try {
      const res = await fetch('/api/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Callback to sync billing/subscription status
  const handleRefreshSubscription = async () => {
    try {
      const res = await fetch('/api/billing/subscription', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNavigateArg = (targetTab: string, argument?: any) => {
    setNavArg(argument || null);
    setTab(targetTab as TabState);
    setMobileSidebarOpen(false);
  };

  // --- COMPONENT SELECTION MATCHER ---
  const renderAppTab = () => {
    if (!profile) return null;
    
    switch (tab) {
      case 'dashboard':
        return (
          <DashboardHome 
            profile={profile} 
            subscription={subscription} 
            projects={projects} 
            lessons={lessons} 
            progress={progress}
            onNavigate={handleNavigateArg}
          />
        );
      case 'projects':
        return (
          <ProjectsView 
            token={token} 
            initialSelectedProject={navArg} 
            onRefreshProjects={handleRefreshProjects}
            projects={projects}
          />
        );
      case 'learn':
        return (
          <LearnView 
            token={token} 
            initialSelectedLesson={navArg} 
            lessons={lessons} 
            progress={progress} 
            onRefreshProgress={handleRefreshProgress}
          />
        );
      case 'review':
        return <CodeReviewView token={token} />;
      case 'mentor':
        return <MentorView token={token} profile={profile} />;
      case 'builder':
        return (
          <VoidStudio 
            token={token} 
            subscription={subscription} 
            projects={projects} 
            onRefreshProjects={handleRefreshProjects}
          />
        );
      case 'workspace':
        return <WorkspaceView token={token} />;
      case 'billing':
        return (
          <BillingView 
            token={token} 
            subscription={subscription} 
            onRefreshSubscription={handleRefreshSubscription}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            token={token} 
            profile={profile} 
            onRefreshProfile={async () => {
              const res = await fetch('/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) setProfile(await res.json());
            }} 
            onLogout={handleLogout}
          />
        );
      case 'analytics':
        return <ProductAnalytics />;
      case 'blog':
        return <BlogSystem />;
      case 'docs':
        return <DocSystem />;
      case 'launch':
        return <LaunchAdminDashboard token={token} />;
      case 'templates':
        return <Templates token={token} onUseTemplate={(tplName) => handleNavigateArg('builder', tplName)} />;
      case 'github':
        return <GitHubConnect token={token} />;
      case 'security':
        return <SecurityDashboard token={token} />;
      default:
        return null;
    }
  };

  const handleOnboardingComplete = async (selections: { goal: string; googleConnected: boolean; projectName: string }) => {
    localStorage.setItem('void_onboarding_completed', 'true');
    setShowOnboarding(false);
    
    if (selections.projectName && token) {
      try {
        await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: selections.projectName,
            description: `Academic assignment generated during onboarding for track: ${selections.goal}`
          })
        });
        handleRefreshProjects();
      } catch (e) {
        console.error("Onboarding project creation failed:", e);
      }
    }
  };

  const renderSubdomainSwitcher = () => (
    <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2.5 text-center text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-50">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
        <span className="font-mono text-[10px] md:text-xs text-zinc-400">
          {subdomain === 'www' ? (
            <span>Host: <strong className="text-purple-400 font-bold uppercase">voidcoding.com</strong> (Marketing Platform)</span>
          ) : (
            <span>Host Subdomain: <strong className="text-purple-400 font-bold uppercase">app.voidcoding.com</strong> (SaaS Student Dashboard)</span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => {
            setSubdomain('www');
            setScreen('landing');
          }}
          className={`px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border rounded-md transition-all ${
            subdomain === 'www' 
              ? 'bg-purple-950 border-purple-500 text-purple-300' 
              : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-500'
          }`}
        >
          www (Marketing)
        </button>
        <button 
          onClick={() => {
            setSubdomain('app');
            if (!token) {
              setScreen('auth');
            } else {
              setScreen('app');
            }
          }}
          className={`px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border rounded-md transition-all ${
            subdomain === 'app' 
              ? 'bg-purple-950 border-purple-500 text-purple-300' 
              : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-500'
          }`}
        >
          app (SaaS Portal)
        </button>
      </div>
    </div>
  );

  // --- SCREEN RENDERS ---
  if (subdomain === 'www' || screen === 'landing') {
    return (
      <div className="min-h-screen bg-black flex flex-col relative">
        {renderSubdomainSwitcher()}
        <div className="flex-1">
          <LandingPage 
            onGetStarted={() => {
              setSubdomain('app');
              if (!token) setScreen('auth');
              else setScreen('app');
            }} 
            onLogin={() => {
              setSubdomain('app');
              if (!token) setScreen('auth');
              else setScreen('app');
            }} 
            onInstallApp={handleInstallApp}
            installPrompt={installPrompt}
          />
        </div>
        <CookieConsent />
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <div className="min-h-screen bg-black flex flex-col relative">
        {renderSubdomainSwitcher()}
        <div className="flex-1 flex items-center justify-center">
          <AuthView 
            onAuthSuccess={handleAuthSuccess} 
            onBackToLanding={() => {
              setSubdomain('www');
              setScreen('landing');
            }} 
          />
        </div>
        <CookieConsent />
      </div>
    );
  }

  const isPro = subscription?.plan === 'pro';

  // Master workspace template framework
  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-purple-900 selection:text-white relative">
      {renderSubdomainSwitcher()}
      
      <div className="flex-1 flex min-h-0 relative">
        {/* GLOWS ambient lights */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 border-r border-zinc-900 flex-col justify-between shrink-0 h-screen sticky top-0 bg-black z-30">
        
        {/* Brand container */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-800 to-indigo-950 border border-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-950/20">
              <span className="font-mono font-black text-white text-sm tracking-widest">V</span>
            </div>
            <div>
              <h2 className="font-sans font-bold text-sm tracking-wider uppercase leading-none">VOID CODING</h2>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mt-1">SaaS ACADEMY</span>
            </div>
          </div>

          {/* Nav Item list */}
          <nav className="space-y-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            <button 
              onClick={() => handleNavigateArg('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'dashboard' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('projects')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'projects' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <FolderDot className="w-4 h-4" />
              <span>Workspaces</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('learn')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'learn' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>CS Curriculum</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('review')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'review' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Auditor</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('mentor')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'mentor' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <Cpu className="w-4 h-4" />
              <span>AI Mentor Chat</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('builder')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'builder' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-bold">Void Studio</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('workspace')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'workspace' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <Cloud className="w-4 h-4" />
              <span>Google Hub</span>
            </button>

            <div className="pt-3 pb-1">
              <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-600 block pl-3 uppercase">ACADEMIC GATEWAY</span>
            </div>
            <button 
              onClick={() => handleNavigateArg('templates')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'templates' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Layout Library</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('github')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'github' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <Github className="w-4 h-4 text-zinc-300" />
              <span>GitHub Sync</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('security')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'security' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security Audit</span>
            </button>

            <button 
              onClick={() => handleNavigateArg('billing')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'billing' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'settings' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <div className="pt-4 pb-1">
              <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-600 block pl-3 uppercase">LAUNCH PREPARATION</span>
            </div>

            <button 
              onClick={() => handleNavigateArg('launch')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'launch' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Launch Board</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('analytics')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'analytics' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>SaaS Analytics</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('blog')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'blog' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <BookText className="w-4 h-4 text-indigo-400" />
              <span>SEO Blog</span>
            </button>
            <button 
              onClick={() => handleNavigateArg('docs')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all focus:outline-none ${tab === 'docs' ? 'bg-zinc-900/60 text-white border-l-2 border-purple-500' : 'hover:bg-zinc-900/30 hover:text-zinc-200'}`}
            >
              <BookOpen className="w-4 h-4 text-zinc-400" />
              <span>API & Policies</span>
            </button>
          </nav>
        </div>

        {/* Install companion app CTA */}
        {installPrompt && (
          <div className="px-4 pb-2">
            <button
              onClick={handleInstallApp}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 hover:from-purple-900/30 hover:to-indigo-900/30 border border-purple-500/25 hover:border-purple-500/40 text-purple-300 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all animate-pulse cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 animate-bounce" />
              <span>Install Companion</span>
            </button>
          </div>
        )}

        {/* User Card info container bottom */}
        <div className="p-4 border-t border-zinc-900">
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-950 flex items-center justify-center font-bold text-xs border border-purple-900/40">
                {profile?.full_name?.charAt(0) || 'S'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-zinc-200 truncate">{profile?.full_name}</p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className={`text-[8px] font-mono font-bold px-1 rounded uppercase ${
                    isPro ? 'bg-purple-950 text-purple-300' : 'bg-zinc-850 text-zinc-500'
                  }`}>
                    {isPro ? 'Pro' : 'Free'}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono truncate">{profile?.education_level.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-1.5 hover:bg-zinc-900 text-[10px] font-mono text-zinc-500 hover:text-red-400 rounded transition-colors focus:outline-none"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>DISCONNECT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BAR HEADER */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden border-b border-zinc-900 px-6 py-4 flex justify-between items-center bg-black z-30 relative">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-800 to-indigo-950 flex items-center justify-center">
              <span className="font-mono text-xs font-black text-white">V</span>
            </div>
            <h2 className="font-sans font-bold text-sm tracking-wider">VOID CODING</h2>
          </div>

          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 hover:bg-zinc-900 border border-zinc-900 rounded text-zinc-400 focus:outline-none"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* MOBILE SIDEBAR DROPDOWN */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-zinc-950 border-b border-zinc-900 p-6 space-y-6 animate-fadeIn absolute left-0 right-0 top-14 z-40 shadow-2xl">
            <nav className="space-y-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              <button onClick={() => handleNavigateArg('dashboard')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'dashboard' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button onClick={() => handleNavigateArg('projects')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'projects' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <FolderDot className="w-4 h-4" />
                <span>Workspaces</span>
              </button>
              <button onClick={() => handleNavigateArg('learn')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'learn' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <BookOpen className="w-4 h-4" />
                <span>CS Curriculum</span>
              </button>
              <button onClick={() => handleNavigateArg('review')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'review' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <Sparkles className="w-4 h-4" />
                <span>AI Auditor</span>
              </button>
              <button onClick={() => handleNavigateArg('mentor')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'mentor' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <Cpu className="w-4 h-4" />
                <span>AI Mentor Chat</span>
              </button>
              <button onClick={() => handleNavigateArg('builder')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'builder' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 font-bold">Void Studio</span>
              </button>
              <button onClick={() => handleNavigateArg('workspace')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'workspace' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <Cloud className="w-4 h-4" />
                <span>Google Hub</span>
              </button>
              <button onClick={() => handleNavigateArg('templates')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'templates' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Layout Library</span>
              </button>
              <button onClick={() => handleNavigateArg('github')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'github' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <Github className="w-4 h-4 text-zinc-300" />
                <span>GitHub Sync</span>
              </button>
              <button onClick={() => handleNavigateArg('security')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'security' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Security Audit</span>
              </button>
              <button onClick={() => handleNavigateArg('billing')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'billing' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <CreditCard className="w-4 h-4" />
                <span>Billing</span>
              </button>
              <button onClick={() => handleNavigateArg('settings')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'settings' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button onClick={() => handleNavigateArg('launch')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'launch' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Launch Board</span>
              </button>
              <button onClick={() => handleNavigateArg('analytics')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'analytics' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Analytics</span>
              </button>
              <button onClick={() => handleNavigateArg('blog')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'blog' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>SEO Blog</span>
              </button>
              <button onClick={() => handleNavigateArg('docs')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left ${tab === 'docs' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-900/55'}`}>
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span>API & Policies</span>
              </button>
            </nav>

            <div className="border-t border-zinc-900 pt-4 flex justify-between items-center text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Logged: {profile?.full_name?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="text-red-400 font-bold hover:underline">DISCONNECT</button>
            </div>
          </div>
        )}

        {/* Trial Reminder Banner */}
        {!isPro && trialStatus && (
          <div className="bg-purple-950/40 border-b border-purple-900/40 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span className="font-sans text-[11px]">
                You are on a <strong>14-Day Free Academy Trial</strong>. <strong>{trialStatus.daysRemaining} days remaining</strong>. Enjoy unrestricted visual compile reviews!
              </span>
            </div>
            <button 
              onClick={() => handleNavigateArg('billing')}
              className="mt-2 sm:mt-0 px-3.5 py-1 bg-purple-600 hover:bg-purple-700 text-[10px] font-bold text-white rounded uppercase tracking-wider transition-all"
            >
              Upgrade to Pro Elite
            </button>
          </div>
        )}

        {/* MAIN APPLICATION CORE WRAPPER SECTION */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderAppTab()}
        </main>

      </div>
      </div>

      {/* Dynamic Overlays */}
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete} 
          onClose={() => setShowOnboarding(false)} 
        />
      )}
      <CookieConsent />
    </div>
  );
}
