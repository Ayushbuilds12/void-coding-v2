import React, { useState } from 'react';
import { 
  Layers, Sparkles, Star, Search, Filter, Cpu, ArrowRight,
  Eye, Download, ShoppingBag, Terminal, Heart, Check, Compass, Code
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  stars: number;
  complexity: 'Beginner' | 'Intermediate' | 'Professional';
  author: string;
  avatarColor: string;
  bgGradient: string;
}

interface TemplatesProps {
  token: string;
  onUseTemplate?: (templateName: string) => void;
}

export default function Templates({ token, onUseTemplate }: TemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedTemplates, setLikedTemplates] = useState<string[]>([]);
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Layouts' },
    { id: 'ai-saas', label: 'AI SaaS' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'agency', label: 'Agency' },
    { id: 'ecommerce', label: 'Ecommerce' },
    { id: 'startup', label: 'Startup' },
    { id: 'lms', label: 'LMS' },
    { id: 'crm', label: 'CRM' },
    { id: 'blog', label: 'Blog' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'mobile-app', label: 'Mobile App' }
  ];

  const templatesList: Template[] = [
    {
      id: 't1',
      name: 'Void Cosmic SaaS Landing Page',
      category: 'ai-saas',
      description: 'Futuristic product landing page styled with deep slate grays, glowing neon shadows, and functional 3D canvas embeddings.',
      rating: 4.9,
      stars: 432,
      complexity: 'Professional',
      author: 'Void Core Team',
      avatarColor: 'bg-purple-650',
      bgGradient: 'from-purple-950/40 via-indigo-950/20 to-black'
    },
    {
      id: 't2',
      name: 'Executive Portfolio & Blog Hub',
      category: 'portfolio',
      description: 'Sleek dark portfolio featuring structured typography, custom navigation rails, integrated blog systems, and interactive CV sheets.',
      rating: 4.8,
      stars: 219,
      complexity: 'Beginner',
      author: 'Priya S.',
      avatarColor: 'bg-indigo-650',
      bgGradient: 'from-zinc-900/60 via-purple-950/15 to-black'
    },
    {
      id: 't3',
      name: 'Infinite Orbit Web3 Marketplace',
      category: 'ecommerce',
      description: 'NFT and digital goods storefront featuring integrated wallet prompts, grid asset cards, and dynamic filter controls.',
      rating: 4.9,
      stars: 387,
      complexity: 'Professional',
      author: 'Astra Studio',
      avatarColor: 'bg-emerald-600',
      bgGradient: 'from-emerald-950/40 via-zinc-950 to-black'
    },
    {
      id: 't4',
      name: 'BTech Computer Science Learning Portal',
      category: 'lms',
      description: 'Fully featured curriculum dashboard. Tracks lesson structures, quizzes, and displays compiler analytics widgets.',
      rating: 4.7,
      stars: 184,
      complexity: 'Intermediate',
      author: 'Void Edu Core',
      avatarColor: 'bg-amber-600',
      bgGradient: 'from-amber-950/30 via-zinc-950 to-black'
    },
    {
      id: 't5',
      name: 'Decentralized Analytics Dashboard',
      category: 'dashboard',
      description: 'Stately admin control panel. Features fully mock-grounded charts, custom analytics reports, and detailed security stats.',
      rating: 4.9,
      stars: 512,
      complexity: 'Professional',
      author: 'Void Core Team',
      avatarColor: 'bg-purple-650',
      bgGradient: 'from-purple-950/40 via-fuchsia-950/10 to-black'
    },
    {
      id: 't6',
      name: 'Vortex Creative Agency Canvas',
      category: 'agency',
      description: 'High-end layout featuring modular project cases, client reviews, 3D particles, and team member carousels.',
      rating: 4.8,
      stars: 156,
      complexity: 'Intermediate',
      author: 'Alex Chen',
      avatarColor: 'bg-pink-650',
      bgGradient: 'from-pink-950/30 via-zinc-950 to-black'
    },
    {
      id: 't7',
      name: 'Neural CRM Customer Relations',
      category: 'crm',
      description: 'Modern contact pipeline manager. Features timeline trackers, client card profiles, and dynamic messaging shortcuts.',
      rating: 4.6,
      stars: 128,
      complexity: 'Intermediate',
      author: 'SaaS Builder Lab',
      avatarColor: 'bg-cyan-600',
      bgGradient: 'from-cyan-950/30 via-zinc-950 to-black'
    },
    {
      id: 't8',
      name: 'Quantum Mobile App Showcase',
      category: 'mobile-app',
      description: 'Fully responsive mobile mockup showcase. Features custom sliding app preview frame, feature cards, and download buttons.',
      rating: 4.9,
      stars: 310,
      complexity: 'Professional',
      author: 'Void Core Team',
      avatarColor: 'bg-purple-650',
      bgGradient: 'from-purple-950/40 via-indigo-950/20 to-black'
    },
    {
      id: 't9',
      name: 'Vanguard Startup Hub',
      category: 'startup',
      description: 'Minimalist landing page with high-end typography designed for early stage startups raising seed funds.',
      rating: 4.7,
      stars: 145,
      complexity: 'Beginner',
      author: 'Vanguard Lab',
      avatarColor: 'bg-red-600',
      bgGradient: 'from-red-950/20 via-zinc-950 to-black'
    },
    {
      id: 't10',
      name: 'SEO Editorial Blog Framework',
      category: 'blog',
      description: 'Slightly serif-styled elegant blog framework with lightning fast loading layouts, tags, and newsletter prompts.',
      rating: 4.8,
      stars: 198,
      complexity: 'Beginner',
      author: 'Priya S.',
      avatarColor: 'bg-indigo-650',
      bgGradient: 'from-indigo-950/30 via-zinc-950 to-black'
    }
  ];

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedTemplates.includes(id)) {
      setLikedTemplates(prev => prev.filter(item => item !== id));
    } else {
      setLikedTemplates(prev => [...prev, id]);
    }
  };

  const handleUse = (template: Template) => {
    setLaunchingId(template.id);
    setTimeout(() => {
      setLaunchingId(null);
      if (onUseTemplate) {
        onUseTemplate(template.name);
      } else {
        alert(`Successfully launched "${template.name}" in your workspace. You can now configure this layout via the Void Studio Code Editor.`);
      }
    }, 1500);
  };

  const filteredTemplates = templatesList.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-purple-500" />
          <span>SaaS Layout Marketplace</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Select from our curated high-performance academic templates. Bootstrap full layouts in your workspace instantly.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search active templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-2 pl-10 pr-4 text-xs text-zinc-200 outline-none focus:border-purple-800"
          />
        </div>

        {/* Templates Count */}
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 shrink-0">
          <Compass className="w-4 h-4 text-purple-400" />
          <span>Displaying <strong>{filteredTemplates.length}</strong> verified layouts</span>
        </div>
      </div>

      {/* Category Horizontal Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none font-mono text-[10px] uppercase tracking-wider font-bold">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-2 rounded-lg border transition-all shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-purple-650/15 border-purple-500 text-purple-300'
                : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(tpl => {
          const isLiked = likedTemplates.includes(tpl.id);
          const isLaunching = launchingId === tpl.id;

          return (
            <div 
              key={tpl.id}
              className={`bg-gradient-to-br ${tpl.bgGradient} border border-zinc-900 hover:border-purple-900/50 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Card visual ambient lights */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-900/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div>
                {/* Header Tag + Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-900/30">
                    {tpl.category.replace('-', ' ')}
                  </span>
                  
                  <div className="flex items-center gap-1 text-[11px] text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{tpl.rating}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-purple-400 transition-colors line-clamp-1">
                  {tpl.name}
                </h3>
                
                {/* Author Info */}
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-5 h-5 rounded-full ${tpl.avatarColor} flex items-center justify-center text-[8px] font-bold text-white uppercase`}>
                    {tpl.author.charAt(0)}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">By {tpl.author}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed mt-4 line-clamp-3">
                  {tpl.description}
                </p>
              </div>

              {/* Action and specs footer */}
              <div className="mt-6 border-t border-zinc-900/60 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={(e) => handleLike(tpl.id, e)}
                    className={`p-1.5 rounded-lg border hover:bg-zinc-900/80 transition-colors ${
                      isLiked ? 'text-red-500 border-red-950 bg-red-950/10' : 'text-zinc-500 border-zinc-900'
                    }`}
                    title="Like layout"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
                  </button>
                  <span className="font-mono text-[9px] text-zinc-500">{tpl.stars + (isLiked ? 1 : 0)} Stars</span>
                </div>

                <button 
                  onClick={() => handleUse(tpl)}
                  disabled={isLaunching}
                  className="px-3.5 py-2 bg-purple-650 hover:bg-purple-700 disabled:bg-zinc-900 rounded-lg text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isLaunching ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Code className="w-3.5 h-3.5" />
                  )}
                  <span>{isLaunching ? 'Deploying...' : 'Use Template'}</span>
                </button>
              </div>

              {/* Complexity badge floating */}
              <div className="absolute top-4 right-4 hidden group-hover:block">
                <span className="text-[9px] font-mono text-zinc-500 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                  {tpl.complexity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
