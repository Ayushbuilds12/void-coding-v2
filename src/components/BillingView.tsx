import { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Sparkles, AlertCircle, RefreshCw, CheckCircle2, Award, FileText, ArrowRight, X } from 'lucide-react';
import { Subscription, BillingHistory } from '../types';
import { apiFetch } from '../lib/api';

interface BillingViewProps {
  token: string;
  subscription: Subscription | null;
  onRefreshSubscription: () => Promise<void>;
}

export default function BillingView({ token, subscription, onRefreshSubscription }: BillingViewProps) {
  const [loading, setLoading] = useState(false);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  
  // Checkout states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'pay_select' | 'processing' | 'success'>('pay_select');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [upiId, setUpiId] = useState('student@okaxis');
  
  // Compliance auto-renewal checkbox consent
  const [acceptedAutoRenewal, setAcceptedAutoRenewal] = useState(false);

  // Load transaction logs
  const loadBillingHistory = async () => {
    try {
      const res = await apiFetch('/api/billing/history', { token });
      if (res.ok) {
        const history = await res.json();
        setBillingHistory(history);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBillingHistory();
  }, [subscription]);

  const handleOpenCheckout = () => {
    setAcceptedAutoRenewal(false);
    setCheckoutStep('pay_select');
    setShowCheckoutModal(true);
  };

  // Trigger Razorpay simulated verification payment flow
  const handleVerifyPayment = async () => {
    if (!acceptedAutoRenewal) return;
    setCheckoutStep('processing');
    setLoading(true);

    try {
      // Step 1: Create checkout order
      const orderRes = await apiFetch('/api/billing/checkout', {
        token,
        json: { plan: 'pro' }
      });

      if (orderRes.ok) {
        // Step 2: Verification
        const orderData = await orderRes.json();
        const rzpPayId = `pay_${Math.random().toString(36).substring(2, 11)}`;

        const verifyRes = await apiFetch('/api/billing/verify', {
          token,
          json: {
            razorpayPaymentId: rzpPayId,
            razorpaySubscriptionId: orderData.id,
            plan: 'pro'
          }
        });

        if (verifyRes.ok) {
          setTimeout(async () => {
            setCheckoutStep('success');
            setLoading(false);
            await onRefreshSubscription();
          }, 1500); // realistic payment loader delay
        }
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setCheckoutStep('pay_select');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you absolutely sure you want to cancel your Pro Mentor subscription? You will lose access to unlimited AI tutor querying.')) return;
    setLoading(true);

    try {
      const res = await apiFetch('/api/billing/cancel', {
        token,
        method: 'POST'
      });
      if (res.ok) {
        await onRefreshSubscription();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isPro = subscription?.plan === 'pro';

  return (
    <div className="space-y-8 text-white animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Billing & Subscriptions</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage academic licensing seats and inspect transaction records with our integrated simulated Razorpay gateway.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left pane: Active Subscription details */}
        <div className="md:col-span-3 bg-zinc-950 border border-zinc-900 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-base font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5" />
              <span>Seat Status</span>
            </h2>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-purple-950/40 border border-purple-900/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-mono text-zinc-500 uppercase">CURRENT PLAN</p>
                <p className="text-lg font-bold mt-1">{isPro ? 'Pro Mentor Plan' : 'Free Student Sandbox'}</p>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {isPro 
                    ? 'Thank you! Your active subscription gives you unlimited AI querying, priority compilation reviews, and comprehensive learning paths.'
                    : 'Access to basic curricula with limited daily AI tutor queries. Upgrade to unlock full step-by-step assistance.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-zinc-500 font-mono">
              Status: <span className="text-purple-400 capitalize font-bold">{subscription?.status || 'active'}</span>
            </div>
            
            {isPro ? (
              <button 
                onClick={handleCancelSubscription}
                disabled={loading}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-800 rounded-lg text-xs font-mono transition-all"
              >
                Cancel Subscription
              </button>
            ) : (
              <button 
                onClick={handleOpenCheckout}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Upgrade to Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right pane: Curriculums details or pricing card summary */}
        <div className="md:col-span-2 bg-gradient-to-br from-zinc-950 to-purple-950/10 border border-purple-950/40 rounded-xl p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-800/5 rounded-full blur-2xl pointer-events-none"></div>
          <h3 className="font-bold text-sm text-zinc-200">Pro Elite Licensing Includes:</h3>
          
          <ul className="space-y-3 text-xs text-zinc-400 font-sans">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>UNLIMITED AI tutor mentoring queries</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Full step-by-step Project Architect</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Advanced security & performance audits</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Complete university course-level pre-seeds</span>
            </li>
          </ul>

          <div className="border-t border-zinc-900/60 pt-4 mt-4">
            <p className="font-mono text-2xl font-extrabold">₹499<span className="text-xs text-zinc-500 font-sans ml-1">/ month</span></p>
          </div>
        </div>
      </div>

      {/* REFERRAL REWARDS PANEL */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-zinc-900 pb-4">
          <h2 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5" />
            <span>Referrals & Tuition Rewards</span>
          </h2>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded uppercase font-bold">
            Cleared Balance: ₹750.00
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Introduce fellow CS students to Void Coding! You will receive <strong>₹150</strong> on each verified registration that completes 3 compile runs, plus a <strong>20% recurring commission</strong> on any premium monthly upgrades they secure.
        </p>

        {/* Reward metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-3.5 bg-zinc-900/40 border border-zinc-900 rounded-lg">
            <span className="text-[9px] text-zinc-500 uppercase block">Total Clicks</span>
            <span className="text-sm font-extrabold text-white mt-1 block">42</span>
          </div>
          <div className="p-3.5 bg-zinc-900/40 border border-zinc-900 rounded-lg">
            <span className="text-[9px] text-zinc-500 uppercase block">Registrations</span>
            <span className="text-sm font-extrabold text-white mt-1 block">8</span>
          </div>
          <div className="p-3.5 bg-zinc-900/40 border border-zinc-900 rounded-lg">
            <span className="text-[9px] text-zinc-500 uppercase block">Pro Converts</span>
            <span className="text-sm font-extrabold text-white mt-1 block">2</span>
          </div>
          <div className="p-3.5 bg-zinc-900/40 border border-zinc-900 rounded-lg">
            <span className="text-[9px] text-zinc-500 uppercase block">Pending Clearing</span>
            <span className="text-sm font-extrabold text-zinc-500 mt-1 block">₹300.00</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          {/* Referral link */}
          <div className="flex-1">
            <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">Your Unique Referral Link</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value="https://voidcoding.com/ref/student821" 
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-purple-800 rounded px-3 py-1.5 text-xs text-zinc-300 font-mono outline-none"
              />
              <button 
                onClick={() => alert('Referral link copied to clipboard!')}
                className="px-4 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-900/40 rounded text-xs font-semibold"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Action payouts */}
          <div className="sm:w-56 flex flex-col justify-end">
            <button 
              onClick={() => alert('Payout of ₹750.00 requested via UPI! Settlements typically clear in 24-48 hours.')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs uppercase tracking-wider transition-all"
            >
              Request UPI Payout
            </button>
          </div>
        </div>

        {/* Rewards disclosure terms */}
        <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-2 text-[11px] text-zinc-500 leading-relaxed font-sans">
          <p className="font-bold text-zinc-400 font-mono text-[10px] uppercase">Compliance & Anti-Fraud Protection Rules</p>
          <p>
            Self-referrals (registering duplicate trial configurations using alternate credentials under similar IP routes, router profiles, or device footprints) are strictly prohibited. Rewards are audited before settling. Fraudulent profiles lead to automated reward forfeitures and seat suspension.
          </p>
        </div>
      </div>

      {/* Transaction billing histories */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
          <FileText className="w-4.5 h-4.5" />
          <span>Billing Logs</span>
        </h2>

        {billingHistory.length === 0 ? (
          <div className="border border-zinc-900 bg-zinc-950 p-8 rounded-xl text-center text-xs text-zinc-500 font-mono">
            No active billing transactions logged.
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden overflow-x-auto text-xs font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/60 text-zinc-500 border-b border-zinc-900 uppercase tracking-wider text-[9px]">
                  <th className="px-5 py-3">Invoice Ref</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Payment Gateway ID</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/40 text-zinc-300">
                {billingHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-zinc-900/10">
                    <td className="px-5 py-3.5 font-bold">{h.invoice_id}</td>
                    <td className="px-5 py-3.5 font-sans">{h.plan}</td>
                    <td className="px-5 py-3.5 text-zinc-500">{h.payment_id}</td>
                    <td className="px-5 py-3.5 font-bold text-white">₹{h.amount}.00</td>
                    <td className="px-5 py-3.5 text-zinc-400">{new Date(h.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-900/30 px-2 py-0.5 rounded font-mono uppercase font-bold">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RAZORPAY SIMULATED GATEWAY CHECKOUT MODAL OVERLAY */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-purple-900/30 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-scaleIn">
            
            {/* Razorpay Brand Header */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-950 px-5 py-4 border-b border-purple-500/10 flex justify-between items-center text-white relative">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-white flex items-center justify-center shadow-md">
                  <span className="font-mono text-purple-900 font-black text-sm">R</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs tracking-wide">Razorpay Secured Checkout</h4>
                  <p className="text-[9px] text-purple-200 uppercase font-mono">Void Coding Licences</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-white hover:opacity-75 focus:outline-none"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal payment content stages */}
            {checkoutStep === 'pay_select' && (
              <div className="p-5 space-y-4 text-sm">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-xs text-zinc-500">Amount Due:</span>
                  <span className="text-base font-bold text-white">₹499.00</span>
                </div>

                {/* Tab selections card vs upi */}
                <div className="flex border-b border-zinc-900 text-xs font-mono">
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-2 border-b-2 text-center transition-all ${paymentMethod === 'card' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-500'}`}
                  >
                    Credit / Debit Card
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-2 border-b-2 text-center transition-all ${paymentMethod === 'upi' ? 'border-purple-500 text-white' : 'border-transparent text-zinc-500'}`}
                  >
                    UPI ID
                  </button>
                </div>

                {/* Form panels */}
                {paymentMethod === 'card' ? (
                  <div className="space-y-3 font-sans text-xs">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Card Number</label>
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white outline-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Expiry Date</label>
                        <input type="text" placeholder="12/29" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-center outline-none font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">CVV</label>
                        <input type="password" placeholder="•••" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-center outline-none font-mono" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 font-sans text-xs">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">UPI Address</label>
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Auto-Renewal Disclosure Checkbox */}
                <div className="p-3 bg-purple-950/10 border border-purple-900/20 rounded-lg flex items-start space-x-2.5">
                  <input 
                    type="checkbox" 
                    id="auto-renew-consent"
                    checked={acceptedAutoRenewal} 
                    onChange={(e) => setAcceptedAutoRenewal(e.target.checked)}
                    className="mt-0.5 accent-purple-500 rounded bg-zinc-900 border-zinc-800 cursor-pointer" 
                  />
                  <label htmlFor="auto-renew-consent" className="text-[10px] text-zinc-400 leading-normal select-none cursor-pointer">
                    I explicitly authorize automatic monthly renewals of ₹499/month on this card/UPI source until canceled. I have reviewed the <span className="text-purple-400 hover:underline">Billing Guidelines</span>.
                  </label>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleVerifyPayment}
                    disabled={!acceptedAutoRenewal}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-lg shadow-lg flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹499.00 & Upgrade</span>
                  </button>
                  <p className="text-[10px] text-zinc-500 text-center font-mono mt-3 leading-tight">By completing, you authorize subscription order tracking on our billing servers.</p>
                </div>
              </div>
            )}

            {checkoutStep === 'processing' && (
              <div className="p-8 text-center space-y-4">
                <RefreshCw className="w-10 h-10 animate-spin text-purple-400 mx-auto" />
                <h4 className="font-bold text-sm text-zinc-200">Contacting Payment Gateway</h4>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">Please do not refresh. Verifying standard payload security with Razorpay sandbox servers...</p>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="p-8 text-center space-y-4 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-base text-zinc-100">Subscription Upgraded!</h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">Payment complete. Your Pro Mentor licence seat has been successfully synced in the database.</p>
                
                <div className="pt-2">
                  <button 
                    onClick={() => setShowCheckoutModal(false)}
                    className="px-6 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 rounded-lg text-xs font-semibold"
                  >
                    Return to Billing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
