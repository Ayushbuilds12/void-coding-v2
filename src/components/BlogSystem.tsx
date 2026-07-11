import { useState } from 'react';
import { Search, Tag, BookOpen, Calendar, Clock, ArrowRight, CornerDownLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'AI Coding' | 'Web Development' | 'Next.js' | 'React' | 'AI Tools';
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
}

export default function BlogSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = ['All', 'AI Coding', 'Web Development', 'Next.js', 'React', 'AI Tools'];

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Mastering Pointer Visualizations with 3D Memory Layouts',
      slug: 'mastering-pointers-3d-visualizer',
      category: 'AI Coding',
      excerpt: 'Visualizing memory addresses, stack frames, and heaps directly inside the browser using dynamic node systems.',
      content: `Pointers are notoriously difficult for new computer science students to master. Most classrooms rely on flat, abstract blackboard drawings. At Void Coding, we designed a responsive 3D system to bridge this conceptual gap.

### The Problem with Traditional Pedagogy
When students write \`int* ptr = &val\`, they rarely conceptualize that they have created an 8-byte container storing a 64-bit hexadecimal coordinate. They treat the dereference operator \`*\` as magic.

### Enter 3D Spatial Memory Nodes
By projecting dynamic coordinate charts in three-dimensional nodes, students can:
1. Click the variable node to view its contents and visual coordinates.
2. Observe stack-heap boundary lines dividing functional heaps dynamically.
3. Simulate double pointers (\`int**\`) as connected ropes of light linking addresses.

Using these spatial analogies speeds up DSA comprehension by up to 300%. Check out our Void Studio panel to launch your pointer sandbox immediately.`,
      date: 'July 10, 2026',
      readTime: '4 min read',
      tags: ['C++', 'Pointers', '3D Graphics', 'CS Education'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: '2',
      title: 'Deploying High-Performance Next.js Apps with Express Middleware',
      slug: 'nextjs-express-integration-guide',
      category: 'Next.js',
      excerpt: 'A comprehensive guide on managing custom server assets, bundling Node processes, and resolving ESM relative imports at build-time.',
      content: `Next.js provides spectacular zero-config compilation, but what if your startup requires an adjacent persistent Express API backend? 

### The CJS / ESM Relative Resolution Hurdle
When launching full-stack Node applications inside container layers, runtime relative path lookups are often error-prone due to ESM type differences.

### Solution: Bundling with Esbuild
By compiling your entry point \`server.ts\` directly into a bundled CJS script:
\`\`\`bash
esbuild server.ts --bundle --platform=node --format=cjs --outfile=dist/server.cjs
\`\`\`
We flatten absolute directory dependencies, bypassing runtime dynamic checks entirely. It is standard practice inside all Void-deployed systems.`,
      date: 'July 05, 2026',
      readTime: '6 min read',
      tags: ['Next.js', 'Express', 'Esbuild', 'SaaS Deployment'],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: '3',
      title: 'How Generative AI is Changing Academic Programming Assignments',
      slug: 'generative-ai-academic-programming',
      category: 'AI Tools',
      excerpt: 'Evaluating how structured AI guidance, line-by-line compilations, and professor co-pilots improve grades without cheating.',
      content: `Academic integrity in college programming coursework has reached a turning point. Copying code from generic LLM interfaces produces non-functioning boilerplate and triggers plagiarism detectors.

### Learning-First AI Assistance
Rather than spitting out answers, personal co-pilots must learn to ask leading questions. A true tutor:
- Flags logic boundaries.
- Compares alternate algorithm complexity (O-notation).
- Gives interactive quizzes mid-chat to test code retention.

By adopting this pedagogical stance, AI becomes an equalizer for first-generation computer science students.`,
      date: 'June 28, 2026',
      readTime: '5 min read',
      tags: ['Generative AI', 'Academic Integrity', 'Tutor Technology'],
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: '4',
      title: 'Building Beautiful Glassmorphism UIs with Tailwind CSS v4',
      slug: 'tailwind-v4-glassmorphism-templates',
      category: 'Web Development',
      excerpt: 'Mastering CSS backdrop-blurs, transparent border gradients, and negative spacing in Tailwind v4.',
      content: `SaaS landing pages have evolved past generic color schemes. Modern design requires depth, shadows, and frosted-glass components.

### Structuring a Frosted Container
Use the perfect backdrop-blur combination to establish visual layers:
\`\`\`html
<div class="bg-zinc-950/40 backdrop-blur-md border border-zinc-900/80 rounded-2xl">
  <!-- Content -->
</div>
\`\`\`
Pairing this with micro-radial light coordinates gives a futuristic feeling suited to high-performance SaaS interfaces.`,
      date: 'June 22, 2026',
      readTime: '3 min read',
      tags: ['TailwindCSS', 'CSS v4', 'UI Design', 'Glassmorphism'],
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=60'
    }
  ];

  const filteredPosts = blogPosts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-black text-white p-6 rounded-2xl border border-zinc-900 animate-fadeIn space-y-6">
      
      {/* HEADER SECTION */}
      <div className="border-b border-zinc-900 pb-5">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-9 h-9 rounded-lg bg-purple-950/40 border border-purple-900/40 flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Void Academy Blog</h2>
            <p className="text-xs text-zinc-500 font-mono">Expert engineering guidelines, educational tips & technology insights</p>
          </div>
        </div>
      </div>

      {activePost ? (
        /* SINGLE BLOG POST VIEW */
        <div className="space-y-6 animate-fadeIn">
          <button 
            onClick={() => setActivePost(null)}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-[10px] uppercase border border-purple-900/40">{activePost.category}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activePost.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activePost.readTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">{activePost.title}</h1>
            <p className="text-zinc-400 italic text-sm leading-relaxed border-l-2 border-purple-500 pl-4">{activePost.excerpt}</p>
          </div>

          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-zinc-900 relative">
            <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
          </div>

          <article className="prose prose-invert max-w-none text-sm sm:text-base text-zinc-300 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
            {activePost.content}
          </article>

          <div className="border-t border-zinc-900 pt-5 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono text-zinc-500 mr-2 uppercase tracking-wider">Tags:</span>
            {activePost.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-medium">
                #{tag}
              </span>
            ))}
          </div>

          {/* RELATED POSTS WIDGET */}
          <div className="border-t border-zinc-900 pt-6 space-y-4">
            <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {blogPosts.filter(p => p.id !== activePost.id).slice(0, 2).map((rel) => (
                <div 
                  key={rel.id}
                  onClick={() => setActivePost(rel)}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 hover:border-purple-950 hover:bg-zinc-900/20 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-purple-400">{rel.category}</span>
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-200 mt-1 line-clamp-1">{rel.title}</h4>
                    <p className="text-[11px] text-zinc-500 leading-normal mt-1 line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-900/50">
                    <span>{rel.readTime}</span>
                    <span className="text-purple-400 font-bold flex items-center gap-0.5">Read <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* POSTS LISTING VIEW */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Search articles, keywords, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-850'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="bg-zinc-950/60 border border-zinc-900 rounded-2xl overflow-hidden hover:border-purple-900/50 transition-all cursor-pointer flex flex-col h-full group"
                >
                  <div className="h-44 border-b border-zinc-900 overflow-hidden relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-zinc-800 font-mono text-[9px] text-purple-400 font-bold uppercase tracking-widest">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-sans font-bold text-sm sm:text-base text-zinc-200 group-hover:text-purple-400 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-zinc-900/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Tag className="w-3.5 h-3.5 text-purple-500/60" />
                        <span className="font-mono text-[10px] truncate max-w-[150px]">{post.tags[0]}</span>
                      </div>
                      <span className="text-purple-400 font-bold flex items-center gap-1 transition-all group-hover:translate-x-0.5">
                        <span>Read Post</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-500">
              <p className="text-sm">No articles match your selection. Reset search to view updates.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
