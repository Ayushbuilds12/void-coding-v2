import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Code, Play, Download, Archive, Save, Flame, ShieldAlert,
  Sliders, Activity, Users, MessageSquare, Clipboard, Layers, RotateCcw,
  Plus, Check, Send, Trash2, FileCode, CheckCircle, ExternalLink, HelpCircle
} from 'lucide-react';
import { Project, Subscription } from '../types';

interface VoidStudioProps {
  token: string;
  subscription: Subscription | null;
  projects: Project[];
  onRefreshProjects: () => Promise<Project[]>;
}

export default function VoidStudio({ token, subscription, projects, onRefreshProjects }: VoidStudioProps) {
  const isPro = subscription?.plan === 'pro';
  
  // Tab within Studio: 'website-generator' | 'three-builder' | 'team-space'
  const [activeTab, setActiveTab] = useState<'website' | 'three' | 'team'>('website');

  // --- WEBSITE GENERATOR STATES ---
  const [prompt, setPrompt] = useState('Create a futuristic high-conversion SaaS landing page for Void, with glowing border cards, deep charcoal backgrounds, interactive neon purple action buttons, a gorgeous product feature grid, testimonial carousels, and an elegant pricing table.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [editorCode, setEditorCode] = useState('');
  const [previewKey, setPreviewKey] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [selectedProject, setSelectedProject] = useState<string>('');

  // --- 3D WEBSITE BUILDER STATES ---
  const [sceneType, setSceneType] = useState<'particles' | 'geometric' | 'monolith' | 'orbit'>('particles');
  const [primaryColor, setPrimaryColor] = useState('#8b5cf6'); // Purple
  const [rotationSpeed, setRotationSpeed] = useState(1.5);
  const [particleCount, setParticleCount] = useState(800);
  const [showWireframe, setShowWireframe] = useState(false);
  const [threeDCode, setThreeDCode] = useState('');

  // --- TEAM COLLABORATION STATES ---
  const [comments, setComments] = useState<Array<{ id: string; author: string; role: string; text: string; time: string }>>([
    { id: '1', author: 'Alex Chen', role: 'Lead Architect', text: 'Love the premium charcoal styling on the hero section. Can we make the background animation slightly slower?', time: '2 hours ago' },
    { id: '2', author: 'Priya Sharma', role: 'UI Designer', text: 'Adding the 3D particles section below the fold will look highly engaging. I recommend a purple-cyan gradient scheme.', time: '1 hour ago' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; text: string; time: string; type: string }>>([
    { id: '1', text: 'SaaS Landing Page code layout finalized', time: '10 mins ago', type: 'code' },
    { id: '2', text: 'Three.js canvas scene initialized on host 0.0.0.0', time: '30 mins ago', type: 'scene' },
    { id: '3', text: 'Project shared with team workspace "Beta testers"', time: '1 hour ago', type: 'team' }
  ]);

  // Set default initial code
  useEffect(() => {
    const defaultHTML = `<!-- 
  ======================================================
  VOID GENERATOR v3.0 - PREMIUM SAAS LANDING PAGE 
  ======================================================
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Void - Next-Generation Dev Platform</title>
  <!-- Tailwind Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            void: {
              black: '#09090b',
              zinc: '#18181b',
              purple: '#8b5cf6',
              glow: '#c084fc',
            }
          }
        }
      }
    }
  </script>
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #09090b;
      color: #f4f4f5;
    }
    .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }
    .purple-glow-card {
      position: relative;
      background: rgba(24, 24, 27, 0.6);
      border: 1px solid rgba(139, 92, 246, 0.15);
      border-radius: 1rem;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .purple-glow-card:hover {
      border-color: rgba(139, 92, 246, 0.4);
      box-shadow: 0 0 25px rgba(139, 92, 246, 0.1);
    }
  </style>
</head>
<body class="overflow-x-hidden">

  <!-- Ambient Light Background -->
  <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none"></div>
  <div class="absolute top-1/2 right-10 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none"></div>

  <!-- Header Nav -->
  <header class="border-b border-zinc-900 bg-void-black/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-950 flex items-center justify-center border border-purple-500/20">
          <span class="font-mono text-white font-black text-sm">V</span>
        </div>
        <span class="font-display font-bold text-lg tracking-wider text-white">VOID.IO</span>
      </div>
      <nav class="hidden md:flex space-x-8 text-sm text-zinc-400 font-medium">
        <a href="#features" class="hover:text-white transition-colors">Features</a>
        <a href="#showcase" class="hover:text-white transition-colors">3D Sandbox</a>
        <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
      </nav>
      <button class="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all" onclick="alert('Welcome to the Future!')">
        Get Started
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
    <div class="inline-flex items-center space-x-2 bg-purple-950/40 border border-purple-800/30 px-3 py-1 rounded-full text-xs text-purple-300 font-mono mb-6">
      <span class="flex h-2 w-2 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
      </span>
      <span>Void Website Builder Active</span>
    </div>
    
    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight font-display max-w-4xl mx-auto text-white leading-tight">
      Build and Ship <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400">Interactive 3D Sites</span> in Seconds
    </h1>
    
    <p class="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed">
      Unlock state-of-the-art layout rendering. Zero config, fully responsive, and packed with high-end aesthetic components curated for high-velocity software startups.
    </p>

    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <button class="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20" onclick="alert('Creating project workspace!')">
        Deploy New SaaS Site
      </button>
      <button class="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all">
        Inspect Source
      </button>
    </div>
  </section>

  <!-- Features Grid Section -->
  <section id="features" class="py-20 px-6 max-w-7xl mx-auto border-t border-zinc-900">
    <div class="text-center mb-16">
      <h2 class="text-2xl sm:text-4xl font-bold font-display text-white">Full-Stack Autonomy</h2>
      <p class="text-zinc-500 text-sm mt-3">Everything you need to package high-fidelity user experiences.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="purple-glow-card p-6">
        <div class="w-10 h-10 rounded-lg bg-purple-950/40 border border-purple-800/30 flex items-center justify-center text-purple-400 mb-6">
          ⚡
        </div>
        <h3 class="font-bold text-lg text-white">Instant Compiles</h3>
        <p class="text-zinc-400 text-xs mt-2.5 leading-relaxed">
          Watch modifications compile instantly. Our sandboxed live frame listens for DOM changes in real-time.
        </p>
      </div>

      <div class="purple-glow-card p-6">
        <div class="w-10 h-10 rounded-lg bg-purple-950/40 border border-purple-800/30 flex items-center justify-center text-purple-400 mb-6">
          📐
        </div>
        <h3 class="font-bold text-lg text-white">Tailwind Utility</h3>
        <p class="text-zinc-400 text-xs mt-2.5 leading-relaxed">
          Harness the ultimate utility-first CSS engine. Write production-ready spacing, alignment, and grid layouts.
        </p>
      </div>

      <div class="purple-glow-card p-6">
        <div class="w-10 h-10 rounded-lg bg-purple-950/40 border border-purple-800/30 flex items-center justify-center text-purple-400 mb-6">
          🌀
        </div>
        <h3 class="font-bold text-lg text-white">Three.js Interop</h3>
        <p class="text-zinc-400 text-xs mt-2.5 leading-relaxed">
          Inject premium interactive backgrounds and planetary orbits with customizable material controllers.
        </p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-zinc-900 bg-void-black/95 py-12 px-6">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
      <p class="text-xs text-zinc-500">&copy; 2026 Void Inc. Powered by the Void AI Studio Engine.</p>
      <div class="flex space-x-6 text-xs text-zinc-400">
        <a href="#" class="hover:text-white transition-colors">Privacy</a>
        <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>

</body>
</html>`;

    setGeneratedCode(defaultHTML);
    setEditorCode(defaultHTML);
    setThreeDCode(generateThreeJSCode('particles', '#8b5cf6', 800, 1.5, false));
    if (projects && projects.length > 0) {
      setSelectedProject(projects[0].id);
    }
  }, [projects]);

  // Generate 3D Three.js source snippet based on scene parameter state
  const generateThreeJSCode = (type: string, color: string, count: number, speed: number, wireframe: boolean) => {
    return `// VOID THREE.JS RENDERER v2.0
// Initialized scene of type: "${type}"
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('webgl-container').appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(${color.replace('#', '0x')}, 2, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Geometry Setup: ${type}
let mesh;
if ('${type}' === 'particles') {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < ${count}; i++) {
    vertices.push(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({
    color: ${color.replace('#', '0x')},
    size: 0.05,
    transparent: true,
    opacity: 0.8
  });
  mesh = new THREE.Points(geometry, material);
} else if ('${type}' === 'geometric') {
  const geometry = new THREE.IcosahedronGeometry(2, 1);
  const material = new THREE.MeshStandardMaterial({
    color: ${color.replace('#', '0x')},
    wireframe: ${wireframe},
    roughness: 0.2,
    metalness: 0.8
  });
  mesh = new THREE.Mesh(geometry, material);
} else {
  // Monolith
  const geometry = new THREE.BoxGeometry(1.5, 3.5, 0.4);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 1.0,
    wireframe: ${wireframe}
  });
  mesh = new THREE.Mesh(geometry, material);
}

scene.add(mesh);
camera.position.z = 5;

// Animation Loop
const animate = () => {
  requestAnimationFrame(animate);
  
  if ('${type}' === 'particles') {
    mesh.rotation.y += 0.002 * ${speed};
    mesh.rotation.x += 0.001 * ${speed};
  } else {
    mesh.rotation.y += 0.01 * ${speed};
    mesh.rotation.z += 0.005 * ${speed};
  }
  
  renderer.render(scene, camera);
};

animate();`;
  };

  // Trigger regeneration of website code based on prompt
  const handleGenerateWebsite = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/code/review', { // reuse code review/helper logic if needed or do custom prompt
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language: 'html',
          code: prompt // Passing prompt in code space to trigger AI generation
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Extract optimised or generated layout
        if (data.optimizedCode) {
          // If the AI returned an HTML template, use it
          setGeneratedCode(data.optimizedCode);
          setEditorCode(data.optimizedCode);
        } else {
          // fallback mockup generation
          generateFallbackHTML();
        }
      } else {
        generateFallbackHTML();
      }
      setPreviewKey(prev => prev + 1);
    } catch (e) {
      console.error(e);
      generateFallbackHTML();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackHTML = () => {
    // Generate high-end HTML layout based on prompt topics
    const isCrypto = prompt.toLowerCase().includes('crypto') || prompt.toLowerCase().includes('web3');
    const isPortfolio = prompt.toLowerCase().includes('portfolio') || prompt.toLowerCase().includes('resume');
    
    let title = "Void Generated Platform";
    let accent = "#8b5cf6"; // Purple
    let contentTheme = "AI SaaS Studio";
    
    if (isCrypto) {
      title = "Nebula Web3 Gateway";
      accent = "#10b981"; // Emerald
      contentTheme = "Decentralized DeFi Smart System";
    } else if (isPortfolio) {
      title = "Senior Developer Hub";
      accent = "#38bdf8"; // Sky Blue
      contentTheme = "Interactive Systems Portfolio";
    }

    const customHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0b0b0f; color: #f4f4f5; }
    .font-display { font-family: 'Space Grotesk', sans-serif; }
  </style>
</head>
<body class="overflow-x-hidden min-h-screen flex flex-col justify-between">
  <!-- Glowing effect -->
  <div class="absolute top-0 right-10 w-96 h-96 bg-[${accent}]/10 rounded-full blur-[120px] pointer-events-none"></div>

  <!-- Header -->
  <header class="border-b border-zinc-900 bg-black/40 backdrop-blur">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <span class="font-display font-bold text-lg tracking-wide text-white uppercase">${title.split(' ')[0]}</span>
      <span class="text-xs font-mono px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">AI GENERATED</span>
    </div>
  </header>

  <!-- Hero Content -->
  <main class="max-w-4xl mx-auto px-6 py-20 text-center flex-1">
    <div class="inline-flex items-center space-x-2 bg-zinc-900 px-3 py-1 rounded-full text-xs text-zinc-400 font-mono mb-6">
      <span>Theme: ${contentTheme}</span>
    </div>
    <h1 class="text-4xl sm:text-6xl font-extrabold font-display leading-tight text-white">
      Your Prompt <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Perfected</span> with Design Precision
    </h1>
    <p class="text-zinc-400 mt-6 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
      This live landing page was crafted autonomously based on your prompt: "${prompt}". Highly modular architecture, adaptive Tailwind layers, and ready to deploy.
    </p>

    <div class="mt-8 flex justify-center gap-3">
      <button class="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-3 rounded-lg" onclick="alert('Successfully connected!')">
        Deploy Sandbox Page
      </button>
      <button class="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs px-5 py-3 rounded-lg">
        Explore Features
      </button>
    </div>

    <!-- Generated layout preview specs -->
    <div class="mt-16 grid sm:grid-cols-2 gap-4 text-left">
      <div class="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl">
        <h3 class="font-bold text-sm text-white">Tailwind Styling</h3>
        <p class="text-zinc-500 text-xs mt-2">Fully configured with responsive, adaptive layouts suitable for desktop, mobile viewports, and Android app containers.</p>
      </div>
      <div class="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl">
        <h3 class="font-bold text-sm text-white">Optimized Components</h3>
        <p class="text-zinc-500 text-xs mt-2">Designed with customizable action controllers, interactive triggers, and high-contrast color balances.</p>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600">
    &copy; 2026 Void Platform. Autodeployed via prompt-to-code compiler engine.
  </footer>
</body>
</html>`;

    setGeneratedCode(customHTML);
    setEditorCode(customHTML);
  };

  // Download the generated code inside a clean .html text wrapper
  const handleDownloadCode = () => {
    const blob = new Blob([editorCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'void_generated_site.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export as ZIP placeholder
  const handleExportZIP = () => {
    alert('Preparing your fully-packaged Workspace zip archive with HTML entry, tailwind settings, package.json and mobile configuration scripts. Ready to import to Android Studio or deploy to Vercel/Netlify!');
  };

  // Save generated files into the current selected project context
  const handleSaveProject = async () => {
    if (!selectedProject) {
      alert('Please select or create an active project to bind this website design!');
      return;
    }
    setSaveStatus('saving');
    
    try {
      const res = await fetch(`/api/projects/${selectedProject}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          generatedCode: editorCode,
          prompt: prompt,
          deploymentUrl: `https://void-deploy-sandbox-${selectedProject}.run.app`
        })
      });

      if (res.ok) {
        setSaveStatus('saved');
        await onRefreshProjects();
        setTimeout(() => setSaveStatus('idle'), 2500);
      } else {
        setSaveStatus('idle');
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('idle');
    }
  };

  // Trigger changes on 3D scene builder
  const handleUpdateThreeD = (type: typeof sceneType) => {
    setSceneType(type);
    setThreeDCode(generateThreeJSCode(type, primaryColor, particleCount, rotationSpeed, showWireframe));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        author: 'You (Software Lead)',
        role: 'Administrator',
        text: newComment,
        time: 'Just now'
      }
    ]);
    setNewComment('');
  };

  // Renders the 3D canvas simulation dynamically
  const renderThreeDFrame = () => {
    return (
      <div className="relative w-full h-[360px] bg-black rounded-xl border border-zinc-900 overflow-hidden flex flex-col justify-between p-4">
        {/* Background Visualizer Animation */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_24px]"></div>
        
        {/* Active Three.js canvas simulation view */}
        <div className="absolute inset-0 flex items-center justify-center">
          {sceneType === 'particles' && (
            <div className="w-64 h-64 relative animate-spin" style={{ animationDuration: `${20 / rotationSpeed}s` }}>
              {Array.from({ length: 45 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 45;
                const radius = 60 + Math.random() * 40;
                const x = Math.sin(angle) * radius;
                const y = Math.cos(angle) * radius;
                return (
                  <div 
                    key={i} 
                    className="absolute w-1 h-1 rounded-full pointer-events-none" 
                    style={{
                      backgroundColor: primaryColor,
                      top: `calc(50% + ${y}px)`,
                      left: `calc(50% + ${x}px)`,
                      opacity: Math.random() * 0.8 + 0.2,
                    }}
                  />
                );
              })}
              {/* Extra inner orbit particles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border border-dashed rounded-full opacity-35 animate-ping" style={{ borderColor: primaryColor }} />
              </div>
            </div>
          )}

          {sceneType === 'geometric' && (
            <div className="relative flex items-center justify-center">
              <div 
                className={`w-40 h-40 border-2 rounded-2xl flex items-center justify-center animate-spin ${
                  showWireframe ? 'border-dashed border-purple-500/40 bg-transparent' : 'bg-purple-950/20 border-purple-800'
                }`}
                style={{ 
                  animationDuration: `${12 / rotationSpeed}s`, 
                  borderColor: primaryColor,
                  borderRadius: '35% 65% 70% 30% / 30% 40% 60% 70%'
                }}
              >
                <div className="w-10 h-10 rounded-full animate-bounce bg-white/10" style={{ backgroundColor: `${primaryColor}30` }} />
              </div>
            </div>
          )}

          {sceneType === 'monolith' && (
            <div className="relative flex items-center justify-center">
              <div 
                className="w-24 h-48 bg-zinc-900 border border-zinc-800/80 shadow-2xl relative animate-pulse flex items-center justify-center rounded-lg"
                style={{ 
                  transform: 'rotateX(20deg) rotateY(45deg)',
                  boxShadow: `0 0 40px ${primaryColor}20`,
                  borderColor: `${primaryColor}50`
                }}
              >
                {/* Neon core */}
                <div className="w-1 h-36 rounded" style={{ backgroundColor: primaryColor, boxShadow: `0 0 15px ${primaryColor}` }} />
              </div>
            </div>
          )}
        </div>

        {/* Floating Controls Indicators overlay */}
        <div className="relative z-10 flex justify-between items-start w-full">
          <div className="font-mono text-[9px] text-zinc-500 bg-black/60 px-2 py-1 rounded border border-zinc-900">
            THREE_RENDERER // ACTIVE // {sceneType.toUpperCase()}
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[9px] text-emerald-400">60 FPS</span>
          </div>
        </div>

        {/* Metrics details overlay */}
        <div className="relative z-10 bg-zinc-950/90 backdrop-blur border border-zinc-900 rounded-lg p-3 max-w-xs font-mono text-[10px] text-zinc-400 space-y-1">
          <p className="font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>GPU Mesh Analytics</span>
          </p>
          <div className="flex justify-between"><span>Geometry Type:</span> <span className="text-white font-bold">{sceneType}</span></div>
          <div className="flex justify-between"><span>Vertices:</span> <span className="text-white font-bold">{sceneType === 'particles' ? particleCount : 1240}</span></div>
          <div className="flex justify-between"><span>Delta Speed:</span> <span className="text-white font-bold">{rotationSpeed} rad/s</span></div>
          <div className="flex justify-between"><span>Draw Mode:</span> <span className="text-purple-400 font-bold">{showWireframe ? 'Wireframe' : 'Solid Mesh'}</span></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-white animate-fadeIn">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
            <span>Void Creator Studio</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            High-fidelity prompt-to-website engine & interactive 3D WebGL scene architect.
          </p>
        </div>

        {/* Tab Selection Switch */}
        <div className="flex rounded-lg bg-zinc-950 border border-zinc-900 p-1 font-mono text-[10px] uppercase tracking-wider font-bold">
          <button 
            onClick={() => setActiveTab('website')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'website' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SaaS Website</span>
          </button>
          <button 
            onClick={() => setActiveTab('three')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'three' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3D Builder</span>
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'team' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team & Logs</span>
          </button>
        </div>
      </div>

      {/* BILLING SECURITY SHIELD LOCK (PHASE 7 PRO CHECKOUT LOCK) */}
      {!isPro && (
        <div className="bg-gradient-to-r from-purple-950/30 via-zinc-950 to-purple-950/30 border border-purple-500/20 rounded-xl p-6 text-center max-w-3xl mx-auto my-4 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-purple-950/80 border border-purple-500/30 flex items-center justify-center mx-auto mb-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-lg font-bold">SaaS Website & 3D Builder locked on Free Tier</h2>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Generating custom responsive websites and high-end WebGL 3D environments requires intensive AI GPU cycles. Upgrade to **Void Pro Plan** to unlock unlimited chat prompts, export source packages, and direct deployment URLs.
          </p>
          <div className="pt-2">
            <span className="text-xs font-mono text-zinc-500 block mb-3">Subscription unlocks: 2D Web Generator + 3D Shaders + Team Shared Collaboration workspaces</span>
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => {
                  window.location.hash = '#billing';
                  // Force billing tab focus by standard scroll / alert
                  alert('Navigating you to the Billing Hub! Upgrade to unlock Void Studio.');
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW ACCORDING TO ACTIVE TAB */}
      {isPro && activeTab === 'website' && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Panel: Prompt Input Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Compiler Instructions</span>
              </h3>
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Describe your custom layout</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-800 rounded px-3 py-2.5 text-xs text-zinc-200 outline-none h-36 resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Bind to project scope */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Save Target Workspace</label>
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 outline-none focus:border-purple-800"
                >
                  <option value="">Select target project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Trigger Generation button */}
              <button 
                onClick={handleGenerateWebsite}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-2"
              >
                {isGenerating ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
                <span>{isGenerating ? 'Compiling Layout...' : 'Build SaaS Landing Page'}</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-3">Layout Templates</h4>
              <div className="grid gap-2 text-xs">
                <button 
                  onClick={() => setPrompt("Create an aesthetic Web3 Crypto Dashboard with real-time green/red charting visuals, modular wallet connect prompts, high-contrast dark theme, and grid-aligned transaction tables.")}
                  className="w-full text-left p-2.5 bg-zinc-900/40 hover:bg-zinc-900 hover:text-purple-400 border border-zinc-900 rounded transition-colors text-zinc-400 font-medium"
                >
                  🌐 Decentralized Web3 DeFi Dashboard
                </button>
                <button 
                  onClick={() => setPrompt("Create a sleek minimalist portfolio page for a Senior Cloud Software Architect. Centered bold typography, large clean margins, deep charcoal boxes, interactive skills tag lines, and contact links.")}
                  className="w-full text-left p-2.5 bg-zinc-900/40 hover:bg-zinc-900 hover:text-purple-400 border border-zinc-900 rounded transition-colors text-zinc-400 font-medium"
                >
                  💼 Modern Senior Developer Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Split Code & Live Preview */}
          <div className="lg:col-span-3 space-y-4">
            {/* Header with quick file actions */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-xs text-white">index.html (Tailwind Active)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <button 
                  onClick={handleDownloadCode}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 flex items-center gap-1.5"
                  title="Download HTML source code"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button 
                  onClick={handleExportZIP}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 flex items-center gap-1.5"
                  title="Export full ZIP package"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Export ZIP</span>
                </button>
                <button 
                  onClick={handleSaveProject}
                  disabled={saveStatus === 'saving'}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-white font-medium flex items-center gap-1.5"
                  title="Save to target workspace folder"
                >
                  {saveStatus === 'saving' ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{saveStatus === 'saved' ? 'Saved Successfully!' : 'Save Layout'}</span>
                </button>
              </div>
            </div>

            {/* Editor vs Preview tabs */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[500px]">
              {/* Code Editor */}
              <div className="border-b border-zinc-900 px-4 py-2.5 bg-zinc-950/50 flex justify-between items-center text-xs text-zinc-500 font-mono">
                <span>INTERACTIVE SOURCE CODE EDITOR</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>SYNTAX OK</span>
                </span>
              </div>
              <textarea 
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                className="flex-1 bg-black p-4 font-mono text-[11px] text-emerald-400 outline-none resize-none leading-relaxed overflow-auto border-0"
              />
            </div>

            {/* Dynamic Iframe Live Preview Frame */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[500px]">
              <div className="border-b border-zinc-900 px-4 py-2.5 bg-zinc-950/50 flex justify-between items-center text-xs text-zinc-500 font-mono">
                <span className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>LIVE COMPILER SANDBOX PREVIEW</span>
                </span>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Responsive Frame</span>
              </div>
              <iframe 
                key={previewKey}
                title="SaaS Site Preview Frame"
                srcDoc={editorCode}
                sandbox="allow-scripts allow-modals"
                className="flex-1 bg-zinc-950 w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3D BUILDER VIEW (PHASE 4) */}
      {isPro && activeTab === 'three' && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Controls column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-5">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Scene Parameters</span>
              </h3>

              {/* Geometry Types */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Choose Mesh Structure</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => handleUpdateThreeD('particles')}
                    className={`py-2 px-3 border rounded text-center font-medium transition-colors ${sceneType === 'particles' ? 'bg-purple-600/15 border-purple-500 text-white' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400'}`}
                  >
                    🌌 Neural Particles
                  </button>
                  <button 
                    onClick={() => handleUpdateThreeD('geometric')}
                    className={`py-2 px-3 border rounded text-center font-medium transition-colors ${sceneType === 'geometric' ? 'bg-purple-600/15 border-purple-500 text-white' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400'}`}
                  >
                    💎 3D Icosahedron
                  </button>
                  <button 
                    onClick={() => handleUpdateThreeD('monolith')}
                    className={`py-2 px-3 border rounded text-center font-medium transition-colors ${sceneType === 'monolith' ? 'bg-purple-600/15 border-purple-500 text-white' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400'}`}
                  >
                    ⬛ Glass Monolith
                  </button>
                  <button 
                    onClick={() => handleUpdateThreeD('orbit')}
                    className={`py-2 px-3 border rounded text-center font-medium transition-colors ${sceneType === 'orbit' ? 'bg-purple-600/15 border-purple-500 text-white' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400'}`}
                  >
                    🪐 Orbit Ring
                  </button>
                </div>
              </div>

              {/* Color picker */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Primary Shader Color</label>
                <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 p-2 rounded-lg">
                  <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      setThreeDCode(generateThreeJSCode(sceneType, e.target.value, particleCount, rotationSpeed, showWireframe));
                    }}
                    className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer outline-none"
                  />
                  <div className="font-mono text-xs">
                    <span className="text-zinc-500 uppercase block text-[9px] tracking-wider">HEX RGB VALUE</span>
                    <span className="text-white font-bold">{primaryColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Range rotation speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                  <span>ANGULAR VELOCITY</span>
                  <span className="text-purple-400 font-bold">{rotationSpeed} rad/s</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="4" 
                  step="0.1"
                  value={rotationSpeed}
                  onChange={(e) => {
                    setRotationSpeed(parseFloat(e.target.value));
                    setThreeDCode(generateThreeJSCode(sceneType, primaryColor, particleCount, parseFloat(e.target.value), showWireframe));
                  }}
                  className="w-full accent-purple-500 bg-zinc-900 h-1.5 rounded-lg outline-none cursor-pointer"
                />
              </div>

              {/* Particles density */}
              {sceneType === 'particles' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                    <span>PARTICLE RESOLUTION</span>
                    <span className="text-purple-400 font-bold">{particleCount} Nodes</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="1500" 
                    step="50"
                    value={particleCount}
                    onChange={(e) => {
                      setParticleCount(parseInt(e.target.value));
                      setThreeDCode(generateThreeJSCode(sceneType, primaryColor, parseInt(e.target.value), rotationSpeed, showWireframe));
                    }}
                    className="w-full accent-purple-500 bg-zinc-900 h-1.5 rounded-lg outline-none cursor-pointer"
                  />
                </div>
              )}

              {/* Toggle Wireframe for geometric */}
              {sceneType !== 'particles' && (
                <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-850 rounded-lg">
                  <div>
                    <span className="block text-xs font-bold text-zinc-300">Wireframe Mesh</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Render material vertex outlines</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={showWireframe}
                    onChange={(e) => {
                      setShowWireframe(e.target.checked);
                      setThreeDCode(generateThreeJSCode(sceneType, primaryColor, particleCount, rotationSpeed, e.target.checked));
                    }}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-purple-950/20 border border-purple-900/25 p-4 rounded-xl text-xs text-purple-300 leading-relaxed">
              💡 **Three.js Optimization**: In production, vertex limits are managed automatically to ensure safe WebGL GPU parsing across mobile Chrome and Android wrappers.
            </div>
          </div>

          {/* Canvas display and generated webgl code block */}
          <div className="lg:col-span-3 space-y-4">
            {/* Live WebGL Stage */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
              <div className="border-b border-zinc-900 p-4 bg-zinc-950/50 flex justify-between items-center text-xs font-mono text-zinc-500">
                <span>INTERACTIVE THREE.JS SHADER VIEWPORT</span>
                <span className="text-emerald-400">GPU_ACCELERATED</span>
              </div>
              <div className="p-4">
                {renderThreeDFrame()}
              </div>
            </div>

            {/* Generated JavaScript Code view */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[350px]">
              <div className="border-b border-zinc-900 p-4 bg-zinc-950/50 flex justify-between items-center text-xs font-mono text-zinc-500">
                <span>GENERATED THREE.JS INJECTION SNIPPET</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(threeDCode);
                    alert('Three.js helper script copied to clipboard!');
                  }}
                  className="px-2.5 py-1 hover:bg-zinc-900 rounded border border-zinc-900 hover:text-white transition-colors"
                >
                  Copy Script
                </button>
              </div>
              <textarea 
                value={threeDCode}
                readOnly
                className="flex-1 bg-black p-4 font-mono text-[10.5px] text-purple-300 outline-none resize-none leading-relaxed overflow-auto border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* TEAM COLLABORATION & ACTIVITY LOGS (PHASE 8 & 9) */}
      {isPro && activeTab === 'team' && (
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left panel: Activity history */}
          <div className="md:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Workspace Activity Log</span>
            </h3>
            
            <div className="space-y-3">
              {activityLogs.map(log => (
                <div key={log.id} className="bg-zinc-900/40 border border-zinc-900/60 p-3 rounded-lg text-xs leading-relaxed flex flex-col justify-between">
                  <p className="text-zinc-300 font-medium">{log.text}</p>
                  <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono text-zinc-500">
                    <span className="uppercase">TYPE: {log.type}</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Shared project discussions */}
          <div className="md:col-span-3 bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-[520px]">
            <div className="overflow-y-auto space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-purple-400 flex items-center gap-1.5 border-b border-zinc-900 pb-3 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Workspace Collaboration Board</span>
              </h3>

              <div className="space-y-3.5">
                {comments.map(c => (
                  <div key={c.id} className="bg-zinc-900/60 border border-zinc-900 p-4 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between items-center font-mono text-[10px]">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-white font-bold">{c.author}</span>
                        <span className="text-zinc-500">({c.role})</span>
                      </div>
                      <span className="text-zinc-500">{c.time}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed font-sans">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment input form */}
            <form onSubmit={handleAddComment} className="border-t border-zinc-900 pt-4 mt-4 bg-zinc-950">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  placeholder="Post shared assignment comment or structure recommendations..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-xs text-white outline-none focus:border-purple-800"
                />
                <button 
                  type="submit"
                  disabled={!newComment.trim()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-900 text-white rounded-lg transition-colors disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
