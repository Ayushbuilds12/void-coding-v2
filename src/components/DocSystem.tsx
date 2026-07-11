import { useState } from 'react';
import { 
  FileText, Shield, FileCheck, RefreshCcw, HelpCircle, Mail, 
  Globe, MapPin, Landmark, Award, HardDrive, ListCollapse, Eye 
} from 'lucide-react';

type DocSection = 
  | 'getting-started' | 'features' | 'api' | 'faq' | 'contact'
  | 'privacy' | 'terms' | 'billing-policy' | 'refund' | 'cookie' 
  | 'rewards-policy' | 'disclosures' | 'appstore';

export default function DocSystem() {
  const [activeTab, setActiveTab] = useState<DocSection>('getting-started');

  const menuItems = [
    { id: 'getting-started' as const, label: 'Getting Started', category: 'Documentation', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'features' as const, label: 'Product Features', category: 'Documentation', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'api' as const, label: 'API Reference', category: 'Documentation', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'faq' as const, label: 'FAQ Centre', category: 'Documentation', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    
    { id: 'privacy' as const, label: 'Privacy & Deletion Policy', category: 'Legal & Trust', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'terms' as const, label: 'Terms of Service', category: 'Legal & Trust', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { id: 'billing-policy' as const, label: 'Billing & Auto-Renewal', category: 'Legal & Trust', icon: <RefreshCcw className="w-3.5 h-3.5" /> },
    { id: 'refund' as const, label: 'Refund Policy', category: 'Legal & Trust', icon: <RefreshCcw className="w-3.5 h-3.5" /> },
    { id: 'cookie' as const, label: 'Cookie & Tracking Policy', category: 'Legal & Trust', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'rewards-policy' as const, label: 'Rewards & Referrals', category: 'Legal & Trust', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'disclosures' as const, label: 'Data Disclosures (AI/Stripe)', category: 'Legal & Trust', icon: <HardDrive className="w-3.5 h-3.5" /> },
    { id: 'appstore' as const, label: 'App Store Compliance', category: 'Legal & Trust', icon: <ListCollapse className="w-3.5 h-3.5" /> },
    { id: 'contact' as const, label: 'Contact Support Hub', category: 'Legal & Trust', icon: <Mail className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="bg-black text-white p-6 rounded-2xl border border-zinc-900 animate-fadeIn flex flex-col md:flex-row gap-6">
      
      {/* SIDE MENU */}
      <aside className="w-full md:w-64 shrink-0 space-y-5">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 pl-2">Academy Docs</h3>
          <div className="space-y-1 mt-2">
            {menuItems.filter(i => i.category === 'Documentation').map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                  activeTab === item.id 
                    ? 'bg-purple-950/40 text-purple-300 border-l-2 border-purple-500' 
                    : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 pl-2">Legal & Trust</h3>
          <div className="space-y-1 mt-2">
            {menuItems.filter(i => i.category === 'Legal & Trust').map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-left transition-all ${
                  activeTab === item.id 
                    ? 'bg-purple-950/40 text-purple-300 border-l-2 border-purple-500' 
                    : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 sm:p-8 overflow-y-auto max-h-[600px] prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        
        {activeTab === 'getting-started' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Getting Started</h1>
            <p>Welcome to Void Coding! We are glad you are here. This document will walk you through the essential steps to configure your sandbox workspace, initiate compile runs, and connect active Google Cloud modules.</p>
            
            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">1. Registering Your Account</h3>
            <p>Sign up using Google OAuth or premium secure Email registration. Once signed up, our multi-step Onboarding engine will configure your primary learning tracks based on your curriculum objectives.</p>

            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">2. Launching Your First Project</h3>
            <p>Head to the <strong>Projects</strong> tab to generate code templates for Python algorithms, Next.js components, or C++ structures. The Project Creator Assistant builds optimized directories with automatic package.json declarations.</p>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Product Features</h1>
            <p>Void Coding features a suite of deep tools engineered for rapid computer science education and web development:</p>
            
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Interactive 3D Visualizer:</strong> Renders visual coordinates, pointer links, memory grids, and algorithms to clarify memory offsets in real time.</li>
              <li><strong>Line-By-Line Compiler Code Review:</strong> Submit functions in TypeScript, Python, or C++ and receive instant line grades assessing memory usage, execution speed, and syntax vulnerabilities.</li>
              <li><strong>Void Studio Website Builder:</strong> Generates responsive HTML/CSS structures, live templates, and sandbox code grids in your browser.</li>
              <li><strong>Google Workspace Sync:</strong> Imports files from your Google Drive, monitors student classrooms, and reads emails to track your assignments.</li>
            </ul>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">API Reference</h1>
            <p>Access and manipulate workspace resources programmatically using our REST endpoints.</p>
            
            <h3 className="text-sm font-bold text-zinc-200 mt-4 font-mono">GET /api/projects</h3>
            <p className="text-zinc-400">Fetch all active sandbox directories synced to your session.</p>
            <pre className="p-3 bg-black rounded border border-zinc-900 text-emerald-400 font-mono text-[11px]">
{`Headers:
  Authorization: Bearer <your_jwt_token>`}
            </pre>

            <h3 className="text-sm font-bold text-zinc-200 mt-4 font-mono">POST /api/mentor/chat</h3>
            <p className="text-zinc-400">Send chat inputs to OpenAI / Gemini streaming engines and receive compiler reviews.</p>
            <pre className="p-3 bg-black rounded border border-zinc-900 text-emerald-400 font-mono text-[11px]">
{`Body:
  {
    "message": "Explain double pointer references",
    "history": []
  }`}
            </pre>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">FAQ Centre</h1>
            <div className="space-y-4 mt-3">
              <div>
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Is my financial data secure?</h4>
                <p className="text-xs text-zinc-400 mt-1">Yes! We do not store or process payment card details. All transactions are routed directly via Razorpay compliant gateway interfaces.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Can I request a custom API key setup?</h4>
                <p className="text-xs text-zinc-400 mt-1">Yes! If you choose to supply your own OpenAI or Gemini credentials, you can configure them within the Settings view.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Privacy Policy & GDPR Compliance</h1>
            <p className="text-[11px] text-zinc-500 font-mono">Effective Date: July 10, 2026 | Version: v1.4.2</p>
            
            <p>Void Coding Ltd ("we", "our", "us") values your privacy. This policy outlines how we collect, store, secure, and permanently erase your academic file uploads, prompts, telemetry logs, and workspace metadata under General Data Protection Regulation (GDPR) mandates.</p>
            
            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">1. Information We Collect</h3>
            <p>We collect only the metrics necessary to maintain your workspace context:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Account Identifiers:</strong> Your email, full name, profile picture, and chosen CS track education level.</li>
              <li><strong>Study Content:</strong> File scripts, codes, notes, and mentor conversation prompt files.</li>
              <li><strong>Billing History:</strong> Simulated payment logs and order reference IDs. We do not store raw card numbers.</li>
            </ul>

            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">2. GDPR Data Deletion Pipeline (Article 17)</h3>
            <p>Under GDPR Article 17, you hold the absolute "Right to be Forgotten." You may trigger complete account erasure in your Settings Panel at any time. When you click <strong>"Erase Student Sandbox Profile"</strong>, our backend executes a cascade deletion pipeline:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>All profile info, names, and academic levels are purged from our database.</li>
              <li>All created files, sandbox structures, and workspaces are deleted.</li>
              <li>All OpenAI / Gemini chat memory states are permanently dereferenced.</li>
              <li>Historical transaction invoice metadata is isolated and retained strictly for legal auditing and tax purposes for the statutory 7-year block, but detached from your primary profile.</li>
            </ul>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Terms of Service</h1>
            <p className="text-[11px] text-zinc-500 font-mono">Effective Date: July 10, 2026 | Version: v1.2.0</p>
            <p>By accessing or interacting with Void Coding services, you agree to comply with our academic integrity terms and general standard license agreements.</p>
            
            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">1. Appropriate Academic Usage</h3>
            <p>Our tools are engineered to help you understand compiler flow, visualize algorithms, and solve assignments iteratively. Void Coding must not be used to copy complete projects with the intention of cheating or bypass college evaluation controls.</p>

            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">2. Liability Limitation</h3>
            <p>We provide our code reviews and AI compiling hints on an "as-is" basis and carry no financial liabilities for failed exams, deployment errors, or server downtimes.</p>
          </div>
        )}

        {activeTab === 'billing-policy' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Billing & Auto-Renewal Disclosure</h1>
            <p className="text-[11px] text-zinc-500 font-mono">Effective Date: July 10, 2026</p>
            
            <p>Transparency is our absolute focus. Here are our transparent billing procedures, charge cycles, and cancellation terms:</p>
            
            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">1. Trial Rules & Upgrades</h3>
            <p>Each student account begins on a <strong>14-Day Free Trial</strong>. No payment card is required to initiate a trial. At the end of 14 days, your compiler limits will scale back to standard tier unless you explicitly opt to upgrade to our premium plans.</p>

            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">2. Mandatory Auto-Renewal Disclosure</h3>
            <p>By purchasing a premium monthly tier, you explicitly authorize Void Coding to process renewal payments on the anniversary of your checkout date. Charges are billed automatically utilizing your saved Razorpay payment method.</p>

            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">3. Frictionless Cancellation & Upgrades</h3>
            <p>You can cancel your active subscription at any time with a single click in your Billings Dashboard. Your pro capabilities will remain active until the end of your current paid billing period, and no further renewal charges will be made. You may also upgrade or downgrade your plan instantly, with automatic prorated credit adjustments.</p>
          </div>
        )}

        {activeTab === 'refund' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Refund & Cancellation Policy</h1>
            <p className="text-[11px] text-zinc-500 font-mono">Effective Date: July 10, 2026</p>
            <p>We want our students and self-taught developers to feel confident. Here is how our refund mechanics operate:</p>
            
            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">14-Day Money-Back Guarantee</h3>
            <p>If you purchase our Pro Elite monthly subscription and feel it doesn\'t meet your educational requirements, you can request a 100% full refund within 14 days of checkout. Simply contact our support desk at <strong>support@voidcoding.com</strong>.</p>
          </div>
        )}

        {activeTab === 'cookie' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Cookie & Tracking Policy</h1>
            <p className="text-[11px] text-zinc-500 font-mono">Effective Date: July 10, 2026</p>
            
            <p>We use essential functional cookies and site analytical identifiers to authenticate users, save session keys, track tutorial progress, and understand conversion rates.</p>
            
            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">1. Category Definition</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Essential (Mandatory):</strong> Handles active login tokens, database verification sessions, and security protection structures.</li>
              <li><strong>Functional (Optional):</strong> Saves your custom IDE themes, font configurations, and workspace structures.</li>
              <li><strong>Analytics (Optional):</strong> Tracks compilation time ranges, chat prompt frequencies, and student completion speeds.</li>
              <li><strong>Marketing (Optional):</strong> Feeds promotional discount alerts within your dashboard feed.</li>
            </ul>

            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">2. Complete Consent Control & Withdrawal</h3>
            <p>You have full, granular control. You may alter your preferences, toggle analytical tracking, or withdraw your consent completely at any time by clicking the **"GDPR Privacy"** trigger in the bottom-left corner of the screen.</p>
          </div>
        )}

        {activeTab === 'rewards-policy' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Referrals, Rewards, and Payout Conditions</h1>
            <p className="text-[11px] text-zinc-500 font-mono">Effective Date: July 10, 2026</p>
            
            <p>Earn tuition cash back by introducing fellow computer science students to Void Coding! Here are our reward guidelines:</p>
            
            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">1. Earnings Structure</h3>
            <p>Receive ₹150 for every student who registers using your referral link and completes their first three AI compile tasks. Receive 20% recurring commission on any premium subscriptions they purchase.</p>

            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">2. Anti-Fraud & Self-Referral Prevention Rules</h3>
            <p>To keep the platform fair, we enforce strict anti-abuse protections. Self-referrals (signing up with alternate emails from the same IP, device fingerprint, or network router) are strictly prohibited. The system analyzes compilation patterns, browser header traces, and payment card accounts to flag automated bots or self-referral attempts. Any fraudulent balances are subject to immediate forfeiture.</p>

            <h3 className="text-sm font-bold text-white mt-4 uppercase tracking-wider font-mono">3. Reward Settlement & Payout Thresholds</h3>
            <p>Earned balances remain in a pending state for a 14-day safety clearing window (matching our refund policy). Cleared rewards can be requested for transfer to your Bank Account or UPI once your accumulated balance meets the minimum withdrawal threshold of ₹500.</p>
          </div>
        )}

        {activeTab === 'disclosures' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Data Disclosures & Third-Party Processors</h1>
            <p className="text-[11px] text-zinc-500 font-mono">Effective Date: July 10, 2026</p>
            
            <p>To provide high-fidelity AI coaching, compiler audits, and instant billing gateways, we transfer specific sanitized datasets to our secure sub-processors:</p>
            
            <table className="w-full text-left text-xs border-collapse mt-3 border border-zinc-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-900/60 font-mono text-zinc-400">
                  <th className="p-2 border border-zinc-900">Processor</th>
                  <th className="p-2 border border-zinc-900">Purpose</th>
                  <th className="p-2 border border-zinc-900">Transferred Fields</th>
                  <th className="p-2 border border-zinc-900">Retention</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-zinc-900 font-bold">OpenAI Inc.</td>
                  <td className="p-2 border border-zinc-900">AI Mentor response synthesis</td>
                  <td className="p-2 border border-zinc-900">Prompts, study code file lines</td>
                  <td className="p-2 border border-zinc-900 font-mono">Transient (0 days cache)</td>
                </tr>
                <tr>
                  <td className="p-2 border border-zinc-900 font-bold">Google Cloud</td>
                  <td className="p-2 border border-zinc-900">Workspace sync & Gemini</td>
                  <td className="p-2 border border-zinc-900">Auth scopes, compiler queries</td>
                  <td className="p-2 border border-zinc-900 font-mono">Session duration</td>
                </tr>
                <tr>
                  <td className="p-2 border border-zinc-900 font-bold">Razorpay Software</td>
                  <td className="p-2 border border-zinc-900">Subscription checkout</td>
                  <td className="p-2 border border-zinc-900">Email, plan name, order ID</td>
                  <td className="p-2 border border-zinc-900 font-mono">Statutory 7 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'appstore' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">App Store & Web Compliance Label</h1>
            <p>To ensure total transparency, here is our official data governance label representing Void's data safety compliance:</p>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4 font-mono text-xs">
              <div className="p-4 bg-purple-950/20 border border-purple-900/30 rounded-xl space-y-2">
                <h3 className="font-bold text-purple-300">Google Play Data Safety</h3>
                <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[11px]">
                  <li><strong>Data Shared:</strong> None. No datasets are sold, traded, or shared with marketing aggregates.</li>
                  <li><strong>Data Collected:</strong> Email, Full Name, and user-provided code files.</li>
                  <li><strong>Security:</strong> All transfers occur over encrypted TLS/HTTPS connections.</li>
                  <li><strong>User Right:</strong> Absolute data deletion request pipeline supported.</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-950/20 border border-purple-900/30 rounded-xl space-y-2">
                <h3 className="font-bold text-purple-300">Apple App Store Privacy</h3>
                <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[11px]">
                  <li><strong>Data Used to Track You:</strong> None. No cross-app tracking identifiers are requested.</li>
                  <li><strong>Data Linked to You:</strong> Contact info, purchase history, and user academic logs.</li>
                  <li><strong>Data Isolation:</strong> User parameters are sandboxed securely with access controls.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Contact & Support</h1>
            <p>Have questions about plans, assignments, custom integration setups, or refund processes? Reach out to our physical or digital desks:</p>
            
            <div className="grid gap-3 pt-4">
              <div className="flex items-center space-x-3.5 p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                <Mail className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Support Email</h4>
                  <a href="mailto:support@voidcoding.com" className="text-xs text-zinc-400 hover:text-purple-400">support@voidcoding.com</a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                <Landmark className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Bank Accounts Coordinates</h4>
                  <p className="text-xs text-zinc-400 font-mono">Available on request via verified active billing invoices</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Corporate HQ Address</h4>
                  <p className="text-xs text-zinc-400">Void Coding Ltd, Nehru Place IT Hub, Block C, New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
