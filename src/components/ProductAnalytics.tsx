import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, MessageSquare, Laptop, Box, 
  ArrowUpRight, DollarSign, Activity, RefreshCw 
} from 'lucide-react';

export interface AnalyticsEvent {
  id: string;
  type: 'signup' | 'chat_message' | 'website_generated' | 'scene_generated' | 'upgrade';
  timestamp: string;
  userEmail: string;
}

export default function ProductAnalytics() {
  const [stats, setStats] = useState({
    dailyActive: 142,
    weeklyActive: 894,
    monthlyActive: 3120,
    conversionRate: 4.8,
    totalRevenue: 249500,
    chatUsage: 4510,
    webGenerations: 612,
    sceneGenerations: 382,
    upgrades: 89
  });

  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    // Generate some mock historical analytics data and merge with live recorded events
    const generateEvents = () => {
      const types: Array<AnalyticsEvent['type']> = ['signup', 'chat_message', 'website_generated', 'scene_generated', 'upgrade'];
      const emails = ['user.one@btech.edu', 'code.master@gmail.com', 'startup_founder@io.co', 'delhi.cs@academy.in', 'pune.student@college.org'];
      const events: AnalyticsEvent[] = [];
      
      for (let i = 0; i < 8; i++) {
        events.push({
          id: `ev_${Date.now() - i * 180000}`,
          type: types[Math.floor(Math.random() * types.length)],
          timestamp: new Date(Date.now() - i * 180000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          userEmail: emails[Math.floor(Math.random() * emails.length)]
        });
      }
      setRecentEvents(events);
    };

    generateEvents();

    // Load dynamic tracker from local storage if any
    const stored = localStorage.getItem('void_live_analytics_events');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentEvents(prev => [...parsed, ...prev].slice(0, 10));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Utility to let users simulate metric changes or reload
  const handleRefresh = () => {
    setStats(prev => ({
      ...prev,
      dailyActive: prev.dailyActive + Math.floor(Math.random() * 5),
      chatUsage: prev.chatUsage + Math.floor(Math.random() * 2),
      totalRevenue: prev.totalRevenue + (Math.random() > 0.8 ? 499 : 0)
    }));
  };

  return (
    <div className="space-y-6 text-white bg-black p-6 rounded-2xl border border-zinc-900 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span>Product Analytics Center</span>
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">Real-time telemetric tracking & conversion dashboard</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-mono rounded flex items-center gap-1.5 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Force Refresh logs</span>
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4.5 space-y-1 relative">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Active Audience</span>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">{stats.dailyActive}</div>
          <p className="text-[10px] text-zinc-500 font-mono">
            Weekly: <span className="text-zinc-300">{stats.weeklyActive}</span> • Monthly: <span className="text-zinc-300">{stats.monthlyActive}</span>
          </p>
          <div className="absolute top-4 right-4 p-1.5 bg-purple-950/40 border border-purple-900/40 rounded text-purple-400">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4.5 space-y-1 relative">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">SaaS Revenue (INR)</span>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">₹{(stats.totalRevenue).toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% MRR Growth rate</span>
          </p>
          <div className="absolute top-4 right-4 p-1.5 bg-emerald-950/40 border border-emerald-900/40 rounded text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4.5 space-y-1 relative">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">AI Chat Queries</span>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">{stats.chatUsage}</div>
          <p className="text-[10px] text-zinc-500 font-mono">
            Avg: <span className="text-zinc-300">14.5 queries</span> per user session
          </p>
          <div className="absolute top-4 right-4 p-1.5 bg-indigo-950/40 border border-indigo-900/40 rounded text-indigo-400">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4.5 space-y-1 relative">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Conversion Rate</span>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">{stats.conversionRate}%</div>
          <p className="text-[10px] text-zinc-500 font-mono">
            Upgrades: <span className="text-purple-400 font-bold">{stats.upgrades}</span> elite users
          </p>
          <div className="absolute top-4 right-4 p-1.5 bg-purple-950/40 border border-purple-900/40 rounded text-purple-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Feature Generations Chart Map Block */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-zinc-950/30 border border-zinc-900 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Feature Usage Breakdown</h3>
          
          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1.5 text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-purple-400" />
                  <span>Void Studio Website Generations</span>
                </span>
                <span className="font-mono text-zinc-200">{stats.webGenerations} builds</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interactive 3D Scene Generations</span>
                </span>
                <span className="font-mono text-zinc-200">{stats.sceneGenerations} loads</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-300" />
                  <span>AI Assistant Chats Completed</span>
                </span>
                <span className="font-mono text-zinc-200">{stats.chatUsage} cycles</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-purple-950/10 border border-purple-900/10 rounded-lg text-[10px] text-purple-300 leading-normal">
            <strong>Conversion Funnel Optimization Note:</strong> Website generation is currently your highest-converting user engagement loop. We suggest adding a Pro modal CTA inside Void Studio templates.
          </div>
        </div>

        {/* Live event logger */}
        <div className="bg-zinc-950/30 border border-zinc-900 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Live Event Stream</h3>
          
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {recentEvents.map((ev) => (
              <div key={ev.id} className="flex justify-between items-start text-[10px] bg-black/40 border border-zinc-900/60 p-2 rounded-lg gap-2">
                <div>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ev.type === 'upgrade' ? 'bg-emerald-500 animate-ping' :
                      ev.type === 'signup' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></span>
                    <span className="font-mono text-zinc-300 capitalize">{ev.type.replace('_', ' ')}</span>
                  </div>
                  <span className="text-zinc-500 block truncate max-w-[150px] mt-0.5">{ev.userEmail}</span>
                </div>
                <span className="text-zinc-600 font-mono shrink-0">{ev.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

// Global logger helper
export function logAnalyticsEvent(type: AnalyticsEvent['type'], userEmail: string = 'guest@voidcoding.com') {
  try {
    const existingStr = localStorage.getItem('void_live_analytics_events');
    const existing: AnalyticsEvent[] = existingStr ? JSON.parse(existingStr) : [];
    
    const newEvent: AnalyticsEvent = {
      id: `ev_${Date.now()}`,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      userEmail
    };

    const updated = [newEvent, ...existing].slice(0, 15);
    localStorage.setItem('void_live_analytics_events', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to write event log', e);
  }
}
