import { useState, useEffect } from 'react';
import { 
  Check, Sparkles, ArrowRight, User, GraduationCap, 
  Globe, FolderPlus, MessageSquare, ShieldCheck, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingFlowProps {
  onComplete: (selections: {
    goal: string;
    googleConnected: boolean;
    projectName: string;
  }) => void;
  onClose: () => void;
}

export default function OnboardingFlow({ onComplete, onClose }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [googleConnected, setGoogleConnected] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const steps = [
    { id: 1, title: "Welcome" },
    { id: 2, title: "Learning Goal" },
    { id: 3, title: "Google Cloud" },
    { id: 4, title: "First Project" },
    { id: 5, title: "Complete" }
  ];

  const goals = [
    { id: 'algorithms', label: 'Master DSA & Algorithms', desc: 'Focus on C++, Java, and Python structures.' },
    { id: 'college', label: 'Excel in University Coursework', desc: 'Prepare for exams and complete assignments.' },
    { id: 'startup', label: 'Build full-stack Web Startups', desc: 'React, Next.js, and backend integration.' },
    { id: 'job', label: 'Land a Senior FAANG Role', desc: 'Deep dive into code quality, reviews & scale.' }
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setShowCelebration(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    onComplete({
      goal: goal || 'algorithms',
      googleConnected: googleConnected,
      projectName: projectName || 'My First App'
    });
  };

  const handleFinish = () => {
    onComplete({
      goal,
      googleConnected,
      projectName: projectName || 'My First App'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Side: Progress & Info */}
        <div className="p-6 md:p-8 bg-zinc-900/40 border-r border-zinc-900 w-full md:w-64 shrink-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-800 to-indigo-950 border border-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">VOID ONBOARDING</span>
            </div>

            <div className="space-y-4">
              {steps.map((s) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;

                return (
                  <div key={s.id} className="flex items-center space-x-3 text-xs">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono transition-all ${
                      isCompleted 
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300' 
                        : isActive 
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-950' 
                        : 'border-zinc-800 text-zinc-600'
                    }`}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.id}
                    </div>
                    <span className={`font-medium transition-all ${
                      isActive ? 'text-white font-bold' : isCompleted ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-900">
            <button 
              onClick={handleSkip} 
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono tracking-wider uppercase block"
            >
              Skip Onboarding &times;
            </button>
          </div>
        </div>

        {/* Right Side: Step Content Area */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between min-h-[380px]">
          <div>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="inline-block px-2.5 py-1 rounded bg-purple-950/60 border border-purple-900/40 text-[10px] font-mono text-purple-300 uppercase tracking-widest">
                    Phase 01 // Welcome
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Step into the Void</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Void Coding is the world\'s most interactive AI-powered computer science training environment. Let\'s customize your workspace context in 4 simple steps to accelerate your learning speed.
                  </p>
                  
                  <div className="p-4 bg-purple-950/10 border border-purple-900/20 rounded-2xl flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-purple-300">Secure Sandboxed Environment</h4>
                      <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
                        All files, active codes, and workspace notes are locally persistent or fully secured via cloud encryption.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="inline-block px-2.5 py-1 rounded bg-purple-950/60 border border-purple-900/40 text-[10px] font-mono text-purple-300 uppercase tracking-widest">
                    Phase 02 // Goal Setting
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">What are you building?</h2>
                  <p className="text-zinc-400 text-sm">Select your primary objective to seed personalized tutor guidelines.</p>
                  
                  <div className="grid gap-2.5 pt-2">
                    {goals.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          goal === g.id 
                            ? 'bg-purple-950/20 border-purple-500 text-white' 
                            : 'bg-zinc-900/20 border-zinc-900 hover:border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold">{g.label}</span>
                          {goal === g.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{g.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="inline-block px-2.5 py-1 rounded bg-purple-950/60 border border-purple-900/40 text-[10px] font-mono text-purple-300 uppercase tracking-widest">
                    Phase 03 // Hub Integrations
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Connect Google Cloud Hub</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Synchronize with your student dashboard. Connect Google Drive to upload lecture slide PDFs, import code scripts, and access classrooms.
                  </p>

                  <div className="pt-4 flex flex-col items-center">
                    {googleConnected ? (
                      <div className="w-full p-4 bg-emerald-950/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-900/20 flex items-center justify-center text-emerald-400">
                            <Check className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Google Hub Synchronized</p>
                            <p className="text-[10px] text-zinc-500">Drive, Gmail & Google Calendar connected</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setGoogleConnected(false)}
                          className="text-[10px] font-mono text-zinc-500 hover:text-white"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setGoogleConnected(true);
                        }}
                        className="w-full py-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-2xl flex items-center justify-center gap-3 font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>Link Your Google Workspace Account</span>
                      </button>
                    )}
                    <p className="text-[10px] text-zinc-500 mt-3 text-center leading-relaxed">
                      This authorizes Void Coding to securely scan selected files for educational and indexing logic.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="inline-block px-2.5 py-1 rounded bg-purple-950/60 border border-purple-900/40 text-[10px] font-mono text-purple-300 uppercase tracking-widest">
                    Phase 04 // Launchpad
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Your First Codebase</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Enter a title for your initial active study workspace. We will preseed compile structures and mentor chats for it.
                  </p>

                  <div className="pt-4 space-y-3">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500">Project Workspace Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Binary Search Trees, portfolio-website"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full p-3 bg-zinc-900 border border-zinc-800 focus:border-purple-800 rounded-xl text-xs text-white placeholder-zinc-600 outline-none"
                    />
                    <div className="flex gap-2">
                      {['Data Structures', 'NextJS Landing', 'Portfolio App'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setProjectName(p)}
                          className="px-2.5 py-1 text-[10px] rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div 
                  key="step5" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 text-center py-6"
                >
                  <div className="w-16 h-16 bg-purple-950/60 border border-purple-500/40 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Check className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Workspace Ready!</h2>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                    Your personal academy parameters have been established. Welcome to the elite tier of visual computer science education.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-900 mt-6">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 disabled:opacity-30 transition-all"
            >
              Back
            </button>

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-purple-950"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Launch Dashboard
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
