import { BookOpen, Award, Flame, Cpu, FolderDot, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Project, Lesson, Progress, Subscription } from '../types';
import OnboardingChecklist from './OnboardingChecklist';

interface DashboardHomeProps {
  profile: { full_name: string; education_level: string };
  subscription: Subscription | null;
  projects: Project[];
  lessons: Lesson[];
  progress: Progress[];
  onNavigate: (tab: string, arg?: any) => void;
}

export default function DashboardHome({ profile, subscription, projects, lessons, progress, onNavigate }: DashboardHomeProps) {
  // Calculations
  const isPro = subscription?.plan === 'pro';
  const completedLessonsCount = progress.filter(p => p.completion_percentage >= 100).length;
  const overallProgressPercent = lessons.length > 0 ? Math.round((completedLessonsCount / lessons.length) * 100) : 0;
  
  const totalProjects = projects.length;
  const activeStreak = 5; // Fixed mockup coding streak
  const queryUsage = isPro ? "Unlimited" : `${Math.max(0, 15 - (progress.length * 2))} / 15`;

  // Recommended lessons (beginner/intermediate/advanced based on level)
  const getRecs = () => {
    const level = profile.education_level.toLowerCase();
    if (level === 'advanced') {
      return lessons.filter(l => l.difficulty === 'advanced' || l.difficulty === 'intermediate');
    }
    return lessons.filter(l => l.difficulty === 'beginner' || l.difficulty === 'intermediate');
  };
  const recommended = getRecs().slice(0, 2);

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Welcome Hero Banner Card */}
      <div className="relative bg-gradient-to-r from-zinc-950 via-purple-950/20 to-zinc-950 rounded-2xl border border-purple-900/30 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-700/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-950/80 border border-purple-800/40 px-2.5 py-1 rounded-full text-[10px] text-purple-300 font-mono mb-4">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>{profile.education_level} Track Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.full_name}!
            </h1>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl">
              Ready to construct your next software milestone? Your personal AI Coding Mentor is active. Dive into courses, inspect Pointer allocation, or reviews security bugs.
            </p>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-4 shrink-0 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-purple-950/80 border border-purple-800/30 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">CODING STREAK</p>
              <p className="text-xl font-bold">{activeStreak} Days Strong</p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Hub Connection Promos */}
      <div className="bg-gradient-to-r from-purple-950/20 via-zinc-950 to-purple-950/20 border border-purple-900/25 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-800/20 flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono text-purple-300 uppercase tracking-widest">Workspace Lab Connectivity Enabled</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Explore active curriculums, draft and transmit student reports, and sync files safely to Google Drive storage.</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('workspace')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-xs font-bold rounded-lg shrink-0 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Connect Google APIs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Course Progress Card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Curriculum Progress</p>
              <p className="text-2xl font-bold mt-2">{completedLessonsCount} / {lessons.length}</p>
              <p className="text-xs text-zinc-400 mt-1">Lessons completed</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          
          {/* Progress bar visual */}
          <div className="mt-6">
            <div className="flex justify-between text-[11px] font-mono text-zinc-500 mb-1">
              <span>Progress</span>
              <span>{overallProgressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${overallProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* AI Limit Indicator */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">AI Tutor Queries</p>
              <p className="text-2xl font-bold mt-2">{queryUsage}</p>
              <p className="text-xs text-zinc-400 mt-1">Daily limits remaining</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-2 text-[11px] text-zinc-400 font-mono">
              <span className={`w-2 h-2 rounded-full ${isPro ? 'bg-emerald-500' : 'bg-yellow-500 animate-pulse'}`}></span>
              <span>{isPro ? 'Unlimited developer tools active' : '15 messages/day limit'}</span>
            </div>
          </div>
        </div>

        {/* Active Projects Tracker */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Active Sandbox</p>
              <p className="text-2xl font-bold mt-2">{totalProjects} / {isPro ? '∞' : '3'}</p>
              <p className="text-xs text-zinc-400 mt-1">Active folder workspaces</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <FolderDot className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (totalProjects / (isPro ? 20 : 3)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pro Plan Indicator */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Subscription Tier</p>
              <p className="text-2xl font-bold mt-2">{isPro ? 'Pro Elite' : 'Free Tier'}</p>
              <p className="text-xs text-zinc-400 mt-1">{isPro ? 'Premium academic seat' : 'Basic CS access'}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-[11px] font-mono text-zinc-400">Manage plan</span>
            <button 
              onClick={() => onNavigate('billing')} 
              className="text-[11px] font-mono font-semibold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center space-x-1"
            >
              <span>Upgrade</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Onboarding Checklist Tracker */}
      <OnboardingChecklist 
        projectsCount={totalProjects} 
        hasGoogleConnected={true} 
        isPro={isPro} 
        onNavigate={onNavigate} 
      />

      {/* Main Sections: Recent Projects + Curriculum Recommendations */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Workspace Projects */}
        <div className="lg:col-span-3 bg-zinc-950 border border-zinc-900 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold tracking-tight">Active Workspaces</h2>
              <button 
                onClick={() => onNavigate('projects')} 
                className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
              >
                View Workspaces
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-900 rounded-lg">
                <FolderDot className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm font-medium">No active workspaces</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">Create a coding folder to build academic assignments and structure templates with AI.</p>
                <button 
                  onClick={() => onNavigate('projects')} 
                  className="mt-4 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs rounded border border-zinc-800 transition-colors"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 3).map((proj, idx) => (
                  <div key={idx} className="bg-zinc-900/40 border border-zinc-900/60 rounded-lg p-4 hover:border-purple-950 transition-all flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-200">{proj.name}</h3>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-1">{proj.description || "No project overview set."}</p>
                    </div>
                    <button 
                      onClick={() => onNavigate('projects', proj)} 
                      className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 text-[11px] font-mono border border-zinc-800 hover:border-purple-900 rounded transition-all"
                    >
                      Open Assistant
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {!isPro && projects.length >= 3 && (
            <div className="mt-6 bg-purple-950/20 border border-purple-900/30 rounded-lg p-3 text-xs text-purple-300 flex items-center justify-between">
              <span>You have reached the Free Plan limit of 3 projects.</span>
              <button onClick={() => onNavigate('billing')} className="text-[11px] font-bold underline text-white hover:text-purple-200 transition-colors">Upgrade</button>
            </div>
          )}
        </div>

        {/* Suggested Lessons */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold tracking-tight">Curriculum Recommends</h2>
            <button 
              onClick={() => onNavigate('learn')} 
              className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
            >
              Browse Catalog
            </button>
          </div>

          <div className="space-y-4">
            {recommended.map((less, i) => {
              const lessProg = progress.find(p => p.lesson_id === less.id);
              const isCompleted = lessProg && lessProg.completion_percentage >= 100;

              return (
                <div key={i} className="group bg-zinc-900/30 border border-zinc-900 rounded-lg p-4 hover:border-zinc-800 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-purple-400 px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-900/40">
                      {less.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 capitalize">{less.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-200 mt-2.5 group-hover:text-purple-400 transition-colors">
                    {less.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{less.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 border-t border-zinc-900/60 pt-3">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {isCompleted ? '✓ Completed' : '• Pending start'}
                    </span>
                    <button 
                      onClick={() => onNavigate('learn', less)} 
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center space-x-1"
                    >
                      <span>Study</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
