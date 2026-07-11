import { useState } from 'react';
import { BookOpen, Code2, Terminal, Users, Cpu, ShieldCheck, Zap, ArrowRight, Check, HelpCircle } from 'lucide-react';
import ThreeDSpace from './ThreeDSpace';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onInstallApp?: () => void;
  installPrompt?: any;
}

export default function LandingPage({ onGetStarted, onLogin, onInstallApp, installPrompt }: LandingPageProps) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const features = [
    {
      icon: <Terminal className="w-6 h-6 text-purple-400" />,
      title: "Line-By-Line Explanations",
      desc: "Stop copying code blindly. Our AI tutor dissects algorithms and source files, describing compiler flow in standard language."
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      title: "Interactive 3D Visualizer",
      desc: "Explore programming networks, memory layouts, pointers, and class hierarchies dynamically using custom-paired 3D representations."
    },
    {
      icon: <Code2 className="w-6 h-6 text-purple-400" />,
      title: "Project Creator Assistant",
      desc: "Generate production-ready folder structures, source templates, and modules. Build academic assignments step-by-step."
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      title: "Advanced Code Reviewer",
      desc: "Instantly compile, analyze, and grade code quality. Detect security leaks, performance bottlenecks, and learn how to optimize them."
    }
  ];

  const benefits = [
    {
      tag: "School & University Students",
      title: "Excel in your Computer Science degrees and assignments",
      points: [
        "Preseed classes on pointers, lists, databases, operating systems, and networking.",
        "Secure comprehensive help with semester final projects and BCA/BTech coursework.",
        "Interactive quizzes with immediate explanations and code challenges to test knowledge."
      ]
    },
    {
      tag: "Self-Taught Developers",
      title: "Bridge the gap to senior engineering roles",
      points: [
        "Learn optimal software engineering practices like modular architecture.",
        "Master complexity (O-notation) and data structure hierarchies visually.",
        "Receive code reviews modeled after top tech company pull request feedback."
      ]
    }
  ];

  const pricing = [
    {
      name: "Free Student Sandbox",
      price: "0",
      period: "forever",
      desc: "Perfect for beginners exploring coding fundamentals.",
      features: [
        "Access basic curated computer science lessons",
        "Interactive quizzes & code challenge testing",
        "Limited daily AI Mentor questions (15/day)",
        "Build and manage up to 3 active projects",
        "Standard static code reviews"
      ],
      btnText: "Start Learning Free",
      popular: false,
      action: onGetStarted
    },
    {
      name: "Pro Mentor Elite",
      price: "499",
      period: "month",
      desc: "Comprehensive toolkit for university projects and interview preparation.",
      features: [
        "UNLIMITED daily AI Mentor questions & chats",
        "Create and manage UNLIMITED code projects",
        "Advanced full-step Project Creator Assistant",
        "Comprehensive reviews (Security, Speed, Style)",
        "Full access to advanced, university-level curricula",
        "Priority AI processing (no speed throttling)"
      ],
      btnText: "Upgrade to Pro",
      popular: true,
      action: onGetStarted
    }
  ];

  const faqs = [
    {
      q: "Who is Void Coding designed for?",
      a: "Void Coding is engineered for school, college, and university students (BCA, BTech, CS degrees) as well as self-taught developers. The platform adapts to your experience level—delivering visual, simplified analogies for beginners, and complex, deep-dive architectural discussions for advanced students."
    },
    {
      q: "Does it support multiple programming languages?",
      a: "Yes! The AI Mentor, Code Reviewer, and Project Assistant support major modern languages including Python, C, C++, Java, JavaScript, TypeScript, HTML, CSS, SQL, and and frameworks like React, Node.js, and Next.js."
    },
    {
      q: "How does the subscription work? Is Razorpay integrated?",
      a: "Yes, our billing dashboard uses an integrated payment portal simulated with Razorpay, allowing you to seamlessly purchase the Pro Plan, view invoices, download transaction logs, and manage (upgrade/downgrade/cancel) your subscription."
    },
    {
      q: "Can I use it to complete my university assignment?",
      a: "Absolutely! The AI Project Assistant helps you design, structure, write, and debug complete modules. Rather than doing the work for you, it serves as a personal tutor, explaining the architecture and teaching you how to code it yourself."
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen selection:bg-purple-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-800 to-indigo-950 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-950/20">
              <span className="font-mono text-lg font-bold text-white tracking-widest">V</span>
            </div>
            <div>
              <span className="font-sans font-bold text-base tracking-wider text-white">VOID CODING</span>
              <span className="hidden md:inline-block ml-2 px-1.5 py-0.5 rounded text-[9px] bg-purple-950 text-purple-300 font-mono border border-purple-800/40">AI ACADEMY</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {installPrompt && onInstallApp && (
              <button 
                onClick={onInstallApp} 
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-purple-500/40 bg-purple-950/40 text-purple-300 hover:bg-purple-900/40 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-purple-950/25"
              >
                <span>Install WebApp</span>
              </button>
            )}
            <button onClick={onLogin} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Log In
            </button>
            <button onClick={onGetStarted} className="px-4 py-2 text-sm font-medium bg-white text-black hover:bg-zinc-200 rounded-lg transition-all shadow-md">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        {/* Ambient radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-900/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-zinc-900/80 border border-purple-900/30 rounded-full px-3 py-1 mb-6">
            <span className="flex h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-purple-300">Your AI Coding Tutor is Active</span>
          </div>

          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Learn, Build, and Master Coding With <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-200 to-purple-400">AI</span>
          </h1>
          
          <p className="font-sans text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
            Your personal AI coding mentor that teaches, reviews, explains, and helps you build real software projects from scratch.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onGetStarted} className="w-full sm:w-auto px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer">
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </button>
            {installPrompt && onInstallApp && (
              <button onClick={onInstallApp} className="w-full sm:w-auto px-8 py-3.5 bg-purple-950/50 hover:bg-purple-900/40 text-purple-300 rounded-lg font-medium border border-purple-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-950/20 animate-pulse">
                <span>Install Companion App</span>
              </button>
            )}
            <a href="#pricing" className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg font-medium border border-zinc-800 transition-all flex items-center justify-center">
              View Plans
            </a>
          </div>

          {/* Interactive 3D Orbit Node showcase */}
          <div className="mt-16 max-w-4xl mx-auto relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 blur opacity-40"></div>
            <ThreeDSpace />
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase text-purple-400 tracking-widest">Engineered for Learning</h2>
            <p className="text-3xl font-bold mt-2">Personalized Coding Mentor in your browser</p>
            <p className="text-zinc-400 mt-4">We do not just output boilerplate. We tutor you, ensuring you understand the underlying patterns, algorithms, and logic.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-purple-900/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-purple-950/40 border border-purple-800/20 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Benefits */}
      <section className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase text-purple-400 tracking-widest">Tailored Cohorts</h2>
            <p className="text-3xl font-bold mt-2">Accelerating developer skills at every level</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {benefits.map((b, i) => (
              <div key={i} className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-800/5 rounded-full blur-3xl pointer-events-none"></div>
                <div>
                  <span className="font-mono text-xs text-purple-300 bg-purple-950/80 border border-purple-800/40 px-3 py-1 rounded-full">
                    {b.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-6 text-white leading-snug">
                    {b.title}
                  </h3>
                  <ul className="mt-8 space-y-4">
                    {b.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-400 leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 border-t border-zinc-900 pt-6">
                  <button onClick={onGetStarted} className="text-sm font-medium text-white hover:text-purple-400 inline-flex items-center space-x-2 transition-colors">
                    <span>Unlock student paths</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Mentor Showcase */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono uppercase text-purple-400 tracking-widest bg-purple-950/55 px-3 py-1 border border-purple-900/30 rounded-full">AI MENTOR SYSTEM</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-6 text-white leading-tight">
                An expert AI tutor sitting right next to you
              </h2>
              <p className="text-zinc-400 mt-4 leading-relaxed">
                Rather than writing the code for you, Void Coding acts like a university professor. If you submit a buggy function, it explains the compiler mechanics, asks leading questions, and provides interactive quizzes to ensure you understand why the error happened and how to avoid it in the future.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-4">
                  <p className="font-mono text-xl font-bold text-white">60s</p>
                  <p className="text-xs text-zinc-400 mt-1">Setup time for university templates</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-4">
                  <p className="font-mono text-xl font-bold text-white">20+</p>
                  <p className="text-xs text-zinc-400 mt-1">CS topics seeded dynamically</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                </div>
                <span className="text-[10px] text-zinc-500">mentor_session.py</span>
              </div>
              <div className="space-y-4 font-sans">
                <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
                  <p className="text-[10px] font-mono text-purple-300">STUDENT // BTech Year 2</p>
                  <p className="text-xs text-zinc-300 mt-1 font-medium">How do I implement a custom binary search algorithm in Python?</p>
                </div>
                <div className="bg-purple-950/20 p-3 rounded border border-purple-900/30">
                  <p className="text-[10px] font-mono text-purple-400">VOID_MENTOR // ACTIVE</p>
                  <p className="text-xs text-zinc-200 mt-1 leading-relaxed">
                    Great question! Think of a dictionary. Instead of flipping page-by-page from the start (linear search), you open it in the middle. If your word is further down, you discard the first half. That\'s **Binary Search**!
                  </p>
                  <p className="text-[10px] text-purple-300 font-mono mt-3">Prerequisite: Array must be sorted.</p>
                  <pre className="text-[10px] font-mono bg-zinc-950/80 p-2 rounded text-emerald-400 border border-zinc-900 overflow-x-auto mt-2">
{`# Discarding halves iteratively
mid = (low + high) // 2
if arr[mid] == target:
    return mid # Found index!`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase text-purple-400 tracking-widest">Simple Tiering</h2>
            <p className="text-3xl font-bold mt-2 font-sans">Invest in your coding excellence</p>
            <p className="text-zinc-400 mt-4 text-sm max-w-md mx-auto">Get comprehensive AI instruction for the cost of a couple of textbooks. Upgrade anytime using simulated Razorpay secure checkout.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((p, i) => (
              <div key={i} className={`bg-zinc-950 rounded-2xl p-8 border ${p.popular ? 'border-purple-500 shadow-xl shadow-purple-950/20 relative' : 'border-zinc-900'} flex flex-col justify-between`}>
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500 text-white uppercase tracking-wider">
                    Recommended for Students
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">{p.name}</h3>
                  <p className="text-sm text-zinc-400 mt-2 min-h-[40px]">{p.desc}</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold font-mono text-white">₹{p.price}</span>
                    <span className="text-sm text-zinc-500 ml-2">/ {p.period}</span>
                  </div>
                  
                  <ul className="mt-8 space-y-4">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="text-sm text-zinc-300">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10">
                  <button onClick={p.action} className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${p.popular ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800'}`}>
                    {p.btnText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono uppercase text-purple-400 tracking-widest">Information Desk</h2>
            <p className="text-3xl font-bold mt-2 font-sans">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                <button onClick={() => toggleFaq(i)} className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none">
                  <span className="font-medium text-white text-base font-sans">{f.q}</span>
                  <HelpCircle className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-5 pt-1 border-t border-zinc-900">
                    <p className="text-sm text-zinc-400 leading-relaxed font-sans">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-zinc-900 relative overflow-hidden bg-gradient-to-b from-black to-zinc-950">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to master your software coursework?</h2>
          <p className="text-zinc-400 mt-4 text-base max-w-lg mx-auto">Create your sandbox student profile in under 30 seconds and start understanding computer science visually.</p>
          <div className="mt-8">
            <button onClick={onGetStarted} className="px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 mx-auto">
              Get Started for Free <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-zinc-900 text-zinc-500 font-sans text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-white tracking-wider font-mono">VOID CODING</span>
            <span>|</span>
            <p>© 2026 Void Coding. Crafted for BTech & Computer Science Academic Excellence.</p>
          </div>
          <div className="flex space-x-6 text-[11px]">
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/robots.txt" className="hover:text-white transition-colors" target="_blank">Robots</a>
            <a href="/sitemap.xml" className="hover:text-white transition-colors" target="_blank">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
